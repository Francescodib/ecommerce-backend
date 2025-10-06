/**
 * Seed Data MongoDB - ShopSphere
 * Script per popolare MongoDB con dati di esempio
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '../../../.env' });

// Import models
const Review = require('../models/mongodb/Review');
const ReviewComment = require('../models/mongodb/ReviewComment');
const ActivityLog = require('../models/mongodb/ActivityLog');

// MongoDB connection string (senza autenticazione per sviluppo locale)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopsphere';

// Funzione per generare date casuali negli ultimi 30 giorni
const randomDate = (daysAgo = 30) => {
  const now = new Date();
  const past = new Date(now.getTime() - (Math.random() * daysAgo * 24 * 60 * 60 * 1000));
  return past;
};

// =======================
// REVIEWS DATA (30 recensioni)
// =======================
const reviewsData = [
  // Recensioni iPhone 15 Pro (product_id: 1)
  {
    productId: 1,
    userId: 3,
    orderId: 1,
    rating: 5,
    title: 'Fantastico! Migliore iPhone mai avuto',
    comment: 'Sono passato dal 13 Pro e la differenza si sente. Il chip A17 Pro è velocissimo, le foto sono spettacolari anche di notte. La batteria dura tutto il giorno senza problemi. Consigliatissimo!',
    pros: ['Fotocamera eccezionale', 'Performance top', 'Batteria ottima'],
    cons: ['Prezzo alto'],
    verifiedPurchase: true,
    helpful: 12,
    createdAt: randomDate(10)
  },
  {
    productId: 1,
    userId: 15,
    orderId: 15,
    rating: 4,
    title: 'Ottimo ma costoso',
    comment: 'Prodotto Apple sempre al top della qualità. Display bellissimo, fluidità impressionante. Unico neo il prezzo davvero alto.',
    pros: ['Qualità costruttiva', 'Display perfetto'],
    cons: ['Prezzo', 'Non include caricatore'],
    verifiedPurchase: true,
    helpful: 8,
    createdAt: randomDate(5)
  },

  // Recensioni Samsung Galaxy S24 (product_id: 2)
  {
    productId: 2,
    userId: 4,
    orderId: 2,
    rating: 5,
    title: 'Miglior Android del momento',
    comment: 'Display AMOLED fantastico, fotocamera versatile e Android 14 fluidissimo. Batteria che dura due giorni con uso normale. Molto soddisfatto!',
    pros: ['Display eccellente', 'Autonomia ottima', 'Software pulito'],
    cons: ['Scalda un po\' sotto stress'],
    verifiedPurchase: true,
    helpful: 15,
    createdAt: randomDate(12)
  },
  {
    productId: 2,
    userId: 10,
    rating: 4,
    title: 'Ottima alternativa ad iPhone',
    comment: 'Per chi non vuole iOS è la scelta migliore. Ottimo rapporto qualità/prezzo, veloce e affidabile.',
    pros: ['Rapporto qualità/prezzo', 'Ricarica veloce'],
    cons: ['Bloatware Samsung'],
    verifiedPurchase: false,
    helpful: 5,
    createdAt: randomDate(20)
  },

  // Recensioni MacBook Air M2 (product_id: 3)
  {
    productId: 3,
    userId: 5,
    orderId: 3,
    rating: 5,
    title: 'Perfetto per lavoro e studio',
    comment: 'Uso il MacBook per programmazione e video editing leggero. Silenzioso, veloce, batteria infinita. Non scalda mai. Il migliore laptop che abbia mai avuto.',
    pros: ['Silenzioso (fanless)', 'Batteria eccezionale', 'Display Liquid Retina'],
    cons: ['Solo 2 porte USB-C'],
    verifiedPurchase: true,
    helpful: 25,
    createdAt: randomDate(15)
  },
  {
    productId: 3,
    userId: 11,
    orderId: 9,
    rating: 5,
    title: 'La perfezione fatta laptop',
    comment: 'Leggero, potente, silenzioso. Lo porto sempre con me, dura tutto il giorno senza ricarica. Il chip M2 è una meraviglia.',
    pros: ['Leggerissimo', 'Prestazioni', 'Design'],
    cons: ['Prezzo'],
    verifiedPurchase: true,
    helpful: 18,
    createdAt: randomDate(8)
  },

  // Recensioni Sony WH-1000XM5 (product_id: 4)
  {
    productId: 4,
    userId: 5,
    orderId: 3,
    rating: 5,
    title: 'Migliori cuffie wireless in assoluto',
    comment: 'Cancellazione del rumore pazzesca, qualità audio premium, comodità estrema. Le uso per viaggi e lavoro. Non tornerei mai indietro.',
    pros: ['ANC eccellente', 'Audio di qualità', 'Comfort'],
    cons: ['Non pieghevoli', 'Custodia ingombrante'],
    verifiedPurchase: true,
    helpful: 30,
    createdAt: randomDate(15)
  },
  {
    productId: 4,
    userId: 12,
    orderId: 12,
    rating: 4,
    title: 'Ottime ma care',
    comment: 'Qualità Sony come sempre al top. ANC fantastico in treno e aereo. Un po\' care ma ne valgono la pena.',
    pros: ['Cancellazione rumore', 'Durata batteria'],
    cons: ['Prezzo alto'],
    verifiedPurchase: true,
    helpful: 10,
    createdAt: randomDate(3)
  },
  {
    productId: 4,
    userId: 11,
    orderId: 9,
    rating: 5,
    title: 'Le migliori per l\'ufficio',
    comment: 'Lavoro in open space e queste cuffie mi salvano la vita. Silenzio totale, musica perfetta. Consigliatissime.',
    pros: ['ANC top', 'Comode per ore'],
    cons: ['Un po\' pesanti'],
    verifiedPurchase: true,
    helpful: 7,
    createdAt: randomDate(8)
  },

  // Recensioni iPad Air (product_id: 5)
  {
    productId: 5,
    userId: 8,
    orderId: 6,
    rating: 5,
    title: 'Perfetto per creativi',
    comment: 'Lo uso con Apple Pencil per disegno digitale. Display fantastico, zero lag, app professionali. Sostituisce quasi il laptop.',
    pros: ['Display eccellente', 'Potenza chip M1', 'Versatile'],
    cons: ['Accessori costosi'],
    verifiedPurchase: true,
    helpful: 14,
    createdAt: randomDate(7)
  },

  // Recensioni Giacca Pelle (product_id: 6)
  {
    productId: 6,
    userId: 7,
    orderId: 5,
    rating: 4,
    title: 'Bella giacca, qualità buona',
    comment: 'Pelle di buona qualità, vestibilità perfetta. Stile biker molto bello. Unica pecca: odore di pelle nuovo molto forte.',
    pros: ['Stile', 'Vestibilità'],
    cons: ['Odore iniziale forte'],
    verifiedPurchase: true,
    helpful: 5,
    createdAt: randomDate(18)
  },
  {
    productId: 6,
    userId: 14,
    orderId: 14,
    rating: 5,
    title: 'Qualità/prezzo ottimo',
    comment: 'Per il prezzo è un affare. Pelle vera, cuciture precise, tasche funzionali. Molto soddisfatto.',
    pros: ['Rapporto qualità/prezzo', 'Stile'],
    cons: ['Un po\' rigida all\'inizio'],
    verifiedPurchase: true,
    helpful: 9,
    createdAt: randomDate(2)
  },

  // Recensioni Jeans (product_id: 7)
  {
    productId: 7,
    userId: 4,
    rating: 5,
    title: 'Comodi e belli',
    comment: 'Tessuto elasticizzato molto comodo, vestono perfettamente. Li ho presi in 3 colori!',
    pros: ['Comfort', 'Vestibilità'],
    cons: [],
    verifiedPurchase: false,
    helpful: 3,
    createdAt: randomDate(25)
  },
  {
    productId: 7,
    userId: 13,
    orderId: 13,
    rating: 4,
    title: 'Belli ma attenzione taglia',
    comment: 'Jeans carini e confortevoli ma vestono un po\' abbondanti. Prendere una taglia in meno.',
    pros: ['Comfort', 'Qualità tessuto'],
    cons: ['Taglie abbondanti'],
    verifiedPurchase: true,
    helpful: 12,
    createdAt: randomDate(1)
  },

  // Recensioni T-Shirt (product_id: 8)
  {
    productId: 8,
    userId: 9,
    orderId: 7,
    rating: 5,
    title: 'Perfette come base',
    comment: 'Cotone di qualità, resistono bene ai lavaggi. Prezzo ottimo per 3 pezzi. Super basiche.',
    pros: ['Prezzo', 'Qualità cotone'],
    cons: ['Nessuno'],
    verifiedPurchase: true,
    helpful: 6,
    createdAt: randomDate(6)
  },

  // Recensioni Sneakers (product_id: 9)
  {
    productId: 9,
    userId: 6,
    orderId: 4,
    rating: 4,
    title: 'Comode per running',
    comment: 'Ammortizzazione buona, leggere. Le uso per correre 3 volte a settimana. Un po\' strette in punta.',
    pros: ['Leggere', 'Ammortizzate'],
    cons: ['Stringono in punta'],
    verifiedPurchase: true,
    helpful: 8,
    createdAt: randomDate(22)
  },

  // Recensioni Cappotto (product_id: 10)
  {
    productId: 10,
    userId: 8,
    orderId: 8,
    rating: 5,
    title: 'Elegante e caldo',
    comment: 'Lana di ottima qualità, tiene caldo senza essere pesante. Taglio elegante, perfetto per ufficio.',
    pros: ['Qualità lana', 'Elegante', 'Caldo'],
    cons: ['Richiede lavaggio a secco'],
    verifiedPurchase: true,
    helpful: 11,
    createdAt: randomDate(11)
  },
  {
    productId: 10,
    userId: 12,
    orderId: 10,
    rating: 4,
    title: 'Bello ma un po\' caro',
    comment: 'Cappotto molto bello e di qualità. Forse un po\' caro ma ne vale la pena.',
    pros: ['Qualità', 'Stile'],
    cons: ['Prezzo'],
    verifiedPurchase: true,
    helpful: 4,
    createdAt: randomDate(4)
  },

  // Recensioni Robot Aspirapolvere (product_id: 11)
  {
    productId: 11,
    userId: 7,
    orderId: 5,
    rating: 5,
    title: 'Rivoluzionario!',
    comment: 'Non più senza! Pulisce benissimo, mappa la casa, evita ostacoli. App fantastica. Consiglio a tutti.',
    pros: ['Pulizia efficace', 'Mappatura laser', 'App intuitiva'],
    cons: ['Rumoroso in modalità max'],
    verifiedPurchase: true,
    helpful: 22,
    createdAt: randomDate(18)
  },

  // Recensioni Set Pentole (product_id: 12)
  {
    productId: 12,
    userId: 16,
    rating: 4,
    title: 'Buon set per iniziare',
    comment: 'Antiaderenza buona, facili da pulire. Per il prezzo un ottimo set completo.',
    pros: ['Completo', 'Antiaderenza', 'Prezzo'],
    cons: ['Manici scaldano un po\''],
    verifiedPurchase: false,
    helpful: 7,
    createdAt: randomDate(14)
  },

  // Recensioni Macchina Caffè (product_id: 13)
  {
    productId: 13,
    userId: 17,
    rating: 5,
    title: 'Caffè da bar a casa',
    comment: 'Caffè cremoso e buonissimo. Semplice da usare e pulire. Ne vale ogni centesimo.',
    pros: ['Qualità caffè', 'Facile da usare'],
    cons: ['Un po\' ingombrante'],
    verifiedPurchase: false,
    helpful: 16,
    createdAt: randomDate(9)
  },

  // Recensioni Frullatore (product_id: 14)
  {
    productId: 14,
    userId: 18,
    rating: 4,
    title: 'Potente e versatile',
    comment: 'Frulla di tutto, dagli smoothie alle zuppe. Potente e con tanti accessori utili.',
    pros: ['Potenza', 'Accessori inclusi'],
    cons: ['Cavo corto'],
    verifiedPurchase: false,
    helpful: 5,
    createdAt: randomDate(16)
  },

  // Recensioni Asciugamani (product_id: 15)
  {
    productId: 15,
    userId: 19,
    rating: 5,
    title: 'Morbidissimi!',
    comment: 'Cotone egiziano di qualità, assorbono benissimo e sono super morbidi. Ottimo acquisto.',
    pros: ['Morbidezza', 'Assorbenza', 'Qualità'],
    cons: [],
    verifiedPurchase: false,
    helpful: 9,
    createdAt: randomDate(13)
  },

  // Recensioni Clean Code (product_id: 16)
  {
    productId: 16,
    userId: 20,
    rating: 5,
    title: 'Must-have per sviluppatori',
    comment: 'Libro fondamentale per ogni programmatore. Principi chiari, esempi pratici. Migliora immediatamente il tuo codice.',
    pros: ['Contenuti chiari', 'Esempi pratici'],
    cons: ['In inglese'],
    verifiedPurchase: false,
    helpful: 28,
    createdAt: randomDate(30)
  },

  // Recensioni Harry Potter (product_id: 19)
  {
    productId: 19,
    userId: 21,
    rating: 5,
    title: 'Cofanetto meraviglioso',
    comment: 'Tutti e 7 i libri in un elegante cofanetto. Edizione curata, pagine di qualità. Regalo perfetto!',
    pros: ['Completo', 'Qualità editoriale', 'Cofanetto elegante'],
    cons: ['Un po\' pesante'],
    verifiedPurchase: false,
    helpful: 13,
    createdAt: randomDate(19)
  },

  // Recensioni Tapis Roulant (product_id: 21)
  {
    productId: 21,
    userId: 22,
    rating: 4,
    title: 'Buon tapis roulant per casa',
    comment: 'Stabile, silenzioso, pieghevole. Perfetto per casa. Display semplice ma funzionale.',
    pros: ['Pieghevole', 'Silenzioso', 'Stabile'],
    cons: ['Display basic'],
    verifiedPurchase: false,
    helpful: 11,
    createdAt: randomDate(21)
  },

  // Recensioni Mountain Bike (product_id: 24)
  {
    productId: 24,
    userId: 13,
    orderId: 11,
    rating: 5,
    title: 'MTB fantastica!',
    comment: 'Usata su sentieri sterrati e ha performato benissimo. Sospensioni ottime, cambio preciso. Rapporto qualità/prezzo incredibile.',
    pros: ['Sospensioni', 'Rapporto qualità/prezzo', 'Cambio preciso'],
    cons: ['Sella un po\' dura'],
    verifiedPurchase: true,
    helpful: 17,
    createdAt: randomDate(5)
  },

  // Recensioni LEGO Millennium Falcon (product_id: 26)
  {
    productId: 26,
    userId: 23,
    rating: 5,
    title: 'Il sogno di ogni fan di Star Wars',
    comment: 'Set LEGO incredibile! 7500 pezzi, dettagli pazz eschi. Ci ho messo 3 settimane a completarlo. Un capolavoro.',
    pros: ['Dettagli straordinari', 'Esperienza di build', 'Esposto fa la sua figura'],
    cons: ['Prezzo', 'Serve molto spazio'],
    verifiedPurchase: false,
    helpful: 25,
    createdAt: randomDate(28)
  },

  // Recensioni Nintendo Switch OLED (product_id: 28)
  {
    productId: 28,
    userId: 24,
    rating: 5,
    title: 'Display OLED fa la differenza',
    comment: 'Passato dalla Switch normale alla OLED: il display è tutta un\'altra cosa. Colori vividi, neri perfetti. Gaming portatile al top.',
    pros: ['Display OLED', 'Versatilità', 'Libreria giochi'],
    cons: ['Prezzo giochi first-party'],
    verifiedPurchase: false,
    helpful: 19,
    createdAt: randomDate(12)
  }
];

// =======================
// COMMENTS DATA (20 commenti)
// =======================
// Questi verranno popolati dopo aver creato le review
let commentsData = [];

// =======================
// ACTIVITY LOGS DATA (100 log)
// =======================
const activityLogsData = [];

// Genera 100 log di attività varia
const actions = ['view_product', 'add_to_cart', 'add_to_wishlist', 'search', 'view_category', 'login'];
const entityTypes = ['product', 'category', 'other'];

for (let i = 0; i < 100; i++) {
  const userId = Math.floor(Math.random() * 30) + 1; // Random user 1-30
  const action = actions[Math.floor(Math.random() * actions.length)];
  const entityType = action === 'view_product' ? 'product' :
                     action === 'view_category' ? 'category' : 'other';
  const entityId = entityType === 'product' ? Math.floor(Math.random() * 30) + 1 :
                   entityType === 'category' ? Math.floor(Math.random() * 6) + 1 : null;

  activityLogsData.push({
    userId,
    action,
    entityType,
    entityId,
    metadata: {
      timestamp: randomDate(30),
      ...( action === 'search' && { searchTerm: ['laptop', 'smartphone', 'scarpe', 'libri'][Math.floor(Math.random() * 4)] })
    },
    ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: randomDate(30)
  });
}

// =======================
// SEED FUNCTION
// =======================
async function seedMongoDB() {
  try {
    console.log('🔌 Connessione a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connesso a MongoDB\n');

    // Pulisci collezioni esistenti
    console.log('🗑️  Pulizia collezioni esistenti...');
    await Review.deleteMany({});
    await ReviewComment.deleteMany({});
    await ActivityLog.deleteMany({});
    console.log('✅ Collezioni pulite\n');

    // Inserisci Reviews
    console.log('📝 Inserimento Reviews...');
    const reviews = await Review.insertMany(reviewsData);
    console.log(`✅ ${reviews.length} recensioni inserite\n`);

    // Crea commenti per alcune review
    console.log('💬 Inserimento Comments...');
    const sampleReviews = reviews.slice(0, 10); // Commenta solo prime 10 review

    sampleReviews.forEach((review, idx) => {
      // 1-2 commenti per review
      const numComments = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < numComments; i++) {
        commentsData.push({
          reviewId: review._id,
          userId: Math.floor(Math.random() * 30) + 1,
          comment: [
            'Grazie per la recensione dettagliata!',
            'Concordo pienamente!',
            'Anche io ho avuto la stessa esperienza',
            'Ottimi suggerimenti, grazie',
            'Recensione molto utile'
          ][Math.floor(Math.random() * 5)],
          createdAt: new Date(review.createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      }
    });

    const comments = await ReviewComment.insertMany(commentsData);
    console.log(`✅ ${comments.length} commenti inseriti\n`);

    // Inserisci Activity Logs
    console.log('📊 Inserimento Activity Logs...');
    const logs = await ActivityLog.insertMany(activityLogsData);
    console.log(`✅ ${logs.length} activity log inseriti\n`);

    // Verifica finale
    console.log('📈 Riepilogo finale:');
    const reviewCount = await Review.countDocuments();
    const commentCount = await ReviewComment.countDocuments();
    const logCount = await ActivityLog.countDocuments();

    console.log(`   - Reviews: ${reviewCount}`);
    console.log(`   - Comments: ${commentCount}`);
    console.log(`   - Activity Logs: ${logCount}`);
    console.log('\n✅ Seed MongoDB completato con successo!\n');

  } catch (error) {
    console.error('❌ Errore durante il seed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connessione MongoDB chiusa');
  }
}

// Esegui seed
seedMongoDB();
