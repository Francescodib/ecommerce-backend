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

### FASE 1: Setup Ambiente (30 min) ⏳
- [ ] 1.1 Creare struttura cartelle
- [ ] 1.2 Setup Docker Compose (MySQL + MongoDB)
- [ ] 1.3 Inizializzare progetto Node.js (npm init)
- [ ] 1.4 Installare dipendenze base
- [ ] 1.5 Configurare connessioni database

### FASE 2: Database (1h)
- [ ] 2.1 Aggiornare schema SQL (Users + role)
- [ ] 2.2 Importare schema MySQL
- [ ] 2.3 Creare seed data SQL (30 users, 30 products, 15 orders)
- [ ] 2.4 Definire schema MongoDB (Mongoose)
- [ ] 2.5 Creare seed data MongoDB (30 reviews)

### FASE 3: Backend Base (2h)
- [ ] 3.1 Setup Express + middlewares base
- [ ] 3.2 Sistema autenticazione JWT
- [ ] 3.3 Middleware verifica ruoli
- [ ] 3.4 CRUD Users
- [ ] 3.5 CRUD Products
- [ ] 3.6 CRUD Categories

### FASE 4: Logica Business (2h)
- [ ] 4.1 Sistema Orders + OrderDetails
- [ ] 4.2 Sistema Payments
- [ ] 4.3 Validazioni e relazioni
- [ ] 4.4 Gestione errori centralizzata

### FASE 5: MongoDB Integration (1.5h)
- [ ] 5.1 CRUD Reviews
- [ ] 5.2 CRUD Comments
- [ ] 5.3 Sistema Activity Logs (middleware automatico)
- [ ] 5.4 Query complesse MongoDB
- [ ] 5.5 Indici e ottimizzazioni

### FASE 6: Query Avanzate SQL (1h)
- [ ] 6.1 Query ordini per utente
- [ ] 6.2 Query prodotti più venduti
- [ ] 6.3 Query fatturato per categoria
- [ ] 6.4 Ottimizzazione indici MySQL

### FASE 7: Documentazione e Testing (1h)
- [ ] 7.1 Collection Postman completa
- [ ] 7.2 Documentazione API (API.md)
- [ ] 7.3 Guida setup (SETUP.md)
- [ ] 7.4 README principale
- [ ] 7.5 Testing finale completo

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
- ✅ Backend Node.js completo e commentato
- ✅ Schema SQL aggiornato
- ✅ Schema MongoDB (Mongoose)
- ✅ Seed data funzionanti

### Infrastructure
- ✅ Docker Compose configurato
- ✅ File .env.example
- ✅ .gitignore appropriato

### Documentazione
- ✅ README.md (overview + quick start)
- ✅ SETUP.md (guida installazione dettagliata)
- ✅ API.md (documentazione endpoint)
- ✅ MONGODB-SCHEMA.md (schema collections)
- ✅ Diagramma ER aggiornato

### Testing
- ✅ Collection Postman completa
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
- ✅ Password hashate (bcrypt)
- ✅ JWT con expiration
- ✅ Validazione ruoli su endpoint protetti
- ✅ Sanitizzazione input
- ✅ .env non committato

### Performance
- ✅ Indici su colonne ricercate/joinned
- ✅ Connection pooling database
- ✅ Text index MongoDB per full-text search
- ✅ Paginazione su liste lunghe

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

**Ultima modifica**: 2025-10-03
**Fase corrente**: FASE 1 - Setup Ambiente
**Prossimo step**: Aggiornamento schema SQL con Users + role

---

**Note per ripresa lavoro:**
- Schema SQL da aggiornare: Customers → Users + campo role
- Diagramma ER da aggiornare su drawdb.app
- Tutte le FK che puntavano a Customers vanno aggiornate a Users
