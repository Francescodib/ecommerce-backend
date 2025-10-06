/**
 * Script per popolare MongoDB con dati di esempio
 * Esegui: node seed-mongodb.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Review = require('./src/models/mongodb/Review');
const ReviewComment = require('./src/models/mongodb/ReviewComment');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shopsphere';

// Dati di esempio per le recensioni
// NOTA: Dati allineati con seed.sql
// Order 1 (user 3): iPhone 15 Pro (product 1)
// Order 2 (user 4): Samsung Galaxy S24 (product 2)
// Order 3 (user 5): MacBook Air + Cuffie Sony (products 3, 4)
// Order 8 (user 10): Giacca Pelle + Cappotto (products 6, 10)
// Order 12 (user 14): Sony Cuffie (product 4)
// Order 15 (user 17): iPhone 15 Pro (product 1)

const sampleReviews = [
  {
    productId: 1,
    userId: 3,
    orderId: 1,
    rating: 5,
    title: "Fantastico! Migliore iPhone mai avuto",
    comment: "Sono passato dal 13 Pro e la differenza si sente. Il chip A17 Pro è velocissimo, le foto sono spettacolari anche di notte. La batteria dura tutto il giorno senza problemi. Consigliatissimo!",
    pros: ["Fotocamera eccezionale", "Performance top", "Batteria ottima"],
    cons: ["Prezzo alto"],
    verifiedPurchase: true,
    helpful: 12,
    createdAt: new Date('2024-09-29')
  },
  {
    productId: 1,
    userId: 17,
    orderId: 15,
    rating: 4,
    title: "Ottimo ma costoso",
    comment: "Prodotto Apple sempre al top della qualità. Display bellissimo, fluidità impressionante. Unico neo il prezzo davvero alto.",
    pros: ["Qualità costruttiva", "Display perfetto"],
    cons: ["Prezzo", "Non include caricatore"],
    verifiedPurchase: true,
    helpful: 8,
    createdAt: new Date('2024-10-05')
  },
  {
    productId: 4,
    userId: 5,
    orderId: 3,
    rating: 5,
    title: "Migliori cuffie mai usate",
    comment: "La cancellazione del rumore è impressionante. Perfette per viaggi in aereo e treno. Audio cristallino, comfort eccezionale anche dopo ore di utilizzo.",
    pros: ["Cancellazione rumore top", "Comfort estremo", "Qualità audio"],
    cons: [],
    verifiedPurchase: true,
    helpful: 15,
    createdAt: new Date('2024-09-25')
  },
  {
    productId: 3,
    userId: 5,
    orderId: 3,
    rating: 5,
    title: "Laptop perfetto per sviluppatori",
    comment: "MacBook Air M2 è una bestia. Compilo progetti enormi senza che si surriscaldi. Batteria infinita, silenzioso. Miglior acquisto dell'anno.",
    pros: ["Performance M2", "Batteria eccezionale", "Silenzioso"],
    cons: ["Solo 2 porte USB-C"],
    verifiedPurchase: true,
    helpful: 20,
    createdAt: new Date('2024-09-28')
  },
  {
    productId: 6,
    userId: 10,
    orderId: 8,
    rating: 4,
    title: "Giacca di ottima qualità",
    comment: "Pelle morbida e resistente. Vestibilità perfetta, molto elegante. Unico difetto: il prezzo è abbastanza alto ma vale la spesa.",
    pros: ["Qualità materiali", "Elegante", "Vestibilità"],
    cons: ["Prezzo elevato"],
    verifiedPurchase: true,
    helpful: 6,
    createdAt: new Date('2024-10-02')
  },
  {
    productId: 2,
    userId: 4,
    orderId: 2,
    rating: 4,
    title: "Ottimo smartphone Android",
    comment: "Samsung Galaxy S24 è un ottimo telefono. Display AMOLED fantastico, fotocamera ottima. OneUI è migliorata molto.",
    pros: ["Display AMOLED", "Fotocamera", "Prezzo giusto"],
    cons: ["Batteria nella media"],
    verifiedPurchase: true,
    helpful: 5,
    createdAt: new Date('2024-09-20')
  }
];

// Commenti di esempio
const sampleComments = [
  {
    userId: 26,
    comment: "Concordo pienamente! Anche io ho fatto l'upgrade e non potrei essere più soddisfatto."
  },
  {
    userId: 10,
    comment: "Ottima recensione, molto dettagliata. Mi hai convinto all'acquisto!"
  },
  {
    userId: 7,
    comment: "Anche io le uso per i viaggi, sono incredibili per la cancellazione del rumore."
  }
];

async function seedMongoDB() {
  try {
    console.log('🔌 Connessione a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connesso a MongoDB\n');

    // Pulisci collezioni esistenti
    console.log('🗑️  Pulizia collezioni esistenti...');
    await Review.deleteMany({});
    await ReviewComment.deleteMany({});
    console.log('✅ Collezioni pulite\n');

    // Inserisci recensioni
    console.log('📝 Inserimento recensioni...');
    const insertedReviews = await Review.insertMany(sampleReviews);
    console.log(`✅ ${insertedReviews.length} recensioni inserite\n`);

    // Inserisci commenti (collegati alle prime 3 recensioni)
    if (insertedReviews.length >= 3) {
      console.log('💬 Inserimento commenti...');

      const commentsToInsert = [
        {
          reviewId: insertedReviews[0]._id,
          userId: sampleComments[0].userId,
          comment: sampleComments[0].comment
        },
        {
          reviewId: insertedReviews[1]._id,
          userId: sampleComments[1].userId,
          comment: sampleComments[1].comment
        },
        {
          reviewId: insertedReviews[2]._id,
          userId: sampleComments[2].userId,
          comment: sampleComments[2].comment
        }
      ];

      const insertedComments = await ReviewComment.insertMany(commentsToInsert);
      console.log(`✅ ${insertedComments.length} commenti inseriti\n`);
    }

    // Statistiche finali
    console.log('📊 Riepilogo:');
    const reviewCount = await Review.countDocuments();
    const commentCount = await ReviewComment.countDocuments();

    console.log(`   - Recensioni: ${reviewCount}`);
    console.log(`   - Commenti: ${commentCount}`);
    console.log(`   - Prodotti con recensioni: ${new Set(sampleReviews.map(r => r.productId)).size}`);
    console.log(`   - Media rating prodotto 1: ${(sampleReviews.filter(r => r.productId === 1).reduce((sum, r) => sum + r.rating, 0) / sampleReviews.filter(r => r.productId === 1).length).toFixed(1)}`);

    console.log('\n✨ Seed MongoDB completato con successo!\n');

    // Esempi di query
    console.log('🔍 Esempi di query:');
    console.log('   - Recensioni prodotto 1: db.reviews.find({ productId: 1 })');
    console.log('   - Recensioni 5 stelle: db.reviews.find({ rating: 5 })');
    console.log('   - Search "fotocamera": db.reviews.find({ $text: { $search: "fotocamera" } })');

  } catch (error) {
    console.error('❌ Errore durante il seed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connessione MongoDB chiusa');
    process.exit(0);
  }
}

// Esegui seed
seedMongoDB();
