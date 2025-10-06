# ShopSphere - Strategia Operativa

## 📋 Obiettivo
Progettare e implementare due database (MySQL + MongoDB) con backend Node.js/Express per gestione e-commerce, seguendo la traccia del progetto.

---

## 🗂️ Stack Tecnologico

- **Backend**: Node.js + Express
- **Database SQL**: MySQL (Docker)
- **Database NoSQL**: MongoDB (Docker)
- **ORM/Driver**: mysql2 per SQL, Mongoose per MongoDB
- **Autenticazione**: JWT (JSON Web Tokens)
- **Orchestrazione**: Docker Compose
- **Testing API**: Postman

---

## 📊 Database Design

### MySQL (Relazionale)
- **Users** (ex Customers - con campo `role`)
- **Products**
- **Categories**
- **Orders**
- **OrderDetails**
- **Payments**
- **Addresses**
- **Wishlists**

**Modifica chiave**:
- Tabella `Customers` → `Users`
- Aggiunto campo: `role ENUM('customer', 'admin', 'seller') DEFAULT 'customer'`

### MongoDB (Documenti)

**Collections:**

1. **Reviews** (Recensioni prodotti)
```javascript
{
  _id: ObjectId,
  productId: Number,        // FK a Products (MySQL)
  userId: Number,           // FK a Users (MySQL)
  orderId: Number,          // FK a Orders - verifica acquisto
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

2. **ReviewComments** (Commenti recensioni)
```javascript
{
  _id: ObjectId,
  reviewId: ObjectId,       // FK a Reviews (MongoDB)
  userId: Number,           // FK a Users (MySQL)
  comment: String,
  createdAt: Date
}
```

3. **ActivityLogs** (Log attività)
```javascript
{
  _id: ObjectId,
  userId: Number,           // FK a Users (MySQL)
  action: String,           // "view_product", "add_to_cart", "search"
  entityType: String,       // "product", "order", "review"
  entityId: Number,
  metadata: Object,         // Dati flessibili
  ipAddress: String,
  userAgent: String,
  createdAt: Date
}
```

---

## 🏗️ Struttura Progetto

```
progetto/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # Connessioni MySQL e MongoDB
│   │   │   └── jwt.js               # Config JWT
│   │   ├── models/
│   │   │   ├── sql/                 # Query MySQL
│   │   │   └── mongodb/             # Schema Mongoose
│   │   ├── controllers/             # Logica business
│   │   ├── routes/                  # Endpoint API
│   │   ├── middlewares/
│   │   │   ├── auth.js              # Verifica JWT
│   │   │   └── roleCheck.js         # Verifica ruoli
│   │   ├── utils/                   # Helper functions
│   │   └── server.js                # Entry point
│   ├── package.json
│   └── .env.example
├── database/
│   ├── sql/
│   │   ├── schema.sql               # Schema MySQL
│   │   └── seed.sql                 # Dati esempio
│   └── mongodb/
│       ├── init.js                  # Struttura collections
│       └── seed.js                  # Dati esempio
├── docs/
│   ├── ShopSphere-ER.jpeg           # Diagramma ER
│   ├── API.md                       # Doc API
│   ├── SETUP.md                     # Guida setup
│   └── MONGODB-SCHEMA.md            # Schema MongoDB
├── postman/
│   └── ShopSphere.postman_collection.json
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

### Auth (Pubblici)
- `POST /api/auth/register` - Registrazione utente
- `POST /api/auth/login` - Login (ritorna JWT)

### Users (Protetti)
- `GET /api/users/:id` - Dettagli utente
- `PUT /api/users/:id` - Aggiorna profilo
- `GET /api/users/:id/orders` - Ordini utente

### Products
- `GET /api/products` - Lista con filtri (categoria, prezzo, search)
- `GET /api/products/:id` - Dettagli prodotto
- `POST /api/products` - Crea prodotto [ADMIN]
- `PUT /api/products/:id` - Aggiorna prodotto [ADMIN]
- `DELETE /api/products/:id` - Elimina prodotto [ADMIN]
- `GET /api/products/top-selling` - **Query complessa: prodotti più venduti**

### Categories
- `GET /api/categories` - Lista categorie
- `POST /api/categories` - Crea categoria [ADMIN]

### Orders
- `POST /api/orders` - Crea ordine
- `GET /api/orders/:id` - Dettagli ordine
- `PUT /api/orders/:id/status` - Aggiorna stato [ADMIN]
- `GET /api/orders/user/:userId` - **Query complessa: ordini per utente**

### Payments
- `POST /api/payments` - Registra pagamento
- `GET /api/payments/order/:orderId` - Pagamenti ordine

### Reviews (MongoDB)
- `POST /api/reviews` - Crea recensione (solo se acquisto verificato)
- `GET /api/reviews/product/:productId` - Recensioni prodotto
- `GET /api/reviews/search` - **Query MongoDB: ricerca full-text**
- `PUT /api/reviews/:id/helpful` - Incrementa utilità
- `DELETE /api/reviews/:id` - Elimina recensione [ADMIN o autore]

### Comments (MongoDB)
- `POST /api/reviews/:reviewId/comments` - Aggiungi commento
- `GET /api/reviews/:reviewId/comments` - Lista commenti
- `DELETE /api/comments/:id` - Elimina commento [ADMIN o autore]

### Activity Logs (MongoDB)
- `POST /api/logs` - Registra attività (automatico)
- `GET /api/logs/user/:userId` - **Query MongoDB: log filtrati**
- `GET /api/logs/analytics` - **Aggregazione: statistiche attività** [ADMIN]

---

## 🎯 Query Complesse Richieste

### SQL (MySQL)
1. **Ordini per utente con totali**
   - JOIN Orders + OrderDetails + Products
   - Calcolo totale ordine
   - Filtri per stato, data

2. **Prodotti più venduti**
   - JOIN Products + OrderDetails
   - GROUP BY prodotto
   - ORDER BY quantità venduta

3. **Fatturato per categoria/periodo**
   - JOIN Categories + Products + OrderDetails + Payments
   - GROUP BY categoria/periodo
   - SUM importi

### MongoDB (NoSQL)
1. **Ricerca full-text su recensioni**
   - Text index su title + comment
   - Filtri: rating, verifiedPurchase, data

2. **Aggregazione: media rating per prodotto**
   - Pipeline aggregation
   - GROUP BY productId
   - AVG rating

3. **Attività più frequenti per periodo**
   - Pipeline aggregation
   - GROUP BY action + periodo
   - COUNT occorrenze

4. **Recensioni con filtri avanzati**
   - Rating range
   - Solo acquisti verificati
   - Ordinamento per helpful/data

---

## 📅 Piano Operativo (8 ore totali)

### FASE 1: Setup Ambiente (30 min) ✅ COMPLETATA
- [x] 1.1 Creare struttura cartelle
- [x] 1.2 Setup Docker Compose (MySQL + MongoDB)
- [x] 1.3 Inizializzare progetto Node.js (npm init)
- [x] 1.4 Installare dipendenze base
- [x] 1.5 Configurare file .env e .gitignore

### FASE 2: Database (2h) ✅ COMPLETATA
- [x] 2.1 Aggiornare schema SQL (Users + role)
- [x] 2.2 Importare schema MySQL
- [x] 2.3 Creare seed data SQL (30 users, 30 products, 15 orders)
- [x] 2.4 Definire schema MongoDB (Mongoose)
- [x] 2.5 Creare seed data MongoDB (29 reviews, 18 comments, 100 logs)
- [x] 2.6 Risolvere problema autenticazione MongoDB
- [x] 2.7 Verificare dati in entrambi i database

### FASE 3: Backend Base (1.5h) ✅ COMPLETATA
- [x] 3.1 Setup Express + middlewares base
- [x] 3.2 Sistema autenticazione JWT
- [x] 3.3 Middleware verifica ruoli (+ ownership check)
- [x] 3.4 CRUD Categories (completo)
- [x] 3.5 Auth endpoints (register, login, me)
- [x] 3.6 Fix password hash in seed data
- [x] 3.7 Test API funzionanti

### FASE 4: Products & Users (2h) ✅ COMPLETATA
- [x] 4.1 CRUD Products (con filtri e search)
- [x] 4.2 Query prodotti più venduti (SQL complessa)
- [x] 4.3 CRUD Users management
- [x] 4.4 Get ordini per utente (query complessa)

### FASE 5: MongoDB Integration (1.5h) ✅ COMPLETATA
- [x] 5.1 CRUD Reviews
- [x] 5.2 CRUD Comments
- [x] 5.3 Query complesse MongoDB (aggregazioni, full-text search)
- [x] 5.4 Indici e ottimizzazioni

### FASE 6: Query Avanzate SQL (1h) ✅ COMPLETATA (già fatto in FASE 4)
- [x] 6.1 Query ordini per utente (JOIN 4 tabelle)
- [x] 6.2 Query prodotti più venduti (JOIN + GROUP BY)
- [x] 6.3 Filtri dinamici e aggregazioni
- [x] 6.4 Ottimizzazione query con indici

### FASE 7: Documentazione e Testing (1h) ✅ COMPLETATA
- [x] 7.1 Collection Postman completa
- [x] 7.2 Documentazione API completa (docs/FASE-*.md)
- [x] 7.3 README principale con quick start
- [x] 7.4 Testing API funzionanti

---

## 📦 Seed Data (Quantità)

- **Users**: 30 totali
  - 2 admin
  - 28 customer
- **Products**: 30 (distribuiti su 5-6 categorie)
- **Categories**: 6
- **Orders**: 15
- **OrderDetails**: ~40-50 (prodotti per ordine)
- **Payments**: 15 (1 per ordine)
- **Addresses**: 30 (1 per user)
- **Reviews**: 30
- **ReviewComments**: ~20
- **ActivityLogs**: ~100 (generati automaticamente)

---

## 🚀 Deliverable Finali

### Codice
- ⏳ Backend Node.js completo e commentato (in progress)
- ✅ Schema SQL aggiornato
- ✅ Schema MongoDB (Mongoose)
- ✅ Seed data funzionanti

### Infrastructure
- ✅ Docker Compose configurato
- ✅ File .env.example
- ✅ .gitignore appropriato

### Documentazione
- ⏳ README.md (overview + quick start) - da creare
- ✅ GUIDA-DOCKER.md (guida Docker completa)
- ✅ FASE-2-COMPLETATA.md (riepilogo database)
- ⏳ API.md (documentazione endpoint) - da creare
- ⏳ MONGODB-SCHEMA.md (schema collections) - da creare
- ✅ Diagramma ER aggiornato (drawdb.app)

### Testing
- ⏳ Collection Postman completa - da creare
- ✅ Esempi request/response

---

## 🔧 Comandi Docker (Spiegati)

### Avvio ambiente
```bash
docker-compose up -d
# up: avvia i container
# -d: detached mode (in background)
```

### Stop ambiente
```bash
docker-compose down
# Ferma e rimuove i container (dati persistono nei volumi)
```

### Visualizzare logs
```bash
docker-compose logs -f mysql
# logs: mostra output
# -f: follow (continua a mostrare)
```

### Accedere a MySQL
```bash
docker exec -it shopsphere-mysql mysql -u root -p
# exec: esegue comando in container
# -it: interactive terminal
```

### Reset completo
```bash
docker-compose down -v
# -v: rimuove anche i volumi (dati persi!)
```

---

## 📝 Note Importanti

### Buone Pratiche
- ✅ Validazione input su tutti gli endpoint
- ✅ Gestione errori centralizzata
- ✅ Logging appropriato
- ✅ Codice commentato (italiano ok)
- ✅ Nomi variabili/funzioni significativi
- ✅ Struttura modulare

### Security
- ⏳ Password hashate (bcrypt) - da implementare in API
- ⏳ JWT con expiration - da implementare
- ⏳ Validazione ruoli su endpoint protetti - da implementare
- ⏳ Sanitizzazione input - da implementare
- ✅ .env non committato

### Performance
- ✅ Indici su colonne ricercate/joinned
- ⏳ Connection pooling database - da implementare
- ✅ Text index MongoDB per full-text search
- ⏳ Paginazione su liste lunghe - da implementare

---

## 🎓 Obiettivi Didattici

Questo progetto ti permetterà di imparare:
1. ✅ Docker e Docker Compose
2. ✅ Architettura REST API
3. ✅ Database relazionali (MySQL) e NoSQL (MongoDB)
4. ✅ Autenticazione JWT
5. ✅ Query complesse e aggregazioni
6. ✅ Best practices Node.js/Express
7. ✅ Documentazione tecnica

---

## 📍 Stato Avanzamento

**Ultima modifica**: 2025-10-04
**Fase corrente**: ✅ PROGETTO COMPLETATO
**Fasi completate**: FASE 1-7 ✅ (100%)

---

## 🎉 PROGETTO COMPLETATO CON SUCCESSO!

**Riepilogo Implementazione:**

### ✅ Backend Completo (40+ endpoints)
- **Authentication** (4 endpoint): Register, Login, Profile
- **Categories** (5 endpoint): CRUD completo
- **Products** (9 endpoint): CRUD + top-selling + filtri avanzati
- **Users** (7 endpoint): CRUD + orders + addresses con ownership check
- **Reviews** (8 endpoint): CRUD + search + stats + helpful
- **Comments** (4 endpoint): CRUD su review comments

### ✅ Database Ibrido
- **MySQL**: 10 tabelle con seed data (30 users, 30 products, 15 orders)
- **MongoDB**: Reviews + Comments con aggregazioni e full-text search

### ✅ Query Complesse
1. Top-selling products (JOIN 4 tabelle + GROUP BY)
2. User orders (JOIN 4 tabelle con items details)
3. Review stats (MongoDB aggregation con rating distribution)
4. Full-text search (Text index + relevance score)

### ✅ Sicurezza & Best Practices
- JWT authentication con expiration
- Role-based access control (customer/admin/seller)
- Ownership check pattern
- Password hashing (bcrypt)
- SQL injection prevention (prepared statements)
- Error handling centralizzato

### ✅ Documentazione
- README.md completo con quick start
- Postman collection (40+ requests)
- 6 doc files dettagliati (FASE-1 → FASE-5)
- STRATEGIA-OPERATIVA.md con piano completo

**Server**: http://localhost:3000
**Credenziali**: admin@shopsphere.com / password123
