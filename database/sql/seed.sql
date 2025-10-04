-- =====================================================
-- ShopSphere - Seed Data SQL
-- =====================================================
-- Dati di esempio per testing e demo
-- 30 users, 30 products, 15 orders, ecc.

-- Disabilita foreign key checks per velocizzare l'import
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- USERS (30 totali: 2 admin, 28 customers)
-- =====================================================
-- Password per tutti: "password123" (hash bcrypt)
-- Hash: $2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password_hash`, `phone`, `role`) VALUES
(1, 'Admin', 'Principale', 'admin@shopsphere.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 338 1234567', 'admin'),
(2, 'Seller', 'Manager', 'seller@shopsphere.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 338 1234568', 'admin'),
(3, 'Mario', 'Rossi', 'mario.rossi@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 338 1111111', 'customer'),
(4, 'Giulia', 'Bianchi', 'giulia.bianchi@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 338 2222222', 'customer'),
(5, 'Luca', 'Verdi', 'luca.verdi@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 338 3333333', 'customer'),
(6, 'Anna', 'Neri', 'anna.neri@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 338 4444444', 'customer'),
(7, 'Francesco', 'Russo', 'francesco.russo@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 338 5555555', 'customer'),
(8, 'Sara', 'Ferrari', 'sara.ferrari@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 338 6666666', 'customer'),
(9, 'Alessandro', 'Colombo', 'alessandro.colombo@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 338 7777777', 'customer'),
(10, 'Elena', 'Ricci', 'elena.ricci@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 338 8888888', 'customer'),
(11, 'Marco', 'Marino', 'marco.marino@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 338 9999999', 'customer'),
(12, 'Chiara', 'Greco', 'chiara.greco@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 339 1111111', 'customer'),
(13, 'Davide', 'Bruno', 'davide.bruno@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 339 2222222', 'customer'),
(14, 'Martina', 'Gallo', 'martina.gallo@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 339 3333333', 'customer'),
(15, 'Simone', 'Conti', 'simone.conti@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 339 4444444', 'customer'),
(16, 'Federica', 'De Luca', 'federica.deluca@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 339 5555555', 'customer'),
(17, 'Matteo', 'Mancini', 'matteo.mancini@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 339 6666666', 'customer'),
(18, 'Valentina', 'Costa', 'valentina.costa@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 339 7777777', 'customer'),
(19, 'Andrea', 'Giordano', 'andrea.giordano@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 339 8888888', 'customer'),
(20, 'Alessia', 'Rizzo', 'alessia.rizzo@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 339 9999999', 'customer'),
(21, 'Stefano', 'Lombardi', 'stefano.lombardi@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 340 1111111', 'customer'),
(22, 'Laura', 'Moretti', 'laura.moretti@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 340 2222222', 'customer'),
(23, 'Riccardo', 'Barbieri', 'riccardo.barbieri@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 340 3333333', 'customer'),
(24, 'Silvia', 'Fontana', 'silvia.fontana@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 340 4444444', 'customer'),
(25, 'Daniele', 'Santoro', 'daniele.santoro@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 340 5555555', 'customer'),
(26, 'Francesca', 'Mariani', 'francesca.mariani@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 340 6666666', 'customer'),
(27, 'Gabriele', 'Rinaldi', 'gabriele.rinaldi@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 340 7777777', 'customer'),
(28, 'Elisa', 'Caruso', 'elisa.caruso@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 340 8888888', 'customer'),
(29, 'Tommaso', 'Leone', 'tommaso.leone@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 340 9999999', 'customer'),
(30, 'Giorgia', 'Longo', 'giorgia.longo@email.com', '$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq', '+39 341 1111111', 'customer');

-- =====================================================
-- ADDRESSES (30, uno per user)
-- =====================================================
INSERT INTO `addresses` (`user_id`, `address_line`, `city`, `postal_code`, `country`, `type`, `is_default`) VALUES
(1, 'Via Roma 1', 'Milano', '20121', 'Italia', 'both', TRUE),
(2, 'Corso Italia 23', 'Roma', '00100', 'Italia', 'both', TRUE),
(3, 'Via Garibaldi 45', 'Napoli', '80100', 'Italia', 'both', TRUE),
(4, 'Piazza Duomo 12', 'Firenze', '50122', 'Italia', 'both', TRUE),
(5, 'Via Torino 78', 'Torino', '10121', 'Italia', 'both', TRUE),
(6, 'Via Veneto 34', 'Bologna', '40100', 'Italia', 'both', TRUE),
(7, 'Corso Vittorio 56', 'Palermo', '90100', 'Italia', 'both', TRUE),
(8, 'Via Dante 89', 'Genova', '16100', 'Italia', 'both', TRUE),
(9, 'Piazza San Marco 15', 'Venezia', '30100', 'Italia', 'both', TRUE),
(10, 'Via Mazzini 67', 'Verona', '37100', 'Italia', 'both', TRUE),
(11, 'Corso Umberto 91', 'Bari', '70100', 'Italia', 'both', TRUE),
(12, 'Via XX Settembre 22', 'Catania', '95100', 'Italia', 'both', TRUE),
(13, 'Piazza Castello 5', 'Cagliari', '09100', 'Italia', 'both', TRUE),
(14, 'Via Colombo 44', 'Trieste', '34100', 'Italia', 'both', TRUE),
(15, 'Corso Cavour 88', 'Padova', '35100', 'Italia', 'both', TRUE),
(16, 'Via Marconi 11', 'Brescia', '25100', 'Italia', 'both', TRUE),
(17, 'Piazza Maggiore 7', 'Parma', '43100', 'Italia', 'both', TRUE),
(18, 'Via Nazionale 99', 'Modena', '41100', 'Italia', 'both', TRUE),
(19, 'Corso Repubblica 33', 'Reggio Emilia', '42100', 'Italia', 'both', TRUE),
(20, 'Via Libertà 66', 'Perugia', '06100', 'Italia', 'both', TRUE),
(21, 'Piazza Unità 18', 'Ancona', '60100', 'Italia', 'both', TRUE),
(22, 'Via Kennedy 77', 'Salerno', '84100', 'Italia', 'both', TRUE),
(23, 'Corso Francia 42', 'Pescara', '65100', 'Italia', 'both', TRUE),
(24, 'Via Europa 55', 'Foggia', '71100', 'Italia', 'both', TRUE),
(25, 'Piazza Risorgimento 28', 'Lecce', '73100', 'Italia', 'both', TRUE),
(26, 'Via Manzoni 81', 'Pisa', '56100', 'Italia', 'both', TRUE),
(27, 'Corso Matteotti 14', 'Livorno', '57100', 'Italia', 'both', TRUE),
(28, 'Via Gramsci 36', 'Siena', '53100', 'Italia', 'both', TRUE),
(29, 'Piazza Dante 63', 'Arezzo', '52100', 'Italia', 'both', TRUE),
(30, 'Via Carducci 95', 'Bergamo', '24100', 'Italia', 'both', TRUE);

-- =====================================================
-- CATEGORIES (6 categorie)
-- =====================================================
INSERT INTO `categories` (`id`, `name`, `description`) VALUES
(1, 'Elettronica', 'Dispositivi elettronici, smartphone, computer e accessori'),
(2, 'Abbigliamento', 'Abbigliamento uomo, donna e bambino'),
(3, 'Casa e Cucina', 'Articoli per la casa, cucina e arredamento'),
(4, 'Libri', 'Libri, ebook e audiolibri'),
(5, 'Sport e Outdoor', 'Attrezzature sportive e articoli per outdoor'),
(6, 'Giocattoli', 'Giochi e giocattoli per bambini');

-- =====================================================
-- PRODUCTS (30 prodotti, distribuiti su 6 categorie)
-- =====================================================
INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `price`, `stock_quantity`, `img_url`, `is_active`) VALUES
-- Elettronica (5 prodotti)
(1, 1, 'iPhone 15 Pro', 'Smartphone Apple con chip A17 Pro, fotocamera da 48MP', 1199.00, 50, 'https://example.com/iphone15.jpg', TRUE),
(2, 1, 'Samsung Galaxy S24', 'Smartphone Android con display AMOLED 6.2"', 899.00, 75, 'https://example.com/galaxys24.jpg', TRUE),
(3, 1, 'MacBook Air M2', 'Laptop ultraleggero con chip M2, 13.6 pollici', 1499.00, 30, 'https://example.com/macbookair.jpg', TRUE),
(4, 1, 'Sony WH-1000XM5', 'Cuffie wireless con cancellazione rumore', 399.00, 100, 'https://example.com/sonywh1000.jpg', TRUE),
(5, 1, 'iPad Air', 'Tablet Apple con chip M1, display Liquid Retina 10.9"', 699.00, 60, 'https://example.com/ipadair.jpg', TRUE),

-- Abbigliamento (5 prodotti)
(6, 2, 'Giacca in Pelle Uomo', 'Giacca in vera pelle, stile biker', 249.00, 40, 'https://example.com/jacket.jpg', TRUE),
(7, 2, 'Jeans Slim Fit Donna', 'Jeans elasticizzati a vita alta', 79.00, 120, 'https://example.com/jeans.jpg', TRUE),
(8, 2, 'T-Shirt Basic Cotone', 'Confezione 3 t-shirt 100% cotone', 29.90, 200, 'https://example.com/tshirt.jpg', TRUE),
(9, 2, 'Sneakers Running', 'Scarpe da running ammortizzate', 129.00, 80, 'https://example.com/sneakers.jpg', TRUE),
(10, 2, 'Cappotto Lana Donna', 'Cappotto elegante in lana vergine', 189.00, 50, 'https://example.com/coat.jpg', TRUE),

-- Casa e Cucina (5 prodotti)
(11, 3, 'Robot Aspirapolvere', 'Robot intelligente con mappatura laser', 349.00, 45, 'https://example.com/robot.jpg', TRUE),
(12, 3, 'Set Pentole Antiaderenti', 'Set 10 pezzi con rivestimento ceramico', 99.00, 70, 'https://example.com/pentole.jpg', TRUE),
(13, 3, 'Macchina del Caffè', 'Macchina espresso automatica', 299.00, 55, 'https://example.com/coffee.jpg', TRUE),
(14, 3, 'Frullatore ad Immersione', 'Frullatore 800W con accessori', 49.90, 90, 'https://example.com/frullatore.jpg', TRUE),
(15, 3, 'Set Asciugamani Spugna', 'Set 6 pezzi in cotone egiziano', 45.00, 110, 'https://example.com/towels.jpg', TRUE),

-- Libri (5 prodotti)
(16, 4, 'Clean Code - Robert Martin', 'Guida alla scrittura di codice pulito', 39.90, 150, 'https://example.com/cleancode.jpg', TRUE),
(17, 4, 'Il Nome della Rosa', 'Romanzo di Umberto Eco', 14.90, 200, 'https://example.com/nomerosa.jpg', TRUE),
(18, 4, 'Sapiens - Yuval Harari', 'Da animali a dèi. Breve storia dell\'umanità', 24.90, 180, 'https://example.com/sapiens.jpg', TRUE),
(19, 4, 'Harry Potter Collezione', 'Cofanetto completo 7 volumi', 89.00, 95, 'https://example.com/harrypotter.jpg', TRUE),
(20, 4, 'La Divina Commedia', 'Edizione integrale con note', 19.90, 160, 'https://example.com/divina.jpg', TRUE),

-- Sport e Outdoor (5 prodotti)
(21, 5, 'Tapis Roulant Elettrico', 'Tapis roulant pieghevole 12 km/h', 449.00, 25, 'https://example.com/treadmill.jpg', TRUE),
(22, 5, 'Set Pesi Regolabili', 'Manubri regolabili 2-24 kg', 159.00, 40, 'https://example.com/dumbbells.jpg', TRUE),
(23, 5, 'Tenda Campeggio 4 Posti', 'Tenda impermeabile facile montaggio', 129.00, 35, 'https://example.com/tent.jpg', TRUE),
(24, 5, 'Mountain Bike 29"', 'MTB full suspension, 21 velocità', 899.00, 20, 'https://example.com/mtb.jpg', TRUE),
(25, 5, 'Zaino Trekking 50L', 'Zaino ergonomico con copertura antipioggia', 89.00, 65, 'https://example.com/backpack.jpg', TRUE),

-- Giocattoli (5 prodotti)
(26, 6, 'LEGO Millennium Falcon', 'Set LEGO Star Wars 7541 pezzi', 179.90, 30, 'https://example.com/lego.jpg', TRUE),
(27, 6, 'Barbie Dreamhouse', 'Casa dei sogni di Barbie con ascensore', 249.00, 45, 'https://example.com/barbie.jpg', TRUE),
(28, 6, 'Nintendo Switch OLED', 'Console con schermo OLED 7"', 349.00, 55, 'https://example.com/switch.jpg', TRUE),
(29, 6, 'Puzzle 1000 Pezzi', 'Puzzle raffigurante Van Gogh', 19.90, 100, 'https://example.com/puzzle.jpg', TRUE),
(30, 6, 'Drone con Fotocamera', 'Drone quadricottero con camera HD', 129.00, 40, 'https://example.com/drone.jpg', TRUE);

-- =====================================================
-- DISCOUNTS (3 codici sconto attivi)
-- =====================================================
INSERT INTO `discounts` (`id`, `code`, `description`, `discount_type`, `value`, `min_order_amount`, `max_discount_amount`, `start_date`, `end_date`, `usage_limit`, `used_count`, `is_active`) VALUES
(1, 'WELCOME10', 'Sconto benvenuto 10%', 'percentage', 10.00, 50.00, 50.00, '2024-01-01', '2025-12-31', NULL, 5, TRUE),
(2, 'ESTATE2024', 'Sconto estivo 15%', 'percentage', 15.00, 100.00, 100.00, '2024-06-01', '2024-09-30', 100, 12, TRUE),
(3, 'FIXED20', 'Sconto fisso 20€', 'fixed_amount', 20.00, 80.00, NULL, '2024-01-01', '2025-12-31', NULL, 8, TRUE);

-- =====================================================
-- ORDERS (15 ordini)
-- =====================================================
INSERT INTO `orders` (`id`, `user_id`, `shipping_address_id`, `billing_address_id`, `order_date`, `status`, `discount_id`, `total_amount`, `notes`) VALUES
(1, 3, 3, 3, '2024-09-15 10:30:00', 'delivered', 1, 1079.10, 'Consegna veloce per favore'),
(2, 4, 4, 4, '2024-09-16 14:20:00', 'delivered', NULL, 809.00, NULL),
(3, 5, 5, 5, '2024-09-18 09:15:00', 'delivered', 2, 1274.15, NULL),
(4, 6, 6, 6, '2024-09-20 16:45:00', 'shipped', NULL, 128.90, NULL),
(5, 7, 7, 7, '2024-09-22 11:00:00', 'shipped', 3, 329.00, 'Regalo, no fattura in pacco'),
(6, 8, 8, 8, '2024-09-25 13:30:00', 'processing', NULL, 698.00, NULL),
(7, 9, 9, 9, '2024-09-26 15:00:00', 'processing', 1, 35.91, NULL),
(8, 10, 10, 10, '2024-09-27 10:10:00', 'confirmed', NULL, 478.00, NULL),
(9, 11, 11, 11, '2024-09-28 12:25:00', 'confirmed', 2, 1274.15, NULL),
(10, 12, 12, 12, '2024-09-29 14:50:00', 'pending', NULL, 189.00, NULL),
(11, 13, 13, 13, '2024-09-30 09:35:00', 'pending', NULL, 899.00, 'Chiamare prima della consegna'),
(12, 14, 14, 14, '2024-10-01 11:20:00', 'delivered', 1, 358.11, NULL),
(13, 15, 15, 15, '2024-10-01 16:40:00', 'shipped', NULL, 79.00, NULL),
(14, 16, 16, 16, '2024-10-02 10:05:00', 'processing', NULL, 249.00, NULL),
(15, 17, 17, 17, '2024-10-03 13:15:00', 'confirmed', 2, 1019.15, NULL);

-- =====================================================
-- ORDER_ITEMS (dettagli prodotti per ordine)
-- =====================================================
INSERT INTO `order_items` (`order_id`, `product_id`, `quantity`, `unit_price`, `subtotal`) VALUES
-- Ordine 1 (user 3): iPhone 15 Pro
(1, 1, 1, 1199.00, 1199.00),

-- Ordine 2 (user 4): Samsung Galaxy S24
(2, 2, 1, 899.00, 899.00),

-- Ordine 3 (user 5): MacBook Air + Cuffie Sony
(3, 3, 1, 1499.00, 1499.00),
(3, 4, 1, 399.00, 399.00),

-- Ordine 4 (user 6): Sneakers
(4, 9, 1, 129.00, 129.00),

-- Ordine 5 (user 7): Robot Aspirapolvere
(5, 11, 1, 349.00, 349.00),

-- Ordine 6 (user 8): iPad Air
(6, 5, 1, 699.00, 699.00),

-- Ordine 7 (user 9): T-shirt
(7, 8, 1, 29.90, 29.90),

-- Ordine 8 (user 10): Giacca Pelle + Cappotto
(8, 6, 1, 249.00, 249.00),
(8, 10, 1, 189.00, 189.00),

-- Ordine 9 (user 11): MacBook Air + Cuffie Sony
(9, 3, 1, 1499.00, 1499.00),
(9, 4, 1, 399.00, 399.00),

-- Ordine 10 (user 12): Cappotto
(10, 10, 1, 189.00, 189.00),

-- Ordine 11 (user 13): Mountain Bike
(11, 24, 1, 899.00, 899.00),

-- Ordine 12 (user 14): Sony Cuffie
(12, 4, 1, 399.00, 399.00),

-- Ordine 13 (user 15): Jeans
(13, 7, 1, 79.00, 79.00),

-- Ordine 14 (user 16): Giacca Pelle
(14, 6, 1, 249.00, 249.00),

-- Ordine 15 (user 17): iPhone 15 Pro
(15, 1, 1, 1199.00, 1199.00);

-- =====================================================
-- PAYMENTS (1 pagamento per ordine completato/processato)
-- =====================================================
INSERT INTO `payments` (`order_id`, `payment_date`, `amount`, `payment_method`, `status`, `transaction_id`) VALUES
(1, '2024-09-15 10:31:00', 1079.10, 'credit_card', 'completed', 'TXN-2024091501'),
(2, '2024-09-16 14:21:00', 809.00, 'paypal', 'completed', 'TXN-2024091602'),
(3, '2024-09-18 09:16:00', 1274.15, 'credit_card', 'completed', 'TXN-2024091803'),
(4, '2024-09-20 16:46:00', 128.90, 'debit_card', 'completed', 'TXN-2024092004'),
(5, '2024-09-22 11:01:00', 329.00, 'bank_transfer', 'completed', 'TXN-2024092205'),
(6, '2024-09-25 13:31:00', 698.00, 'credit_card', 'completed', 'TXN-2024092506'),
(7, '2024-09-26 15:01:00', 35.91, 'paypal', 'completed', 'TXN-2024092607'),
(8, '2024-09-27 10:11:00', 478.00, 'credit_card', 'completed', 'TXN-2024092708'),
(9, '2024-09-28 12:26:00', 1274.15, 'credit_card', 'completed', 'TXN-2024092809'),
(10, '2024-09-29 14:51:00', 189.00, 'cash_on_delivery', 'pending', NULL),
(11, '2024-09-30 09:36:00', 899.00, 'credit_card', 'pending', NULL),
(12, '2024-10-01 11:21:00', 358.11, 'paypal', 'completed', 'TXN-2024100112'),
(13, '2024-10-01 16:41:00', 79.00, 'debit_card', 'completed', 'TXN-2024100113'),
(14, '2024-10-02 10:06:00', 249.00, 'credit_card', 'completed', 'TXN-2024100214'),
(15, '2024-10-03 13:16:00', 1019.15, 'credit_card', 'completed', 'TXN-2024100315');

-- =====================================================
-- SHIPPINGS (per ordini shipped/delivered)
-- =====================================================
INSERT INTO `shippings` (`order_id`, `shipping_address_id`, `shipping_method`, `tracking_number`, `carrier`, `shipped_date`, `estimated_delivery`, `delivery_date`, `status`) VALUES
(1, 3, 'express', 'IT123456789', 'DHL', '2024-09-15 18:00:00', '2024-09-16 18:00:00', '2024-09-16 14:30:00', 'delivered'),
(2, 4, 'standard', 'IT234567890', 'Poste Italiane', '2024-09-17 09:00:00', '2024-09-20 18:00:00', '2024-09-19 11:20:00', 'delivered'),
(3, 5, 'express', 'IT345678901', 'DHL', '2024-09-18 17:00:00', '2024-09-19 18:00:00', '2024-09-19 15:45:00', 'delivered'),
(4, 6, 'standard', 'IT456789012', 'BRT', '2024-09-21 10:00:00', '2024-09-24 18:00:00', NULL, 'in_transit'),
(5, 7, 'express', 'IT567890123', 'DHL', '2024-09-23 08:00:00', '2024-09-24 18:00:00', NULL, 'in_transit'),
(12, 14, 'overnight', 'IT678901234', 'TNT', '2024-10-01 16:00:00', '2024-10-02 12:00:00', '2024-10-02 10:30:00', 'delivered'),
(13, 15, 'standard', 'IT789012345', 'Poste Italiane', '2024-10-02 09:00:00', '2024-10-05 18:00:00', NULL, 'in_transit');

-- =====================================================
-- WISHLISTS (alcuni utenti con prodotti salvati)
-- =====================================================
INSERT INTO `wishlists` (`user_id`, `product_id`, `added_at`) VALUES
(3, 3, '2024-09-10 12:00:00'),  -- Mario vuole MacBook
(3, 21, '2024-09-12 15:30:00'), -- Mario vuole Tapis Roulant
(4, 1, '2024-09-14 10:00:00'),  -- Giulia vuole iPhone
(4, 27, '2024-09-14 10:05:00'), -- Giulia vuole Barbie House
(5, 24, '2024-09-17 11:20:00'), -- Luca vuole Mountain Bike
(6, 11, '2024-09-19 16:45:00'), -- Anna vuole Robot
(7, 28, '2024-09-21 09:30:00'), -- Francesco vuole Switch
(8, 13, '2024-09-24 14:00:00'), -- Sara vuole Macchina Caffè
(9, 19, '2024-09-25 18:20:00'), -- Alessandro vuole Harry Potter
(10, 2, '2024-09-26 13:15:00'); -- Elena vuole Galaxy

-- Riabilita foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Fine seed data
SELECT 'Seed data inseriti con successo!' as message;
