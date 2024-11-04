
import { Router } from 'express'
import { getRecipeInformation, getRecipes } from '../controllers/recipeController.js'
import userAuthMiddleware from '../middileware/userAuthMiddileware.js'
const router = Router()

router.get('/',userAuthMiddleware,getRecipes)
router.get('/getRecipeDetails/:recipeId',userAuthMiddleware, getRecipeInformation);
export default router