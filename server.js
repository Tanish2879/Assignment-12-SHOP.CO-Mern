const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

// env configure
dotenv.config();

// database connection
connectDB();

// server instance 
const app = express();

// middleware
app.use(cors());
app.use(express.json());


// routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/category", categoryRoutes)
app.use("/api/v1/product", productRoutes)

//rest api
app.get("/", (req,res)=>{
    res.send("<h1>Welcome to the Ecom App</h1>")
})

const PORT = process.env.PORT || 8000  

app.listen(PORT,()=>{
    console.log(`Sever is running on ${PORT}`)
})


