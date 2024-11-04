import { generateAccessToken, generateRefreshToken } from "../helperFunctions/tokenHelper.js"
import Liked from "../model/likedRecipeModel.js"
import User from '../model/userModel.js'
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
dotenv.config();

export const checkUserEmail = async(req,res) =>{
    try{
        const { email,name } = req.body
        let userData = await User.findOne({email})
        if (!userData) {
            userData = new User({
                email,
                name
            });
            await userData.save();
        } 
        const userPayload = { email ,name};
        const accessToken = generateAccessToken(userPayload)
        const refreshToken = generateRefreshToken(userPayload)
        res.status(200).json({emailExists: true,accessToken,refreshToken,message: "Email is registered"})
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal Server Error."})
    }
}


export const addLikes = async (req, res) => {
    try {
        const { id: itemId, name, image } = req.body;
        const userId = req.user._id
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const alreadyLikedIndex = user.liked.indexOf(itemId);
        if (alreadyLikedIndex !== -1) {
            return res.status(200).json({ message: "Item already exist." });
        }
        const likedItem = new Liked({
            itemId,
            userId,
            name,
            image
        });
        await likedItem.save();
        user.liked.push(itemId);
        await user.save();
        return res.status(200).json({ message: "Item added to liked items." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};



export const getLikedRecipes = async (req, res) => {
    try {
        const userId = req.user._id; 
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 6;
        const search = req.query.search || '';

        const searchQuery = {
            userId,
            ...(search && {
                name: { $regex: search, $options: 'i' }
            })
        };

        const total = await Liked.countDocuments(searchQuery);

        const totalPages = Math.ceil(total / pageSize);

        const recipes = await Liked.find(searchQuery)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .select('itemId userId name image createdAt');

        return res.status(200).json({
            recipes,
            total,
            totalPages,
            currentPage: page,
            pageSize
        });

    } catch (error) {
        console.error('Error in getLikedRecipes:', error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const removeLikedRecipe = async (req, res) => {
    try {
      const { id } = req.body;
      const userId = req.user._id;
    if (!id) {
        return res.status(400).json({ message: "Recipe ID is required." });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      const likedIndex = user.liked.findIndex(likedId => 
        likedId.toString() === id.toString()
      );
      user.liked.splice(likedIndex, 1);
      await user.save();
      const removed = await Liked.findOneAndDelete({
        _id: id,
        userId: userId
      });
  
      if (!removed) {
        console.warn(`Liked entry not found for itemId: ${id} and userId: ${userId}`);
      }
  
      return res.status(200).json({ 
        message: "Recipe removed from favorites successfully.",
        removedId: id 
      });
  
    } catch (error) {
      console.error('Error in removeLikedRecipe:', error);
      return res.status(500).json({ 
        message: "Failed to remove recipe from favorites.",
        error: error.message 
      });
    }
  };


  export const getRefreshToken = async (req, res) => {
	try {
		const { refreshToken } = req.body;
		if (!refreshToken) {
			return res.status(400).json({ message: "Refresh token is missing" });
		}
		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);
		const { email } = decoded;
		const user = await User.findOne({email:email})
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		const userPayload = {
			name: user.name,
			email: user.email,
		};
		const newAccessToken = generateAccessToken(userPayload);
		const newRefreshToken = generateRefreshToken(userPayload);
		return res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
	} catch (error) {
    console.log(error.message)
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

 

