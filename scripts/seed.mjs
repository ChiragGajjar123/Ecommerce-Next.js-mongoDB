import { MongoClient } from "mongodb";
import { hash } from "bcryptjs";

const uri = process.env.MONGODB_URI ?? "mongodb://localhost:27017/";
const dbName = process.env.MONGODB_DB ?? "cmg_ecommerce";

const now = new Date();

const collections = [
  {
    title: "Travel Ready",
    slug: "travel-ready",
    description: "Functional essentials for commuting, weekend plans, and quick getaways.",
    imageUrl: "/products/carryall.svg",
    featured: true
  },
  {
    title: "Everyday Style",
    slug: "everyday-style",
    description: "Comfortable pieces and accessories made for repeated daily use.",
    imageUrl: "/products/sneaker.svg",
    featured: true
  },
  {
    title: "Home Edit",
    slug: "home-edit",
    description: "Thoughtful home goods for cleaner desks, calmer dining, and better routines.",
    imageUrl: "/products/desk-set.svg",
    featured: true
  }
];

const productSeeds = [
  {
    name: "Heritage Carryall",
    slug: "heritage-carryall",
    description: "A structured carryall with reinforced handles, practical internal pockets, and a polished finish for travel days.",
    priceCents: 749900,
    compareAtCents: 899900,
    stock: 18,
    images: ["/products/carryall.svg"],
    collections: ["travel-ready"],
    tags: ["bag", "travel", "leather"],
    featured: true,
    status: "active"
  },
  {
    name: "Tailored Transit Jacket",
    slug: "tailored-transit-jacket",
    description: "A lightweight jacket with clean lines, weather-aware fabric, and enough pockets to keep essentials close.",
    priceCents: 629900,
    compareAtCents: 699900,
    stock: 22,
    images: ["/products/jacket.svg"],
    collections: ["travel-ready", "everyday-style"],
    tags: ["jacket", "travel", "outerwear"],
    featured: true,
    status: "active"
  },
  {
    name: "Minimal Gold Watch",
    slug: "minimal-gold-watch",
    description: "A balanced analog watch with a minimal face, polished gold-tone case, and adjustable strap.",
    priceCents: 389900,
    compareAtCents: 449900,
    stock: 34,
    images: ["/products/watch.svg"],
    collections: ["everyday-style"],
    tags: ["watch", "accessory", "gold"],
    featured: true,
    status: "active"
  },
  {
    name: "Modular Desk Set",
    slug: "modular-desk-set",
    description: "A tidy organizer set with divided storage, soft-touch trays, and a compact footprint for daily work.",
    priceCents: 219900,
    stock: 40,
    images: ["/products/desk-set.svg"],
    collections: ["home-edit"],
    tags: ["desk", "organizer", "home"],
    featured: true,
    status: "active"
  },
  {
    name: "Everyday White Sneaker",
    slug: "everyday-white-sneaker",
    description: "A clean, cushioned sneaker with durable stitching and a flexible sole for long days on foot.",
    priceCents: 489900,
    compareAtCents: 549900,
    stock: 28,
    images: ["/products/sneaker.svg"],
    collections: ["everyday-style", "travel-ready"],
    tags: ["sneaker", "footwear", "travel"],
    featured: true,
    status: "active"
  },
  {
    name: "Ceramic Dining Set",
    slug: "ceramic-dining-set",
    description: "A ceramic set with plates and cups in soft neutrals, designed for everyday meals and easy stacking.",
    priceCents: 329900,
    stock: 16,
    images: ["/products/ceramic-set.svg"],
    collections: ["home-edit"],
    tags: ["ceramic", "dining", "home"],
    featured: false,
    status: "active"
  }
];

async function ensureIndexes(db) {
  await Promise.all([
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
    db.collection("products").createIndex({ slug: 1 }, { unique: true }),
    db.collection("products").createIndex({ name: "text", description: "text", tags: "text" }),
    db.collection("collections").createIndex({ slug: 1 }, { unique: true }),
    db.collection("orders").createIndex({ userId: 1, createdAt: -1 }),
    db.collection("orders").createIndex({ orderNumber: 1 }, { unique: true })
  ]);
}

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  await ensureIndexes(db);

  const collectionIds = new Map();
  for (const collection of collections) {
    const result = await db.collection("collections").findOneAndUpdate(
      { slug: collection.slug },
      {
        $set: { ...collection, updatedAt: now },
        $setOnInsert: { createdAt: now }
      },
      { upsert: true, returnDocument: "after" }
    );
    collectionIds.set(collection.slug, result._id);
  }

  for (const product of productSeeds) {
    const { collections: productCollections, ...rest } = product;
    await db.collection("products").updateOne(
      { slug: product.slug },
      {
        $set: {
          ...rest,
          collectionIds: productCollections.map((slug) => collectionIds.get(slug)).filter(Boolean),
          updatedAt: now
        },
        $setOnInsert: { createdAt: now }
      },
      { upsert: true }
    );
  }

  const adminPasswordHash = await hash("Admin@12345", 12);
  const customerPasswordHash = await hash("Customer@12345", 12);

  await db.collection("users").updateOne(
    { email: "admin@cmg.local" },
    {
      $set: {
        name: "CMG Admin",
        email: "admin@cmg.local",
        passwordHash: adminPasswordHash,
        role: "admin",
        addresses: [],
        disabled: false,
        updatedAt: now
      },
      $setOnInsert: { createdAt: now }
    },
    { upsert: true }
  );

  await db.collection("users").updateOne(
    { email: "customer@cmg.local" },
    {
      $set: {
        name: "CMG Customer",
        email: "customer@cmg.local",
        passwordHash: customerPasswordHash,
        role: "customer",
        addresses: [
          {
            id: "demo-address",
            label: "Home",
            name: "CMG Customer",
            phone: "+91 9876543210",
            line1: "C G Road",
            line2: "Navrangpura",
            city: "Ahmedabad",
            state: "Gujarat",
            postalCode: "380009",
            country: "India",
            latitude: 23.033863,
            longitude: 72.585022
          }
        ],
        disabled: false,
        updatedAt: now
      },
      $setOnInsert: { createdAt: now }
    },
    { upsert: true }
  );

  await client.close();
  console.log(`Seeded ${dbName}`);
  console.log("Admin: admin@cmg.local / Admin@12345");
  console.log("Customer: customer@cmg.local / Customer@12345");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
