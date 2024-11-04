

import { Router } from 'express'
import { checkUserEmail,addLikes,getLikedRecipes,removeLikedRecipe,getRefreshToken } from '../controllers/userController.js'
import userAuthMiddleware from '../middileware/userAuthMiddileware.js'
const router = Router()

router.post('/checkMail',checkUserEmail)
router.post('/addLike',userAuthMiddleware,addLikes)
router.get('/getLikedRecipes',userAuthMiddleware,getLikedRecipes)
router.post('/removeLike',userAuthMiddleware, removeLikedRecipe);
router.post('/getRefreshToken',getRefreshToken)

export default router