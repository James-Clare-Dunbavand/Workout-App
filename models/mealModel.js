const mongoose = require("mongoose");

const MealModel = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    servings: {
        type: Number,
        required: true,
    },
    recipe: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "recipe",

        required: true,
    },

    start: {
        type: Date,
    },
    end: {
        type: Date,
    },
});

const Meal = mongoose.model("meal", MealModel);

module.exports = Meal;
