const { BadRequestError, NotFoundError, CustomError } = require("../errors");
const Ingredient = require("../models/ingredientModel.js");
const Nutrient = require("../models/foodNutrientModel.js");
const ingredientUtils = require("../utils/ingredientUtils.js");
const { nutrientIds } = require("../utils/nutrientUtils.js");

const getIngredient = async (req, res) => {
    const { ingredientName } = req.params;

    const ingredient = await Ingredient.findOne({ name: ingredientName });
    if (!ingredient) {
        throw new NotFoundError(`Ingredient: ${ingredientName} not found.`);
    }
    res.status(200).json(ingredientUtils.responseIngredient(ingredient));
};

const addIngredients = async (req, res) => {
    const { ingredients } = req.body;
    if (ingredients === null || ingredients == []) {
        throw new BadRequestError("Please provide ingredients to add");
    }
    console.log(req.body);
    console.log(ingredients);
    const fdcIngredientIds = ingredients
        .filter(({ fdcId }) => fdcId != null)
        .map(({ fdcId }) => fdcId);
    const fdcIngredientsMap =
        fdcIngredientIds.length > 0
            ? await ingredientUtils.fetchFdcIngredients(fdcIngredientIds)
            : new Map();

    const response = [];
    for (const ingredient of ingredients) {
        response.push(
            await ingredientUtils.addIngredient(ingredient, fdcIngredientsMap),
        );
    }
    res.json(response);
};

const pullAndAddIngredientInformationUsda = async (req, res) => {
    const foodData = new Map();
    const fdcIds = [];
    const { ingredient, ingredientsToAdd } = req.body;
    const reqIngredients = ingredient ? [ingredient] : ingredientsToAdd;

    reqIngredients.forEach((element) => {
        foodData.set(Number(element.fdcId), element.foodData || {});
        fdcIds.push(element.fdcId);
    });
    const response = await ingredientUtils.fetchFdcIngredients(fdcIds);

    const formatedResponse =
        await ingredientUtils.formatFdcIngredients(response);
    const formatedIngredients = ingredientUtils.addManualIngredientData(
        formatedResponse,
        foodData,
    );

    const addedIngredients = [];
    for (const ingredient of formatedIngredients) {
        const addedIngredient = await Ingredient.create(ingredient);
        addedIngredients.push(addedIngredient);
    }

    return res.status(200).json(addedIngredients);
};

const getAllIngredient = async (req, res) => {
    const response = await Ingredient.find().populate({
        path: "foodNutrients",
        populate: { path: "foodNutrient" },
    });
    const ingredients = response.map((item) => {
        return ingredientUtils.responseIngredient(item);
    });
    res.status(200).json({ ingredients: ingredients });
};

const addIngredientManualOld = async (req, res) => {
    const { ingredient } = req.body;
    const foodData = ingredient.foodData;
    if (
        !ingredient.fdcId &&
        !(
            foodData.nutrients.calorie &&
            foodData.nutrients.fat &&
            foodData.nutrients.fiber &&
            foodData.nutrients.protein &&
            foodData.nutrients.carbs &&
            foodData.nutrients.sodium
        )
    ) {
        throw new BadRequestError(
            "Please provide either fdcId or manual nutrients",
        );
    }

    const ingredientObject = {
        name: foodData.name,
        category: foodData.category,
        servingSize: foodData.servingSize,
        costPerServing: foodData.costPerServing,
        foodNutrients: [
            {
                foodNutrient: nutrientIds.calorie,
                amountPer100: foodData.nutrients?.calorie,
            },
            {
                foodNutrient: nutrientIds.fat,
                amountPer100: foodData.nutrients?.fat,
            },
            {
                foodNutrient: nutrientIds.fiber,
                amountPer100: foodData.nutrients?.fiber,
            },
            {
                foodNutrient: nutrientIds.protein,
                amountPer100: foodData.nutrients?.protein,
            },
            {
                foodNutrient: nutrientIds.carbs,
                amountPer100: foodData.nutrients?.carbs,
            },
            {
                foodNutrient: nutrientIds.sodium,
                amountPer100: foodData.nutrients?.sodium,
            },
        ],
    };

    const newIngredient = await Ingredient.create(ingredientObject);
    return res
        .status(201)
        .json(ingredientUtils.responseIngredient(newIngredient));
};

const deleteIngredient = async (req, res) => {
    const { ingredientName } = req.params;
    const deletedIngredient = await Ingredient.deleteOne({
        name: ingredientName,
    });
    res.status(200).json({ message: deletedIngredient });
};

const updateIngredient = async (req, res) => {
    const { ingredientName } = req.params;
    const { ingredient } = req.body;
    if (!ingredient) {
        throw new BadRequestError("Please provide updated ingredient");
    }

    const newIngredient = await Ingredient.findOneAndUpdate(
        { name: ingredientName },
        ingredient,
        {
            new: true,
            runValidators: true,
        },
    );
    res.status(200).json(ingredientUtils.responseIngredient(newIngredient));
};
const testFunc = (number) => {
    return 10 + number;
};

module.exports = {
    testFunc,
    getIngredient,
    addIngredientManualOld,
    getAllIngredient,
    deleteIngredient,
    updateIngredient,
    pullAndAddIngredientInformationUsda,
    addIngredients,
};
