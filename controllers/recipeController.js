import axios from "axios";
import dotenv from "dotenv";
import User from "../model/userModel.js";

dotenv.config();


export const getRecipes = async (req, res) => {
    try {
        const userId = req.user._id
        const { page, pageSize, search= "" } = req.query;
        const apiKey = process.env.SPOONACULAR_API_KEY;
        let response
        if(search == ""){
            response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
                params: {
                    number: pageSize,
                    offset: (page - 1) * pageSize,
                    apiKey,
                }
            });
        }else{
            response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
                params: {
                    query: search,
                    number: pageSize,
                    offset: (page - 1) * pageSize,
                    apiKey,
                }
            });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json({
            recipes: response.data,
            user: {
                name: user.name,
                email: user.email,
                liked: user.liked
            }
        });
    } catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).send("Internal Server Error");
    }
};


export const getRecipeInformation = async (req, res) => {
    try {
        const { recipeId } = req.params; 
        const apiKey = process.env.SPOONACULAR_API_KEY;

        const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
        
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).send("Internal Server Error");
    }
};