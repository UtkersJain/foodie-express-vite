-- Update existing menu items with proper Unsplash image URLs
-- Migration: 004-update-existing-images.sql

-- Update main dishes
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop' WHERE name = 'Classic Burger';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=300&h=200&fit=crop' WHERE name = 'Grilled Chicken';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=200&fit=crop' WHERE name = 'Margherita Pizza';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=300&h=200&fit=crop' WHERE name = 'Fish & Chips';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop' WHERE name = 'Pasta Carbonara';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop' WHERE name = 'BBQ Ribs';

-- Update beverages
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300&h=200&fit=crop' WHERE name = 'Coca Cola';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=200&fit=crop' WHERE name = 'Fresh Orange Juice';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop' WHERE name = 'Coffee';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop' WHERE name = 'Iced Tea';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=300&h=200&fit=crop' WHERE name = 'Smoothie';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&h=200&fit=crop' WHERE name = 'Sparkling Water';

-- Update desserts
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop' WHERE name = 'Chocolate Cake';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop' WHERE name = 'Ice Cream Sundae';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1535920527002-b35e96722da9?w=300&h=200&fit=crop' WHERE name = 'Apple Pie';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&h=200&fit=crop' WHERE name = 'Cheesecake';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop' WHERE name = 'Tiramisu';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop' WHERE name = 'Brownie';

-- Update additional items if they exist
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop' WHERE name = 'Chicken Caesar Salad';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop' WHERE name = 'Beef Tacos (3pc)';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1623599368805-3e87c624b0b8?w=300&h=200&fit=crop' WHERE name = 'Vegetarian Wrap';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop' WHERE name = 'Salmon Fillet';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=300&h=200&fit=crop' WHERE name = 'Mushroom Risotto';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=300&h=200&fit=crop' WHERE name = 'Green Tea';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=300&h=200&fit=crop' WHERE name = 'Lemonade';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=200&fit=crop' WHERE name = 'Milkshake (Vanilla)';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=300&h=200&fit=crop' WHERE name = 'Energy Drink';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop' WHERE name = 'Crème Brûlée';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1464195643332-1f236b1c2255?w=300&h=200&fit=crop' WHERE name = 'Fruit Tart';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1541781408260-3c61143b63d5?w=300&h=200&fit=crop' WHERE name = 'Chocolate Mousse';

-- Show updated items
SELECT name, image_url FROM menu_items ORDER BY category, name;
