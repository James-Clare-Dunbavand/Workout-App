const mongoose = require("mongoose");

const ShoppingStateSchema = mongoose.Schema(
    {
        checked: {
            type: Boolean,
            default: false,
        },
        note: {
            type: String,
            default: "",
        },
        quantityOverride: {
            type: Number,
        },
    },
    { _id: false },
);

const MealPlanModel = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    meals: [{ type: mongoose.SchemaTypes.ObjectId, ref: "meal" }],

    recipeInstances: [
        {
            recipeId: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "recipe",
                required: true,
            },

            remainingPortions: { type: Number, required: true },
            totalPortions: { type: Number, required: true },
        },
    ],

    shoppingState: { type: Map, of: ShoppingStateSchema, default: {} },
    // map of ingredient id to shopping state.
});

const MealPlan = mongoose.model("mealPlan", MealPlanModel);

module.exports = MealPlan;
