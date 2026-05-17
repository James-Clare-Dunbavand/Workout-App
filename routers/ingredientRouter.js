const {
    testFunc,
    getIngredient,
    addIngredientManualOld,
    getAllIngredient,
    deleteIngredient,
    updateIngredient,
    pullAndAddIngredientInformationUsda,
    addIngredients,
} = require("../controlers/ingredientControler.js");

const express = require("express");
const router = express.Router();

router.route("/").get(getAllIngredient).post(addIngredients);
router
    .route("/addIngredientFromUsda")
    .post(pullAndAddIngredientInformationUsda);
router.route("/pullIngredientInformation/:foodDataId").get(async (req, res) => {
    const { foodDataId } = req.params;
    console.log(foodDataId);
    const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods?api_key=eu0E2bRkHxT2i2l51LHVn9yGNf8gBtwaVL1ntWn7`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fdcIds: [foodDataId],
                format: "abridged",
            }),
        },
    );
    console.log(response);
    const ingredients = await response.json();

    console.log(ingredients);
    if (ingredients.error) {
        throw ingredients.error;
    }
    res.json(ingredients);
});
router
    .route("/:ingredientName")
    .get(getIngredient)
    .patch(updateIngredient)
    .delete(deleteIngredient);

module.exports = router;
