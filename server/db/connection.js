import { MongoClient, ServerApiVersion } from "mongodb";

const ATLAS_URI = "mongodb+srv://Anes:MongoMongo@cluster0.cqhwtsk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const uri = process.env.ATLAS_URI || "";
const client = new MongoClient(ATLAS_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  // Connect the client to the server
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log(
   "Pinged your deployment. You successfully connected to MongoDB!"
  );
} catch(err) {
  console.error(err);
}

let db = client.db("employees");

export default db;