# Istruzioni per la Consegna - ShopSphere Backend

**Autore**: Francesco di Biase
**Corso**: Master Web Development
**Data**: Ottobre 2025

---

## 📦 Contenuto della Consegna

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

## 🚀 Avvio Rapido

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

# 3. Inizializza MySQL
docker exec -i shopsphere-mysql mysql -u shopsphere_user -pshopsphere_pass shopsphere < database/sql/schema.sql
docker exec -i shopsphere-mysql mysql -u shopsphere_user -pshopsphere_pass shopsphere < database/sql/seed.sql

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

## 📚 Documentazione

- **README.md** - Guida completa con installazione, API, query complesse, testing
- **API.md** - Documentazione dettagliata di tutti i 40+ endpoints
- **Postman Collection** - Importabile in Postman per testing rapido

---

## 🧪 Testing

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

## ✅ Checklist Valutazione

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

## 📊 Caratteristiche Principali

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

## 🔧 Tecnologie Utilizzate

- **Backend**: Node.js 18, Express 4.x
- **Database**: MySQL 8.0, MongoDB 7.0
- **ORM/ODM**: mysql2, Mongoose
- **Auth**: JWT (jsonwebtoken), bcrypt
- **DevOps**: Docker Compose

---

## 📝 Note per il Docente

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

Il database contiene già:
- 30 utenti (2 admin, 28 customers)
- 30 prodotti in 6 categorie
- 15 ordini completi con pagamenti e spedizioni
- Recensioni e commenti di esempio

Tutto è pronto per il testing immediato.

---

## 📞 Contatti

**Autore**: Francesco di Biase
**Progetto**: ShopSphere E-commerce Backend
**Corso**: Master Web Development
**Anno**: 2025

---

**Grazie per la valutazione! 🙏**
