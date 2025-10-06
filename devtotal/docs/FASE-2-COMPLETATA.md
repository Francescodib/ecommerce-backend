# ✅ FASE 2 COMPLETATA - Database Setup

**Data completamento**: 2025-10-04
**Tempo impiegato**: ~2 ore

---

## 📊 Database MySQL - Completato

### Schema Implementato

**Tabelle create (10 totali):**
1. ✅ `users` - Utenti del sistema (con campo `role`)
2. ✅ `addresses` - Indirizzi spedizione/fatturazione
3. ✅ `categories` - Categorie prodotti
4. ✅ `products` - Catalogo prodotti
5. ✅ `orders` - Ordini clienti
6. ✅ `order_items` - Dettagli prodotti per ordine
7. ✅ `payments` - Pagamenti
8. ✅ `shippings` - Spedizioni
9. ✅ `discounts` - Codici sconto
10. ✅ `wishlists` - Liste desideri

### Modifiche Chiave dallo Schema Iniziale

- **Tabella `customers` → `users`** con campo `role ENUM('customer', 'admin', 'seller')`
- Aggiunti campi `updated_at` dove necessario
- Aggiunti indici su colonne più ricercate per performance
- Foreign keys con CASCADE/RESTRICT appropriati
- Campi `is_active`, `is_default` per gestione stato

### Seed Data Inseriti

| Tabella | Quantità | Note |
|---------|----------|------|
| Users | 30 | 2 admin, 28 customer |
| Addresses | 30 | 1 per user |
| Categories | 6 | Elettronica, Abbigliamento, Casa, Libri, Sport, Giocattoli |
| Products | 30 | 5 per categoria |
| Orders | 15 | Stati vari (pending, confirmed, shipped, delivered) |
| Order Items | 18 | Prodotti negli ordini |
| Payments | 15 | Vari metodi di pagamento |
| Shippings | 7 | Per ordini spediti/consegnati |
| Discounts | 3 | Codici sconto attivi |
| Wishlists | 10 | Prodotti salvati da utenti |

### File Creati

- ✅ [`database/sql/schema.sql`](../database/sql/schema.sql) - Schema completo
- ✅ [`database/sql/seed.sql`](../database/sql/seed.sql) - Dati di esempio

### Query di Verifica

```sql
-- Conteggio tabelle
SELECT
  'USERS' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'PRODUCTS', COUNT(*) FROM products
UNION ALL SELECT 'ORDERS', COUNT(*) FROM orders;

-- Ordini con totale e utente
SELECT o.id, u.email, o.total_amount, o.status, o.order_date
FROM orders o
JOIN users u ON o.user_id = u.id
ORDER BY o.order_date DESC;

-- Prodotti più venduti
SELECT p.name, SUM(oi.quantity) as total_sold
FROM products p
JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id
ORDER BY total_sold DESC
LIMIT 5;
```

---

## 📄 Database MongoDB - Completato

### Collections Implementate

**3 Collections:**
1. ✅ `reviews` - Recensioni prodotti
2. ✅ `reviewcomments` - Commenti alle recensioni
3. ✅ `activitylogs` - Log attività utenti

### Schema Mongoose

#### Reviews
```javascript
{
  productId: Number,        // FK a Products (MySQL)
  userId: Number,           // FK a Users (MySQL)
  orderId: Number,          // FK a Orders (MySQL)
  rating: Number,           // 1-5
  title: String,
  comment: String,
  pros: [String],
  cons: [String],
  verifiedPurchase: Boolean,
  helpful: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Indici:**
- `productId` + `createdAt` (compound)
- `userId`
- Full-text su `title` e `comment`

#### ReviewComments
```javascript
{
  reviewId: ObjectId,       // FK a Reviews (MongoDB)
  userId: Number,           // FK a Users (MySQL)
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indici:**
- `reviewId` + `createdAt`

#### ActivityLogs
```javascript
{
  userId: Number,           // FK a Users (MySQL), nullable
  action: String,           // Enum di azioni
  entityType: String,       // 'product', 'order', 'review', etc.
  entityId: Number,
  metadata: Object,         // Dati flessibili
  ipAddress: String,
  userAgent: String,
  createdAt: Date
}
```

**Indici:**
- `userId` + `createdAt`
- `action` + `createdAt`
- `entityType` + `entityId`

### Seed Data Inseriti

| Collection | Quantità | Note |
|------------|----------|------|
| Reviews | 29 | Recensioni dettagliate per vari prodotti |
| ReviewComments | 18 | 1-2 commenti per le prime 10 review |
| ActivityLogs | 100 | Varie azioni utenti (view, add_to_cart, search, etc.) |

### File Creati

- ✅ [`backend/src/models/mongodb/Review.js`](../backend/src/models/mongodb/Review.js)
- ✅ [`backend/src/models/mongodb/ReviewComment.js`](../backend/src/models/mongodb/ReviewComment.js)
- ✅ [`backend/src/models/mongodb/ActivityLog.js`](../backend/src/models/mongodb/ActivityLog.js)
- ✅ [`backend/src/utils/seedMongo.js`](../backend/src/utils/seedMongo.js) - Script seed

### Query di Verifica

```javascript
// Conteggio collections
db.reviews.countDocuments()
db.reviewcomments.countDocuments()
db.activitylogs.countDocuments()

// Recensioni per prodotto con rating medio
db.reviews.aggregate([
  { $match: { productId: 1 } },
  { $group: {
      _id: "$productId",
      avgRating: { $avg: "$rating" },
      count: { $sum: 1 }
  }}
])

// Activity logs per utente
db.activitylogs.find({ userId: 3 }).sort({ createdAt: -1 }).limit(10)

// Full-text search recensioni
db.reviews.find({ $text: { $search: "fantastico ottimo" } })
```

---

## 🔧 Problemi Risolti

### 1. Autenticazione MongoDB
**Problema**: Connection refused con credenziali
**Causa**: Container MongoDB senza autenticazione abilitata
**Soluzione**: Connessione senza auth: `mongodb://localhost:27017/shopsphere`

### 2. Campo `image_url` vs `img_url`
**Problema**: Errore import seed SQL
**Causa**: Nome campo diverso tra schema drawdb e script
**Soluzione**: Allineato a `img_url` nello schema

### 3. Posizionamento `node_modules`
**Problema**: Moduli non trovati da seed script
**Causa**: npm install creato cartella annidata
**Soluzione**: Spostato `node_modules` in `backend/`

---

## 📁 Struttura File Database

```
progetto/
├── database/
│   ├── sql/
│   │   ├── schema.sql              # ✅ Schema MySQL completo
│   │   ├── seed.sql                # ✅ Seed data SQL
│   │   └── MODIFICHE-SCHEMA.md     # Guida modifiche drawdb
│   └── mongodb/
│       └── (vuota, seed in backend/src/utils/)
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── mongodb/
│   │   │       ├── Review.js       # ✅ Model Mongoose
│   │   │       ├── ReviewComment.js # ✅ Model Mongoose
│   │   │       └── ActivityLog.js  # ✅ Model Mongoose
│   │   └── utils/
│   │       └── seedMongo.js        # ✅ Script seed MongoDB
│   └── package.json
└── docs/
    ├── GUIDA-DOCKER.md             # ✅ Guida Docker completa
    └── FASE-2-COMPLETATA.md        # ✅ Questo file
```

---

## 🚀 Comandi Utili

### Avvio Database
```bash
docker-compose up -d
```

### Reset e Re-seed MySQL
```bash
docker exec shopsphere-mysql mysql -u shopsphere_user -pshopsphere_pass \
  -e "DROP DATABASE IF EXISTS shopsphere; CREATE DATABASE shopsphere;"

docker exec -i shopsphere-mysql mysql -u shopsphere_user -pshopsphere_pass \
  shopsphere < database/sql/schema.sql

docker exec -i shopsphere-mysql mysql -u shopsphere_user -pshopsphere_pass \
  shopsphere < database/sql/seed.sql
```

### Re-seed MongoDB
```bash
npm run --prefix backend seed:mongo
```

### Verifica Dati
```bash
# MySQL
docker exec shopsphere-mysql mysql -u shopsphere_user -pshopsphere_pass \
  shopsphere -e "SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM products;"

# MongoDB
mongosh "mongodb://127.0.0.1:27017/shopsphere" --eval "db.stats()"
```

---

## 📝 Note Importanti

### Per Sviluppo Locale
- ✅ MySQL: porta 3306, user `shopsphere_user`, password `shopsphere_pass`
- ✅ MongoDB: porta 27017, **senza autenticazione**
- ✅ Dati persistono in volumi Docker anche dopo `docker-compose down`

### Per Reset Completo
```bash
# ATTENZIONE: Cancella tutti i dati!
docker-compose down -v
docker-compose up -d

# Re-import
docker exec -i shopsphere-mysql mysql -u shopsphere_user -pshopsphere_pass \
  shopsphere < database/sql/schema.sql && \
docker exec -i shopsphere-mysql mysql -u shopsphere_user -pshopsphere_pass \
  shopsphere < database/sql/seed.sql && \
npm run --prefix backend seed:mongo
```

### Password Users (Seed Data)
- Tutti gli utenti hanno password hashata: **`password123`**
- Hash bcrypt: `$2b$10$rZ7qNqVE8K.IxJxLfJ1VXO7Zv7KqJ5Zq5KqJ5Zq5KqJ5Zq5KqJ5Zq`
- Da usare per testing login API

---

## ✅ Checklist Completamento FASE 2

- [x] Schema MySQL progettato e importato
- [x] Seed data SQL creati e importati (30 users, 30 products, 15 orders)
- [x] Schema MongoDB (Mongoose) definito
- [x] Seed data MongoDB creati e importati (29 reviews, 18 comments, 100 logs)
- [x] Indici database ottimizzati
- [x] Verifica dati in entrambi i database
- [x] Documentazione comandi seed
- [x] File `.env` configurati

---

## 🎯 Prossimi Passi (FASE 3)

**FASE 3: Backend Base**
1. Setup Express + middlewares base
2. Sistema autenticazione JWT
3. Middleware verifica ruoli
4. CRUD Users
5. CRUD Products
6. CRUD Categories

**File da creare:**
- `backend/src/server.js`
- `backend/src/config/database.js`
- `backend/src/config/jwt.js`
- `backend/src/middlewares/auth.js`
- `backend/src/middlewares/errorHandler.js`
- Controllers, routes per ogni risorsa

---

**FASE 2 COMPLETATA CON SUCCESSO! 🎉**
