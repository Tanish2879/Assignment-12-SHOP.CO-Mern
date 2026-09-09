const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");

const userModel = require("./models/userModel");
const categoryModel = require("./models/categoryModel");
const productModel = require("./models/poductModel");

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB.");

    // 1. Seed Categories
    console.log("Seeding Categories...");
    await categoryModel.deleteMany({});

    const categoriesData = [
      { name: "T-shirts", slug: "t-shirts" },
      { name: "Shorts", slug: "shorts" },
      { name: "Shirts", slug: "shirts" },
      { name: "Hoodie", slug: "hoodie" },
      { name: "Jeans", slug: "jeans" }
    ];

    const createdCategories = await categoryModel.insertMany(categoriesData);
    console.log(`Created ${createdCategories.length} categories.`);

    const getCatId = (name) => {
      const cat = createdCategories.find((c) => c.name.toLowerCase() === name.toLowerCase());
      return cat ? cat._id : createdCategories[0]._id;
    };

    // 2. Seed Users
    console.log("Seeding Users (Admin & Customer)...");
    await userModel.deleteMany({});

    const hashedAdminPassword = await bcrypt.hash("admin123", 10);
    const hashedCustomerPassword = await bcrypt.hash("user123", 10);

    const usersData = [
      {
        name: "Admin User",
        email: "admin@shop.co",
        password: hashedAdminPassword,
        phone: "+91 9898989898",
        address: "SHOP.CO Headquarters, San Francisco, CA",
        answer: "Cricket",
        role: 1
      },
      {
        name: " User Customer",
        email: "user@shop.co",
        password: hashedCustomerPassword,
        phone: "+91 9898988776",
        address: "123 Fashion Street, New York, NY",
        answer: "Football",
        role: 0
      }
    ];

    await userModel.insertMany(usersData);
    console.log("Created Admin (admin@shop.co) and Customer (user@shop.co).");

    // 3. Seed Products
    console.log("Seeding Products with Figma Images...");
    await productModel.deleteMany({});

    const productsImageDir = path.join(__dirname, "../client/src/assets/images/products");

    const getPhotoBuffer = (fileName) => {
      try {
        const filePath = path.join(productsImageDir, fileName);
        if (fs.existsSync(filePath)) {
          return {
            data: fs.readFileSync(filePath),
            contentType: "image/png"
          };
        }
      } catch (err) {
        console.warn(`Could not read ${fileName}:`, err.message);
      }
      return undefined;
    };

    const rawProducts = [
      // New Arrivals
      {
        name: "T-shirt with Tape Details",
        description: "This modern graphic t-shirt is crafted from 100% premium breathable cotton for ultimate style and daily comfort.",
        price: 120,
        rating: 4.5,
        category: getCatId("T-shirts"),
        quantity: 15,
        colors: ["#4F4631", "#314F4A", "#31344F"],
        sizes: ["Small", "Medium", "Large", "X-Large"],
        dressStyle: "Casual",
        shipping: true,
        photoFile: "product1.png"
      },
      {
        name: "Skinny Fit Jeans",
        description: "Tailored skinny fit jeans made from stretchable premium denim offering flexible fit and superior durability.",
        price: 240,
        originalPrice: 260,
        rating: 3.5,
        category: getCatId("Jeans"),
        quantity: 12,
        colors: ["#000000", "#063AF5"],
        sizes: ["Small", "Medium", "Large", "X-Large"],
        dressStyle: "Casual",
        shipping: true,
        photoFile: "product2.png"
      },
      {
        name: "Checkered Shirt",
        description: "Classic checkered button-down casual shirt with breathable fabric, perfect for formal outings or daily layered styles.",
        price: 180,
        rating: 4.5,
        category: getCatId("Shirts"),
        quantity: 10,
        colors: ["#F50606", "#063AF5", "#000000"],
        sizes: ["Small", "Medium", "Large", "X-Large"],
        dressStyle: "Casual",
        shipping: true,
        photoFile: "product3.png"
      },
      {
        name: "Sleeve Striped T-shirt",
        description: "Contemporary sleeve striped casual tee engineered with soft cotton blend for maximum breathability and style.",
        price: 130,
        originalPrice: 160,
        rating: 4.5,
        category: getCatId("T-shirts"),
        quantity: 8,
        colors: ["#F57906", "#000000", "#FFFFFF"],
        sizes: ["Small", "Medium", "Large", "X-Large"],
        dressStyle: "Casual",
        shipping: true,
        photoFile: "product4.png"
      },

      // Top Selling
      {
        name: "Vertical Striped Shirt",
        description: "Smart vertical striped button-up shirt giving a flattering slim profile with lightweight luxurious cotton fabric.",
        price: 212,
        originalPrice: 232,
        rating: 5.0,
        category: getCatId("Shirts"),
        quantity: 14,
        colors: ["#06CAF5", "#000000", "#FFFFFF"],
        sizes: ["Small", "Medium", "Large", "X-Large"],
        dressStyle: "Casual",
        shipping: true,
        photoFile: "product5.png"
      },
      {
        name: "Courage Graphic T-shirt",
        description: "Express your bold fashion taste with this vibrant courage graphic t-shirt crafted from pure organic combed cotton.",
        price: 145,
        rating: 4.0,
        category: getCatId("T-shirts"),
        quantity: 20,
        colors: ["#F57906", "#000000"],
        sizes: ["Small", "Medium", "Large", "X-Large"],
        dressStyle: "Casual",
        shipping: true,
        photoFile: "product6.png"
      },
      {
        name: "Loose Fit Bermuda Shorts",
        description: "Relaxed loose fit bermuda shorts made for casual weekends, gym sessions, and beach outings with quick-drying cotton.",
        price: 80,
        rating: 3.0,
        category: getCatId("Shorts"),
        quantity: 4, // Low stock test
        colors: ["#314F4A", "#000000", "#4F4631"],
        sizes: ["Small", "Medium", "Large", "X-Large"],
        dressStyle: "Casual",
        shipping: true,
        photoFile: "product7.png"
      },
      {
        name: "Faded Skinny Jeans",
        description: "Vintage washed faded skinny jeans featuring subtle distressed details and comfortable stretch denim structure.",
        price: 210,
        rating: 4.5,
        category: getCatId("Jeans"),
        quantity: 0, // Out of stock test
        colors: ["#063AF5", "#000000"],
        sizes: ["Small", "Medium", "Large", "X-Large"],
        dressStyle: "Casual",
        shipping: true,
        photoFile: "product8.png"
      },

      // Additional Catalog & Dress Styles (Formal, Party, Gym)
      {
        name: "Polo with Contrast Trim",
        description: "Sophisticated polo shirt with detailed contrast trim around collar and sleeves. Suitable for semi-formal and formal events.",
        price: 212,
        originalPrice: 242,
        rating: 4.0,
        category: getCatId("T-shirts"),
        quantity: 9,
        colors: ["#000000", "#00C12B", "#F50606"],
        sizes: ["Small", "Medium", "Large", "X-Large"],
        dressStyle: "Formal",
        shipping: true,
        photoFile: "product 9.png"
      },
      {
        name: "Gradient Graphic T-shirt",
        description: "Eye-catching gradient print tee made with ultra-soft micro-modal cotton fabric, ideal for parties and streetwear.",
        price: 145,
        rating: 3.5,
        category: getCatId("T-shirts"),
        quantity: 18,
        colors: ["#F506A4", "#7D06F5", "#000000"],
        sizes: ["Small", "Medium", "Large", "X-Large"],
        dressStyle: "Party",
        shipping: true,
        photoFile: "product 10.png"
      },
      {
        name: "Polo with Tipping Details",
        description: "Refined luxury polo shirt with tipped ribbed collar, crafted for comfort during gym workouts and athletic activities.",
        price: 180,
        rating: 4.5,
        category: getCatId("T-shirts"),
        quantity: 7,
        colors: ["#000000", "#FFFFFF", "#063AF5"],
        sizes: ["Small", "Medium", "Large", "X-Large"],
        dressStyle: "Gym",
        shipping: true,
        photoFile: "product 11.png"
      },
      {
        name: "Black Striped T-shirt",
        description: "Monochrome horizontal striped tee designed for effortless everyday wear, tailored fit, and durable washing longevity.",
        price: 120,
        originalPrice: 150,
        rating: 5.0,
        category: getCatId("T-shirts"),
        quantity: 11,
        colors: ["#000000", "#FFFFFF"],
        sizes: ["Small", "Medium", "Large", "X-Large"],
        dressStyle: "Casual",
        shipping: true,
        photoFile: "product 12.png"
      }
    ];

    for (const item of rawProducts) {
      const product = new productModel({
        name: item.name,
        slug: slugify(item.name, { lower: true }),
        description: item.description,
        price: item.price,
        originalPrice: item.originalPrice,
        rating: item.rating,
        category: item.category,
        quantity: item.quantity,
        colors: item.colors,
        sizes: item.sizes,
        dressStyle: item.dressStyle,
        shipping: item.shipping,
        photo: getPhotoBuffer(item.photoFile)
      });
      await product.save();
    }

    console.log(`Successfully seeded ${rawProducts.length} products with photos!`);
    console.log("Database seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
