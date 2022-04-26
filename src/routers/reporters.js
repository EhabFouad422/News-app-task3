const { Router } = require('express')

const express=require('express')

const Reporter = require('../models/reporters')

const router=express.Router()

const auth=require('../middleware/auth')


const multer=require('multer')


router.post('/signup',async (req,res)=>
{
    try
    {
        const reporter=new Reporter(req.body)
        const token=await reporter.generateToken()
        await reporter.save()
        res.status(200).send({reporter,token})

    }
    catch(e)
    {
        res.status(500).send(e.message)
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


router.post('/add/image/reporter',auth,uploads.single('image'),async(req,res)=>{
    try{
        req.reporter.image=req.file.buffer
        await req.reporter.save()
        res.send()
    }
    catch(e)
    {
        res.status(500).send(e.message)
    }
})


router.post('/login',async(req,res)=>{
  try{
    const reporter=await Reporter.findByCredentials(req.body.email,req.body.password)
  const token=await reporter.generateToken()
  res.status(200).send({reporter,token})
  }
  catch(e)
  {
      res.status(e).send(e.message)
  }  
})


router.delete('/logout',auth,async(req,res)=>{
    try{
        req.reporter.tokens=req.reporter.tokens.filter((el)=>{
            return el!==req.token
        })
        await req.reporter.save()
        res.status(200).send()
    }
    catch(e)
    {
        res.status(500).send(e.message)
    }
})

router.delete('/reporter',auth,async (req,res)=>
{
    try{
    const reporter=await Reporter.findByIdAndDelete(req.reporter._id,{
        new:true,
        runValidators:true
    })
    if(!reporter)
    {
        return res.status(400).send("Not Avaliable")
    }
    res.status(200).send(reporter)
}
catch(e)
{
    res.status(500).send(e.message)
}
})


router.patch('/reporter',auth,async (req,res)=>
{

    try{
        const updates=Object.keys(req.body)
    const reporter=await Reporter.findById(req.reporter._id)
    if(!reporter)
    {
        return res.status(400).send("Not Avaliable")
    }
    updates.forEach((el)=>reporter[el]=req.body[el])
    await reporter.save()
    res.status(200).send(reporter)
}
catch(e)
{
    res.status(400).send(e)
}
})

router.get('/profile',auth,async(req,res)=>{
    res.send(req.reporter)
})
module.exports=router