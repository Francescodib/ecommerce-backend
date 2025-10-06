# Istruzioni per la Consegna - ShopSphere Backend

**Autore**: Francesco di Biase
**Corso**: Master Web Development
**Data**: Ottobre 2025

---

## Contenuto della Consegna

Questa cartella contiene il progetto completo **ShopSphere**, un backend e-commerce con architettura ibrida MySQL + MongoDB.

### Struttura

```
consegna/
├── README.md                              Guida completa del progetto
├── API.md                                 Documentazione API dettagliata
├── ShopSphere.postman_collection.json     Collection Postman (40+ requests)
├── docker-compose.yml                     Configurazione Docker
│
├── backend/                               Backend Node.js/Express
│   ├── src/
│   │   ├── config/                        Configurazioni DB e JWT
│   │   ├── controllers/                   Business logic (6 controller)
│   │   ├── middlewares/                   Auth ed error handling
│   │   ├── models/mongodb/                Mongoose schemas (3 models)
│   │   ├── routes/                        API routes (6 route files)
│   │   └── server.js                      Entry point dell'applicazione
│   ├── package.json
│   └── .env.example
│
└── database/
    ├── sql/
    │   ├── schema.sql                     Schema MySQL (10 tabelle)
    │   └── seed.sql                       Dati iniziali
    └── mongodb/                           (vuoto - models in backend/src/models)
```

---

## Avvio Rapido

### 1. Prerequisiti

- Node.js 18+
- Docker Desktop installato e avviato

### 2. Installazione

```bash
# Dalla cartella consegna/

# 1. Installa le dipendenze
cd backend
npm install
cd ..

# 2. Avvia i database con Docker
docker compose up -d
# Al primo avvio, MySQL esegue automaticamente schema.sql e seed.sql

# 3. Popola MongoDB (opzionale ma consigliato)
cd backend
npm run seed:mongodb
cd ..

# 4. Avvia il server
cd backend
npm run dev
```

### 3. Verifica

```bash
# Health check
curl http://localhost:3000/health

# Risposta attesa:
# {"success":true,"message":"ShopSphere API is running",...}
```

Il server è ora disponibile su **http://localhost:3000**

---

## Documentazione

- **README.md** - Guida completa con installazione, API, query complesse, testing
- **API.md** - Documentazione dettagliata di tutti i 40+ endpoints
- **Postman Collection** - Importabile in Postman per testing rapido

---

## Testing

### Con cURL

```bash
# Get products
curl http://localhost:3000/api/products

# Login admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shopsphere.com","password":"password123"}'
```

### Con Postman

1. Importa `ShopSphere.postman_collection.json`
2. Esegui "Login Admin"
3. Il token viene salvato automaticamente
4. Testa gli endpoint

### Credenziali Test

```
Admin:  admin@shopsphere.com / password123
User:   mario.rossi@email.com / password123
```

---

## Checklist Valutazione

Il progetto implementa:

### Database
- [x] MySQL con 10 tabelle normalizzate
- [x] MongoDB con 3 collections
- [x] Schema relazionale completo con foreign keys
- [x] Indici su campi frequenti
- [x] Seed data (30 users, 30 products, 15 orders)

### Backend API
- [x] 40+ endpoint RESTful funzionanti
- [x] Autenticazione JWT
- [x] Role-based access control
- [x] Ownership check pattern
- [x] Error handling centralizzato
- [x] Input validation

### Query Complesse
- [x] Top-selling products (JOIN 4 tabelle + GROUP BY)
- [x] User orders (JOIN 4 tabelle con subquery)
- [x] Review stats (MongoDB aggregation)
- [x] Full-text search (MongoDB text index)

### Sicurezza
- [x] Password hashing (bcrypt)
- [x] SQL injection prevention (prepared statements)
- [x] JWT con expiration
- [x] Protected endpoints

### Documentazione
- [x] README completo
- [x] API documentation
- [x] Postman collection
- [x] Commenti nel codice

---

## Caratteristiche Principali

### Architettura Ibrida
- **MySQL**: Dati transazionali (users, products, orders, payments)
- **MongoDB**: Dati non strutturati (reviews, comments, logs)

### API Categories
1. **Authentication** (4 endpoint) - Register, Login, Profile
2. **Categories** (5 endpoint) - CRUD completo
3. **Products** (9 endpoint) - CRUD + top-selling + filtri
4. **Users** (7 endpoint) - CRUD + orders + addresses
5. **Reviews** (8 endpoint) - CRUD + search + stats
6. **Comments** (4 endpoint) - CRUD su recensioni

### Query SQL Avanzate
1. Prodotti più venduti con statistiche vendita
2. Ordini utente con dettagli completi (payment, shipping, items)
3. Filtri dinamici con prepared statements

### MongoDB Features
1. Aggregation pipeline per statistiche rating
2. Full-text search con relevance score
3. Text indexes su campi title e comment
4. Compound indexes per performance

---

## Tecnologie Utilizzate

- **Backend**: Node.js 18, Express 4.x
- **Database**: MySQL 8.0, MongoDB 7.0
- **ORM/ODM**: mysql2, Mongoose
- **Auth**: JWT (jsonwebtoken), bcrypt
- **DevOps**: Docker Compose

---

## Note

### Punti di Forza

1. **Architettura solida**: Separazione concerns (MVC pattern)
2. **Sicurezza**: JWT, bcrypt, prepared statements, ownership check
3. **Query complesse**: 4 query avanzate SQL e MongoDB
4. **Documentazione**: Completa e professionale
5. **Best practices**: Error handling, validation, connection pooling

### Testing Suggerito

1. Importare Postman collection
2. Testare login e autenticazione
3. Testare CRUD prodotti (con filtri)
4. Testare query complessa top-selling
5. Testare ownership check (user vs admin)
6. Testare aggregazione MongoDB (review stats)
7. Testare full-text search

### Database Popolato

Il database MySQL contiene già:
- 30 utenti (2 admin, 28 customers)
- 30 prodotti in 6 categorie
- 15 ordini completi con pagamenti e spedizioni

Il database MongoDB (se eseguito il seed) contiene:
- 6 recensioni per 5 prodotti diversi
- 3 commenti collegati alle recensioni
- Dati collegati ai prodotti/utenti/ordini MySQL

Tutto è pronto per il testing immediato.

---

## Seed MongoDB

NOTA: MySQL viene popolato automaticamente al primo avvio di Docker Compose. MongoDB invece richiede l'esecuzione manuale del seed.

### Esecuzione

```bash
# Dalla cartella backend/
npm run seed:mongodb
```

### Output atteso

```
Connessione a MongoDB...
Connesso a MongoDB

Pulizia collezioni esistenti...
Collezioni pulite

Inserimento recensioni...
6 recensioni inserite

Inserimento commenti...
3 commenti inseriti

Riepilogo:
   - Recensioni: 6
   - Commenti: 3
   - Prodotti con recensioni: 5
   - Media rating prodotto 1: 4.5

Seed MongoDB completato con successo!
```

### Dati inseriti

Lo script crea:

**6 Recensioni**:
- 2 recensioni per iPhone 15 Pro (prodotto 1) - rating 5 e 4
- 1 recensione per Samsung Galaxy S24 (prodotto 2) - rating 4
- 1 recensione per MacBook Air M2 (prodotto 3) - rating 5
- 1 recensione per Sony WH-1000XM5 (prodotto 4) - rating 5
- 1 recensione per Giacca in Pelle (prodotto 6) - rating 4

**3 Commenti** collegati alle prime 3 recensioni

**Collegamento con MySQL**:
- `productId` riferisce prodotti esistenti (1, 2, 3, 4, 6)
- `userId` riferisce utenti esistenti (3, 5, 8, 12, 15, 20)
- `orderId` riferisce ordini esistenti (1, 2, 8, 12, 15)
- `verifiedPurchase: true` quando collegato a ordine reale

### Verifica via API

```bash
# Recensioni prodotto 1 con statistiche
curl http://localhost:3000/api/products/1/reviews | python3 -m json.tool

# Output include:
# - count: 2
# - stats: { avgRating: 4.5, rating5: 1, rating4: 1, ... }

# Full-text search
curl 'http://localhost:3000/api/reviews/search?q=fotocamera'
```

### Pulizia e Re-Seed

```bash
# Lo script pulisce automaticamente prima di inserire
npm run seed:mongodb
```

---

