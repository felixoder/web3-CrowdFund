// lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || ""; // Ensure this is set in .env
const options = {};

// Use a module-scoped variable to store the MongoClient promise
let clientPromise: Promise<MongoClient>;

// Check if we are in development mode
if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to the environment variables.");
}

// Create a single instance of the MongoClient
const client = new MongoClient(uri, options);
clientPromise = client.connect();

// Export the promise to be used in your API routes or application
export default clientPromise;
