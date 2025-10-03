-- ShopSphere Database Schema
-- MySQL Database per e-commerce
-- Versione: 2.0 (con Users + role)

-- ====================
-- TABELLA USERS (ex customers)
-- ====================
-- Gestisce tutti gli utenti del sistema (customers, admin, seller)
CREATE TABLE `users` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`first_name` VARCHAR(100) NOT NULL,
	`last_name` VARCHAR(100) NOT NULL,
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`password_hash` VARCHAR(255) NOT NULL,
	`phone` VARCHAR(20),
	`role` ENUM('customer', 'admin', 'seller') NOT NULL DEFAULT 'customer',
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`),
	INDEX idx_email (`email`),
	INDEX idx_role (`role`)
);

-- ====================
-- TABELLA ADDRESSES
-- ====================
-- Indirizzi di spedizione e fatturazione degli utenti
CREATE TABLE `addresses` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` INTEGER NOT NULL,
	`address_line` VARCHAR(255) NOT NULL,
	`city` VARCHAR(100) NOT NULL,
	`postal_code` VARCHAR(20) NOT NULL,
	`country` VARCHAR(100) NOT NULL,
	`type` ENUM('billing', 'shipping', 'both') NOT NULL DEFAULT 'both',
	`is_default` BOOLEAN NOT NULL DEFAULT FALSE,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`),
	INDEX idx_user_id (`user_id`)
);

-- ====================
-- TABELLA CATEGORIES
-- ====================
-- Categorie dei prodotti
CREATE TABLE `categories` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(100) NOT NULL UNIQUE,
	`description` TEXT,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`),
	INDEX idx_name (`name`)
);

-- ====================
-- TABELLA PRODUCTS
-- ====================
-- Catalogo prodotti
CREATE TABLE `products` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`category_id` INTEGER NOT NULL,
	`name` VARCHAR(255) NOT NULL,
	`description` TEXT NOT NULL,
	`price` DECIMAL(10,2) NOT NULL,
	`stock_quantity` INTEGER NOT NULL DEFAULT 0,
	`image_url` VARCHAR(500),
	`is_active` BOOLEAN NOT NULL DEFAULT TRUE,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`),
	INDEX idx_category_id (`category_id`),
	INDEX idx_price (`price`),
	INDEX idx_name (`name`)
);

-- ====================
-- TABELLA ORDERS
-- ====================
-- Ordini effettuati dagli utenti
CREATE TABLE `orders` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` INTEGER NOT NULL,
	`shipping_address_id` INTEGER NOT NULL,
	`billing_address_id` INTEGER NOT NULL,
	`order_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`status` ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
	`discount_id` INTEGER,
	`total_amount` DECIMAL(10,2) NOT NULL,
	`notes` TEXT,
	PRIMARY KEY(`id`),
	INDEX idx_user_id (`user_id`),
	INDEX idx_status (`status`),
	INDEX idx_order_date (`order_date`)
);

-- ====================
-- TABELLA ORDER_ITEMS
-- ====================
-- Dettagli prodotti per ogni ordine
CREATE TABLE `order_items` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`order_id` INTEGER NOT NULL,
	`product_id` INTEGER NOT NULL,
	`quantity` INTEGER NOT NULL,
	`unit_price` DECIMAL(10,2) NOT NULL,
	`subtotal` DECIMAL(10,2) NOT NULL,
	PRIMARY KEY(`id`),
	INDEX idx_order_id (`order_id`),
	INDEX idx_product_id (`product_id`)
);

-- ====================
-- TABELLA PAYMENTS
-- ====================
-- Pagamenti degli ordini
CREATE TABLE `payments` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`order_id` INTEGER NOT NULL,
	`payment_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`amount` DECIMAL(10,2) NOT NULL,
	`payment_method` ENUM('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery') NOT NULL,
	`status` ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
	`transaction_id` VARCHAR(255),
	PRIMARY KEY(`id`),
	INDEX idx_order_id (`order_id`),
	INDEX idx_status (`status`),
	UNIQUE INDEX idx_transaction_id (`transaction_id`)
);

-- ====================
-- TABELLA SHIPPINGS
-- ====================
-- Spedizioni ordini
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
	PRIMARY KEY(`id`),
	INDEX idx_order_id (`order_id`),
	INDEX idx_status (`status`),
	INDEX idx_tracking_number (`tracking_number`)
);

-- ====================
-- TABELLA DISCOUNTS
-- ====================
-- Codici sconto e promozioni
CREATE TABLE `discounts` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`code` VARCHAR(50) NOT NULL UNIQUE,
	`description` TEXT,
	`discount_type` ENUM('percentage', 'fixed_amount') NOT NULL,
	`value` DECIMAL(10,2) NOT NULL,
	`min_order_amount` DECIMAL(10,2),
	`max_discount_amount` DECIMAL(10,2),
	`start_date` DATETIME,
	`end_date` DATETIME,
	`usage_limit` INTEGER,
	`used_count` INTEGER NOT NULL DEFAULT 0,
	`is_active` BOOLEAN NOT NULL DEFAULT TRUE,
	PRIMARY KEY(`id`),
	INDEX idx_code (`code`),
	INDEX idx_is_active (`is_active`)
);

-- ====================
-- TABELLA WISHLISTS
-- ====================
-- Liste desideri utenti
CREATE TABLE `wishlists` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` INTEGER NOT NULL,
	`product_id` INTEGER NOT NULL,
	`added_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`id`),
	UNIQUE INDEX idx_user_product (`user_id`, `product_id`),
	INDEX idx_user_id (`user_id`),
	INDEX idx_product_id (`product_id`)
);

-- ====================
-- FOREIGN KEYS
-- ====================

-- Addresses → Users
ALTER TABLE `addresses`
ADD FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;

-- Products → Categories
ALTER TABLE `products`
ADD FOREIGN KEY(`category_id`) REFERENCES `categories`(`id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

-- Orders → Users
ALTER TABLE `orders`
ADD FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

-- Orders → Addresses (shipping)
ALTER TABLE `orders`
ADD FOREIGN KEY(`shipping_address_id`) REFERENCES `addresses`(`id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

-- Orders → Addresses (billing)
ALTER TABLE `orders`
ADD FOREIGN KEY(`billing_address_id`) REFERENCES `addresses`(`id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

-- Orders → Discounts
ALTER TABLE `orders`
ADD FOREIGN KEY(`discount_id`) REFERENCES `discounts`(`id`)
ON UPDATE CASCADE ON DELETE SET NULL;

-- Order_items → Orders
ALTER TABLE `order_items`
ADD FOREIGN KEY(`order_id`) REFERENCES `orders`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;

-- Order_items → Products
ALTER TABLE `order_items`
ADD FOREIGN KEY(`product_id`) REFERENCES `products`(`id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

-- Payments → Orders
ALTER TABLE `payments`
ADD FOREIGN KEY(`order_id`) REFERENCES `orders`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;

-- Shippings → Orders
ALTER TABLE `shippings`
ADD FOREIGN KEY(`order_id`) REFERENCES `orders`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;

-- Shippings → Addresses
ALTER TABLE `shippings`
ADD FOREIGN KEY(`shipping_address_id`) REFERENCES `addresses`(`id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

-- Wishlists → Users
ALTER TABLE `wishlists`
ADD FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;

-- Wishlists → Products
ALTER TABLE `wishlists`
ADD FOREIGN KEY(`product_id`) REFERENCES `products`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
