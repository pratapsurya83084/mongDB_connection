import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app=express()
//use cors
app.use(cors({
    origin:process.env.CORS_ORIGIN ,         //CORS_ORIGIN IS DEFIND IN THE .env  FILE
    Credential:true


}))

//json,urlencoded,static-public are user entred data this all are configured 
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))

app.use(express.static("public"))
//cookieParser   is used to access user browser cookie and set ,to store secured cookie and only server read and remove
app.use(cookieParser())

export {app};