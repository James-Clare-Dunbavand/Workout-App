import { useEffect, useRef, useState } from "react";
import type { RemoveSidebarCard } from "../../types/actions";
import type { RecipeInstance } from "../../types/recipe";
import { useRecipesById } from "../../contexts/recipeById/useRecipeById";
import { useMealPlansActions } from "../../contexts/mealPlans/useMealPlansHook";

type Props = {
    removeSidebarRecipe: RemoveSidebarCard;
    recipeData: RecipeInstance;
};

export default function RecipeSidebarCard({ recipeData }: Props) {
    const { recipesById } = useRecipesById();

    const remainingPortions = recipeData.remainingPortions;
    const totalPortions = recipeData.totalPortions;
    const { changeRecipePortions, removeRecipeFromMealPlan } =
        useMealPlansActions();

    if ("ingredient" in recipeData) {
        throw new Error("should be a Recipe not an ingerdient");
    }
    const recipe = recipesById.get(recipeData.recipeId);
    if (!recipe) throw new Error(`no recipe at this id ${recipeData.recipeId}`);

    const { imageUrl, name, _id: recipeId } = recipe;

    return (
        <li
            className="sidebar-card"
            draggable="true"
            data-name={name}
            data-imageurl={imageUrl}
            data-recipe-id={recipeId}
        >
            <img src={imageUrl} alt="" draggable="false" />
            <div className="remainingPortions-selector">
                <button
                    type="button"
                    className="ingredient-button"
                    onClick={() => {
                        if (totalPortions <= 1)
                            removeRecipeFromMealPlan(recipeId);
                        if (remainingPortions < 1) {
                            return;
                        }
                        changeRecipePortions(
                            totalPortions - 1,
                            remainingPortions - 1,
                            recipeData.recipeId,
                        );
                    }}
                >
                    {Number(totalPortions) <= 1 ? "D" : "-"}
                </button>
                <div>
                    <span>{String(remainingPortions)}</span>/
                    <span>{String(totalPortions)}</span>
                </div>
                <button
                    type="button"
                    className="ingredient-button"
                    onClick={() => {
                        changeRecipePortions(
                            totalPortions + 1,
                            remainingPortions + 1,
                            recipeData.recipeId,
                        );
                    }}
                >
                    +
                </button>
            </div>
        </li>
    );
}
