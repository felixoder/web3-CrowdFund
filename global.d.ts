// global.d.ts
interface Window {
    ethereum?: any;
  }
  
  declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
  }