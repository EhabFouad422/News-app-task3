const mongoose=require('mongoose')
const validator=require("validator")
const bcryptjs=require("bcryptjs")
const jwt=require('jsonwebtoken')
const articleSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    reporter:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    image:{
        type:Buffer
    }
   
})
articleSchema.methods.toJSON=function(){
    const article=this
    const articleObject=article.toObject()
    return articleObject
}

const Article=mongoose.model('Article',articleSchema)
module.exports=Article

