import "server-only";

import { MongoClient, type Db } from "mongodb";
import { env } from "@/lib/env";

declare global {
  // eslint-disable-next-line no-var
  var __cmgMongoClientPromise: Promise<MongoClient> | undefined;
}

const clientPromise =
  globalThis.__cmgMongoClientPromise ??
  new MongoClient(env.mongodbUri, {
    maxPoolSize: 10,
    retryReads: true,
    retryWrites: true
  }).connect();

if (process.env.NODE_ENV !== "production") {
  globalThis.__cmgMongoClientPromise = clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(env.mongodbDb);
}

export async function ensureIndexes() {
  const db = await getDb();

  await Promise.all([
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
    db.collection("products").createIndex({ slug: 1 }, { unique: true }),
    db.collection("products").createIndex({ name: "text", description: "text", tags: "text" }),
    db.collection("collections").createIndex({ slug: 1 }, { unique: true }),
    db.collection("orders").createIndex({ userId: 1, createdAt: -1 }),
    db.collection("orders").createIndex({ orderNumber: 1 }, { unique: true })
  ]);
}
