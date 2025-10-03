# Modifiche Schema SQL - Da Applicare su drawdb.app

## ✏️ Modifiche da Fare

### 1. **Rinomina Tabella: `customers` → `users`**

**Azione su drawdb.app:**
- Clicca sulla tabella `customers`
- Rinominala in `users`

**Campi modificati/aggiunti:**
- ✅ Aggiungi campo `role` dopo `phone`:
  - **Nome**: `role`
  - **Tipo**: `ENUM('customer', 'admin', 'seller')`
  - **Default**: `'customer'`
  - **NOT NULL**: ✅

- ✅ Aggiungi campo `updated_at` dopo `created_at`:
  - **Nome**: `updated_at`
  - **Tipo**: `DATETIME`
  - **Default**: `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
  - **NOT NULL**: ✅

**Indici da aggiungere:**
- `idx_email` su campo `email`
- `idx_role` su campo `role`

---

### 2. **Aggiorna Tabella `addresses`**

**Modifiche:**
- ✅ Rinomina campo: `customer_id` → `user_id`
- ✅ Aggiungi campo `city` (VARCHAR 100) dopo `address_line`
- ✅ Modifica campo `type`:
  - Da: `ENUM('billing', 'shipping', 'other')`
  - A: `ENUM('billing', 'shipping', 'both')`
  - Default: `'both'`
- ✅ Aggiungi campo `is_default` (BOOLEAN, DEFAULT FALSE)

**Foreign Key da aggiornare:**
- `user_id` → `users.id` (era `customer_id` → `customers.id`)
- ON UPDATE: CASCADE
- ON DELETE: CASCADE

---

### 3. **Aggiorna Tabella `products`**

**Campi aggiunti:**
- ✅ `image_url` (VARCHAR 500, NULL) dopo `stock_quantity`
- ✅ `is_active` (BOOLEAN, DEFAULT TRUE)
- ✅ `updated_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)

**Indici da aggiungere:**
- `idx_price` su campo `price`
- `idx_name` su campo `name`

---

### 4. **Aggiorna Tabella `orders`**

**Modifiche:**
- ✅ Rinomina campo: `customer_id` → `user_id`
- ✅ Modifica campo `status`:
  - Da: `ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled')`
  - A: `ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')`
  - Default: `'pending'`
- ✅ Aggiungi campo `notes` (TEXT, NULL) alla fine

**Foreign Key da aggiornare:**
- `user_id` → `users.id` (era `customer_id` → `customers.id`)

**Indici da aggiungere:**
- `idx_user_id` su `user_id`
- `idx_status` su `status`
- `idx_order_date` su `order_date`

---

### 5. **Aggiorna Tabella `order_items`**

**Campi aggiunti:**
- ✅ `subtotal` (DECIMAL 10,2, NOT NULL) dopo `unit_price`

**Indici da aggiungere:**
- `idx_order_id` su `order_id`
- `idx_product_id` su `product_id`

---

### 6. **Aggiorna Tabella `payments`**

**Modifiche:**
- ✅ Modifica campo `payment_method`:
  - Da: `ENUM('credit_card', 'paypal', 'bank_transfer', 'cash')`
  - A: `ENUM('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery')`
- ✅ Aggiungi default `'pending'` a campo `status`

**Indici da aggiungere:**
- `idx_order_id` su `order_id`
- `idx_status` su `status`
- `idx_transaction_id` (UNIQUE) su `transaction_id`

---

### 7. **Aggiorna Tabella `shippings`**

**Campi aggiunti:**
- ✅ `carrier` (VARCHAR 100, NULL) dopo `tracking_number`
- ✅ `estimated_delivery` (DATETIME, NULL) dopo `shipped_date`

**Modifiche:**
- ✅ Modifica campo `status`:
  - Da: `ENUM('pending', 'shipped', 'in_transit', 'delivered', 'returned')`
  - A: `ENUM('pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned')`
  - Default: `'pending'`

**Indici da aggiungere:**
- `idx_order_id` su `order_id`
- `idx_status` su `status`
- `idx_tracking_number` su `tracking_number`

---

### 8. **Aggiorna Tabella `discounts`**

**Campi aggiunti:**
- ✅ `min_order_amount` (DECIMAL 10,2, NULL) dopo `value`
- ✅ `max_discount_amount` (DECIMAL 10,2, NULL)
- ✅ `usage_limit` (INTEGER, NULL) dopo `end_date`
- ✅ `used_count` (INTEGER, DEFAULT 0, NOT NULL)
- ✅ `is_active` (BOOLEAN, DEFAULT TRUE, NOT NULL)

**Modifiche:**
- ✅ Modifica lunghezza `code`: da VARCHAR(255) a VARCHAR(50)

**Indici da aggiungere:**
- `idx_code` su `code`
- `idx_is_active` su `is_active`

---

### 9. **CREA Nuova Tabella `wishlists`**

**Campi:**
| Campo | Tipo | Vincoli |
|-------|------|---------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT, UNIQUE |
| user_id | INTEGER | NOT NULL, FK → users.id |
| product_id | INTEGER | NOT NULL, FK → products.id |
| added_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

**Indici:**
- `idx_user_product` (UNIQUE) su (`user_id`, `product_id`)
- `idx_user_id` su `user_id`
- `idx_product_id` su `product_id`

**Foreign Keys:**
- `user_id` → `users.id` (CASCADE, CASCADE)
- `product_id` → `products.id` (CASCADE, CASCADE)

---

## 🔄 Riepilogo Foreign Keys da Aggiornare

Tutte le FK che puntavano a `customers` ora puntano a `users`:
- ✅ `addresses.user_id` → `users.id`
- ✅ `orders.user_id` → `users.id`
- ✅ `wishlists.user_id` → `users.id`

---

## 📊 Foreign Keys Complete (per riferimento)

| Tabella | Campo FK | Riferimento | ON UPDATE | ON DELETE |
|---------|----------|-------------|-----------|-----------|
| addresses | user_id | users.id | CASCADE | CASCADE |
| products | category_id | categories.id | CASCADE | RESTRICT |
| orders | user_id | users.id | CASCADE | RESTRICT |
| orders | shipping_address_id | addresses.id | CASCADE | RESTRICT |
| orders | billing_address_id | addresses.id | CASCADE | RESTRICT |
| orders | discount_id | discounts.id | CASCADE | SET NULL |
| order_items | order_id | orders.id | CASCADE | CASCADE |
| order_items | product_id | products.id | CASCADE | RESTRICT |
| payments | order_id | orders.id | CASCADE | CASCADE |
| shippings | order_id | orders.id | CASCADE | CASCADE |
| shippings | shipping_address_id | addresses.id | CASCADE | RESTRICT |
| wishlists | user_id | users.id | CASCADE | CASCADE |
| wishlists | product_id | products.id | CASCADE | CASCADE |

---

## ✅ Checklist Completamento

- [ ] Tabella `customers` rinominata in `users`
- [ ] Campo `role` aggiunto a `users`
- [ ] Campo `updated_at` aggiunto a `users`
- [ ] Tutti i `customer_id` rinominati in `user_id`
- [ ] Tabella `wishlists` creata
- [ ] Tutti i campi aggiuntivi inseriti
- [ ] Tutti gli indici aggiunti
- [ ] Tutte le FK aggiornate
- [ ] Esportato nuovo SQL da drawdb.app
- [ ] Esportato nuovo diagramma .jpeg/.png

---

**Note:**
Dopo aver completato le modifiche su drawdb.app, esporta:
1. Il file SQL aggiornato
2. L'immagine del diagramma ER (formato .jpeg o .png)

Questi sostituiranno i file precedenti nella cartella del progetto.
