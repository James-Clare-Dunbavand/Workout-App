const { getRecipe, addRecipe, updateRecipe, deleteRecipe, getAllRecipes } = require('../controlers/recipeControler.js');

const express = require('express');
const router = express.Router();


router.route('/').get(getAllRecipes).post(addRecipe);
router.route('/:recipeName').get(getRecipe).delete(deleteRecipe).patch(updateRecipe);



module.exports = router
