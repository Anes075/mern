// server.js - Complete working file
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Anes:MongoMongo@cluster0.cqhwtsk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        dbName: "Article",
      }
    );
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Record Schema
const recordSchema = new mongoose.Schema(
  {
    articleNumber: { type: Number, required: true, trim: true },
    articleName: { type: String, required: true, trim: true },
    unit: { type: String, required: true, trim: true },
    packageSize: { type: Number, required:true, trim: true},
    purchasePrice: { type: Number, required: true, trim: true },
    salesPrice: { type: Number, required:true, trim: true}
  },
  { timestamps: true }
);


const Record = mongoose.model("Record", recordSchema);

// Routes
app.get("/health", (req, res) => {
  res.json({
    status: "Server running",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Get all records
app.get("/record", async (req, res) => {
  try {
    const records = await Record.find({});
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

// Get single record
app.get("/record/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const record = await Record.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch record" });
  }
});

// Create record
app.post("/record", async (req, res) => {
  try {
    const { articleNumber, articleName, unit, packageSize, purchasePrice, salesPrice } = req.body;
    const record = new Record({ articleNumber, articleName, unit, packageSize, purchasePrice, salesPrice });
    const savedRecord = await record.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Validation failed", details: error.message });
    }
    res.status(500).json({ error: "Failed to create record" });
  }
});

// Update record
app.patch("/record/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const record = await Record.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ error: "Failed to update record" });
  }
});

// Delete record
app.delete("/record/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const record = await Record.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete record" });
  }
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer().catch(console.error);