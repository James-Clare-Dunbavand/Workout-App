const mongoose = require("mongoose");

const FoodNutrientSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide nutrient name"],
        unique: false,
        lowercase: true,
    },
    unitName: {
        type: String,
        enum: ["G", "UG", "MG", "KCAL", "IU", "kJ"],
        required: [true, "Please provide unitName"],
    },
    nutrientNumber: {
        type: Number,
        required: [true, "Please provide nutrient number"],
    },
    dailyRecommendedIntake: {
        type: Number,
        default: 0,
    },
});

const FoodNutrient = mongoose.model("foodNutrient", FoodNutrientSchema);

module.exports = FoodNutrient;
