const { MongoClient } = require('mongodb');

// Connection URL
// const url = process.env.DATABASE_URL_STAGING;
const url = "mongodb+srv://riseupdev:AkRLlH1prrBJqlei@cluster0.uxfto.mongodb.net"
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Database and collection
// const dbName = 'cultivate';
const dbName = 'afbc-dev-testing'

async function updateUserPayments() {
  try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const userPayments = db.collection('UserPayment');

    // Update all documents where kycAMLChecks.northCapital.success is not true
    const updateResult = await userPayments.updateMany(
      { 'kycAMLChecks.northCapital.success': { $ne: true } },
      {
        $set: {
          'kycAMLChecks.northCapital': {
            statusCode: "101",
            statusDesc: "Ok",
            kyc: {
              response: {
                "id-number": "5657473678",
                "summary-result": {
                  key: "id.success",
                  message: "PASS"
                },
                results: {
                  key: "result.match",
                  message: "ID Located"
                },
                qualifiers: {
                  qualifier: {
                    key: "resultcode.newer.record.found",
                    message: "Newer Record Found"
                  }
                },
                idnotescore: "0"
              },
              kycstatus: "Auto Approved",
              amlstatus: "Auto Approved"
            }
          }
        }
      }
    );

    console.log('Matched documents:', updateResult.matchedCount);
    console.log('Modified documents:', updateResult.modifiedCount);

  } finally {
    await client.close();
  }
}

module.exports = {
  updateUserPayments,
}

// If you want to run this script directly, uncomment the following lines:
// updateUserPayments().catch(console.error);