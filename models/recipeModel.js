const mongoose = require("mongoose");
const Ingredient = require("./ingredientModel.js");

const RecipeSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 20,
        minlength: 3,
        required: [true, "Please provide name"],
    },
    ingredients: [
        {
            ingredient: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "ingredient",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    imageUrl: {
        type: String,
        default: "/images/Image-not-found.png",
    },
    portions: {
        type: Number,
        default: 1,
    },
});

RecipeSchema.methods.getIngredients = async function () {
    const ingredients = await Ingredient.find({
        name: { $in: this.ingredients },
    });
    return ingredients;
};

const Recipe = mongoose.model("recipe", RecipeSchema);

module.exports = Recipe;
