const mongoose = require("mongoose");

invoiceSchema = new mongoose.Schema({
    invoiceNumber:String,
    orders : [{
        ref:"Order",
        type:mongoose.Schema.Types.ObjectId
    }],
    totalAmount:Number,
    userId:{
        ref:"User",
        type:mongoose.Schema.Types.ObjectId
    }
})

const Invoice = mongoose.model("Invoice",invoiceSchema);


module.exports = Invoice;
