CREATE TABLE `users` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`first_name` VARCHAR(255) NOT NULL,
	`last_name` VARCHAR(255) NOT NULL,
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`password_hash` VARCHAR(255) NOT NULL,
	`phone` VARCHAR(255),
	`role` ENUM('customer', 'admin', 'seller') NOT NULL DEFAULT 'customer',
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
	PRIMARY KEY(`id`)
);


CREATE INDEX `idx_email`
ON `users` (`email`);
CREATE INDEX `idx_role`
ON `users` (`role`);
CREATE TABLE `addresses` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` INTEGER NOT NULL,
	`address_line` VARCHAR(255) NOT NULL,
	`city` VARCHAR(100) NOT NULL,
	`postal_code` VARCHAR(255) NOT NULL,
	`country` VARCHAR(255) NOT NULL,
	`type` ENUM('billing', 'shipping', 'both') NOT NULL DEFAULT 'both',
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`is_default` BOOLEAN NOT NULL DEFAULT FALSE,
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
	`img_url` VARCHAR(500),
	`is_active` BOOLEAN NOT NULL DEFAULT TRUE,
	PRIMARY KEY(`id`)
);


CREATE INDEX `idx_price`
ON `products` (`price`);
CREATE INDEX `idx_name`
ON `products` (`name`);
CREATE TABLE `orders` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` INTEGER NOT NULL,
	`shipping_address_id` INTEGER NOT NULL,
	`billing_address_id` INTEGER NOT NULL,
	`order_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`status` ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
	`discount_id` INTEGER,
	`total_amount` DECIMAL(10,2) NOT NULL,
	`notes` TEXT(65535),
	PRIMARY KEY(`id`)
);


CREATE INDEX `idx_user_id`
ON `orders` (`user_id`);
CREATE INDEX `idx_status`
ON `orders` (`status`);
CREATE INDEX `idx_order_date`
ON `orders` (`order_date`);
CREATE TABLE `order_items` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`order_id` INTEGER NOT NULL,
	`product_id` INTEGER NOT NULL,
	`quantity` INTEGER NOT NULL,
	`unit_price` DECIMAL(10,2) NOT NULL,
	`subtotal` DECIMAL(10,2) NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE INDEX `idx_order_id`
ON `order_items` (`order_id`);
CREATE INDEX `idx_product_id`
ON `order_items` (`product_id`);
CREATE TABLE `payments` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`order_id` INTEGER NOT NULL,
	`payment_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`amount` DECIMAL(10,2) NOT NULL,
	`payment_method` ENUM('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery') NOT NULL,
	`status` ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
	`transaction_id` VARCHAR(255),
	PRIMARY KEY(`id`)
);


CREATE INDEX `idx_order_id`
ON `payments` (`order_id`);
CREATE INDEX `idx_status`
ON `payments` (`status`);
CREATE UNIQUE INDEX `idx_transaction_id`
ON `payments` (`transaction_id`);
CREATE TABLE `shippings` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`order_id` INTEGER NOT NULL,
	`shipping_address_id` INTEGER NOT NULL,
	`shipping_method` ENUM('standard', 'express', 'overnight') NOT NULL,
	`tracking_number` VARCHAR(255),
	`carrier` VARCHAR(100),
	`shipped_date` DATETIME,
	`estimated_delivery` DATETIME,
	`delivery_date` DATETIME,
	`status` ENUM('pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned') NOT NULL DEFAULT 'pending',
	PRIMARY KEY(`id`)
);


CREATE INDEX `idx_order_id`
ON `shippings` (`order_id`);
CREATE INDEX `idx_status`
ON `shippings` (`status`);
CREATE INDEX `idx_tracking_number`
ON `shippings` (`tracking_number`);
CREATE TABLE `discounts` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`code` VARCHAR(50) NOT NULL UNIQUE,
	`description` TEXT(65535),
	`discount_type` ENUM('percentage', 'fixed_amount') NOT NULL,
	`value` DECIMAL(10,2) NOT NULL,
	`min_order_amount` DECIMAL(10,2),
	`max_discount_amount` DECIMAL(10,2),
	`start_date` DATETIME,
	`end_date` DATETIME,
	`usage_limit` INTEGER,
	`used_count` INTEGER NOT NULL DEFAULT 0,
	`is_active` BOOLEAN NOT NULL DEFAULT TRUE,
	PRIMARY KEY(`id`)
);


CREATE INDEX `idx_code`
ON `discounts` (`code`);
CREATE INDEX `idx_is_active`
ON `discounts` (`is_active`);
CREATE TABLE `whishlists` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` INTEGER NOT NULL,
	`product_id` INTEGER NOT NULL,
	`added_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`)
);


ALTER TABLE `addresses`
ADD FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `products`
ADD FOREIGN KEY(`category_id`) REFERENCES `categories`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `orders`
ADD FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
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
ALTER TABLE `whishlists`
ADD FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `whishlists`
ADD FOREIGN KEY(`product_id`) REFERENCES `products`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;