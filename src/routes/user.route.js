import {Router} from 'express'
import {registerUser} from '../controllers/user.controller.js'

import {upload} from '../middlewares/multer.middleware.js'


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
//if /register hit hoga to .post(registerUser) method call karega 
// router.route("/login").post(login)


export default router