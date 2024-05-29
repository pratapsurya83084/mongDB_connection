import {Router} from 'express'
import {registerUser} from '../controllers/user.controller.js'



const router=Router();
router.route("/register").post(registerUser)
//if /register hit hoga to .post(registerUser) method call karega 
// router.route("/login").post(login)


export default router