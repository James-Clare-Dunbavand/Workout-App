import { createCard, createSidebarCard } from "./utils/createCard.js";
import { getIngredients } from "./utils/api.js";
const ingredientInputQuantity = document.querySelectorAll(
    ".sidebar-card-quantity",
);
const sidebarIngredients = document.getElementById("sidebar-ingredients");
const createRecipeForm = document.getElementById("item-builder-header");

const imageInput = document.getElementById("image-input");
let imageUrl = "defaultPath";

const ingredientsSection = document.getElementById("ingredients");
let ingredientsSet = new Map();
let basket = new Map();
window.basket = basket;

const updateBasketQuantity = (ingredientName, newQuantity) => {
    basket.get(ingredientName).quantity = newQuantity;
    updateBasketNutrients();
};

createRecipeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const ingredients = [];
    basket.forEach((ingredient) => {
        ingredients.push({
            name: ingredient.name,
            quantity: ingredient.quantity,
        });
    });

    const recipeName = createRecipeForm.name.value;
    if (ingredients == {} || !recipeName || recipeName == "") {
        alert("bad recipe");
        return;
    }
    const payload = {
        name: recipeName,
        recipeIngredients: ingredients,
        imageUrl,
    };
    const response = await fetch("api/v1/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
});

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
const populateIngredients = async () => {
    try {
        const { ingredients } = await getIngredients();
        console.log(ingredients);
        ingredientsSet = new Map();
        for (const ingredient of ingredients) {
            ingredientsSet.set(ingredient.name, ingredient);
            ingredientsSection.append(
                createCard(
                    ingredient.name,
                    ingredient.foodNutrients,
                    ingredient.imageUrl,
                ),
            );
        }
    } catch (error) {
        console.log(error);
    }
};

populateIngredients();

sidebarIngredients.addEventListener("click", (e) => {
    if (e.target.classList.contains("ingredient-button")) {
        const quantity = e.target.parentElement.querySelector(
            ".sidebar-card-quantity",
        );
        const ingredient = basket.get(
            quantity.parentElement.parentElement.name,
        );
        quantity.value = Math.max(
            0,
            Number(quantity.value) +
                Number(e.target.innerText + ingredient.servingSize),
        );
        updateBasketQuantity(ingredient.name, quantity.value);
    }
});

ingredientsSection.addEventListener("click", (e) => {
    if (e.target.classList.contains("card-add-button")) {
        const ingredientToAdd = ingredientsSet.get(e.target.parentElement.name);
        if (ingredientToAdd == null || ingredientToAdd == undefined) {
            console.error("no ingredient to add");
            return;
        }
        if (basket.has(ingredientToAdd.name)) {
            alert("already in basket");
            return;
        }

        basket.set(ingredientToAdd.name, ingredientToAdd);
        updateBasketQuantity(ingredientToAdd.name, ingredientToAdd.servingSize);
        sidebarIngredients.append(
            createSidebarCard(ingredientToAdd, updateBasketQuantity),
        );
    }
});

imageInput.addEventListener("change", async () => {
    const file = imageInput.files[0];
    const formData = new FormData();
    formData.append("image", file);
    console.log(formData);

    try {
        const response = await fetch("api/v1/upload/image", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        imageUrl = data.image.src;
    } catch (error) {
        console.log(error);
    }
});
