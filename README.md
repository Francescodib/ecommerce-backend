# 🛍️ ShopSphere - E-commerce Backend

Backend completo per piattaforma e-commerce con architettura ibrida **MySQL + MongoDB**.

**Autore**: Francesco di Biase

## 📋 Indice

- [Panoramica](#-panoramica)
- [Tecnologie](#%EF%B8%8F-tecnologie)
- [Quick Start](#-quick-start)
- [API Endpoints](#-api-endpoints)
- [Database](#-database)
- [Autenticazione](#-autenticazione-e-autorizzazione)
- [Documentazione](#-documentazione)

---

## 🎯 Panoramica

ShopSphere è un backend RESTful per e-commerce che implementa:

- ✅ **Architettura ibrida**: MySQL per dati transazionali, MongoDB per reviews/logs
- ✅ **Autenticazione JWT** con role-based access control
- ✅ **Query complesse SQL**: JOIN multipli, aggregazioni, statistiche
- ✅ **MongoDB aggregations**: Rating stats, full-text search
- ✅ **Ownership check**: Utenti vedono solo i propri dati
- ✅ **40+ API endpoints** documentati

---

## 🛠️ Tecnologie

### Backend
- Node.js 18+ / Express 4.x
- MySQL 8.0 (mysql2 con connection pooling)
- MongoDB 7.0 (Mongoose ODM)
- JWT per autenticazione
- bcrypt per password hashing

### DevOps
- Docker Compose per database
- Postman collection completa

---

## 🚀 Quick Start

### 1. Prerequisiti

- Node.js 18+
- Docker & Docker Compose

### 2. Clona e installa

```bash
cd progetto
npm install --prefix backend
```

### 3. Avvia database

```bash
docker compose up -d
```

### 4. Inizializza database

```bash
# MySQL
docker exec -i shopsphere-mysql mysql -u shopsphere_user -pshopsphere_pass shopsphere < database/sql/schema.sql
docker exec -i shopsphere-mysql mysql -u shopsphere_user -pshopsphere_pass shopsphere < database/sql/seed.sql
```

### 5. Avvia server

```bash
cd backend
npm run dev
```

Server running su [http://localhost:3000](http://localhost:3000)

### 6. Test API

```bash
# Health check
curl http://localhost:3000/health

# Get products
curl http://localhost:3000/api/products

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shopsphere.com","password":"password123"}'
```

---

## 📡 API Endpoints

### Authentication (4 endpoints)
- `POST /api/auth/register` - Registrazione
- `POST /api/auth/login` - Login e JWT
- `GET /api/auth/me` - Profilo corrente

### Categories (5 endpoints)
- `GET /api/categories` - Lista categorie
- `GET /api/categories/:id` - Categoria per ID
- `POST /api/categories` - Crea (admin)
- `PUT /api/categories/:id` - Aggiorna (admin)
- `DELETE /api/categories/:id` - Elimina (admin)

### Products (9 endpoints)
- `GET /api/products` - Lista con filtri
- `GET /api/products/:id` - Prodotto per ID
- `GET /api/products/top-selling` - Top venduti
- `GET /api/products/category/:id` - Per categoria
- `POST /api/products` - Crea (admin)
- `PUT /api/products/:id` - Aggiorna (admin)
- `DELETE /api/products/:id` - Elimina (admin)
- `GET /api/products/:id/reviews` - Reviews
- `POST /api/products/:id/reviews` - Crea review

**Filtri disponibili**: `category`, `minPrice`, `maxPrice`, `search`, `limit`, `offset`

### Users (7 endpoints)
- `GET /api/users` - Lista (admin)
- `GET /api/users/:id` - Profilo (self/admin)
- `PUT /api/users/:id` - Aggiorna (self/admin)
- `DELETE /api/users/:id` - Elimina (self/admin)
- `GET /api/users/:id/orders` - Ordini utente
- `GET /api/users/:id/addresses` - Indirizzi

### Reviews (8 endpoints)
- `GET /api/reviews/:id` - Review per ID
- `PUT /api/reviews/:id` - Aggiorna (owner)
- `DELETE /api/reviews/:id` - Elimina (owner/admin)
- `POST /api/reviews/:id/helpful` - +1 helpful
- `GET /api/reviews/search` - Full-text search
- `GET /api/reviews/:id/comments` - Commenti
- `POST /api/reviews/:id/comments` - Crea commento
- `PUT /api/reviews/comments/:id` - Aggiorna commento
- `DELETE /api/reviews/comments/:id` - Elimina commento

**Totale: 40+ endpoints**

---

## 💾 Database

### MySQL (10 tabelle)

- `users` - Utenti con role (customer/admin/seller)
- `categories` - Categorie prodotti
- `products` - Prodotti
- `orders` + `order_items` - Ordini e dettagli
- `payments` - Pagamenti
- `shippings` - Spedizioni
- `addresses` - Indirizzi utenti
- `discounts` - Codici sconto
- `wishlists` - Liste desideri

### MongoDB (3 collections)

- `reviews` - Recensioni con rating, pros/cons
- `reviewcomments` - Commenti sulle recensioni
- `activitylogs` - Log attività (placeholder)

### Seed Data

- 30 users (2 admin, 28 customers)
- 30 products (6 categorie)
- 15 orders completi
- Reviews già presenti

**Credenziali test**:
```
Admin: admin@shopsphere.com / password123
User:  mario.rossi@email.com / password123
```

---

## 📊 Query Complesse

### 1. Top Selling Products (SQL)
```sql
SELECT p.*, SUM(oi.quantity) as total_sold
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('confirmed', 'processing', 'shipped', 'delivered')
GROUP BY p.id
ORDER BY total_sold DESC
```

### 2. User Orders - JOIN 4 tabelle (SQL)
```sql
SELECT o.*, p.payment_method, s.tracking_number,
       COUNT(oi.id) as items_count
FROM orders o
LEFT JOIN payments p ON o.id = p.order_id
LEFT JOIN shippings s ON o.id = s.order_id
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.user_id = ?
GROUP BY o.id
```

### 3. Review Stats (MongoDB)
```javascript
db.reviews.aggregate([
  { $match: { productId: 1 } },
  { $group: {
      _id: null,
      avgRating: { $avg: '$rating' },
      rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } }
    }
  }
])
```

### 4. Full-text Search (MongoDB)
```javascript
db.reviews.find(
  { $text: { $search: "fotocamera" } }
).sort({ score: { $meta: "textScore" } })
```

---

## 🔐 Autenticazione e Autorizzazione

### JWT Authentication

```bash
# 1. Login
POST /api/auth/login
Response: { token: "eyJhbGc..." }

# 2. Usa token
GET /api/users/me
Header: Authorization: Bearer <token>
```

### Role-Based Access Control

**Ruoli**: `customer`, `seller`, `admin`

```javascript
// Solo admin può creare prodotti
POST /api/products (richiede role: admin)

// Utente vede solo i propri dati
GET /api/users/3 ✅ (se autenticato come user 3)
GET /api/users/5 ❌ 403 Forbidden

// Admin vede tutto
GET /api/users/5 ✅ (se admin)
```

---

## 📚 Documentazione

```
docs/
├── GUIDA-DOCKER.md                   Setup Docker
├── FASE-2-COMPLETATA.md              Database setup
├── FASE-3-COMPLETATA.md              Backend + Auth
├── FASE-4A-PRODUCTS-COMPLETATA.md    Products API
├── FASE-4B-USERS-COMPLETATA.md       Users API
└── FASE-5-MONGODB-COMPLETATA.md      Reviews

STRATEGIA-OPERATIVA.md                Piano completo
ShopSphere.postman_collection.json    Postman collection
```

### Importa Postman Collection

1. Apri Postman
2. Import → `ShopSphere.postman_collection.json`
3. Esegui "Login Admin" per settare token
4. Testa tutti gli endpoint

---

## 🧪 Testing Rapido

```bash
# Products con filtri
curl 'http://localhost:3000/api/products?category=1&minPrice=500'

# Top selling
curl 'http://localhost:3000/api/products/top-selling?limit=10'

# Full-text search
curl 'http://localhost:3000/api/reviews/search?q=fotocamera'
```

---

## 🗂️ Struttura Progetto

```
progetto/
├── backend/
│   └── src/
│       ├── config/         DB, JWT
│       ├── controllers/    Business logic
│       ├── middlewares/    Auth, errors
│       ├── models/mongodb/ Mongoose
│       ├── routes/         API routes
│       └── server.js
├── database/
│   ├── sql/               MySQL schema
│   └── mongodb/           Models
├── docs/                  Documentazione
├── docker-compose.yml
└── README.md
```

---

## 🎓 Concetti Implementati

✅ MVC architecture
✅ JWT authentication
✅ Role-based access control
✅ Ownership check pattern
✅ SQL prepared statements
✅ MongoDB aggregations
✅ Full-text search
✅ Connection pooling
✅ Error handling centralizzato
✅ Input validation

---

## 🆘 Troubleshooting

**Database non si connette**:
```bash
docker compose restart
docker compose logs mysql
```

**Porta 3000 occupata**:
```bash
# Cambia porta in backend/.env
PORT=3001
```

**Token scaduto**:
```bash
# Nuovo login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shopsphere.com","password":"password123"}'
```

---

## 👨‍💻 Autore

Progetto Master Web Development - Ottobre 2025

---

**Happy Coding! 🚀**
