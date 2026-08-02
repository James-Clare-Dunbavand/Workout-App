const mongoose = require("mongoose");

const IngredientSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "please provide ingredient name"],
        unique: true,
        lowercase: true,
    },
    category: {
        type: String,
        enum: ["fruit", "vegetable", "meat", "grain", "desert", "other"],
        required: [true, "please provide a category"],
    },
    servingSize: {
        type: Number,
        required: [true, "please provide serving size"],
    },
    costPer100: {
        type: Number,
        required: [true, "please provide cost per serving"],
    },
    foodNutrients: [
        {
            foodNutrient: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "foodNutrient",
                required: [true, "please provide valid nutrient"],
            },
            amountPer100: {
                type: Number,
                default: 0,
                // required: [true, "please provide nutrient amount"],
            },
        },
    ],

    imageUrl: {
        type: String,
        default: "/images/Image-not-found.png",
    },
});

const Ingredient = mongoose.model("ingredient", IngredientSchema);

module.exports = Ingredient;
