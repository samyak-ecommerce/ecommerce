const Order = require('../models/Order');

// 🌟 NAYA FUNCTION: Order place karne ke liye
exports.addOrderItems = async (req, res) => {
    try {
        // Frontend se aane wala data hum yahan catch karenge
        const { orderItems, shippingAddress, totalPrice, userId } = req.body;

        // Agar cart khali hai toh error de do
        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: "Aapka bag khali hai!" });
        }

        // Database ke liye naya order taiyar karo
        const order = new Order({
            user: userId, // Jis user ne login kiya hai uski ID
            orderItems,
            shippingAddress,
            totalPrice
        });

        // Order ko database mein save kar do
        const createdOrder = await order.save();
        
        res.status(201).json({ 
            message: "Mubarak ho! Order Successfully Placed! 🎉", 
            order: createdOrder 
        });

    } catch (error) {
        console.error("Order Error:", error);
        res.status(500).json({ message: "Order save karne mein dikkat aayi.", error: error.message });
    }
};

// 🌟 NAYA FUNCTION: User ki Order History laane ke liye
exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.params.userId;
        // Database se is user ke saare orders nikal lo, aur naye wale sabse upar dikhao (sort)
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Fetch Orders Error:", error);
        res.status(500).json({ message: "Orders laane mein dikkat aayi." });
    }
};

// 👑 ADMIN FUNCTION 1: Saare users ke orders dekhna
exports.getAllOrders = async (req, res) => {
    try {
        // .populate() se hume user ka naam aur email bhi mil jayega
        const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Fetch All Orders Error:", error);
        res.status(500).json({ message: "Orders laane mein dikkat aayi." });
    }
};

// 👑 ADMIN FUNCTION 2: Order ko 'Delivered' mark karna
exports.updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true; // Status change kar diya
            const updatedOrder = await order.save();
            res.status(200).json({ message: "Order Delivered mark ho gaya! ✅", order: updatedOrder });
        } else {
            res.status(404).json({ message: "Order nahi mila!" });
        }
    } catch (error) {
        console.error("Update Order Error:", error);
        res.status(500).json({ message: "Status update karne mein dikkat aayi." });
    }
};