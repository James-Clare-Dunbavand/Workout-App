const {
    modifyShoppingState,
    modifyMealPlan,
    creatMealPlan,
    getMealPlan,
    getMealPlans,
    deleteMealPlan,
    modifyRecipeInstances,
} = require("../controlers/mealPlanControler.js");

const express = require("express");
const router = express.Router();

router.route("/").post(creatMealPlan).get(getMealPlans);
router
    .route("/:id")
    .get(getMealPlan)
    .patch(modifyMealPlan)
    .delete(deleteMealPlan);
router.route("/:id/shopping-state").patch(modifyShoppingState);
router.route("/:id/recipe-instances").patch(modifyRecipeInstances);

// router.route("/:id").delete(deleteMealPlan);

module.exports = router;
