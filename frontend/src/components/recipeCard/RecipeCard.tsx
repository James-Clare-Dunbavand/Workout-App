import "./card.css";
import notFound from "../../images/Image-not-found.png";

import NutrientDisplay from "../nutrientDisplay/NutrientDisplay";
import { nutrientConfig } from "../../utils/nutrients";
import type { AddSidebarRecipe } from "../../types/actions";
import type { Recipe } from "../../types/recipe";
import { memo } from "react";

type RecipeCardProps = {
    recipe: Recipe;
    addSidebarRecipe: AddSidebarRecipe;
};

function RecipeCard({ recipe, addSidebarRecipe }: RecipeCardProps) {
    const { name, foodNutrients, imageUrl, _id } = recipe;

    const NutrientsDisplay = nutrientConfig.map((nutrient) => {
        return (
            <NutrientDisplay
                key={nutrient.name}
                nutrientName={nutrient.name}
                nutrientValue={foodNutrients[nutrient.name]}
                nutrientDaily={nutrient.value}
            />
        );
    });

    return (
        <article className="card">
            <img
                src={
                    !imageUrl ||
                    imageUrl === "/images/Image-not-found.png" ||
                    imageUrl == ""
                        ? notFound
                        : imageUrl
                }
                alt=""
            />
            <h3>{name}</h3>

            <div className="card-info">
                <ul className="card-nutrients">{NutrientsDisplay}</ul>
            </div>
            <button
                type="button"
                className="card-add-button"
                onClick={() => addSidebarRecipe(_id)}
            >
                Add
            </button>
        </article>
    );
}

export default memo(RecipeCard);
