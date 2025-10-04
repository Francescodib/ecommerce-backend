# ShopSphere - Documentazione API

**Autore**: Francesco di Biase

Documentazione completa degli endpoint REST API del backend ShopSphere.

**Base URL**: `http://localhost:3000/api`

---

## Indice

- [Authentication](#authentication)
- [Categories](#categories)
- [Products](#products)
- [Users](#users)
- [Reviews](#reviews)
- [Comments](#comments)
- [Codici di Stato](#codici-di-stato)

---

## Authentication

### POST /auth/register

Registrazione nuovo utente.

**Body**:
```json
{
  "first_name": "Mario",
  "last_name": "Rossi",
  "email": "mario.rossi@email.com",
  "password": "password123",
  "phone": "+39 333 1234567"
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 31,
      "first_name": "Mario",
      "last_name": "Rossi",
      "email": "mario.rossi@email.com",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### POST /auth/login

Login utente.

**Body**:
```json
{
  "email": "admin@shopsphere.com",
  "password": "password123"
}
```

**Response (200)**:
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
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### GET /auth/me

Profilo utente autenticato.

**Headers**: `Authorization: Bearer <token>`

**Response (200)**:
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
      "role": "admin"
    }
  }
}
```

---

## Categories

### GET /categories

Lista tutte le categorie.

**Response (200)**:
```json
{
  "success": true,
  "count": 6,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Elettronica",
        "description": "Dispositivi elettronici...",
        "product_count": 5
      }
    ]
  }
}
```

---

### GET /categories/:id

Categoria per ID.

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "category": {
      "id": 1,
      "name": "Elettronica",
      "description": "Dispositivi elettronici..."
    }
  }
}
```

---

### POST /categories

Crea nuova categoria (Admin only).

**Headers**: `Authorization: Bearer <admin_token>`

**Body**:
```json
{
  "name": "Nuova Categoria",
  "description": "Descrizione categoria"
}
```

**Response (201)**:
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

---

### PUT /categories/:id

Aggiorna categoria (Admin only).

**Headers**: `Authorization: Bearer <admin_token>`

**Body**:
```json
{
  "name": "Nome Aggiornato"
}
```

---

### DELETE /categories/:id

Elimina categoria (Admin only).

**Headers**: `Authorization: Bearer <admin_token>`

**Response (200)**:
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## Products

### GET /products

Lista prodotti con filtri.

**Query Parameters**:
- `category` - ID categoria
- `minPrice` - Prezzo minimo
- `maxPrice` - Prezzo massimo
- `search` - Ricerca testuale
- `isActive` - true/false
- `limit` - Numero risultati (default: 20, max: 100)
- `offset` - Offset paginazione

**Esempio**: `GET /products?category=1&minPrice=500&limit=10`

**Response (200)**:
```json
{
  "success": true,
  "count": 3,
  "total": 5,
  "data": {
    "products": [
      {
        "id": 1,
        "category_id": 1,
        "name": "iPhone 15 Pro",
        "description": "Smartphone Apple...",
        "price": "1199.00",
        "stock_quantity": 50,
        "img_url": "https://example.com/iphone15.jpg",
        "is_active": 1,
        "category_name": "Elettronica"
      }
    ]
  }
}
```

---

### GET /products/:id

Dettagli prodotto.

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "category_id": 1,
      "name": "iPhone 15 Pro",
      "description": "Smartphone Apple con chip A17 Pro...",
      "price": "1199.00",
      "stock_quantity": 50,
      "created_at": "2025-10-04T14:26:36.000Z",
      "img_url": "https://example.com/iphone15.jpg",
      "is_active": 1,
      "category_name": "Elettronica",
      "category_description": "Dispositivi elettronici..."
    }
  }
}
```

---

### GET /products/top-selling

Prodotti più venduti (Query complessa).

**Query Parameters**:
- `limit` - Numero risultati (default: 10, max: 100)

**Response (200)**:
```json
{
  "success": true,
  "count": 5,
  "data": {
    "products": [
      {
        "id": 4,
        "name": "Sony WH-1000XM5",
        "price": "399.00",
        "img_url": "https://example.com/sonywh1000.jpg",
        "category_name": "Elettronica",
        "total_sold": "3",
        "total_orders": 3,
        "total_revenue": "1197.00"
      }
    ]
  }
}
```

---

### GET /products/category/:categoryId

Prodotti per categoria.

**Query Parameters**:
- `limit` - Numero risultati
- `offset` - Offset paginazione

**Response (200)**:
```json
{
  "success": true,
  "category": {
    "id": 1,
    "name": "Elettronica",
    "description": "..."
  },
  "count": 5,
  "data": {
    "products": [...]
  }
}
```

---

### POST /products

Crea prodotto (Admin only).

**Headers**: `Authorization: Bearer <admin_token>`

**Body**:
```json
{
  "category_id": 1,
  "name": "Nuovo Prodotto",
  "description": "Descrizione dettagliata",
  "price": 99.99,
  "stock_quantity": 50,
  "img_url": "https://example.com/image.jpg",
  "is_active": true
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": {...}
  }
}
```

---

### PUT /products/:id

Aggiorna prodotto (Admin only).

**Headers**: `Authorization: Bearer <admin_token>`

**Body** (tutti i campi sono opzionali):
```json
{
  "price": 89.99,
  "stock_quantity": 30
}
```

---

### DELETE /products/:id

Elimina prodotto (Admin only).

**Headers**: `Authorization: Bearer <admin_token>`

**Response (200)**:
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### GET /products/:productId/reviews

Recensioni prodotto con statistiche.

**Query Parameters**:
- `limit` - Numero risultati
- `offset` - Offset paginazione
- `sort` - `recent`, `oldest`, `highest`, `lowest`, `helpful`
- `minRating`, `maxRating` - Filtra per rating

**Response (200)**:
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
    "reviews": [
      {
        "_id": "68e1508b4cb15c1309142292",
        "productId": 1,
        "userId": 3,
        "rating": 5,
        "title": "Fantastico!",
        "comment": "Ottimo prodotto...",
        "pros": ["Fotocamera", "Prestazioni"],
        "cons": ["Prezzo"],
        "verifiedPurchase": true,
        "helpful": 12,
        "createdAt": "2025-09-29T13:26:26.689Z"
      }
    ]
  }
}
```

---

### POST /products/:productId/reviews

Crea recensione prodotto.

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "rating": 5,
  "title": "Ottimo prodotto!",
  "comment": "Descrizione dettagliata della mia esperienza...",
  "pros": ["Qualità", "Prestazioni"],
  "cons": ["Prezzo elevato"],
  "orderId": 1
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "review": {...}
  }
}
```

**Note**:
- Un utente può creare solo 1 recensione per prodotto
- Se viene fornito `orderId`, viene verificato l'acquisto (verifiedPurchase)

---

## Users

### GET /users

Lista utenti (Admin only).

**Headers**: `Authorization: Bearer <admin_token>`

**Query Parameters**:
- `role` - Filtra per ruolo (customer, admin, seller)
- `limit` - Numero risultati
- `offset` - Offset paginazione

**Response (200)**:
```json
{
  "success": true,
  "count": 10,
  "total": 30,
  "data": {
    "users": [
      {
        "id": 1,
        "first_name": "Admin",
        "last_name": "Principale",
        "email": "admin@shopsphere.com",
        "phone": "+39 338 1234567",
        "role": "admin",
        "created_at": "2025-10-04T14:26:36.000Z"
      }
    ]
  }
}
```

---

### GET /users/:id

Profilo utente.

**Headers**: `Authorization: Bearer <token>`

**Ownership**: L'utente può vedere solo il proprio profilo. Gli admin possono vedere tutti.

**Response (200)**:
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

---

### PUT /users/:id

Aggiorna profilo utente.

**Headers**: `Authorization: Bearer <token>`

**Ownership**: L'utente può aggiornare solo il proprio profilo. Gli admin possono aggiornare tutti.

**Body** (tutti i campi sono opzionali):
```json
{
  "first_name": "Mario",
  "last_name": "Rossi",
  "phone": "+39 333 9999999",
  "password": "nuova_password",
  "role": "seller"
}
```

**Note**: Solo gli admin possono modificare il campo `role`.

**Response (200)**:
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {...}
  }
}
```

---

### DELETE /users/:id

Elimina utente.

**Headers**: `Authorization: Bearer <token>`

**Ownership**: L'utente può eliminare solo il proprio account. Gli admin possono eliminare tutti.

**Response (200)**:
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Protezione**: Non è possibile eliminare un utente con ordini pendenti.

---

### GET /users/:id/orders

Ordini utente (Query complessa).

**Headers**: `Authorization: Bearer <token>`

**Ownership**: L'utente può vedere solo i propri ordini.

**Response (200)**:
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
        "payment_method": "credit_card",
        "payment_status": "completed",
        "tracking_number": "IT123456789",
        "carrier": "DHL",
        "shipping_status": "delivered",
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

---

### GET /users/:id/addresses

Indirizzi utente.

**Headers**: `Authorization: Bearer <token>`

**Ownership**: L'utente può vedere solo i propri indirizzi.

**Response (200)**:
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
        "is_default": 1,
        "created_at": "2025-10-04T14:26:36.000Z"
      }
    ]
  }
}
```

---

## Reviews

### GET /reviews/:id

Dettagli recensione.

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "review": {
      "_id": "68e1508b4cb15c1309142292",
      "productId": 1,
      "userId": 3,
      "rating": 5,
      "title": "Fantastico!",
      "comment": "...",
      "pros": ["..."],
      "cons": ["..."],
      "verifiedPurchase": true,
      "helpful": 12,
      "createdAt": "2025-09-29T13:26:26.689Z"
    }
  }
}
```

---

### PUT /reviews/:id

Aggiorna recensione.

**Headers**: `Authorization: Bearer <token>`

**Ownership**: Solo l'autore o un admin può aggiornare.

**Body** (campi opzionali):
```json
{
  "rating": 5,
  "title": "Titolo aggiornato",
  "comment": "Commento aggiornato",
  "pros": ["Pro 1", "Pro 2"],
  "cons": ["Contro 1"]
}
```

---

### DELETE /reviews/:id

Elimina recensione.

**Headers**: `Authorization: Bearer <token>`

**Ownership**: Solo l'autore o un admin può eliminare.

---

### POST /reviews/:id/helpful

Marca recensione come utile.

**Response (200)**:
```json
{
  "success": true,
  "message": "Review marked as helpful",
  "data": {
    "review": {
      ...
      "helpful": 13
    }
  }
}
```

---

### GET /reviews/search

Full-text search nelle recensioni.

**Query Parameters**:
- `q` - Query di ricerca (minimo 2 caratteri)
- `productId` - Opzionale, filtra per prodotto
- `limit` - Numero risultati
- `offset` - Offset paginazione

**Esempio**: `GET /reviews/search?q=fotocamera&productId=1`

**Response (200)**:
```json
{
  "success": true,
  "query": "fotocamera",
  "count": 2,
  "total": 2,
  "data": {
    "reviews": [...]
  }
}
```

---

## Comments

### GET /reviews/:reviewId/comments

Commenti di una recensione.

**Response (200)**:
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
        "createdAt": "2025-09-30T15:40:06.933Z"
      }
    ]
  }
}
```

---

### POST /reviews/:reviewId/comments

Aggiungi commento a recensione.

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "comment": "Concordo completamente!"
}
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "comment": {...}
  }
}
```

---

### PUT /reviews/comments/:id

Aggiorna commento.

**Headers**: `Authorization: Bearer <token>`

**Ownership**: Solo l'autore o un admin.

**Body**:
```json
{
  "comment": "Commento aggiornato"
}
```

---

### DELETE /reviews/comments/:id

Elimina commento.

**Headers**: `Authorization: Bearer <token>`

**Ownership**: Solo l'autore o un admin.

---

## Codici di Stato

### Success

- **200 OK** - Richiesta completata con successo
- **201 Created** - Risorsa creata con successo

### Client Errors

- **400 Bad Request** - Dati invalidi o mancanti
- **401 Unauthorized** - Token mancante o invalido
- **403 Forbidden** - Accesso negato (permessi insufficienti)
- **404 Not Found** - Risorsa non trovata
- **409 Conflict** - Conflitto (es. email già esistente)

### Server Errors

- **500 Internal Server Error** - Errore interno del server

---

## Formato Errori

Tutti gli errori seguono questo formato:

```json
{
  "success": false,
  "message": "Descrizione dell'errore"
}
```

**Esempi**:

```json
{
  "success": false,
  "message": "Access token required"
}
```

```json
{
  "success": false,
  "message": "You can only view your own profile"
}
```

```json
{
  "success": false,
  "message": "Product not found"
}
```

---

**Autore**: Francesco di Biase
**Progetto**: ShopSphere E-commerce Backend
**Data**: Ottobre 2025
