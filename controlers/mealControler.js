const { BadRequestError } = require("../errors");
const Meal = require("../models/mealModel");

const getMeals = async (req, res) => {
    const meals = await Meal.find();
    res.status(200).json(meals);
};

const addMeal = async (req, res) => {
    const meal = req.body;
    if (!meal) {
        throw new BadRequestError("Please provide meal");
    }
    const response = await Meal.create(meal);
    res.status(200).json(response);
};

const deleteMeal = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new BadRequestError("Please provide id");
    }
    const response = await Meal.deleteOne({ _id: id });
    res.status(200).json(response);
};

module.exports = { deleteMeal, getMeals, addMeal };
