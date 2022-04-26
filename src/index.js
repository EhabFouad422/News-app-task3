



const express=require('express')

require('dotenv').config()

const app=express()

const port=process.env.PORT


app.use(express.json())

const articleRoute=require('../src/routers/articles')

const reporterRoute=require('../src/routers/reporters')



require('./database/mongoose')

app.use(articleRoute)

app.use(reporterRoute)



app.listen(port,()=>{console.log("listening to the port" + port)})