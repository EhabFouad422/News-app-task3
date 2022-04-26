



const { Router } = require('express')

const express=require('express')

const res = require('express/lib/response')

const router=express.Router()

const Article=require('../models/articles')

const auth=require('../middleware/auth')

const multer=require('multer')


//Add


router.post('/add/article',auth,async (req,res)=>{
    try{
    const article= new Article({...req.body,reporter:req.reporter._id})
    await article.save()
    res.status(200).send(article)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})
const uploads=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/))
         return cb(null,false)
        cb(null,true)
        
    }
})
//Image
router.post('/image/:id',auth,uploads.single('image'),async(req,res)=>{
    try{
        const id=req.params.id
        const article=await Article.findById({_id:id})
         article.image=req.file.buffer
        await article.save()
        res.send()
    }
    catch(e)
    {
        res.status(500).send(e.message)
    }
})
router.get('/return/articles',auth,async (req,res)=>{
    try{
        await req.reporter.populate('articles')
        res.status(200).send(req.reporter.articles)
    }
    catch(e)
    {
        res.status(500).send(e.message)
    }   
})
//Delete
router.delete('/delete/article/:id',auth, async (req,res)=>{
    try{
        const id=req.params.id
    const article=await Article.findOneAndDelete({_id:id,reporter:req.reporter._id},{
        new:true,
        runValidators:true
    })
    if(!article)
    {
        return res.status(400).send("article is not found")
    }
    res.status(200).send(article)
}
catch(e)
{
    res.status(500).send(e)
}
})

//Update

router.patch('/update/article/:id',auth, async (req,res)=>{
    try{
        const id=req.params.id
       const article=await Article.findOneAndUpdate({_id:id,reporter:req.reporter._id},req.body,{
        new:true,
        runValidators:true
    })
    console.log(article)
    if(!article)
    {
        return res.status(400).send(" Not Avaliable")
    }
    res.status(200).send(article)
}
catch(e)
{
    res.status(500).send(e)
}
})


module.exports=router