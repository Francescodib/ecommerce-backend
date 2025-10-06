# ShopSphere - Backend E-commerce

Backend RESTful API per piattaforma e-commerce con architettura ibrida MySQL + MongoDB.

**Autore**: Francesco di Biase
**Corso**: Master Web Development
**Data**: Ottobre 2025

---

## Indice

- [Descrizione](#descrizione)
- [Tecnologie](#tecnologie)
- [Installazione](#installazione)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Query Complesse](#query-complesse)
- [Testing](#testing)

---

## Descrizione

ShopSphere è un backend completo per e-commerce che implementa:

- **Architettura ibrida**: MySQL per dati transazionali, MongoDB per recensioni
- **40+ API RESTful endpoints**
- **Autenticazione JWT** con role-based access control
- **Query SQL complesse** con JOIN multipli e aggregazioni
- **MongoDB aggregations** per statistiche e full-text search
- **Ownership pattern** per la sicurezza dei dati

---

## Tecnologie

### Backend
- Node.js 18+
- Express 4.x
- JWT (jsonwebtoken)
- bcrypt

### Database
- MySQL 8.0 (mysql2 con connection pooling)
- MongoDB 7.0 (Mongoose ODM)

### DevOps
- Docker Compose

---

## Installazione

### Prerequisiti

- Node.js 18 o superiore
- Docker e Docker Compose
- Git

### Setup

**1. Clona il repository**

```bash
cd consegna
```

**2. Installa le dipendenze**

```bash
cd backend
npm install
```

**3. Avvia i database con Docker**

```bash
# Torna alla root del progetto
cd ..

# Avvia MySQL e MongoDB
docker compose up -d

# Verifica che i container siano attivi
docker ps
```

Al primo avvio, Docker esegue **automaticamente**:
- `database/sql/schema.sql` - Creazione tabelle MySQL
- `database/sql/seed.sql` - Popolamento dati iniziali (30 users, 30 products, 15 orders)

**4. Popola MongoDB con dati di esempio (opzionale)**

```bash
cd backend
npm run seed:mongodb
```

Questo script crea automaticamente:
- 6 recensioni di esempio per vari prodotti
- 3 commenti sulle recensioni
- Dati collegati agli ordini esistenti in MySQL

**5. Configura le variabili d'ambiente**

```bash
cp .env.example .env
```

Il file `.env` contiene già le configurazioni corrette per l'ambiente Docker.

**6. Avvia il server**

```bash
npm run dev
```

Il server sarà disponibile su: **http://localhost:3000**

### Verifica Installazione

```bash
# Health check
curl http://localhost:3000/health

# Risposta attesa:
# {"success":true,"message":"ShopSphere API is running","timestamp":"..."}
```

---

## API Endpoints

### Authentication

```
POST   /api/auth/register        Registrazione nuovo utente
POST   /api/auth/login           Login con email/password
GET    /api/auth/me              Profilo utente autenticato
```

### Categories

```
GET    /api/categories           Lista tutte le categorie
GET    /api/categories/:id       Categoria per ID
POST   /api/categories           Crea categoria (admin)
PUT    /api/categories/:id       Aggiorna categoria (admin)
DELETE /api/categories/:id       Elimina categoria (admin)
```

### Products

```
GET    /api/products                      Lista prodotti con filtri
GET    /api/products/:id                  Prodotto per ID
GET    /api/products/top-selling          Prodotti più venduti
GET    /api/products/category/:id         Prodotti per categoria
POST   /api/products                      Crea prodotto (admin)
PUT    /api/products/:id                  Aggiorna prodotto (admin)
DELETE /api/products/:id                  Elimina prodotto (admin)
GET    /api/products/:id/reviews          Recensioni prodotto
POST   /api/products/:id/reviews          Crea recensione
```

**Filtri disponibili per GET /api/products**:
- `category` - ID categoria
- `minPrice`, `maxPrice` - Range di prezzo
- `search` - Ricerca testuale su nome/descrizione
- `isActive` - Solo prodotti attivi
- `limit` - Numero risultati (default: 20, max: 100)
- `offset` - Offset per paginazione

**Esempio**:
```bash
curl 'http://localhost:3000/api/products?category=1&minPrice=500&limit=10'
```

### Users

```
GET    /api/users                Lista utenti (admin)
GET    /api/users/:id            Profilo utente
PUT    /api/users/:id            Aggiorna profilo
DELETE /api/users/:id            Elimina utente
GET    /api/users/:id/orders     Ordini utente
GET    /api/users/:id/addresses  Indirizzi utente
```

### Reviews

```
GET    /api/reviews/:id                   Dettagli recensione
PUT    /api/reviews/:id                   Aggiorna recensione
DELETE /api/reviews/:id                   Elimina recensione
POST   /api/reviews/:id/helpful           Marca come utile
GET    /api/reviews/search                Full-text search
GET    /api/reviews/:id/comments          Commenti recensione
POST   /api/reviews/:id/comments          Aggiungi commento
PUT    /api/reviews/comments/:id          Aggiorna commento
DELETE /api/reviews/comments/:id          Elimina commento
```

Per documentazione completa, consultare il file [API.md](API.md).

---

## Database

### MySQL

**10 tabelle relazionali**:

1. `users` - Utenti con ruoli (customer, admin, seller)
2. `categories` - Categorie prodotti
3. `products` - Catalogo prodotti
4. `orders` - Ordini clienti
5. `order_items` - Dettagli articoli ordinati
6. `payments` - Informazioni pagamenti
7. `shippings` - Spedizioni
8. `addresses` - Indirizzi utenti
9. `discounts` - Codici sconto
10. `wishlists` - Liste desideri

**Schema completo**: `database/sql/schema.sql`

### MongoDB

**3 collections**:

1. `reviews` - Recensioni prodotti con rating, pros/cons
2. `reviewcomments` - Commenti sulle recensioni
3. `activitylogs` - Log attività utenti

**Models Mongoose**: `database/mongodb/models/`

### Dati Iniziali

Il database viene popolato con:
- 30 utenti (2 admin, 28 customers)
- 30 prodotti in 6 categorie
- 15 ordini completi con pagamenti e spedizioni
- Recensioni e commenti di esempio

**Credenziali di test**:
```
Admin:  admin@shopsphere.com / password123
User:   mario.rossi@email.com / password123
```

---

## Query Complesse

Il progetto implementa diverse query SQL e MongoDB avanzate:

### 1. Top-Selling Products (SQL)

Prodotti più venduti con statistiche di vendita.

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
LIMIT 10
```

**Endpoint**: `GET /api/products/top-selling?limit=10`

**Caratteristiche**:
- JOIN su 4 tabelle
- GROUP BY con aggregazioni (SUM, COUNT)
- Filtro per stati ordine validi

---

### 2. User Orders con Items (SQL)

Ordini utente con dettagli completi di pagamento, spedizione e articoli.

```sql
SELECT
  o.id,
  o.status,
  o.total_amount,
  o.order_date,
  p.payment_method,
  p.status as payment_status,
  s.tracking_number,
  s.carrier,
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

Per ogni ordine, viene eseguita una subquery per ottenere i dettagli degli articoli:

```sql
SELECT
  oi.id,
  oi.product_id,
  oi.quantity,
  oi.unit_price,
  oi.subtotal,
  p.name as product_name,
  p.img_url as product_image
FROM order_items oi
JOIN products p ON oi.product_id = p.id
WHERE oi.order_id = ?
```

**Endpoint**: `GET /api/users/:id/orders`

**Caratteristiche**:
- JOIN multipli (4 tabelle)
- LEFT JOIN per gestire dati opzionali
- GROUP BY con aggregazioni
- Subquery per dettagli nested

---

### 3. Review Statistics (MongoDB Aggregation)

Statistiche recensioni con distribuzione rating.

```javascript
db.reviews.aggregate([
  {
    $match: { productId: 1 }
  },
  {
    $group: {
      _id: null,
      avgRating: { $avg: '$rating' },
      totalReviews: { $sum: 1 },
      rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
      rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
      rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
      rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
      rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
    }
  }
])
```

**Endpoint**: `GET /api/products/:id/reviews`

**Caratteristiche**:
- Aggregation pipeline
- Calcolo media rating
- Distribuzione rating (5★ → 1★)
- Conditional aggregation ($cond)

---

### 4. Full-Text Search (MongoDB)

Ricerca full-text su recensioni con relevance score.

```javascript
db.reviews.find(
  { $text: { $search: "fotocamera eccellente" } },
  { score: { $meta: "textScore" } }
).sort({
  score: { $meta: "textScore" }
})
```

**Endpoint**: `GET /api/reviews/search?q=fotocamera`

**Caratteristiche**:
- Text index su campi `title` e `comment`
- Ordinamento per rilevanza
- Score di ricerca

**Indici utilizzati**:
```javascript
reviewSchema.index({ title: 'text', comment: 'text' });
reviewSchema.index({ productId: 1, createdAt: -1 });
```

---

## Sicurezza

### Autenticazione JWT

Tutti gli endpoint protetti richiedono un token JWT nell'header:

```
Authorization: Bearer <token>
```

Il token viene ottenuto tramite login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shopsphere.com","password":"password123"}'
```

### Role-Based Access Control

Tre ruoli disponibili:
- `customer` - Utente base
- `seller` - Venditore (riservato per future implementazioni)
- `admin` - Amministratore con accesso completo

Alcuni endpoint sono riservati agli admin:
- Creazione/modifica/eliminazione prodotti
- Creazione/modifica/eliminazione categorie
- Modifica ruoli utenti

### Ownership Check

Gli utenti possono accedere solo ai propri dati:
- Un utente può vedere solo il proprio profilo
- Un utente può vedere solo i propri ordini
- Gli admin hanno accesso a tutti i dati

**Esempio**:
```
User ID 3 → GET /api/users/3 ✅ OK
User ID 3 → GET /api/users/5 ❌ 403 Forbidden
Admin    → GET /api/users/5 ✅ OK
```

### Protezione Dati

- Password hashate con bcrypt (10 salt rounds)
- SQL injection prevention con prepared statements
- Validazione input su tutti gli endpoint
- Rate limiting delle richieste (implementabile)

---

## Testing

### 1. Test con cURL

**Health check**:
```bash
curl http://localhost:3000/health
```

**Login admin**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shopsphere.com","password":"password123"}'
```

**Get prodotti**:
```bash
curl http://localhost:3000/api/products
```

**Get prodotti filtrati**:
```bash
curl 'http://localhost:3000/api/products?category=1&minPrice=500&maxPrice=1500'
```

**Top selling products**:
```bash
curl 'http://localhost:3000/api/products/top-selling?limit=5'
```

**Recensioni prodotto**:
```bash
curl 'http://localhost:3000/api/products/1/reviews'
```

**Full-text search**:
```bash
curl 'http://localhost:3000/api/reviews/search?q=fotocamera'
```

### 2. Test con Postman

Importa la collection: `ShopSphere.postman_collection.json`

La collection include:
- 40+ richieste pre-configurate
- Variabili per base URL e token
- Script automatici per gestire l'autenticazione
- Esempi per ogni endpoint

**Istruzioni**:
1. Importa la collection in Postman
2. Esegui la richiesta "Login Admin" nella cartella Authentication
3. Il token verrà salvato automaticamente come variabile
4. Testa gli altri endpoint

### 3. Verifiche Database

**MySQL**:
```bash
docker exec -it shopsphere-mysql mysql -u shopsphere_user -pshopsphere_pass shopsphere

mysql> SELECT COUNT(*) FROM users;
mysql> SELECT COUNT(*) FROM products;
mysql> SELECT COUNT(*) FROM orders;
```

**MongoDB**:
```bash
docker exec -it shopsphere-mongodb mongosh shopsphere

> db.reviews.countDocuments()
> db.reviews.find().limit(2)
```

---

## Struttura Progetto

```
consegna/
├── README.md                    # Questo file
├── API.md                       # Documentazione API completa
├── docker-compose.yml           # Configurazione Docker
├── ShopSphere.postman_collection.json
│
├── backend/
│   ├── src/
│   │   ├── config/              # Configurazioni DB e JWT
│   │   ├── controllers/         # Business logic
│   │   ├── middlewares/         # Auth ed error handling
│   │   ├── models/mongodb/      # Mongoose schemas
│   │   ├── routes/              # API routes
│   │   └── server.js            # Entry point
│   ├── package.json
│   └── .env.example
│
└── database/
    ├── sql/
    │   ├── schema.sql           # Schema MySQL
    │   └── seed.sql             # Dati iniziali
    └── mongodb/
        └── models/              # Mongoose models
```

---

## Troubleshooting

### Database non si connette

```bash
# Verifica che i container siano attivi
docker ps

# Riavvia i container
docker compose restart

# Controlla i log
docker compose logs mysql
docker compose logs mongodb
```

### Porta 3000 già in uso

Modifica la porta nel file `backend/.env`:
```
PORT=3001
```

### Token scaduto

I token JWT scadono dopo 24 ore. Effettua un nuovo login per ottenere un token valido.

---

## Note

- Il server usa `nodemon` in development per auto-reload
- I log delle richieste sono visibili in console durante lo sviluppo
- Le password non vengono mai esposte nelle risposte API
- Tutti i dati sensibili sono hashati o criptati

---

## Autore

**Francesco di Biase**
Master Web Development
Ottobre 2025

