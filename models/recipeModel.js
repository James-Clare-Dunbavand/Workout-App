const mongoose = require("mongoose");
const Ingredient = require("./ingredientModel.js");

const IngredientsSchema = mongoose.Schema({
    name: {
        type: String,
    },
    quantity: {
        type: Number,
    },
});

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
});

// RecipeSchemu.pre("save", async function () {
//     if (this.getIngredients().length < this.ingredients.length) {
//     }
// });

RecipeSchema.methods.getIngredients = async function () {
    const ingredients = await Ingredient.find({
        name: { $in: this.ingredients },
    });
    return ingredients;
};

const Recipe = mongoose.model("recipe", RecipeSchema);

module.exports = Recipe;
