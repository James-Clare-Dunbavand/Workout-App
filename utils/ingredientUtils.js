const { nutrientIds } = require("../utils/nutrientUtils.js");
const Nutrient = require("../models/foodNutrientModel.js");
const Ingredient = require("../models/ingredientModel.js");

const addIngredient = async (reqIngredient, fdcMap) => {
    let formattedIngredient;

    console.log(JSON.stringify(fdcMap.get(reqIngredient.fdcId), null, 2));
    reqIngredient.fdcId
        ? (formattedIngredient = await fdcIngredientToModelFormat(
              fdcMap.get(reqIngredient.fdcId),
          ))
        : (formattedIngredient = { foodNutrients: [] });

    formattedIngredient = ingredientToDbFormat(
        reqIngredient,
        formattedIngredient,
    );
    console.log(JSON.stringify(formattedIngredient, null, 2));
    return await Ingredient.create(formattedIngredient);
};

const ingredientToDbFormat = (reqIngredient, formattedIngredient) => {
    const fields = [
        "name",
        "category",
        "servingSize",
        "costPer100",
        "imageUrl",
    ];
    fields.forEach((field) => {
        if (reqIngredient[field] != null) {
            formattedIngredient[field] = reqIngredient[field];
        }
    });
    nutrientIds.forEach((value, key) => {
        console.log("my key", key, "my reqIng", reqIngredient);
        if (!reqIngredient.foodNutrients[key]) {
            return;
        }
        const element = formattedIngredient.foodNutrients.find((nutrient) =>
            nutrient.foodNutrient.equals(value),
        );
        if (element) {
            element.amountPer100 = reqIngredient.foodNutrients[key];
        } else {
            formattedIngredient.foodNutrients.push({
                foodNutrient: value,
                amountPer100: reqIngredient.foodNutrients[key],
            });
        }
    });

    return formattedIngredient;
};
const responseIngredient = (ingredient) => {
    const response = {
        _id: ingredient._id,
        name: ingredient.name,
        category: ingredient.category,
        servingSize: ingredient.servingSize,
        costPerServing: ingredient.costPerServing,
        imageUrl: ingredient.imageUrl,
        foodNutrients: Object.fromEntries(
            ingredient.foodNutrients.map((nutrient) => [
                nutrient.foodNutrient.name,
                nutrient.amountPer100,
            ]),
        ),
    };
    return response;
};

const formatFdcIngredients = async (fdcIngredients) => {
    const newIngredients = [];
    for (const ingredient of fdcIngredients) {
        newIngredients.push(await fdcIngredientToModelFormat(ingredient));
    }
    //
    return newIngredients;
};

const fetchFdcIngredients = async (fdcIdArray) => {
    const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods?api_key=eu0E2bRkHxT2i2l51LHVn9yGNf8gBtwaVL1ntWn7`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fdcIds: fdcIdArray,
                format: "abridged",
            }),
        },
    );
    const ingredients = await response.json();

    if (ingredients.error) {
        throw ingredients.error;
    }
    const ingredientsMap = new Map();
    ingredients.map((ingredient) => {
        ingredientsMap.set(ingredient.fdcId, ingredient);
    });

    return ingredientsMap;
};

const addManualIngredientData = (
    formattedFdcIngredients,
    manualIngredientsDataMap,
) => {
    console.log(JSON.stringify(formattedFdcIngredients, null, 2));
    for (const formattedFdcIngredient of formatedFdcIngredients) {
        if (!manualIngredientsDataMap.get(formattedFdcIngredient.fdcId)) {
            continue;
        }
        const manualIngredientData = manualIngredientsDataMap.get(
            formattedFdcIngredient.fdcId,
        );
        const proteinPer100 = Object.values(formattedFdcIngredient).find(
            (obj) => obj.foodNutrient === nutrientIds["protien"],
        );
        const caloriePer100 = Object.values(formattedFdcIngredient).find(
            (obj) => obj.foodNutrient === nutrientIds["calorie"],
        );

        caloriePer100.quantity =
            manualIngredientData.caloriePer100 ?? caloriePer100;
        proteinPer100.quantity =
            manualIngredientData.proteinPer100 ?? proteinPer100;

        Object.hasOwn(manualIngredientData, "foodName") &&
            (formattedFdcIngredient.name = manualIngredientData.foodName);

        Object.hasOwn(manualIngredientData, "category") &&
            (formattedFdcIngredient.category = manualIngredientData.category);

        Object.hasOwn(manualIngredientData, "servingSize") &&
            (formattedFdcIngredient.servingSize =
                manualIngredientData.servingSize);

        Object.hasOwn(manualIngredientData, "costPerServing") &&
            (formattedFdcIngredient.costPerServing =
                manualIngredientData.costPerServing);
    }

    return formattedFdcIngredients;
};

const fdcIngredientToModelFormat = async (ingredient) => {
    const formattedIngredient = {};

    formattedIngredient.name = ingredient.description
        .toLowerCase()
        .split(/ |,/)[0];
    formattedIngredient.fdcId = ingredient.fdcId;

    formattedIngredient.foodNutrients = await formatNutrients(
        ingredient.foodNutrients,
    );

    //
    return formattedIngredient;
};

const formatNutrients = async (foodNutrients) => {
    const operations = createDBOperations(foodNutrients);
    await Nutrient.bulkWrite(operations);

    const dbNutrients = await Nutrient.find({
        nutrientNumber: {
            $in: foodNutrients.map((nutrient) => nutrient.number),
        },
    });

    const dbNutrientsMap = new Map(
        dbNutrients.map((n) => [n.nutrientNumber, n]),
    );

    return foodNutrients.map((n) => ({
        foodNutrient: dbNutrientsMap.get(Number(n.number))._id,
        amountPer100: n.amount,
    }));
};

const createDBOperations = (foodNutrients) => {
    const operations = foodNutrients.map((nutrient) => ({
        updateOne: {
            filter: {
                nutrientNumber: nutrient.number,
            },
            update: {
                $setOnInsert: {
                    name: nutrient.name.toLowerCase().split(/ |,/)[0],
                    nutrientNumber: nutrient.number,
                    unitName: nutrient.unitName,
                },
            },
            upsert: true,
        },
    }));

    return operations;
};

module.exports = {
    fetchFdcIngredients,
    responseIngredient,
    addManualIngredientData,
    fdcIngredientToModelFormat,
    formatNutrients,
    formatFdcIngredients,
    addIngredient,
};
