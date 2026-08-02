import { getRecipes } from "./utils/api.js";
import { createCard, createSidebarCard } from "./utils/createCard.js";

const sidebarRecipes = document.getElementById("sidebar-recipes");

const recipesSection = document.getElementById("recipes");
let recipesSet = new Map();

let basket = new Map();
window.basket = basket;

const populateRecipes = async () => {
    try {
        const { recipes } = await getRecipes();
        recipesSet = new Map();
        const nutrients = {
            calorie: 0,
            fat: 0,
            fiber: 0,
            protein: 0,
            carbs: 0,
            sodium: 0,
        };
        for (const recipe of recipes) {
            recipesSet.set(recipe.name, recipe);
            recipesSection.append(
                createCard(
                    recipe.name,
                    nutrients,
                    recipe.imageUrl,
                    recipe.ingredients,
                ),
            );
        }
    } catch (error) {
        console.log(error);
    }
};

populateRecipes();

const updateBasketQuantity = (ingredientName, newQuantity) => {
    basket.get(ingredientName).quantity = newQuantity;
    // updateBasketNutrients();
};

const updateBasketNutrients = () => {
    const totalNutrients = {
        calorie: 0,
        fat: 0,
        fiber: 0,
        protein: 0,
        carbs: 0,
        sodium: 0,
    };
    basket.forEach((ingredient) => {
        const { calorie, fat, fiber, protein, carbs, sodium } =
            ingredient.foodNutrients;
        totalNutrients.calorie += (calorie * ingredient.quantity) / 100;
        totalNutrients.fat += (fat * ingredient.quantity) / 100;
        totalNutrients.fiber += (fiber * ingredient.quantity) / 100;
        totalNutrients.protein += (protein * ingredient.quantity) / 100;
        totalNutrients.carbs += (carbs * ingredient.quantity) / 100;
        totalNutrients.sodium += (sodium * ingredient.quantity) / 100;
    });
    for (const [key, value] of Object.entries(totalNutrients)) {
        const li = document.querySelector(`[data-nutrient="${key}"]`);
        if (!li) continue;
        const span = li.querySelector("span");
        if (span) {
            console.log(value);
            span.textContent = Math.round(value);
        }
    }
};

recipesSection.addEventListener("click", (e) => {
    if (e.target.classList.contains("card-add-button")) {
        const recipeToAdd = recipesSet.get(e.target.parentElement.name);
        if (recipeToAdd == null || recipeToAdd == undefined) {
            console.error("no recipe to add");
            return;
        }
        if (basket.has(recipeToAdd.name)) {
            alert("already in basket");
            return;
        }

        basket.set(recipeToAdd.name, recipeToAdd);
        updateBasketQuantity(recipeToAdd.name, recipeToAdd.servingSize);
        sidebarRecipes.append(
            createSidebarCard(recipeToAdd, updateBasketQuantity),
        );
    }
});
