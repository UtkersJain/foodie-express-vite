-- Seed data for Food Ordering Platform
-- Migration: 002-seed-data.sql

-- Insert sample menu items with unique Unsplash images
INSERT INTO menu_items (name, price, category, image_url) VALUES
-- Main Dishes
('Classic Burger', 12.99, 'mains', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop'),
('Grilled Chicken', 15.99, 'mains', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=300&h=200&fit=crop'),
('Margherita Pizza', 14.99, 'mains', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop'),
('Fish & Chips', 13.99, 'mains', 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=300&h=200&fit=crop'),
('Pasta Carbonara', 16.99, 'mains', 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop'),
('BBQ Ribs', 19.99, 'mains', 'https://images.unsplash.com/photo-1544025162287-4d71bcdd2087?w=300&h=200&fit=crop'),

-- Beverages
('Coca Cola', 2.99, 'beverages', 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300&h=200&fit=crop'),
('Fresh Orange Juice', 4.99, 'beverages', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=200&fit=crop'),
('Coffee', 3.99, 'beverages', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop'),
('Iced Tea', 2.99, 'beverages', 'https://images.unsplash.com/photo-1556679343-c7306c19e1cb?w=300&h=200&fit=crop'),
('Smoothie', 5.99, 'beverages', 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=300&h=200&fit=crop'),
('Sparkling Water', 2.49, 'beverages', 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&h=200&fit=crop'),

-- Desserts
('Chocolate Cake', 6.99, 'desserts', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop'),
('Ice Cream Sundae', 5.99, 'desserts', 'https://images.unsplash.com/photo-1563805042443-d4fd215305ad?w=300&h=200&fit=crop'),
('Apple Pie', 4.99, 'desserts', 'https://images.unsplash.com/photo-1535920527002-b35e96722da9?w=300&h=200&fit=crop'),
('Cheesecake', 7.99, 'desserts', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop'),
('Tiramisu', 8.99, 'desserts', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop'),
('Brownie', 4.99, 'desserts', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop');

-- Insert sample historical orders for analytics
INSERT INTO orders (customer_name, customer_phone, customer_address, total_amount, status, created_at) VALUES
('John Doe', '+1234567890', '123 Main St, City', 25.98, 'COMPLETED', NOW() - INTERVAL '2 hours'),
('Jane Smith', '+1234567891', '456 Oak Ave, City', 18.99, 'COMPLETED', NOW() - INTERVAL '4 hours'),
('Bob Johnson', '+1234567892', '789 Pine St, City', 32.97, 'READY', NOW() - INTERVAL '30 minutes'),
('Alice Brown', '+1234567893', '321 Elm St, City', 15.99, 'PREPARING', NOW() - INTERVAL '15 minutes'),
('Charlie Wilson', '+1234567894', '654 Maple Ave, City', 22.98, 'ACCEPTED', NOW() - INTERVAL '5 minutes');

-- Insert order items for the sample orders
-- Order 1 items
INSERT INTO order_items (order_id, menu_item_id, qty, price)
SELECT o.id, m.id, 2, m.price
FROM orders o, menu_items m
WHERE o.customer_name = 'John Doe' AND m.name = 'Classic Burger';

INSERT INTO order_items (order_id, menu_item_id, qty, price)
SELECT o.id, m.id, 1, m.price
FROM orders o, menu_items m
WHERE o.customer_name = 'John Doe' AND m.name = 'Coca Cola';

-- Order 2 items
INSERT INTO order_items (order_id, menu_item_id, qty, price)
SELECT o.id, m.id, 1, m.price
FROM orders o, menu_items m
WHERE o.customer_name = 'Jane Smith' AND m.name = 'Grilled Chicken';

INSERT INTO order_items (order_id, menu_item_id, qty, price)
SELECT o.id, m.id, 1, m.price
FROM orders o, menu_items m
WHERE o.customer_name = 'Jane Smith' AND m.name = 'Coffee';

-- Order 3 items
INSERT INTO order_items (order_id, menu_item_id, qty, price)
SELECT o.id, m.id, 1, m.price
FROM orders o, menu_items m
WHERE o.customer_name = 'Bob Johnson' AND m.name = 'Margherita Pizza';

INSERT INTO order_items (order_id, menu_item_id, qty, price)
SELECT o.id, m.id, 1, m.price
FROM orders o, menu_items m
WHERE o.customer_name = 'Bob Johnson' AND m.name = 'Pasta Carbonara';

INSERT INTO order_items (order_id, menu_item_id, qty, price)
SELECT o.id, m.id, 1, m.price
FROM orders o, menu_items m
WHERE o.customer_name = 'Bob Johnson' AND m.name = 'Sparkling Water';

-- Order 4 items
INSERT INTO order_items (order_id, menu_item_id, qty, price)
SELECT o.id, m.id, 1, m.price
FROM orders o, menu_items m
WHERE o.customer_name = 'Alice Brown' AND m.name = 'Grilled Chicken';

-- Order 5 items
INSERT INTO order_items (order_id, menu_item_id, qty, price)
SELECT o.id, m.id, 1, m.price
FROM orders o, menu_items m
WHERE o.customer_name = 'Charlie Wilson' AND m.name = 'Fish & Chips';

INSERT INTO order_items (order_id, menu_item_id, qty, price)
SELECT o.id, m.id, 1, m.price
FROM orders o, menu_items m
WHERE o.customer_name = 'Charlie Wilson' AND m.name = 'Chocolate Cake';

INSERT INTO order_items (order_id, menu_item_id, qty, price)
SELECT o.id, m.id, 1, m.price
FROM orders o, menu_items m
WHERE o.customer_name = 'Charlie Wilson' AND m.name = 'Iced Tea';

