const {
    addMeal,
    getMeals,
    deleteMeal,
} = require("../controlers/mealControler.js");

const express = require("express");
const router = express.Router();

router.route("/").get(getMeals).post(addMeal);
router.route("/:id").delete(deleteMeal);

module.exports = router;
