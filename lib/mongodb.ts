import { MongoClient } from 'mongodb'

const uri = process.env.DATABASE_URL || "mongodb://localhost:27017/kefko-travel"
const client = new MongoClient(uri)

declare global {
  var __mongoClient: MongoClient | undefined
}

export async function getMongoClient() {
  if (!globalThis.__mongoClient) {
    globalThis.__mongoClient = client
    await globalThis.__mongoClient.connect()
  }
  return globalThis.__mongoClient
}

export async function getMongoDB() {
  const mongoClient = await getMongoClient()
  return mongoClient.db('kefko-travel')
}
