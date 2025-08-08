-- Seed data for Food Ordering Platform
-- Migration: 002-seed-data.sql

-- Insert sample menu items
INSERT INTO menu_items (name, price, category, image_url) VALUES
-- Main Dishes
('Classic Burger', 12.99, 'mains', '/images/classic-burger.png'),
('Grilled Chicken', 15.99, 'mains', '/images/grilled-chicken.png'),
('Margherita Pizza', 14.99, 'mains', '/images/margherita-pizza.png'),
('Fish & Chips', 13.99, 'mains', '/images/fish-and-chips.png'),
('Pasta Carbonara', 16.99, 'mains', '/images/pasta-carbonara.png'),
('BBQ Ribs', 19.99, 'mains', '/images/bbq-ribs.png'),

-- Beverages
('Coca Cola', 2.99, 'beverages', '/images/coca-cola.png'),
('Fresh Orange Juice', 4.99, 'beverages', '/images/fresh-orange-juice.png'),
('Coffee', 3.99, 'beverages', '/images/coffee.png'),
('Iced Tea', 2.99, 'beverages', '/images/iced-tea.png'),
('Smoothie', 5.99, 'beverages', '/images/smoothie.png'),
('Sparkling Water', 2.49, 'beverages', '/images/sparkling-water.png'),

-- Desserts
('Chocolate Cake', 6.99, 'desserts', '/images/chocolate-cake.png'),
('Ice Cream Sundae', 5.99, 'desserts', '/images/ice-cream-sundae.png'),
('Apple Pie', 4.99, 'desserts', '/images/apple-pie.png'),
('Cheesecake', 7.99, 'desserts', '/images/cheesecake.png'),
('Tiramisu', 8.99, 'desserts', '/images/tiramisu.png'),
('Brownie', 4.99, 'desserts', '/images/brownie.png');

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
