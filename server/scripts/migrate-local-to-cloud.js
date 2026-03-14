require("dotenv").config();

const dns = require("node:dns");
const { MongoClient } = require("mongodb");

const LOCAL_URI =
  process.env.LOCAL_MONGODB_URI || "mongodb://127.0.0.1:27017/pay-build";
const CLOUD_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.MONGODB_DB_NAME || "pay-build";

const configuredDnsServers = (process.env.MONGODB_DNS_SERVERS || "8.8.8.8,1.1.1.1")
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);

if (configuredDnsServers.length) {
  dns.setServers(configuredDnsServers);
}

const migrateCollection = async (localDb, cloudDb, collectionName) => {
  const localCollection = localDb.collection(collectionName);
  const cloudCollection = cloudDb.collection(collectionName);
  const documents = await localCollection.find({}).toArray();

  if (!documents.length) {
    return {
      collectionName,
      localCount: 0,
      migratedCount: 0,
    };
  }

  const operations = documents.map((document) => ({
    replaceOne: {
      filter: { _id: document._id },
      replacement: document,
      upsert: true,
    },
  }));

  await cloudCollection.bulkWrite(operations, { ordered: false });

  return {
    collectionName,
    localCount: documents.length,
    migratedCount: operations.length,
  };
};

const run = async () => {
  if (!CLOUD_URI) {
    throw new Error("MONGODB_URI is missing from the environment");
  }

  const localClient = new MongoClient(LOCAL_URI);
  const cloudClient = new MongoClient(CLOUD_URI);

  try {
    await localClient.connect();
    await cloudClient.connect();

    const localDb = localClient.db(DATABASE_NAME);
    const cloudDb = cloudClient.db(DATABASE_NAME);
    const collections = await localDb.listCollections().toArray();

    const results = [];

    for (const collection of collections) {
      results.push(await migrateCollection(localDb, cloudDb, collection.name));
    }

    console.log("Migration completed.");
    console.table(results);
  } finally {
    await Promise.allSettled([localClient.close(), cloudClient.close()]);
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
