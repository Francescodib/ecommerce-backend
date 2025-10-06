# ✅ FASE 5 COMPLETATA - MongoDB Integration

**Data completamento**: 2025-10-04
**Tempo impiegato**: ~45 minuti

---

## 🎯 Implementazione MongoDB - Reviews & Comments

### Controllers Implementati
- [reviewController.js](../backend/src/controllers/reviewController.js) - 8 funzioni
- [reviewCommentController.js](../backend/src/controllers/reviewCommentController.js) - 4 funzioni

**Totale**: 12 endpoint MongoDB

---

## 📡 Reviews API

### 1. GET `/api/products/:productId/reviews` - Reviews prodotto con statistiche

**Query params**:
- `limit` (default: 20, max: 100)
- `offset` (default: 0)
- `sort` - `recent`, `oldest`, `highest`, `lowest`, `helpful`
- `minRating`, `maxRating` - Filtra per rating

**Response con aggregazione statistiche**:
```json
{
  "success": true,
  "product": {
    "id": 1,
    "name": "iPhone 15 Pro"
  },
  "count": 2,
  "total": 2,
  "stats": {
    "avgRating": 4.5,
    "totalReviews": 2,
    "rating5": 1,
    "rating4": 1,
    "rating3": 0,
    "rating2": 0,
    "rating1": 0
  },
  "data": {
    "reviews": [...]
  }
}
```

**MongoDB Aggregation Query**:
```javascript
Review.aggregate([
  { $match: { productId: parseInt(productId) } },
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

**Caratteristiche**:
- Statistiche rating real-time
- Distribuzione rating (5 stelle → 1 stella)
- Sort multipli
- Paginazione
- Filtri per rating range

---

### 2. POST `/api/products/:productId/reviews` - Crea review

**Authorization**: Richiede JWT

**Request body**:
```json
{
  "rating": 5,
  "title": "Ottimo prodotto!",
  "comment": "Descrizione dettagliata...",
  "pros": ["Qualità", "Prestazioni"],
  "cons": ["Prezzo"],
  "orderId": 1
}
```

**Validazioni**:
- Rating required (1-5)
- Title e comment required
- Verifica prodotto esistente
- **Anti-duplicate**: Un utente può recensire un prodotto solo 1 volta
- Verifica acquisto (verifiedPurchase)

**Verifica Acquisto**:
```javascript
// Se orderId fornito, verifica che:
// 1. Ordine appartiene all'utente autenticato
// 2. Ordine contiene il prodotto recensito
const [orderItem] = await query(
  `SELECT oi.* FROM order_items oi
   JOIN orders o ON oi.order_id = o.id
   WHERE o.id = ? AND o.user_id = ? AND oi.product_id = ?`,
  [orderId, userId, productId]
);

if (orderItem) {
  verifiedPurchase = true; // Badge "Acquisto verificato"
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "review": {
      "_id": "68e1508b4cb15c1309142292",
      "productId": 1,
      "userId": 3,
      "orderId": 1,
      "rating": 5,
      "title": "Ottimo prodotto!",
      "comment": "...",
      "pros": ["Qualità", "Prestazioni"],
      "cons": ["Prezzo"],
      "verifiedPurchase": true,
      "helpful": 0,
      "createdAt": "2025-10-04T...",
      "__v": 0
    }
  }
}
```

**Error (409) - Duplicate review**:
```json
{
  "success": false,
  "message": "You have already reviewed this product"
}
```

---

### 3. GET `/api/reviews/:id` - Dettagli review

**Public endpoint** (no auth)

```bash
curl http://localhost:3000/api/reviews/68e1508b4cb15c1309142292
```

---

### 4. PUT `/api/reviews/:id` - Aggiorna review

**Authorization**: Solo owner o admin

**Ownership check**:
```javascript
if (review.userId !== userId && req.user.role !== 'admin') {
  throw new AppError('You can only update your own reviews', 403);
}
```

**Campi aggiornabili**: `rating`, `title`, `comment`, `pros`, `cons`

---

### 5. DELETE `/api/reviews/:id` - Elimina review

**Authorization**: Solo owner o admin

**Ownership check**: Come update

---

### 6. POST `/api/reviews/:id/helpful` - Marca review utile

**Public endpoint** (incrementa counter)

```javascript
// MongoDB atomic increment
Review.findByIdAndUpdate(
  id,
  { $inc: { helpful: 1 } },  // +1 al counter
  { new: true }
)
```

**Response**:
```json
{
  "success": true,
  "message": "Review marked as helpful",
  "data": {
    "review": {
      ...
      "helpful": 13  // Incrementato
    }
  }
}
```

---

### 7. GET `/api/reviews/search` - Full-text search

**Query params**:
- `q` - Query di ricerca (min 2 caratteri)
- `productId` - Opzionale, filtra per prodotto
- `limit`, `offset` - Paginazione

**Esempio**:
```bash
curl 'http://localhost:3000/api/reviews/search?q=fotocamera+eccellente'
```

**MongoDB Full-Text Search**:
```javascript
const filter = {
  $text: { $search: q }  // Cerca in title + comment
};

Review.find(filter, { score: { $meta: 'textScore' } })
  .sort({ score: { $meta: 'textScore' } })  // Ordina per rilevanza
```

**Richiede text index**:
```javascript
// Nel model Review.js
reviewSchema.index({ title: 'text', comment: 'text' });
```

**Response**:
```json
{
  "success": true,
  "query": "fotocamera eccellente",
  "count": 2,
  "total": 2,
  "data": {
    "reviews": [...]
  }
}
```

---

### 8. GET `/api/users/:userId/reviews` - Reviews utente

**Authorization**: Self o admin (ownership check)

```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/users/3/reviews
```

---

## 💬 Comments API

### 1. GET `/api/reviews/:reviewId/comments` - Lista commenti

**Public endpoint**

```bash
curl http://localhost:3000/api/reviews/68e1508b4cb15c1309142292/comments
```

**Response**:
```json
{
  "success": true,
  "count": 1,
  "data": {
    "comments": [
      {
        "_id": "68e1508c4cb15c13091422b9",
        "reviewId": "68e1508b4cb15c1309142292",
        "userId": 26,
        "comment": "Concordo pienamente!",
        "createdAt": "2025-09-30T15:40:06.933Z",
        "__v": 0
      }
    ]
  }
}
```

---

### 2. POST `/api/reviews/:reviewId/comments` - Crea commento

**Authorization**: Richiede JWT

**Request**:
```json
{
  "comment": "Concordo completamente!"
}
```

**Validazioni**:
- Comment required (non vuoto)
- Review deve esistere

---

### 3. PUT `/api/reviews/comments/:id` - Aggiorna commento

**Authorization**: Solo owner o admin

**Ownership check**:
```javascript
if (comment.userId !== userId && req.user.role !== 'admin') {
  throw new AppError('You can only update your own comments', 403);
}
```

---

### 4. DELETE `/api/reviews/comments/:id` - Elimina commento

**Authorization**: Solo owner o admin

---

## 🗄️ MongoDB Models

### Review Schema

```javascript
const reviewSchema = new mongoose.Schema({
  productId: { type: Number, required: true, index: true },
  userId: { type: Number, required: true, index: true },
  orderId: { type: Number, default: null },

  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  comment: { type: String, required: true },

  pros: [String],
  cons: [String],

  verifiedPurchase: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indici
reviewSchema.index({ title: 'text', comment: 'text' });  // Full-text
reviewSchema.index({ productId: 1, createdAt: -1 });     // Compound
reviewSchema.index({ userId: 1 });
```

### ReviewComment Schema

```javascript
const reviewCommentSchema = new mongoose.Schema({
  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    required: true,
    index: true
  },
  userId: { type: Number, required: true },
  comment: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indice compound
reviewCommentSchema.index({ reviewId: 1, createdAt: -1 });
```

---

## 📊 MongoDB Queries Complesse

### 1. Aggregazione Rating Stats ✅

```javascript
Review.aggregate([
  { $match: { productId: 1 } },
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

**Output**:
```json
{
  "avgRating": 4.5,
  "totalReviews": 2,
  "rating5": 1,
  "rating4": 1,
  "rating3": 0,
  "rating2": 0,
  "rating1": 0
}
```

### 2. Full-Text Search con Score ✅

```javascript
Review.find(
  { $text: { $search: "fotocamera eccellente" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } })
```

Cerca in `title` e `comment`, ordina per rilevanza.

### 3. Find con Filtri Multipli ✅

```javascript
const filter = { productId: 1 };
if (minRating) filter.rating = { $gte: minRating };
if (maxRating) filter.rating = { ...filter.rating, $lte: maxRating };

Review.find(filter)
  .sort({ createdAt: -1 })
  .limit(20)
  .skip(0)
```

### 4. Atomic Increment ✅

```javascript
Review.findByIdAndUpdate(
  id,
  { $inc: { helpful: 1 } },
  { new: true }
)
```

---

## 🔍 Indici MongoDB

### Text Index (Full-text search)
```javascript
reviewSchema.index({ title: 'text', comment: 'text' });
```

**Uso**:
```javascript
db.reviews.find({ $text: { $search: "fotocamera" } })
```

### Compound Index (Query performance)
```javascript
reviewSchema.index({ productId: 1, createdAt: -1 });
```

**Ottimizza query**:
```javascript
Review.find({ productId: 1 }).sort({ createdAt: -1 })
```

### Single Field Indexes
```javascript
reviewSchema.index({ userId: 1 });
reviewCommentSchema.index({ reviewId: 1 });
```

---

## 📋 Routes

### [reviews.js](../backend/src/routes/reviews.js)

```javascript
// Public
router.get('/search', searchReviews);
router.get('/:id', getReviewById);
router.post('/:id/helpful', markHelpful);

// Auth required
router.put('/:id', authenticateToken, updateReview);
router.delete('/:id', authenticateToken, deleteReview);

// Comments
router.get('/:reviewId/comments', getReviewComments);
router.post('/:reviewId/comments', authenticateToken, createComment);
router.put('/comments/:id', authenticateToken, updateComment);
router.delete('/comments/:id', authenticateToken, deleteComment);
```

### [products.js](../backend/src/routes/products.js) - Nested routes

```javascript
// GET /api/products/:productId/reviews
router.get('/:productId/reviews', getProductReviews);

// POST /api/products/:productId/reviews
router.post('/:productId/reviews', authenticateToken, createReview);
```

**Pattern RESTful**: Reviews accessibili sia da `/api/products/:id/reviews` che da `/api/reviews/:id`

---

## 🧪 Testing API

### Test Reviews

```bash
# 1. Get reviews con stats
curl 'http://localhost:3000/api/products/1/reviews'

# 2. Sort by helpful
curl 'http://localhost:3000/api/products/1/reviews?sort=helpful'

# 3. Filter by rating
curl 'http://localhost:3000/api/products/1/reviews?minRating=4'

# 4. Create review
curl -X POST http://localhost:3000/api/products/4/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "rating": 5,
    "title": "Ottime cuffie!",
    "comment": "Cancellazione rumore top",
    "pros": ["Audio", "Comfort"],
    "cons": ["Prezzo"],
    "orderId": 2
  }'

# 5. Mark helpful
curl -X POST http://localhost:3000/api/reviews/<id>/helpful

# 6. Full-text search
curl 'http://localhost:3000/api/reviews/search?q=fotocamera'
```

### Test Comments

```bash
# 1. Get comments
curl http://localhost:3000/api/reviews/<reviewId>/comments

# 2. Create comment
curl -X POST http://localhost:3000/api/reviews/<reviewId>/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"comment":"Concordo!"}'

# 3. Update comment
curl -X PUT http://localhost:3000/api/reviews/comments/<id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"comment":"Commento aggiornato"}'
```

---

## ✅ Checklist FASE 5

- [x] Review model con Mongoose
- [x] ReviewComment model
- [x] CRUD completo Reviews (8 endpoint)
- [x] CRUD completo Comments (4 endpoint)
- [x] Aggregazione statistiche rating
- [x] Distribuzione rating (5★ → 1★)
- [x] Full-text search
- [x] Sort multipli (recent, oldest, highest, lowest, helpful)
- [x] Helpful counter con atomic increment
- [x] Verifica acquisto (verifiedPurchase)
- [x] Anti-duplicate review
- [x] Ownership check
- [x] Text indexes
- [x] Compound indexes
- [x] Integrazione routes
- [x] Testing completo

---

## 🎯 Caratteristiche Avanzate Implementate

### 1. Verified Purchase Badge ✅
```javascript
// Verifica che user abbia effettivamente acquistato il prodotto
if (orderId) {
  const [orderItem] = await query(
    `SELECT oi.* FROM order_items oi
     JOIN orders o ON oi.order_id = o.id
     WHERE o.id = ? AND o.user_id = ? AND oi.product_id = ?`,
    [orderId, userId, productId]
  );
  verifiedPurchase = !!orderItem;
}
```

### 2. Anti-Duplicate Review ✅
```javascript
// Un utente può recensire un prodotto solo 1 volta
const existingReview = await Review.findOne({
  productId: parseInt(productId),
  userId: parseInt(userId)
});

if (existingReview) {
  throw new AppError('You have already reviewed this product', 409);
}
```

### 3. Rating Distribution ✅
```javascript
// Conta quante recensioni per ogni stella
rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
// ...
```

### 4. Helpful Counter ✅
```javascript
// Atomic increment - thread-safe
{ $inc: { helpful: 1 } }
```

### 5. Full-Text Search con Relevance Score ✅
```javascript
// Ricerca + scoring per rilevanza
.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
.sort({ score: { $meta: 'textScore' } })
```

---

## 📈 Progresso Totale

**FASE 5 COMPLETATA!**

- ✅ FASE 1: Setup (Docker, progetto)
- ✅ FASE 2: Database (MySQL + MongoDB)
- ✅ FASE 3: Backend base + Auth
- ✅ FASE 4A: Products API
- ✅ FASE 4B: Users API
- ✅ FASE 5: MongoDB Integration

**Prossimo**: Documentazione finale e consegna

**Progresso**: ~85% completato

---

**FASE 5 (MongoDB) COMPLETATA CON SUCCESSO! 🎉**
