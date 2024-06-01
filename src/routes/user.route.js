import {Router} from 'express'
import {loginUser, LogoutUser,registerUser} from '../controllers/user.controller.js'

import {upload} from '../middlewares/multer.middleware.js'
import {verifyJWT}  from "../middlewares/auth.middleware.js"
import {refreshtoken }   from '../controllers/user.controller.js'

const router=Router();
//upload is used to send images just before the registerUser  

router.route("/register").post(
   upload.fields([
 {
    name:"avtar",
    maxCount:1,
 },
 {
    name:"coverImage",
    maxCount:1
 }
   ]),
    registerUser

)


router.route("/login").post(loginUser)

//protected routes

router.route("/logout").post(verifyJWT, LogoutUser)  //verifyJWT is a middleware = before logout meet middleware after next() i.e LogoutUser
router.route("/refreshtoken").post(refreshtoken)  //verifyJWT




//if /register hit hoga to .post(registerUser) method call karega 
// router.route("/login").post(login)


export default router