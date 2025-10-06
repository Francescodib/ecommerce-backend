# ✅ FASE 4A COMPLETATA - Products API

**Data completamento**: 2025-10-04
**Tempo impiegato**: ~45 minuti

---

## 🎯 Implementazione Products CRUD

### Controller: [productController.js](../backend/src/controllers/productController.js)

Implementati 7 endpoint per gestione completa prodotti con query complesse SQL.

---

## 📡 Endpoints Implementati

### 1. GET `/api/products` - Lista prodotti con filtri

**Query params supportati:**
- `category` - Filtra per ID categoria
- `minPrice` - Prezzo minimo
- `maxPrice` - Prezzo massimo
- `search` - Ricerca in nome e descrizione (LIKE)
- `isActive` - Filtra prodotti attivi/disattivi
- `limit` - Numero risultati (default: 20, max: 100)
- `offset` - Offset paginazione (default: 0)

**Esempio request:**
```bash
curl 'http://localhost:3000/api/products?category=1&minPrice=100&maxPrice=1000&limit=5'
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "total": 3,
  "data": {
    "products": [
      {
        "id": 2,
        "category_id": 1,
        "name": "Samsung Galaxy S24",
        "description": "Smartphone Android con display AMOLED 6.2\"",
        "price": "899.00",
        "stock_quantity": 75,
        "created_at": "2025-10-04T14:26:36.000Z",
        "img_url": "https://example.com/galaxys24.jpg",
        "is_active": 1,
        "category_name": "Elettronica"
      }
    ]
  }
}
```

**Caratteristiche:**
- Query SQL dinamica costruita in base ai filtri
- Prepared statements per sicurezza
- Count totale per paginazione
- JOIN con categories per nome categoria

---

### 2. GET `/api/products/:id` - Dettagli prodotto

**Esempio request:**
```bash
curl http://localhost:3000/api/products/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "category_id": 1,
      "name": "iPhone 15 Pro",
      "description": "Smartphone Apple con chip A17 Pro, fotocamera da 48MP",
      "price": "1199.00",
      "stock_quantity": 50,
      "created_at": "2025-10-04T14:26:36.000Z",
      "img_url": "https://example.com/iphone15.jpg",
      "is_active": 1,
      "category_name": "Elettronica",
      "category_description": "Dispositivi elettronici, smartphone, computer e accessori"
    }
  }
}
```

**Caratteristiche:**
- JOIN con categories per informazioni complete
- Error 404 se prodotto non trovato

---

### 3. POST `/api/products` - Crea prodotto (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request body:**
```json
{
  "category_id": 1,
  "name": "Nuovo Prodotto",
  "description": "Descrizione del prodotto",
  "price": 99.99,
  "stock_quantity": 10,
  "img_url": "https://example.com/image.jpg",
  "is_active": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": {
      "id": 31,
      "category_id": 1,
      "name": "Nuovo Prodotto",
      "description": "Descrizione del prodotto",
      "price": "99.99",
      "stock_quantity": 10,
      "created_at": "2025-10-04T16:21:42.000Z",
      "img_url": "https://example.com/image.jpg",
      "is_active": 1,
      "category_name": "Elettronica"
    }
  }
}
```

**Validazioni:**
- Campi obbligatori: `category_id`, `name`, `description`, `price`
- Verifica categoria esistente
- Prezzo deve essere positivo
- Default: `stock_quantity = 0`, `is_active = true`

**Errors:**
- `400` - Campi mancanti o prezzo negativo
- `404` - Categoria non trovata
- `401` - Non autenticato
- `403` - Non admin

---

### 4. PUT `/api/products/:id` - Aggiorna prodotto (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request body (tutti campi opzionali):**
```json
{
  "name": "Nome Aggiornato",
  "price": 149.99
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "product": {
      "id": 31,
      "category_id": 1,
      "name": "Nome Aggiornato",
      "price": "149.99",
      ...
    }
  }
}
```

**Caratteristiche:**
- Update dinamico (solo campi forniti)
- Verifica categoria se cambiata
- Validazione prezzo positivo

**Errors:**
- `404` - Prodotto non trovato
- `400` - Nessun campo da aggiornare o prezzo negativo
- `401/403` - Auth/permessi

---

### 5. DELETE `/api/products/:id` - Elimina prodotto (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Protezioni:**
- Verifica che il prodotto non sia in ordini esistenti
- Se ha ordini, suggerisce di disattivare invece di eliminare

**Error 409:**
```json
{
  "success": false,
  "message": "Cannot delete product. It is referenced in 5 orders. Consider setting is_active to false instead."
}
```

---

### 6. GET `/api/products/top-selling` - Prodotti più venduti (Query complessa)

**Query SQL complessa con:**
- JOIN su 4 tabelle (products, categories, order_items, orders)
- GROUP BY prodotto
- Aggregazioni: SUM, COUNT
- Filtro per stati ordine validi

**Query params:**
- `limit` - Numero risultati (default: 10, max: 100)

**Esempio request:**
```bash
curl 'http://localhost:3000/api/products/top-selling?limit=5'
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": {
    "products": [
      {
        "id": 4,
        "name": "Sony WH-1000XM5",
        "price": "399.00",
        "img_url": "https://example.com/sonywh1000.jpg",
        "category_name": "Elettronica",
        "total_sold": "3",
        "total_orders": 3,
        "total_revenue": "1197.00"
      },
      {
        "id": 1,
        "name": "iPhone 15 Pro",
        "price": "1199.00",
        "img_url": "https://example.com/iphone15.jpg",
        "category_name": "Elettronica",
        "total_sold": "2",
        "total_orders": 2,
        "total_revenue": "2398.00"
      }
    ]
  }
}
```

**Query SQL:**
```sql
SELECT
  p.id,
  p.name,
  p.price,
  p.img_url,
  c.name as category_name,
  SUM(oi.quantity) as total_sold,
  COUNT(DISTINCT oi.order_id) as total_orders,
  SUM(oi.subtotal) as total_revenue
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('confirmed', 'processing', 'shipped', 'delivered')
GROUP BY p.id
ORDER BY total_sold DESC
LIMIT 5
```

---

### 7. GET `/api/products/category/:categoryId` - Prodotti per categoria

**Query params:**
- `limit` - Numero risultati (default: 20, max: 100)
- `offset` - Offset paginazione

**Esempio request:**
```bash
curl 'http://localhost:3000/api/products/category/1?limit=3'
```

**Response:**
```json
{
  "success": true,
  "category": {
    "id": 1,
    "name": "Elettronica",
    "description": "Dispositivi elettronici..."
  },
  "count": 3,
  "data": {
    "products": [...]
  }
}
```

**Caratteristiche:**
- Verifica esistenza categoria
- Solo prodotti attivi (`is_active = TRUE`)
- Ordinamento per data creazione DESC

---

## 🔧 Problemi Risolti

### LIMIT/OFFSET Parameterization Issue

**Problema:**
mysql2 non supporta LIMIT e OFFSET come parametri prepared statement, causando errore:
```
"Incorrect arguments to mysqld_stmt_execute"
```

**Soluzione:**
Utilizzare safe integer interpolation invece di prepared statement parameters:

```javascript
// ❌ SBAGLIATO
sql += ' LIMIT ? OFFSET ?';
params.push(parseInt(limit), parseInt(offset));

// ✅ CORRETTO
const safeLimit = Math.max(1, Math.min(100, parseInt(limit) || 20));
const safeOffset = Math.max(0, parseInt(offset) || 0);
sql += ` LIMIT ${safeLimit} OFFSET ${safeOffset}`;
```

**Sicurezza:**
- Validazione rigorosa con Math.max/Math.min
- Parsing a intero con parseInt
- Valori di default se non forniti
- Limiti massimi (max 100 risultati)

Applicato in:
- `getAllProducts()` - linee 74-76
- `getTopSellingProducts()` - linee 327-328
- `getProductsByCategory()` - linee 380-382

---

## 📋 Routes: [products.js](../backend/src/routes/products.js)

```javascript
const express = require('express');
const router = express.Router();
const { authenticateToken, checkRole } = require('../middlewares/auth');

// Public routes
router.get('/top-selling', getTopSellingProducts);          // PRIMA di /:id!
router.get('/', getAllProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:id', getProductById);

// Admin routes
router.post('/', authenticateToken, checkRole('admin'), createProduct);
router.put('/:id', authenticateToken, checkRole('admin'), updateProduct);
router.delete('/:id', authenticateToken, checkRole('admin'), deleteProduct);
```

**IMPORTANTE:** `/top-selling` deve essere PRIMA di `/:id` per evitare conflitti di routing.

---

## 🧪 Testing API

### Test endpoint pubblici:

```bash
# Lista prodotti con filtri
curl 'http://localhost:3000/api/products?search=iphone'
curl 'http://localhost:3000/api/products?category=1&minPrice=100&maxPrice=1000'
curl 'http://localhost:3000/api/products?limit=5&offset=10'

# Prodotto singolo
curl http://localhost:3000/api/products/1

# Top selling
curl 'http://localhost:3000/api/products/top-selling?limit=5'

# Per categoria
curl 'http://localhost:3000/api/products/category/1?limit=3'
```

### Test endpoint admin:

```bash
# Login admin
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shopsphere.com","password":"password123"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])")

# Crea prodotto
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "category_id": 1,
    "name": "Test Product",
    "description": "Prodotto di test",
    "price": 99.99,
    "stock_quantity": 10
  }'

# Aggiorna prodotto
curl -X PUT http://localhost:3000/api/products/31 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Updated Name","price":149.99}'

# Elimina prodotto
curl -X DELETE http://localhost:3000/api/products/31 \
  -H "Authorization: Bearer $TOKEN"
```

---

## ✅ Checklist FASE 4A

- [x] Controller productController.js completo
- [x] Routes products.js con ordine corretto
- [x] Integrazione in server.js
- [x] Query dinamica con filtri multipli
- [x] Query complessa top-selling con JOIN e GROUP BY
- [x] Validazioni campi e business logic
- [x] Protezione eliminazione prodotti in ordini
- [x] CRUD completo con auth admin
- [x] Fix LIMIT/OFFSET parameterization
- [x] Test tutti gli endpoint

---

## 📊 Query Complesse Implementate

### 1. Top Selling Products ✅
- JOIN su 4 tabelle
- GROUP BY con aggregazioni (SUM, COUNT)
- Filtro per stati ordine
- ORDER BY quantità venduta

### 2. Ricerca Full-Text ✅
- LIKE su nome e descrizione
- Combinazione con altri filtri

### 3. Filtri Multipli Dinamici ✅
- Costruzione query dinamica
- Prepared statements sicuri
- Paginazione con count totale

---

## 🎯 Prossimi Passi (FASE 4B)

**Da implementare:**

1. **Users Management**
   - GET /api/users/:id (con ownership check)
   - PUT /api/users/:id (update profilo)
   - GET /api/users/:id/orders (lista ordini utente)
   - DELETE /api/users/:id (soft delete o admin)

2. **Orders + OrderItems** (FASE 5)
   - POST /api/orders (crea ordine con items)
   - GET /api/orders/:id
   - PUT /api/orders/:id/status (admin)
   - Query complessa ordini per utente

3. **Reviews MongoDB** (FASE 5)
   - CRUD reviews
   - Full-text search
   - Aggregazioni rating

---

**FASE 4A (Products) COMPLETATA CON SUCCESSO! 🎉**

**Progresso totale: ~55% del progetto**
