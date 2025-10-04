# ✅ FASE 4B COMPLETATA - Users Management API

**Data completamento**: 2025-10-04
**Tempo impiegato**: ~30 minuti

---

## 🎯 Implementazione Users CRUD con Ownership Check

### Controller: [userController.js](../backend/src/controllers/userController.js)

Implementati 6 endpoint per gestione utenti con **ownership check** e **role-based access control**.

---

## 🔐 Sistema di Ownership

**Principio**: Un utente può vedere/modificare solo i propri dati, gli admin possono vedere/modificare tutto.

```javascript
// Esempio ownership check
if (requesterRole !== 'admin' && parseInt(id) !== requesterId) {
  throw new AppError('You can only view your own profile', 403);
}
```

---

## 📡 Endpoints Implementati

### 1. GET `/api/users/:id` - Profilo utente

**Authorization**: Richiede token JWT
**Ownership**: Self o Admin

**Esempio request (user vede se stesso):**
```bash
curl http://localhost:3000/api/users/3 \
  -H "Authorization: Bearer <user_token>"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 3,
      "first_name": "Mario",
      "last_name": "Rossi",
      "email": "mario.rossi@email.com",
      "phone": "+39 333 9999999",
      "role": "customer",
      "created_at": "2025-10-04T14:26:36.000Z",
      "updated_at": "2025-10-04T16:30:47.000Z"
    }
  }
}
```

**Ownership check failure (403):**
```bash
# User 3 cerca di vedere user 5
curl http://localhost:3000/api/users/5 \
  -H "Authorization: Bearer <user3_token>"

# Response:
{
  "success": false,
  "message": "You can only view your own profile"
}
```

---

### 2. PUT `/api/users/:id` - Aggiorna profilo

**Authorization**: Richiede token JWT
**Ownership**: Self (solo campi base) o Admin (tutti i campi incluso role)

**Campi aggiornabili:**
- Tutti: `first_name`, `last_name`, `email`, `phone`, `password`
- Solo Admin: `role`

**Esempio request (user aggiorna se stesso):**
```bash
curl -X PUT http://localhost:3000/api/users/3 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <user_token>" \
  -d '{
    "phone": "+39 333 9999999",
    "first_name": "Mario Aggiornato"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "id": 3,
      "first_name": "Mario Aggiornato",
      "last_name": "Rossi",
      "email": "mario.rossi@email.com",
      "phone": "+39 333 9999999",
      "role": "customer",
      "created_at": "2025-10-04T14:26:36.000Z",
      "updated_at": "2025-10-04T16:40:00.000Z"
    }
  }
}
```

**Admin cambia role (solo admin):**
```bash
curl -X PUT http://localhost:3000/api/users/5 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"role": "seller"}'
```

**User prova a cambiare proprio role (403):**
```bash
curl -X PUT http://localhost:3000/api/users/3 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <user_token>" \
  -d '{"role": "admin"}'

# Response:
{
  "success": false,
  "message": "Only admins can change user roles"
}
```

**Validazioni:**
- Email univoca (verifica che non sia già in uso)
- Password hashata con bcrypt se fornita
- Role valido: `customer`, `admin`, `seller`
- Update dinamico (solo campi forniti)

---

### 3. GET `/api/users` - Lista utenti (Admin only)

**Authorization**: Richiede token JWT + ruolo admin
**Query params:**
- `role` - Filtra per ruolo (customer, admin, seller)
- `limit` - Numero risultati (default: 20, max: 100)
- `offset` - Offset paginazione

**Esempio request:**
```bash
curl 'http://localhost:3000/api/users?role=customer&limit=5' \
  -H "Authorization: Bearer <admin_token>"
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "total": 28,
  "data": {
    "users": [
      {
        "id": 31,
        "first_name": "Test",
        "last_name": "User",
        "email": "test@example.com",
        "phone": null,
        "role": "customer",
        "created_at": "2025-10-04T15:29:36.000Z"
      },
      ...
    ]
  }
}
```

**Caratteristiche:**
- Paginazione con count totale
- Filtro per role
- Solo admin può accedere
- Password hash mai incluso nella response

---

### 4. DELETE `/api/users/:id` - Elimina utente

**Authorization**: Richiede token JWT
**Ownership**: Self o Admin

**Protezioni:**
- Verifica utente esistente
- Blocca eliminazione se utente ha ordini pendenti (pending, confirmed, processing)
- Cascade delete su addresses e wishlists

**Esempio request:**
```bash
curl -X DELETE http://localhost:3000/api/users/31 \
  -H "Authorization: Bearer <admin_token>"
```

**Response (successo):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error se ha ordini pendenti (409):**
```json
{
  "success": false,
  "message": "Cannot delete user. User has 2 pending orders. Please complete or cancel them first."
}
```

---

### 5. GET `/api/users/:id/orders` - Ordini utente (Query complessa)

**Authorization**: Richiede token JWT
**Ownership**: Self o Admin

**Query complessa con:**
- JOIN su 4 tabelle (orders, payments, shippings, order_items)
- GROUP BY per aggregazioni
- Recupero items per ogni ordine con dettagli prodotto
- LEFT JOIN per gestire ordini senza payment/shipping

**Esempio request:**
```bash
curl http://localhost:3000/api/users/3/orders \
  -H "Authorization: Bearer <user_token>"
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": {
    "orders": [
      {
        "id": 1,
        "status": "delivered",
        "total_amount": "1079.10",
        "order_date": "2024-09-15T08:30:00.000Z",
        "notes": "Consegna veloce per favore",
        "payment_method": "credit_card",
        "payment_status": "completed",
        "payment_date": "2024-09-15T08:31:00.000Z",
        "transaction_id": "TXN-2024091501",
        "tracking_number": "IT123456789",
        "carrier": "DHL",
        "shipping_method": "express",
        "shipping_status": "delivered",
        "shipped_date": "2024-09-15T16:00:00.000Z",
        "delivery_date": "2024-09-16T12:30:00.000Z",
        "items_count": 1,
        "total_items": "1",
        "items": [
          {
            "id": 1,
            "product_id": 1,
            "quantity": 1,
            "unit_price": "1199.00",
            "subtotal": "1199.00",
            "product_name": "iPhone 15 Pro",
            "product_image": "https://example.com/iphone15.jpg"
          }
        ]
      }
    ]
  }
}
```

**Query SQL:**
```sql
SELECT
  o.id,
  o.status,
  o.total_amount,
  o.order_date,
  o.notes,
  p.payment_method,
  p.status as payment_status,
  p.payment_date,
  p.transaction_id,
  s.tracking_number,
  s.carrier,
  s.shipping_method,
  s.status as shipping_status,
  s.shipped_date,
  s.delivery_date,
  COUNT(oi.id) as items_count,
  SUM(oi.quantity) as total_items
FROM orders o
LEFT JOIN payments p ON o.id = p.order_id
LEFT JOIN shippings s ON o.id = s.order_id
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.user_id = ?
GROUP BY o.id, p.id, s.id
ORDER BY o.order_date DESC
```

**Caratteristiche:**
- Informazioni complete ordine con pagamento e spedizione
- Items con dettagli prodotto per ogni ordine
- Aggregazioni count e sum
- LEFT JOIN per gestire dati mancanti

---

### 6. GET `/api/users/:id/addresses` - Indirizzi utente

**Authorization**: Richiede token JWT
**Ownership**: Self o Admin

**Esempio request:**
```bash
curl http://localhost:3000/api/users/3/addresses \
  -H "Authorization: Bearer <user_token>"
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": {
    "addresses": [
      {
        "id": 3,
        "user_id": 3,
        "address_line": "Via Garibaldi 45",
        "city": "Napoli",
        "postal_code": "80100",
        "country": "Italia",
        "type": "both",
        "created_at": "2025-10-04T14:26:36.000Z",
        "is_default": 1
      }
    ]
  }
}
```

**Ordinamento:**
- Prima gli indirizzi default (`is_default DESC`)
- Poi per data creazione (`created_at DESC`)

---

## 📋 Routes: [users.js](../backend/src/routes/users.js)

```javascript
const express = require('express');
const router = express.Router();
const { authenticateToken, checkRole } = require('../middlewares/auth');

// Tutte le routes richiedono autenticazione
router.use(authenticateToken);

// Admin only
router.get('/', checkRole('admin'), getAllUsers);

// Self or admin (ownership check nel controller)
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Related data
router.get('/:id/orders', getUserOrders);
router.get('/:id/addresses', getUserAddresses);
```

**Pattern architetturale:**
- Autenticazione globale con `router.use(authenticateToken)`
- Role check a livello route per admin
- Ownership check a livello controller per maggiore flessibilità

---

## 🧪 Testing API

### Test ownership check:

```bash
# Login user 3
USER_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mario.rossi@email.com","password":"password123"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])")

# ✅ User vede se stesso (SUCCESS)
curl http://localhost:3000/api/users/3 \
  -H "Authorization: Bearer $USER_TOKEN"

# ❌ User prova a vedere altro utente (403 FORBIDDEN)
curl http://localhost:3000/api/users/5 \
  -H "Authorization: Bearer $USER_TOKEN"
```

### Test role check:

```bash
# Login admin
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shopsphere.com","password":"password123"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])")

# ✅ Admin cambia role (SUCCESS)
curl -X PUT http://localhost:3000/api/users/5 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"role":"seller"}'

# ❌ User prova a cambiare proprio role (403 FORBIDDEN)
curl -X PUT http://localhost:3000/api/users/3 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{"role":"admin"}'
```

### Test query complessa ordini:

```bash
# Get ordini completi con items, payment, shipping
curl http://localhost:3000/api/users/3/orders \
  -H "Authorization: Bearer $USER_TOKEN" \
  | python3 -m json.tool
```

---

## 🔧 Problemi Risolti

### Schema Database Mismatch

**Problema 1**: Query cercava campo `order_number` che non esiste
```sql
-- ❌ SBAGLIATO
SELECT o.order_number FROM orders o

-- ✅ CORRETTO
SELECT o.id FROM orders o
```

**Problema 2**: Campi payment/shipping diversi da attesi
```sql
-- ❌ SBAGLIATO
SELECT p.method, s.shipped_at, s.delivered_at

-- ✅ CORRETTO
SELECT p.payment_method, s.shipped_date, s.delivery_date
```

**Soluzione**: Verificato schema DB con `DESCRIBE` e corretto query per corrispondere ai campi reali.

---

## ✅ Checklist FASE 4B

- [x] Controller userController.js completo
- [x] Routes users.js con ownership check
- [x] Integrazione in server.js
- [x] Ownership check (self o admin)
- [x] Role-based access control (admin features)
- [x] Query complessa ordini utente con JOIN 4 tabelle
- [x] Get addresses utente
- [x] Update dinamico con validazioni
- [x] Protezione delete con verifica ordini pendenti
- [x] Email uniqueness check
- [x] Password hashing su update
- [x] Test ownership violations
- [x] Test role escalation prevention
- [x] Fix schema database mismatch

---

## 📊 Query Complesse Implementate

### 1. User Orders (JOIN 4 tabelle) ✅
```sql
SELECT ... FROM orders o
LEFT JOIN payments p ON o.id = p.order_id
LEFT JOIN shippings s ON o.id = s.order_id
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.user_id = ?
GROUP BY o.id, p.id, s.id
```

**Caratteristiche:**
- JOIN multipli per dati completi
- GROUP BY con aggregazioni COUNT, SUM
- LEFT JOIN per gestire dati opzionali
- Subquery per items dettagliati

### 2. Pending Orders Check ✅
```sql
SELECT COUNT(*) as count FROM orders
WHERE user_id = ? AND status IN ('pending', 'confirmed', 'processing')
```

**Uso:** Prevenire eliminazione utenti con ordini attivi

---

## 🎯 FASE 4 (Products + Users) - Riepilogo Completo

**Implementato:**
- ✅ 7 endpoints Products (FASE 4A)
- ✅ 6 endpoints Users (FASE 4B)
- ✅ Ownership check pattern
- ✅ Role-based access control
- ✅ 3 query complesse SQL:
  1. Top-selling products (JOIN 4 tabelle, GROUP BY)
  2. User orders (JOIN 4 tabelle, subquery items)
  3. Pending orders check
- ✅ Filtri dinamici e paginazione
- ✅ Validazioni business logic
- ✅ Testing completo

**Progresso totale**: ~65% del progetto completato

**Prossimi step (FASE 5)**: MongoDB integration - Reviews, Comments, Activity Logs

---

**FASE 4 (Products & Users) COMPLETATA CON SUCCESSO! 🎉**
