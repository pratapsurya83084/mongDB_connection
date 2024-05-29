import  {asyncHandeler}  from '../utils/asyncHandler.js'

 const registerUser=asyncHandeler(async (req,res)=>{
   return res.status(200).json({
        message:"prataps or surya"
    })
})
export  {registerUser}