# ✅ FASE 3 COMPLETATA - Backend Base

**Data completamento**: 2025-10-04
**Tempo impiegato**: ~1.5 ore

---

## 🚀 Backend Express Implementato

### Configurazioni Database

**MySQL Connection Pool** - [`backend/src/config/database.js`](../backend/src/config/database.js)
- Connection pooling (max 10 connessioni simultanee)
- Helper function `query()` per esecuzione query sicure
- Test connessione all'avvio
- Graceful shutdown support

**MongoDB Connection** - [`backend/src/config/mongodb.js`](../backend/src/config/mongodb.js)
- Connessione Mongoose con retry automatico
- Event listeners per monitoraggio stato
- Graceful shutdown support

**JWT Configuration** - [`backend/src/config/jwt.js`](../backend/src/config/jwt.js)
- Generazione token con payload customizzato
- Verifica e decodifica token
- Expiration configurabile (default 24h)

---

## 🛡️ Middlewares Implementati

### Error Handler - [`backend/src/middlewares/errorHandler.js`](../backend/src/middlewares/errorHandler.js)

**Funzionalità:**
- Gestione centralizzata errori
- Response formattate con status code appropriati
- Stack trace in development mode
- Custom `AppError` class per errori applicativi

**Uso:**
```javascript
throw new AppError('Resource not found', 404);
```

### Authentication - [`backend/src/middlewares/auth.js`](../backend/src/middlewares/auth.js)

**Middlewares disponibili:**

1. **`authenticateToken`** - Verifica JWT token
   ```javascript
   router.get('/profile', authenticateToken, getProfile);
   ```

2. **`checkRole(...roles)`** - Verifica ruolo utente
   ```javascript
   router.post('/categories', authenticateToken, checkRole('admin'), createCategory);
   ```

3. **`checkOwnership(paramName)`** - Verifica proprietà risorsa
   ```javascript
   router.put('/users/:userId', authenticateToken, checkOwnership('userId'), updateUser);
   ```

4. **`optionalAuth`** - Auth opzionale (utile per endpoint pubblici con funzionalità extra per utenti loggati)
   ```javascript
   router.get('/products', optionalAuth, getProducts);
   ```

---

## 📡 API Endpoints Implementati

### Authentication - `/api/auth`

#### POST `/api/auth/register`
Registra nuovo utente

**Request Body:**
```json
{
  "first_name": "Mario",
  "last_name": "Rossi",
  "email": "mario@example.com",
  "password": "password123",
  "phone": "+39 123 456 789",  // opzionale
  "role": "customer"            // opzionale, default: customer
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 31,
      "first_name": "Mario",
      "last_name": "Rossi",
      "email": "mario@example.com",
      "phone": "+39 123 456 789",
      "role": "customer",
      "created_at": "2025-10-04T15:29:36.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validazioni:**
- Email format valido
- Password minimo 6 caratteri
- Email non già registrata

---

#### POST `/api/auth/login`
Login utente esistente

**Request Body:**
```json
{
  "email": "admin@shopsphere.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "first_name": "Admin",
      "last_name": "Principale",
      "email": "admin@shopsphere.com",
      "phone": "+39 338 1234567",
      "role": "admin",
      "created_at": "2025-10-04T14:26:36.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**
- `401` - Email o password errati
- `400` - Campi mancanti

---

#### GET `/api/auth/me`
Profilo utente corrente (richiede autenticazione)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "first_name": "Admin",
      "last_name": "Principale",
      "email": "admin@shopsphere.com",
      "phone": "+39 338 1234567",
      "role": "admin",
      "created_at": "2025-10-04T14:26:36.000Z",
      "updated_at": "2025-10-04T14:26:36.000Z"
    }
  }
}
```

---

### Categories - `/api/categories`

#### GET `/api/categories`
Lista tutte le categorie (pubblico)

**Response (200):**
```json
{
  "success": true,
  "count": 6,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Elettronica",
        "description": "Dispositivi elettronici, smartphone, computer e accessori"
      },
      {
        "id": 2,
        "name": "Abbigliamento",
        "description": "Abbigliamento uomo, donna e bambino"
      }
    ]
  }
}
```

---

#### GET `/api/categories/:id`
Dettagli categoria singola (pubblico)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "category": {
      "id": 1,
      "name": "Elettronica",
      "description": "Dispositivi elettronici..."
    },
    "product_count": 5
  }
}
```

**Errors:**
- `404` - Categoria non trovata

---

#### POST `/api/categories`
Crea nuova categoria (solo admin)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "Nuova Categoria",
  "description": "Descrizione categoria"  // opzionale
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "category": {
      "id": 7,
      "name": "Nuova Categoria",
      "description": "Descrizione categoria"
    }
  }
}
```

**Errors:**
- `401` - Token mancante o non valido
- `403` - Utente non admin
- `409` - Categoria già esistente
- `400` - Nome mancante

---

#### PUT `/api/categories/:id`
Aggiorna categoria (solo admin)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "Nome Aggiornato",
  "description": "Nuova descrizione"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "category": {
      "id": 7,
      "name": "Nome Aggiornato",
      "description": "Nuova descrizione"
    }
  }
}
```

**Errors:**
- `401` - Non autenticato
- `403` - Non admin
- `404` - Categoria non trovata
- `400` - Nessun campo da aggiornare

---

#### DELETE `/api/categories/:id`
Elimina categoria (solo admin)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Errors:**
- `401` - Non autenticato
- `403` - Non admin
- `404` - Categoria non trovata
- `409` - Categoria ha ancora prodotti associati

---

## 🧪 Testing API

### Con cURL

**Login Admin:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shopsphere.com","password":"password123"}'
```

**Salva token:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Get profilo (con auth):**
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Crea categoria (admin):**
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Nuova Categoria","description":"Test"}'
```

**Get tutte le categorie:**
```bash
curl http://localhost:3000/api/categories
```

---

## 📁 Struttura File Backend

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MySQL connection pool
│   │   ├── mongodb.js           # Mongoose connection
│   │   └── jwt.js               # JWT utilities
│   ├── middlewares/
│   │   ├── errorHandler.js      # Error handling
│   │   └── auth.js              # Authentication & authorization
│   ├── controllers/
│   │   ├── authController.js    # Auth logic (register, login)
│   │   └── categoryController.js # Category CRUD
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   └── categories.js        # Category endpoints
│   ├── models/
│   │   └── mongodb/
│   │       ├── Review.js
│   │       ├── ReviewComment.js
│   │       └── ActivityLog.js
│   ├── utils/
│   │   └── seedMongo.js
│   └── server.js                # Express app entry point
├── package.json
└── node_modules/
```

---

## 🔐 Credenziali Seed Data

**Tutti gli utenti hanno password:** `password123`

**Admin:**
- Email: `admin@shopsphere.com`
- Role: `admin`

**Seller:**
- Email: `seller@shopsphere.com`
- Role: `admin`

**Customer (esempio):**
- Email: `mario.rossi@email.com`
- Role: `customer`

---

## 🛠️ Modifiche Seed Data

Durante la FASE 3 è stato corretto l'hash bcrypt delle password nel seed SQL:

**Prima:** Hash non funzionante
**Dopo:** `$2b$10$6VlyTVabYwsU7dvWqd4mSui9iV9eCQ9NQhgYSqQ0OPxlkAQB3H4LW`

Tutti gli utenti ora possono effettuare login con password `password123`.

---

## 🚀 Comandi Utili

### Sviluppo

```bash
# Avvia server in dev mode (con nodemon)
npm run --prefix backend dev

# Avvia server in production mode
npm run --prefix backend start
```

### Database

```bash
# Re-seed MySQL (se hai modificato seed.sql)
docker exec -i shopsphere-mysql mysql -u shopsphere_user -pshopsphere_pass \
  -e "DROP DATABASE IF EXISTS shopsphere; CREATE DATABASE shopsphere;"
docker exec -i shopsphere-mysql mysql -u shopsphere_user -pshopsphere_pass \
  shopsphere < database/sql/schema.sql
docker exec -i shopsphere-mysql mysql -u shopsphere_user -pshopsphere_pass \
  shopsphere < database/sql/seed.sql

# Re-seed MongoDB
npm run --prefix backend seed:mongo
```

---

## ✅ Checklist FASE 3

- [x] Configurazione MySQL connection pool
- [x] Configurazione MongoDB/Mongoose
- [x] Configurazione JWT
- [x] Middleware error handler
- [x] Middleware authentication (JWT)
- [x] Middleware role check
- [x] Middleware ownership check
- [x] Server Express con CORS e body parsing
- [x] Health check endpoint
- [x] Auth endpoints (register, login, me)
- [x] Category CRUD completo
- [x] Test API funzionanti
- [x] Fix password hash in seed data

---

## 🎯 Prossimi Passi (FASE 4)

**Da implementare:**

1. **Products CRUD** (con relazioni a categories)
   - GET /api/products (con filtri: categoria, prezzo, search)
   - GET /api/products/:id
   - POST /api/products (admin)
   - PUT /api/products/:id (admin)
   - DELETE /api/products/:id (admin)
   - GET /api/products/top-selling (query complessa)

2. **Users Management**
   - GET /api/users/:id
   - PUT /api/users/:id
   - GET /api/users/:id/orders

3. **Orders + OrderItems**
   - POST /api/orders (create order)
   - GET /api/orders/:id
   - GET /api/orders/user/:userId (query complessa)

4. **Reviews (MongoDB)**
   - POST /api/reviews
   - GET /api/reviews/product/:productId
   - GET /api/reviews/search (full-text search)

5. **Collection Postman completa**

---

**FASE 3 COMPLETATA CON SUCCESSO! 🎉**

**Progresso totale: ~45% del progetto**
