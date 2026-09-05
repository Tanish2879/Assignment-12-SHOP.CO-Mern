const categoryModel = require("../models/categoryModel")
const slugify = require("slugify")

const createCategoryController = async(req,res)=>{

    try{
        const {name} =req.body;
        if(!name){
            return res.status(401).send({message:"Name is required"})
        }
        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:"Category Already Exists"
            })
        }
        const category = await new categoryModel({name, slug: slugify(name)}).save()
        res.status(201).send({
            success: true,
            message: "new category created",
            category
        })

    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error in category"
        });

    }

}

//update controller

const updateCategoryController = async (req,res)=>{
    try{
        const {name} = req.body;
        const {id} = req.params;
        const category = await categoryModel.findByIdAndUpdate(id, {name, slug:slugify(name)},{new:true})
        res.status(200).send({
            success :true,
            message:"Category Updated Succesfully",
            category
})

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message : "Error while updating Category"
        })
    }
}

// get single category

const singleCategoryController = async (req,res)=>{
    try{
        const category = await categoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:"Get Single Category Success",
            category
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message : "Error while getting single category"
        })



    }
}

module.exports = { createCategoryController ,updateCategoryController,singleCategoryController};