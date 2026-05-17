const Nutrient = require("../models/foodNutrientModel");

const nutrientIds = new Map();
const getNutrientIds = async () => {
    const ids = await Nutrient.find({
        name: {
            $in: ["calorie", "fat", "fiber", "protein", "carbs", "sodium"],
        },
    }).select("name _id");
    ids.forEach((nutrient) => {
        nutrientIds.set(nutrient.name, nutrient._id);
    });
};
getNutrientIds();

module.exports = { nutrientIds };
