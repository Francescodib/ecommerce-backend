CREATE TABLE `customers` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`first_name` VARCHAR(255) NOT NULL,
	`last_name` VARCHAR(255) NOT NULL,
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`password_hash` VARCHAR(255) NOT NULL,
	`phone` VARCHAR(255),
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE TABLE `addresses` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`customer_id` INTEGER NOT NULL,
	`address_line` VARCHAR(255) NOT NULL,
	`postal_code` VARCHAR(255) NOT NULL,
	`country` VARCHAR(255) NOT NULL,
	`type` ENUM('billing', 'shipping', 'other') NOT NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE TABLE `categories` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) NOT NULL UNIQUE,
	`description` TEXT(65535),
	PRIMARY KEY(`id`)
);


CREATE TABLE `products` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`category_id` INTEGER NOT NULL,
	`name` VARCHAR(255) NOT NULL,
	`description` TEXT(65535) NOT NULL,
	`price` DECIMAL(10,2) NOT NULL,
	`stock_quantity` INTEGER NOT NULL DEFAULT 0,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE TABLE `orders` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`customer_id` INTEGER NOT NULL,
	`shipping_address_id` INTEGER NOT NULL,
	`billing_address_id` INTEGER NOT NULL,
	`order_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`status` ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') NOT NULL,
	`discount_id` INTEGER,
	`total_amount` DECIMAL(10,2) NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE `order_items` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`order_id` INTEGER NOT NULL,
	`product_id` INTEGER NOT NULL,
	`quantity` INTEGER NOT NULL,
	`unit_price` DECIMAL(10,2) NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE `payments` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`order_id` INTEGER NOT NULL,
	`payment_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`amount` DECIMAL(10,2) NOT NULL,
	`payment_method` ENUM('credit_card', 'paypal', 'bank_transfer', 'cash') NOT NULL,
	`status` ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL,
	`transaction_id` VARCHAR(255),
	PRIMARY KEY(`id`)
);


CREATE TABLE `shippings` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`order_id` INTEGER NOT NULL,
	`shipping_address_id` INTEGER NOT NULL,
	`shipping_method` ENUM('standard', 'express', 'overnight') NOT NULL,
	`tracking_number` VARCHAR(255),
	`shipped_date` DATETIME,
	`delivery_date` DATETIME,
	`status` ENUM('pending', 'shipped', 'in_transit', 'delivered', 'returned') NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE `discounts` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`code` VARCHAR(255) NOT NULL UNIQUE,
	`description` TEXT(65535),
	`discount_type` ENUM('percentage', 'fixed_amount') NOT NULL,
	`value` DECIMAL(10,2) NOT NULL,
	`start_date` DATETIME,
	`end_date` DATETIME,
	`active` BOOLEAN NOT NULL DEFAULT TRUE,
	PRIMARY KEY(`id`)
);


ALTER TABLE `addresses`
ADD FOREIGN KEY(`customer_id`) REFERENCES `customers`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `products`
ADD FOREIGN KEY(`category_id`) REFERENCES `categories`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `orders`
ADD FOREIGN KEY(`customer_id`) REFERENCES `customers`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `orders`
ADD FOREIGN KEY(`shipping_address_id`) REFERENCES `addresses`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `orders`
ADD FOREIGN KEY(`billing_address_id`) REFERENCES `addresses`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `order_items`
ADD FOREIGN KEY(`order_id`) REFERENCES `orders`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `order_items`
ADD FOREIGN KEY(`product_id`) REFERENCES `products`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `payments`
ADD FOREIGN KEY(`order_id`) REFERENCES `orders`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `shippings`
ADD FOREIGN KEY(`order_id`) REFERENCES `orders`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `shippings`
ADD FOREIGN KEY(`shipping_address_id`) REFERENCES `addresses`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `orders`
ADD FOREIGN KEY(`discount_id`) REFERENCES `discounts`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;