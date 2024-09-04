const { MongoClient } = require('mongodb');

// Connection URL
// const url = process.env.DATABASE_URL_STAGING;
const url = "mongodb+srv://riseupdev:AkRLlH1prrBJqlei@cluster0.uxfto.mongodb.net"
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Database and collection
// const dbName = 'cultivate';
const dbName = 'afbc-dev-testing'

async function updateDocuments(tradeIds) {
  try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const investments = db.collection('Investment');

    // Update all documents where .isArchived does not exist or is null
    const updateResult = await investments.updateMany(
      { tradeId: { $in: tradeIds } },
      { $set: { isClearedForDisbursement: true } }
    );

    console.log('Investment modified documents:', updateResult.matchedCount);
    console.log('Investment modified documents:', updateResult.modifiedCount);

    const transactions = db.collection('Transaction');

    // Update all documents where .isArchived does not exist or is null
    const updateTxResult = await transactions.updateMany(
      { tradeId: { $in: tradeIds } },
      { $set: { fundStatus: "Settled", status: "FUNDED" } }
    );

    console.log('Transaction modified documents:', updateTxResult.matchedCount);
    console.log('Transaction modified documents:', updateTxResult.modifiedCount);

    
  } finally {
    await client.close();
  }
}

module.exports = {
  updateDocuments,
}