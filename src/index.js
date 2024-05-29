// import mongoose from 'mongoose'
// import {DB_NAME} from './constant.js'
import connectDB from './db/index.js'
import dotenv from 'dotenv'
import {app} from './app.js'
dotenv.config({
    path:'.env'
})

connectDB()

.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`server is running on port ${process.env.PORT}`)
    })
})
.catch((err) => {
console.log("mongo db connection is failed",err)
})





// (async()=>{
// try {
//    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//   app.on('error',(error)=>{
//     console.log("ERROR",error);
//     throw error
//   })
//   app.listen(process.env.PORT ,()=>{
//     console.log(`server is running on port ${process.env.PORT}`)
//   })
// } catch (error) {
//     console.log("ERROR",error);
//     throw error
// }
// })()



