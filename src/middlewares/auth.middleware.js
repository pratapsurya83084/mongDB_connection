import { ApiError } from "../utils/Apierror.js";
import { asyncHandeler } from "../utils/asyncHandler.js";
import JWT from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandeler(async (req, res, next) => {
 
 
   try {
     const token =
     req.cookies?.accessToken ||
     req.header("Authorization")?.replace("Bearer", " ");
 
   if (!token) {
     throw new ApiError(401, "unauthorized request");
   }
 
   const decodedToken = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
 
   const user = await User.findById(decodedToken?._id).select(
     "-password -refreshToken",
   );
 
   if (!user) {
     throw new ApiError(401, "invalid access token");
   }
 

   req.user = user;   //if user is exist ,adduser
   next();   //i.e logout kare



   } catch (error) {
    throw new ApiError(401,error?.message || "invalid access token");
   }
});

