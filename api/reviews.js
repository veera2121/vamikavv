import { MongoClient } from "mongodb";

const uri = "mongodb+srv://vamika:vamika12@cluster0reviewsdb.dowupq4.mongodb.net/";
const client = new MongoClient(uri);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db("reviewsDB");
    const collection = db.collection("reviews");

    if (req.method === "POST") {
      const { name, review } = req.body;
      await collection.insertOne({ name, review, date: new Date() });
      return res.status(200).json({ message: "Review Saved ✅" });
    }

    if (req.method === "GET") {
      const reviews = await collection.find({}).toArray();
      return res.status(200).json(reviews);
    }

    res.status(405).json({ message: "Method not allowed ❌" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  } 

}
