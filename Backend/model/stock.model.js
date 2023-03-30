const {model,Schema}=require("mongoose")
// Define schemas
const mongoose=require("mongoose")
const pendingOrderSchema = new Schema({
    buyerQty: Number,
    buyerPrice: Number,
    sellerPrice: Number,
    sellerQty: Number,
  });
  const completedOrderSchema = new Schema({
    price: Number,
    qty: Number,
  });
  
  // Define models
  const PendingOrder = mongoose.model("PendingOrder", pendingOrderSchema);
  const CompletedOrder = mongoose.model("CompletedOrder", completedOrderSchema);

  module.exports={PendingOrder,CompletedOrder}