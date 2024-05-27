import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // only one time index use easy to seraching in database
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      index: true, //easy to seraching in database
      trim: true,
    },
    avtar: {
      type: String, //cloudinary URL use after
      required: true,
    },
    coverImage: {
      type: String, //cloudinary URL use after
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        default: [],
      },
    ],
    password: {
      type: String,
      required: [true, "password is require"],
    },
    refreshToken: {
      // refreshToken   it is a long string hota hai
      type: String,
    },
  },

  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) 
    //if user password is not modify then next run karo
    return next();
  
    //take passwor fild from userSchema and encrypt karo
    this.password = bcrypt.hash(this.password, 10); //else the user password modify hai to dubara bcrypt kar do.

    next();
  
});

  //use method
  userSchema.methods.isPasswordCorrect = async function (password) {
    //help of bcrypt, check user password correct or not.
   return await  bcrypt.compare(password,this.password)   //(password === this.password) both are bcrypt compare
}


//generate auto AccesToken
userSchema.methods.generateAccessToken = function(){
  //sign generate Token
 return  jwt.sign(
    { _id:this._id, email:this.email, username:this.username, fullName:this.fullName,},
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
  }
)

}

//generate  auto RefreshToken
userSchema.methods.generateRefreshToken = function(){

  return  jwt.sign(
    { _id:this._id},
  process.env.REFRESH_TOKEN_SECRET,
  {
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
  }
)

}

//before save
export const User = mongoose.model("User", userSchema);
