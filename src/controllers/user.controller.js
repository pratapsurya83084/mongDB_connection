import { asyncHandeler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/Apierror.js";
import { uploadOncloudinary } from "../utils/cloudinary.fileuploader.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandeler(async (req, res) => {
  //step1 - get user details  from frontend
  //validation  - not empty all filed
  //check user is already exist or not ,check username ,email
  //check for images ,check for avatar
  //upload them to cloudinary ,avtar
  //create user object-create entry in db
  //remove password and refreshtoken fild from response
  //check for user creation
  //return res

  //step1 - get user details  from frontend
  const { fullName, email, username, password } = req.body;

  //step 2-check user is already exist or not ,check username ,email
  if (
    [fullName, email, username, password].some(
      (feilds) => feilds?.trim() === "",
    )
  ) {
    throw new ApiError(400, "All filds are required");
  }

  //step3-check user is already exist or not ,check username ,email
  const existedUser = User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    //currentUser == email,username ,then throw sms =user is already exist
    throw new ApiError(409, "User with email or username is already exist !");
  }

  //step 4- check for images ,check for avatar
  const avatarLocalpath = req.files?.avatar[0]?.path;
  // coverImage

  const coverImageLocalpath = req.files?.coverImage[0]?.path;
  //check for images ,check for avatar
  if (!avatar) {
    throw new ApiError(400, "avatar is required!");
  }

  //step 5-upload them to cloudinary ,avtar
  const avatar = await uploadOncloudinary(avatarLocalpath);
  const coverImages = await uploadOncloudinary(coverImageLocalpath);

  if (!avatar) {
    throw new ApiError(400, "avatar is required!");
  }

  // step 6- create user object-create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar.url, //uploaded cloudinary after images url
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

export { registerUser };
