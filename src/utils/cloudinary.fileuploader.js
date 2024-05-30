import fs from "fs"; //file system it help to read ,write ,sync,async

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SERCET,
});

const uploadOncloudinary = async (localFilepath) => {
  try {
    if (!localFilepath) return null;

    //upload the fileoncloudinary
    const response = await cloudinary.uploader.upload(localFilepath, {
      resource_type: "auto",
    });
    //file has been uploaded successfull
    console.log("successfull uploaded file on cloudinary", response.url);
    return response;

  } catch (error) {  //failure time unlinked file
    fs.unlinkSync(localFilepath)  // remove the locally saved temporary file as the upload opration got failed
    return null;
    
  }

};


export {uploadOncloudinary}

// cloudinary.uploader.upload(
//   "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" },
//   function (error, result) {
//     console.log(result);
//   },
// );
