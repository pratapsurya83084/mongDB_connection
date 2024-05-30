import { asyncHandeler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/Apierror.js";
// import { uploadOncloudinary } from "../utils/cloudinary.fileuploader.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandeler(async (req, res) => {
  //step1 - get user details  from frontend
  const { fullName, email, username, password } = req.body;
console.log("email and username:",email,username);
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
  // console.log(req.files);
  //step 4- check for images ,check for avatar
  // const avatarLocalpath = await req.files?.avatar?.[0]?.path;
  // console.log(avatarLocalpath);
  // let coverImageLocalpath;

  // if (
  //   req.files &&
  //   Array.isArray(req.files.coverImage) &&
  //   req.files.coverImage.length > 0
  // ) {
  //   coverImageLocalpath = req.files.coverImage[0].path;
  // }

  //check for images ,check for avatar
  // if (!avatarLocalpath) {
  //   throw new ApiError(400, "avatar file is required!");
  // }

  // //step 5-upload them to cloudinary ,avtar
  // const avatar = await uploadOncloudinary(avatarLocalpath);
  // const coverImages = await uploadOncloudinary(coverImageLocalpath);

  // if (!avatar) {
  //   throw new ApiError(400, "avatar is required!");
  // }

  // step 6- create user object-create entry in db
  const user = await User.create({
    fullName,
    // avatarImages: avatarImages?.url, //uploaded cloudinary after images url
    // coverImages: coverImages?.url || " ", //coverImage asel tr url, nasel  tr empty
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

export { registerUser };
