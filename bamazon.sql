DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(30) NULL,
    department_name VARCHAR(30) NULL,
    price DECIMAL(10,2) NULL,
    stock_quantity INT NULL, 
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pillowcase", "Bedding", 10.99, 50), 
("Harry Potter complete set", "Books", 70.99, 40), 
("Down Comforter", "Bedding", 150.99, 20), 
("Hair dryer", "Health and Beauty", 50.99, 45),
("Yoga mat", "Health and Beauty", 40.99, 30), 
("Foam roller", "Health and Beauty", 25.99, 40),
("Trash can", "Home goods", 15.99, 30), 
("AAA batteries", "Accessories", 12.99, 30),
("Blender", "Home goods", 75.99, 30), 
("Broom", "Home goods", 10.99, 60);

SELECT * FROM products;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'jackso74'