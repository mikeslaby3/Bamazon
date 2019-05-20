DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id BIGINT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50),
    department_name VARCHAR(50),
    price DECIMAL(10,2),
    stock_quantity INTEGER(10),
    PRIMARY KEY (item_id);
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (1, 'Bamazon Balexa Speaker', 'Music', 149.99, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Susan the Succulent', 'Garden & Outdoor', 15.50, 10), 
('iRobot Vacuum', 'Home & Kitchen', 229.99, 15),
('Lawnmower', 'Garden & Outdoor', 3.99, 50),
('Basketball', 'Sports & Outdoors', 25, 50),
('Waffle Iron', 'Home & Kitchen', 49.99, 5),
('Black Out Curtains', 'Room Essentials', 65, 0),
('Scorpion King 2: Rise of a Warrior', 'Movies', 15, 8),
('iPhone XS', 'Electronics', 800, 1),
('The Shining', 'Books', 8, 18);