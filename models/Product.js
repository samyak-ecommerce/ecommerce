const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // Yahan hum photo ki link save karenge
    category: { type: String, required: true },
    countInStock: { type: Number, required: true, default: 0 } // Kitne items bache hain
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);