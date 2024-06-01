import { asyncHandeler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/Apierror.js";
import { uploadOncloudinary } from "../utils/cloudinary.fileuploader.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { jwt } from "jsonwebtoken";

//genaerate refresh token and accesstoken method
const generateRfreshtokenandaccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accesstoken = user.generateAccessToken();
    const refreshtoken = user.generateRefreshToken();

    user.refreshtoken = refreshtoken;
    await user.save({ validateBeforeSave: false }); //save rerfreshtoken and accesstoken into database

    return { accesstoken, refreshtoken }; //generate accsetoken and refreshtoken
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating refresh and  access token",
    );
  }
};

const registerUser = asyncHandeler(async (req, res) => {
  //step1 - get user details  from frontend
  const { fullName, email, username, password } = req.body;
  console.log("email and username:", email, username);
  //step 2-check user is already exist or not ,check username ,email
  if (
    [fullName, email, username, password].some(
      (feilds) => feilds?.trim() === "",
    )
  ) {
    throw new ApiError(400, "All filds are required");
  }

  //step3-check user is already exist or not ,check username ,email
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    //currentUser == email,username ,then throw sms =user is already exist
    throw new ApiError(409, "User with email or username is already exist !");
  }
  console.log(req.files);
  // step 4- check for images ,check for avatar
  const avatarLocalpath = await req.files?.avatar?.[0]?.path;
  console.log(avatarLocalpath);
  let coverImageLocalpath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalpath = req.files.coverImage[0].path;
  }

  // //check for images ,check for avatar
  if (!avatarLocalpath) {
    throw new ApiError(400, "avatar file is required!");
  }

  // //step 5-upload them to cloudinary ,avtar
  const avatar = await uploadOncloudinary(avatarLocalpath);
  const coverImages = await uploadOncloudinary(coverImageLocalpath);

  if (!avatar) {
    throw new ApiError(400, "avatar is required!");
  }

  // step 6- create user object-create entry in db
  const user = await User.create({
    fullName,
    avatarImages: avatarImages?.url, //uploaded cloudinary after images url
    coverImages: coverImages?.url || " ", //coverImage asel tr url, nasel  tr empty
    email,
    password,
    username: username.toLowerCase(),
  });

  const creatUser = await User.findById(user._id).select(
    "-password -refreshtoken",
  );

  if (!creatUser) {
    throw new ApiError(500, "Something went wrong while registring the user");
  }
  //step6-remove password and refreshtoken fild from response
  //return res
  return res
    .status(201)
    .json(new ApiResponse(200, creatUser, "User registerd Successfully"));
});
//login user
const loginUser = asyncHandeler(async (req, res) => {
  const { email, password, userName } = req.body;
  console.log(email, password);
  if (!(userName || email)) {
    throw new ApiError(400, "password and email  requird,invalid creadential");
  }

  //step3-check user is already exist or not ,check username ,email
  //dB is another continant

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });
  //check user exists or not
  if (!user) {
    throw new ApiError(404, "invalid user  does not exist");
  }

  //check password correct or not
  const ispasswordvalid = await user.isPasswordCorrect(password);

  if (!ispasswordvalid) {
    throw new ApiError(404, "invalid User creadentials");
  }

  //invalid user then make a refreshttoken and accetoken
  const { accesstoken, refreshtoken } = await generateRfreshtokenandaccessToken(
    user._id,
  ); //call function and we get access and refesh token

  //after generate refresh and access token send it cookiess

  const loggedInuser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true, //only server modify cookie but front is not modify
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accesstoken, options)
    .cookie("refreshtoken", refreshtoken, options)
    .json(
      new ApiResponse( //all below are data
        200,
        { user: loggedInuser, accesstoken, refreshtoken },
        "user loggenIn successfully",
      ),
    );
});

//logout functionality
const LogoutUser = asyncHandeler(async (req, res) => {
  //use middleware
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshtoken", options)
    .json(new ApiResponse(200, {}, "User Logged Out successfully"));
});

//get refreshtokens
const refreshtoken = asyncHandeler(async (req, res) => {
  const incomingRefreshtoken = req.cookis.refreshToken || req.body.refreshToken;
  if (incomingRefreshtoken) {
    throw new ApiError(401, "unauthorised request");
  }
  //verify
 try {
   const decodedToken = jwt.verify(
     incomingRefreshtoken,
     process.env.REFRESH_TOKEN_SECRET,
   );
 
   //using id take info from mongooDB user
   const user=await User.findById(decodedToken?._id)
 
   if (!user) {
     throw new ApiError(401,"invalid refreshToken")
 
   }
 
 if (incomingRefreshtoken !== user?.refreshToken) {
   throw new ApiError(401,"Refresh token is expires or used")
 
 }
 
 const options={
   httpOnly:true,
   secure:true
 }
 
 
    const {accesstoken,newrefreshtoken} =  await  generateRfreshtokenandaccessToken(user._id)
     
      return res.status(200)
      .cookie("accessToken",accesstoken,options)
      .cookie("refreshToken",newrefreshtoken,options)
     .json(
       new ApiResponse(
         200,
           {accesstoken,refreshtoken:newrefreshtoken},
           "Refresh token generated successfully"
         
       )
     )
 } catch (error) {
  throw new ApiError(401,"invalid refreshToken")
 }


});

export { registerUser, loginUser, LogoutUser ,refreshtoken};
