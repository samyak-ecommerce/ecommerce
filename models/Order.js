const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // 1. Kisne order kiya? (User ka link)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    // 2. Kya kya kharida? (Items ki list)
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            }
        }
    ],
    // 3. Kahan bhejna hai? (Delivery Address)
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        phone: { type: String, required: true }
    },
    // 4. Paise kitne hue?
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    // 5. Order deliver hua ya nahi? (Admin control ke liye)
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);