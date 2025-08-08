-- Convert all prices from USD to Indian Rupees
-- Migration: 005-convert-to-inr.sql
-- Conversion rate: 1 USD = 82 INR (approximate)

-- Update main dishes
UPDATE menu_items SET price = 1065 WHERE name = 'Classic Burger';           -- $12.99 → ₹1065
UPDATE menu_items SET price = 1311 WHERE name = 'Grilled Chicken';          -- $15.99 → ₹1311
UPDATE menu_items SET price = 1229 WHERE name = 'Margherita Pizza';         -- $14.99 → ₹1229
UPDATE menu_items SET price = 1147 WHERE name = 'Fish & Chips';             -- $13.99 → ₹1147
UPDATE menu_items SET price = 1393 WHERE name = 'Pasta Carbonara';          -- $16.99 → ₹1393
UPDATE menu_items SET price = 1639 WHERE name = 'BBQ Ribs';                 -- $19.99 → ₹1639

-- Update beverages
UPDATE menu_items SET price = 245 WHERE name = 'Coca Cola';                 -- $2.99 → ₹245
UPDATE menu_items SET price = 409 WHERE name = 'Fresh Orange Juice';        -- $4.99 → ₹409
UPDATE menu_items SET price = 327 WHERE name = 'Coffee';                    -- $3.99 → ₹327
UPDATE menu_items SET price = 245 WHERE name = 'Iced Tea';                  -- $2.99 → ₹245
UPDATE menu_items SET price = 491 WHERE name = 'Smoothie';                  -- $5.99 → ₹491
UPDATE menu_items SET price = 204 WHERE name = 'Sparkling Water';           -- $2.49 → ₹204

-- Update desserts
UPDATE menu_items SET price = 573 WHERE name = 'Chocolate Cake';            -- $6.99 → ₹573
UPDATE menu_items SET price = 491 WHERE name = 'Ice Cream Sundae';          -- $5.99 → ₹491
UPDATE menu_items SET price = 409 WHERE name = 'Apple Pie';                 -- $4.99 → ₹409
UPDATE menu_items SET price = 655 WHERE name = 'Cheesecake';                -- $7.99 → ₹655
UPDATE menu_items SET price = 737 WHERE name = 'Tiramisu';                  -- $8.99 → ₹737
UPDATE menu_items SET price = 409 WHERE name = 'Brownie';                   -- $4.99 → ₹409

-- Update additional items if they exist
UPDATE menu_items SET price = 983 WHERE name = 'Chicken Caesar Salad';      -- $11.99 → ₹983
UPDATE menu_items SET price = 1147 WHERE name = 'Beef Tacos (3pc)';         -- $13.99 → ₹1147
UPDATE menu_items SET price = 819 WHERE name = 'Vegetarian Wrap';           -- $9.99 → ₹819
UPDATE menu_items SET price = 1885 WHERE name = 'Salmon Fillet';            -- $22.99 → ₹1885
UPDATE menu_items SET price = 1475 WHERE name = 'Mushroom Risotto';         -- $17.99 → ₹1475

UPDATE menu_items SET price = 204 WHERE name = 'Green Tea';                 -- $2.49 → ₹204
UPDATE menu_items SET price = 286 WHERE name = 'Lemonade';                  -- $3.49 → ₹286
UPDATE menu_items SET price = 409 WHERE name = 'Milkshake (Vanilla)';       -- $4.99 → ₹409
UPDATE menu_items SET price = 327 WHERE name = 'Energy Drink';              -- $3.99 → ₹327

UPDATE menu_items SET price = 614 WHERE name = 'Crème Brûlée';              -- $7.49 → ₹614
UPDATE menu_items SET price = 532 WHERE name = 'Fruit Tart';                -- $6.49 → ₹532
UPDATE menu_items SET price = 491 WHERE name = 'Chocolate Mousse';          -- $5.99 → ₹491

-- Update existing orders to reflect INR prices (multiply by 82)
UPDATE orders SET total_amount = total_amount * 82;
UPDATE order_items SET price = price * 82;

-- Show updated prices
SELECT name, price as price_inr, category FROM menu_items ORDER BY category, name;

-- Show sample totals
SELECT 'Price conversion completed' as status, 
       COUNT(*) as total_items,
       ROUND(AVG(price), 2) as avg_price_inr
FROM menu_items;
