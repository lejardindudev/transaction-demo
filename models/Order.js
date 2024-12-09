const mongoose = require("mongoose");

orderSchema = new mongoose.Schema({
    orderNumber : String,
    amount : Number,
    userId:{
        ref:"User",
        type : mongoose.Schema.Types.ObjectId,
    }

})
const Order = mongoose.model("Order",orderSchema);

module.exports = Order;



