
const productModel = require("../models/poductModel");
const fs = require("fs");
const slugify = require("slugify")


const createProductController = async (req,res)=>{
    try{
        const {name,description,price,category,quantity,shipping} = req.fields
        const photo = req.files && req.files.photo
        //validation
        switch(true){
            case !name:
                return res.status(500).send({error:"Name is Required"})
                
            case !description:
                return res.status(400).send({error:"Description is Required"})
            
            case !price:
                return res.status(400).send({error:"Price is Required"})
                
            case !category:
                return res.status(400).send({error:"Category is Required"})
                
            case !quantity:
                return res.status(400).send({error:"Quantity is Required"})


        }
        const products = new productModel({name, description, price, category, quantity, shipping, slug:slugify(name)});
        if(photo){
            products.photo = {
                data: fs.readFileSync(photo.path),
                contentType: photo.type
            }
        }
        await products.save()
        res.status(201).send({
            success:true,
            message : "Products Created Succesfully",
            products
        })

        }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in crearing product"
        })
    }

}


//get Products

const getProductController= async (req,res)=>{
    try{

        const products = await productModel.find({}).populate('category').select("-photo").limit(10).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            message:"All Products",
            products,
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message :"Error in getting products",
            error: error.message
        }) 

    }
}


//get single products
const getSingleProductController = async (req,res)=>{
    try{
        const product = await productModel.findOne({slug:req.params.slug}).select("-photo").populate("category")
        res.status(200).send({
            success:true,
            message: "Single Product feteched",
            product
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            succes:false,
            message :"Error getting single product",
            error
        })
    }

}

// get photo

const getPhotoController = async (req,res)=>{
    try{
        const product = await productModel.findById(req.params.pid).select("photo")
        if(product && product.photo && product.photo.data){
        res.set('Content-type', product.photo.contentType);
        return res.status(200).send(product.photo.data)
        }
    }catch(error){
        console.log(error)
        res.status(500).send({
            succes:false,
            message :"Error while getting produt photo",
            error
        })
    }

}

//delete product

const deleteProductController = async (req,res)=>{
    try{
        const product = await productModel.findByIdAndDelete(req.params.pid).select("photo")
        res.status(200).send({
            success:true,
            message:"Product Deleted Successfully"
        });
        
    }catch(error){
        console.log(error)
        res.status(500).send({
            succes:false,
            message :"Error while deleting product",
            error
        })
    }

}

//update product 

const updateProductController = async (req,res)=>{
    try{
        const {name,description,price,category,quantity,shipping} = req.fields
        const photo = req.files && req.files.photo
        //validation
        switch(true){
            case !name:
                return res.status(500).send({error:"Name is Required"})
                
            case !description:
                return res.status(400).send({error:"Description is Required"})
            
            case !price:
                return res.status(400).send({error:"Price is Required"})
                
            case !category:
                return res.status(400).send({error:"Category is Required"})
                
            case !quantity:
                return res.status(400).send({error:"Quantity is Required"})


        }
        const products = await productModel.findByIdAndUpdate(req.params.pid,
            {name, description, price, category, quantity, shipping, slug:slugify(name)},{new:true})
        if(photo){
            products.photo = {
                data: fs.readFileSync(photo.path),
                contentType: photo.type
            }
        }
        await products.save()
        res.status(201).send({
            success:true,
            message : "Products Updated Succesfully",
            products
        })

        }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in updating product"
        })
    }

}

// filter product 

const productFilterController = async (req,res)=>{
    try{
        const {checked, radio} = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        if(radio.length) args.price = {$gte: radio[0], $lte: radio[1]};
        const products = await productModel.find(args);
        res.status(200).send({
            success:true,
            products,
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while filtering Product"
        })
    }
}

// product count
const productCountController = async (req,res)=>{
    try{
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success:true,
            total,
            message:"Product counted successfully"
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while getting the count of product",
            error           
        })
    }
}


//product list base on page 

const productListController = async (req,res)=>{
    try{
        const perPage = 6
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel.find({})
        .select("-photo")
        .skip((page-1) * perPage)
        .limit(perPage)
        .sort({createdAt: -1 });
        res.status(200).send({
            success:true,
            products
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while getting the count of product",
            error           
        })
        
    }

}



module.exports = {createProductController ,getProductController ,getSingleProductController ,
                    getPhotoController ,deleteProductController, updateProductController , 
                    productFilterController ,productCountController ,productListController,
                    searchProductController}