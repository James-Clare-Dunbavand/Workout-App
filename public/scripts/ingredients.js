import { createCard } from "./utils/createCard.js";
import { getIngredients } from "./utils/api.js";

const ingredientsSection = document.getElementById("ingredients");

ingredientsSection.append(createCard("a", {}, "images/download.jfif"));

const populateIngredients = async () => {
    try {
        const { ingredients } = await getIngredients();
        for (const ingredient of ingredients) {
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
