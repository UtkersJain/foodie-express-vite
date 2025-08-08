const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const WebSocket = require('ws');

const app = express();
const port = 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/foodie_express',
});

app.use(cors());
app.use(express.json());

// JSON-RPC endpoint
app.post('/api/rpc', async (req, res) => {
  const { method, params, id } = req.body;

  try {
    let result;

    switch (method) {
      case 'getMenu':
        const menuQuery = 'SELECT * FROM menu_items ORDER BY category, name';
        const menuResult = await pool.query(menuQuery);
        result = menuResult.rows;
        break;

      case 'placeOrder':
        const { items, customer } = params;
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

        const orderQuery = 'INSERT INTO orders (customer_name, customer_phone, customer_address, total_amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING id';
        const orderResult = await pool.query(orderQuery, [
          customer.name,
          customer.phone,
          customer.address,
          totalAmount,
          'PENDING'
        ]);

        const newOrderId = orderResult.rows[0].id;

        // Insert order items
        for (const item of items) {
          await pool.query(
            'INSERT INTO order_items (order_id, menu_item_id, qty, price) VALUES ($1, $2, $3, $4)',
            [newOrderId, item.menu_item_id, item.qty, item.price]
          );
        }

        result = { orderId: newOrderId };
        break;

      case 'getOrderStatus':
        const { orderId: statusOrderId } = params;
        const orderStatusQuery = `
          SELECT o.*, 
                 json_agg(
                   json_build_object(
                     'name', mi.name,
                     'qty', oi.qty,
                     'price', oi.price
                   )
                 ) as items
          FROM orders o
          LEFT JOIN order_items oi ON o.id = oi.order_id
          LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
          WHERE o.id = $1
          GROUP BY o.id
        `;
        const orderStatusResult = await pool.query(orderStatusQuery, [statusOrderId]);
        result = orderStatusResult.rows[0] || null;
        break;

      case 'listOrders':
        const { limit = 50 } = params;
        const listQuery = `
          SELECT o.*, 
                 json_agg(
                   json_build_object(
                     'name', mi.name,
                     'qty', oi.qty,
                     'price', oi.price
                   )
                 ) as items
          FROM orders o
          LEFT JOIN order_items oi ON o.id = oi.order_id
          LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
          GROUP BY o.id
          ORDER BY o.created_at DESC
          LIMIT $1
        `;
        const listResult = await pool.query(listQuery, [limit]);
        result = listResult.rows;
        break;

      case 'acceptOrder':
        const { orderId: acceptOrderId } = params;
        const acceptQuery = 'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING status';
        const acceptResult = await pool.query(acceptQuery, ['ACCEPTED', acceptOrderId]);
        result = { status: acceptResult.rows[0]?.status };
        break;

      case 'updateOrderStatus':
        const { orderId: updateOrderId, status } = params;
        const updateQuery = 'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING status';
        const updateResult = await pool.query(updateQuery, [status, updateOrderId]);
        result = { status: updateResult.rows[0]?.status };
        break;

      default:
        throw new Error(`Method '${method}' not found`);
    }

    res.json({
      jsonrpc: '2.0',
      result,
      id
    });

  } catch (error) {
    res.json({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: error.message
      },
      id
    });
  }
});

// WebSocket server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const wss = new WebSocket.Server({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});
