const WebSocket = require('ws');
const http = require('http'); // Ensure http module is imported
const { Pool } = require('pg');

const port = process.env.PORT || 3001; // Use an environment variable or default

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/foodie_express",
    connectionTimeoutMillis: 5000,
});

// Test database connection
pool.connect((err, client, release) => {
    if (err) {
        console.error("❌ WebSocket Server: Database connection failed:", err.message);
    } else {
        console.log("✅ WebSocket Server: Database connected successfully");
        release();
    }
});

let analyticsInterval;

// Function to fetch and broadcast analytics (keep as is)
async function fetchAndBroadcastAnalytics() {
    try {
        const client = await pool.connect();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

        // Total orders today
        const ordersResult = await client.query(`
            SELECT COUNT(*) FROM orders WHERE created_at >= $1
        `, [today]);
        const todayOrders = parseInt(ordersResult.rows[0].count, 10);

        // Total revenue today
        const revenueResult = await client.query(`
            SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE created_at >= $1 AND status = 'COMPLETED'
        `, [today]);
        const todayRevenue = parseFloat(revenueResult.rows[0].coalesce);

        // Average order value today
        const avgOrderValue = todayOrders > 0 ? todayRevenue / todayOrders : 0;

        // Pending orders (not completed or ready)
        const pendingOrdersResult = await client.query(`
            SELECT COUNT(*) FROM orders WHERE status IN ('PENDING', 'ACCEPTED', 'PREPARING')
        `);
        const pendingOrders = parseInt(pendingOrdersResult.rows[0].count, 10);

        client.release();

        const analyticsData = {
            todayOrders,
            todayRevenue,
            avgOrderValue,
            pendingOrders,
        };

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'analytics_update', payload: analyticsData }));
            }
        });
        console.log("📊 Analytics broadcasted:", analyticsData);

    } catch (error) {
        console.error("❌ Failed to fetch and broadcast analytics:", error.message);
    }
}

// Create HTTP server first
const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'OK', wssClients: wss.clients.size }));
    } else {
        res.writeHead(404);
        res.end();
    }
});

// Attach WebSocket server to the HTTP server
const wss = new WebSocket.Server({ server }); // Pass the http server instance here
console.log(`🚀 WebSocket Server started on port ${port}`);

wss.on('connection', ws => {
    console.log('Client connected to WebSocket');

    // Send initial analytics data on connection
    fetchAndBroadcastAnalytics();

    // Start sending analytics updates periodically
    if (!analyticsInterval) {
        analyticsInterval = setInterval(fetchAndBroadcastAnalytics, 10000); // Every 10 seconds
    }

    ws.on('message', message => {
        try {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.type === 'ping') {
                ws.send(JSON.stringify({ type: 'pong' }));
            } else {
                console.log('Received:', parsedMessage);
                // Handle other message types if needed
            }
        } catch (error) {
            console.error('Failed to parse message:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected from WebSocket');
        // If no more clients, stop sending analytics updates
        if (wss.clients.size === 0 && analyticsInterval) {
            clearInterval(analyticsInterval);
            analyticsInterval = null;
            console.log("Stopped analytics broadcast: No more clients connected.");
        }
    });

    ws.on('error', error => {
        console.error('WebSocket error:', error);
    });
});

// Make the HTTP server listen on the port
server.listen(port, () => {
    console.log(`🏥 HTTP Health check endpoint for WebSocket Server available at http://localhost:${port}/health`);
});
