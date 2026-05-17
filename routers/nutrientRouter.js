const express = require("express");
const router = express.Router();
const {
    getNutrient,
    addNutrient,
    getAllNutrient,
    deleteNutrient,
    updateNutrient,
    pullNutrientsFromUsda,
} = require("../controlers/nutrientControler.js");

router.route("/").post(addNutrient).get(getAllNutrient);
router.route("/pullNutrients").get(pullNutrientsFromUsda);
router
    .route("/:nutrientName")
    .patch(updateNutrient)
    .get(getNutrient)
    .delete(deleteNutrient);

module.exports = router;
