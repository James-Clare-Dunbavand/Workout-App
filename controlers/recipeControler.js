const { BadRequestError, NotFoundError } = require("../errors");
const Recipe = require("../models/recipeModel.js");
const Ingredient = require("../models/ingredientModel.js");

const getRecipe = async (req, res) => {
    const { recipeName } = req.params;
    if (!recipeName) {
        throw new BadRequestError("Please provide recipe name");
    }
    const recipe = await Recipe.findOne({ name: recipeName }).populate(
        "ingredients.ingredient",
    );
    if (!recipe) {
        throw new NotFoundError(`${recipeName} does not exist`);
    }
    res.status(200).json(recipe);
};

const getAllRecipes = async (req, res) => {
    const recipes = await Recipe.find().populate("ingredients.ingredient");
    res.status(200).json(recipes);
};

const addRecipe = async (req, res) => {
    const { name, recipeIngredients } = req.body;
    if (!name || !recipeIngredients) {
        throw new BadRequestError("Please provide recipe details");
    }
    const ingredientNames = recipeIngredients.map(
        (ingredient) => ingredient.name,
    );

    const ingredients = await Ingredient.find({
        name: { $in: ingredientNames },
    });
    if (ingredients.length != ingredientNames.length) {
        throw new NotFoundError("Not all ingredients exist.");
    }

    ingredientsWraper = ingredients.map((ingredient) => {
        const quantity = recipeIngredients.find(
            (recipeIngredient) => recipeIngredient.name === ingredient.name,
        ).quantity;
        return {
            ingredient: ingredient._id,
            quantity: quantity,
        };
    });

    const newRecipe = await Recipe.create({
        name: name,
        ingredients: ingredientsWraper,
    });
    res.status(201).json({ recipe: newRecipe });
};

const deleteRecipe = async (req, res) => {
    const { recipeName } = req.params;
    const deletedRecipe = await Recipe.deleteOne({ name: recipeName });
    res.status(200).json(deletedRecipe);
};

const updateRecipe = async (req, res) => {
    const { recipeName } = req.params;
    const { recipe } = req.body;
    const authorizedRecipeParameters = ["name", "ingredients"];

    const oldRecipe = await Recipe.findOne({ name: recipeName });
    if (!oldRecipe) {
        throw new BadRequestError(`${recipeName} is not a known recipe.`);
    }

    for (const param in authorizedRecipeParameters) {
        if (recipe[authorizedRecipeParameters[param]]) {
            oldRecipe[authorizedRecipeParameters[param]] =
                recipe[authorizedRecipeParameters[param]];
        }
    }
    const newRecipe = await oldRecipe.save();
    res.status(200).json(newRecipe);
};

module.exports = {
    getRecipe,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getAllRecipes,
};
