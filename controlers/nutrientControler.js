const Nutrient = require("../models/foodNutrientModel.js");

const { BadRequestError, NotFoundError, CustomError } = require("../errors");

const getNutrient = async (req, res) => {
    const { nutrientName } = req.params;

    const nutrient = await Nutrient.findOne({ name: nutrientName });
    if (!nutrient) {
        throw new NotFoundError(`Nutrient: ${nutrientName} not found.`);
    }
    res.status(200).json(nutrient);
};

const getAllNutrient = async (req, res) => {
    const nutrients = await Nutrient.find();
    res.status(200).json({ nutrients: nutrients });
};

const addNutrient = async (req, res) => {
    const { name, dailyRecommendedIntake, nutrientNumber, unitName } = req.body;

    const nutrient = await Nutrient.create({
        name: name,
        nutrientNumber: nutrientNumber,
        unitName: unitName,
        dailyRecommendedIntake: dailyRecommendedIntake,
    });

    console.log(nutrient);
    res.status(201).json(nutrient);
};

const deleteNutrient = async (req, res) => {
    const { nutrientName } = req.params;
    const deletedNutrient = await Nutrient.deleteOne({
        name: nutrientName,
    });
    res.status(200).json({ message: deletedNutrient });
};

const updateNutrient = async (req, res) => {
    const { nutrientName } = req.params;
    const { nutrient } = req.body;
    if (!nutrient) {
        throw new BadRequestError("Please provide updated nutrient");
    }

    let newNutrient = await Nutrient.findOneAndUpdate(
        { name: nutrientName },
        nutrient,
        {
            returnDocument: true,
            runValidators: true,
        },
    );
    if (newNutrient === null) {
        newNutrient = await Nutrient.findOne({ name: nutrient.name });
    }
    if (newNutrient === null) {
        throw new NotFoundError(`nutrient ${nutrientName} was not found`);
    }
    res.status(200).json(newNutrient);
};

const pullNutrientsFromUsda = async (req, res) => {
    const foodDataId = "170457";
    var foodInfo = await fetch(
        `https://api.nal.usda.gov/fdc/v1/food/${foodDataId}?format=abridged&api_key=DEMO_KEY`,
        {
            method: "GET",
        },
    );
    foodInfo = await foodInfo.json();
    const nutrients = foodInfo.foodNutrients;
    nutrients.forEach(async (nutrient) => {
        await Nutrient.create({
            name: nutrient.name.toLowerCase().split(/ |,/)[0],
            nutrientNumber: nutrient.number,
            unitName: nutrient.unitName,
        });
    });
    res.status(200).send("success");
};

module.exports = {
    getNutrient,
    addNutrient,
    getAllNutrient,
    deleteNutrient,
    updateNutrient,
    pullNutrientsFromUsda,
};
