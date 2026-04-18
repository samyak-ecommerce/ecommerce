const Product = require('../models/Product');

// Saare products dekhne ka function
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Naya product add karne ka function
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category, countInStock } = req.body;
        
        const product = await Product.create({
            name,
            description,
            price,
            image,
            category,
            countInStock
        });

        res.status(201).json({ message: "Product successfully add ho gaya!", product });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ⭐ NAYA FUNCTION: Product Update (Edit) karne ke liye ⭐
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (product) {
            // Naya price aur stock update karo
            product.price = req.body.price || product.price;
            product.countInStock = req.body.countInStock || product.countInStock;
            
            // Database mein save kar do
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product nahi mila!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Update karne mein error aaya", error: error.message });
    }
};


// 🌟 NAYA FUNCTION: Ek click mein Database mein dummy products bharne ke liye
exports.seedProducts = async (req, res) => {
    try {
        // Pehle purane saare products delete kar do (taaki duplicate na ho)
        await Product.deleteMany();

        // 6 Premium ShopX Products
        const sampleProducts = [
            {
                name: "Premium Oversized T-Shirt",
                description: "Drop shoulder oversized t-shirt in pure cotton. Perfect for streetwear.",
                price: 1200,
                image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                category: "Clothing",
                countInStock: 50
            },
            {
                name: "Vintage Washed Hoodie",
                description: "Heavyweight hoodie with a vintage wash finish and relaxed fit.",
                price: 2499,
                image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                category: "Clothing",
                countInStock: 30
            },
            {
                name: "Chunky Street Sneakers",
                description: "High-top chunky sneakers with extra grip and aesthetic design.",
                price: 3499,
                image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                category: "Footwear",
                countInStock: 20
            },
            {
                name: "Cargo Parachute Pants",
                description: "Baggy parachute pants with multiple utility pockets.",
                price: 1899,
                image: "https://images.unsplash.com/photo-1624378439575-d1ead6cb2461?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                category: "Clothing",
                countInStock: 40
            },
            {
                name: "Classic Baseball Cap",
                description: "Minimalist embroidered baseball cap with adjustable strap.",
                price: 599,
                image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                category: "Accessories",
                countInStock: 100
            },
            {
                name: "Leather Moto Jacket",
                description: "Classic faux-leather biker jacket with silver hardware.",
                price: 4999,
                image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                category: "Clothing",
                countInStock: 15
            }
        ];

        // Database mein ek sath sab daal do
        await Product.insertMany(sampleProducts);

        res.status(200).json({ message: "Mubarak ho! 6 Premium Products database mein add ho gaye! 🎉" });
    } catch (error) {
        console.error("Seed Error:", error);
        res.status(500).json({ message: "Seed fail ho gaya", error: error.message });
    }
};