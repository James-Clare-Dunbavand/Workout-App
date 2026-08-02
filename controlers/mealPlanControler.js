const { BadRequestError, NotFoundError } = require("../errors");
const Meal = require("../models/mealModel");
const MealPlan = require("../models/mealPlan");
const { createMeals } = require("./mealControler.js");

const creatMealPlan = async (req, res) => {
    const {
        meals,
        name: planName,
        shoppingState: manulShoppingStateMap,
        recipeInstances,
    } = req.body;
    if (!meals) {
        throw new NotFoundError("provide meals");
    }
    if (!planName) {
        throw new NotFoundError("provide name");
    }
    if (!recipeInstances) {
        throw new NotFoundError("provide recipeInstatnces");
    }
    const dbMeals = await Meal.create(meals);
    if (dbMeals.length < meals) {
        throw new NotFoundError("Not all the meals exist in the database");
    }
    const shoppingStateMap = createStateMap(dbMeals, manulShoppingStateMap);

    const mealPlan = await MealPlan.create({
        name: planName,
        meals: dbMeals.map((meal) => meal._id),
        shoppingState: shoppingStateMap,
        recipeInstances: recipeInstances,
    });
    res.status(200).json(mealPlan);
};

const getMealPlans = async (req, res) => {
    const mealPlans = await MealPlan.find();
    res.status(200).json(mealPlans);
};
const getMealPlan = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new BadRequestError("Provided id was not valid");
    }
    const mealPlans = await MealPlan.find(id);
    res.status(200).json(mealPlans);
};
const deleteMealPlan = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new BadRequestError("Provided id was not valid");
    }
    const mealPlans = await MealPlan.findByIdAndDelete(id);
    res.status(200).json(mealPlans);
};

const modifyMealPlan = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new BadRequestError("Provided id was not valid");
    }
    const { mealPlan } = req.body;
    console.log(mealPlan);
    const { _id: mealIds, name, recipeInstances } = mealPlan;
    if (!mealIds) {
        throw new BadRequestError("Please provide both meals and name");
    }
    const meals = (await Meal.findById(mealIds)) ?? [];
    const prevMealPlan = await MealPlan.findById(id);
    if (!prevMealPlan) {
        throw new NotFoundError("Previous meal plan not found");
    }

    const updatedShoppingState = createStateMap(
        meals,
        prevMealPlan.shoppingState,
    );
    prevMealPlan.name = name ?? prevMealPlan.name;
    prevMealPlan.meals = meals ?? prevMealPlan.meals;
    prevMealPlan.recipeInstances =
        recipeInstances ?? prevMealPlan.recipeInstances;
    prevMealPlan.shoppingState = new Map(updatedShoppingState);

    const updatedMealPlan = await prevMealPlan.save();
    res.status(200).json(updatedMealPlan);
};

const modifyShoppingState = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new BadRequestError("Provided id was not valid");
    }
    const { shoppingStateUpdates } = req.body;
    if (!shoppingStateUpdates) {
        throw new BadRequestError("Provided ingredients state was not valid");
    }
    const mealPlan = await MealPlan.findById(id);

    if (!mealPlan) {
        throw new NotFoundError("meal plan not found");
    }
    for (const update of shoppingStateUpdates) {
        const { id, ...changes } = update;
        const current = mealPlan.shoppingState.get(id);
        if (!current) {
            throw new BadRequestError(
                "Ingredient is not part of this meal plan",
            );
        }
        mealPlan.shoppingState.set(id, { ...current, ...changes });
    }

    const newMealPlan = await mealPlan.save();
    res.status(200).json(newMealPlan);
};
const modifyRecipeInstances = async (req, res) => {
    const { id } = req.params;
    const { recipeInstances } = req.body;
    if (!recipeInstances) {
        throw new NotFoundError("provide recipeInstances");
    }
    const mealPlan = await MealPlan.findById(id);
    if (!mealPlan) {
        throw new NotFoundError("meal plan not found");
    }
    mealPlan.recipeInstances = recipeInstances;
    const newMealPlan = await mealPlan.save();

    res.status(200).json(newMealPlan);
};

const createStateMap = (meals, prevShoppingState) => {
    const next = new Map();
    meals.forEach((meal) => {
        meal.recipe.ingredients.forEach(({ ingredient }) => {
            const ingredientId = ingredient.toString();
            next.set(
                ingredientId,
                prevShoppingState?.get(ingredientId) ?? {
                    checked: false,
                    note: "",
                    quantityOverride: 0,
                },
            );
        });
    });
    return next;
};
module.exports = {
    creatMealPlan,
    getMealPlan,
    getMealPlans,
    modifyMealPlan,
    deleteMealPlan,
    modifyShoppingState,
    modifyRecipeInstances,
};
