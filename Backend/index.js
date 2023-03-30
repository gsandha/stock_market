const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const db=require("./configs/db")
const app = express();
app.use(bodyParser.json());
app.use(cors());
// Connect to MongoDB

// Define schemas
const pendingOrderSchema = new mongoose.Schema({
  buyerQty: Number,
  buyerPrice: Number,
  sellerPrice: Number,
  sellerQty: Number,
});
const completedOrderSchema = new mongoose.Schema({
  price: Number,
  qty: Number,
});

// Define models
const PendingOrder = mongoose.model("PendingOrder", pendingOrderSchema);
const CompletedOrder = mongoose.model("CompletedOrder", completedOrderSchema);
// Get all pending orders
app.get("/pendingOrders", async (req, res) => {
  try {
    const pendingOrders = await PendingOrder.find({});
    res.json(pendingOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching pending orders" });
  }
});

// Get all completed orders
app.get("/completedOrders", async (req, res) => {
  try {
    const completedOrders = await CompletedOrder.find({});
    res.json(completedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching completed orders" });
  }
});

// Place a new order
app.post("/placeOrder", async (req, res) => {
  const { buyerQty, buyerPrice, sellerPrice, sellerQty } = req.body;
  /////////////////////////////////////////////////////////////////////////////////
  try {
    // Check if there is a matching order
    const matchingOrder = await PendingOrder.findOne({
      // buyerQty: sellerQty,
      buyerPrice: sellerPrice,
      sellerPrice: buyerPrice,
      // sellerQty: buyerQty
    });
    const fullymatchingOrder = await PendingOrder.findOne({
      buyerQty: sellerQty,
      buyerPrice: sellerPrice,
      sellerPrice: buyerPrice,
      sellerQty: buyerQty,
    });
    if (fullymatchingOrder) {
      const completedOrder = new CompletedOrder({
        price: buyerPrice || sellerPrice,

        qty: Math.max(sellerQty, buyerQty),
      });
      await completedOrder.save();
      console.log(matchingOrder.qty);

      await PendingOrder.deleteOne({ _id: matchingOrder._id });

      // Respond with the completed order
      res.json(completedOrder);
    } else if (matchingOrder) {
      // Create a new completed order
      const completedOrder = new CompletedOrder({
        price: buyerPrice || sellerPrice,
        // qty: sellerQty||buyerQty
        qty: buyerQty || sellerQty,
      });
      await completedOrder.save();

      const pendingOrder = await PendingOrder.findById({
        _id: matchingOrder._id,
      });
      let buyer1 = pendingOrder.buyerQty;
      let seller1 = pendingOrder.sellerQty;
      if (buyer1 !== null) {
        let pending = await PendingOrder.findByIdAndUpdate(
          { _id: matchingOrder._id },
          { buyerQty: buyer1 - sellerQty }
        );
      } else if (seller1 !== null) {
        let pending = await PendingOrder.findByIdAndUpdate(
          { _id: matchingOrder._id },
          { sellerQty: seller1 - buyerQty }
        );
      }

      console.log(buyer1);
    } else {
      // Create a new pending order
      const pendingOrder = new PendingOrder({
        buyerQty,
        buyerPrice,
        sellerPrice,
        sellerQty,
      });
      await pendingOrder.save();

      // Respond with the pending order
      console.log("Order Placed successfully");
      res.json(pendingOrder);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error placing order" });
  }
});

app.listen(3001, async () => {
  try {
    await db;
    console.log("Database is connected");
  } catch (error) {}
  console.log("Server listening on port 3001");
});
