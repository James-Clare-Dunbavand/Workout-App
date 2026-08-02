import { useCallback, useEffect, useState } from "react";
import Sidebar from "../features/recipeSidebar/RecipeSidebar.tsx";
import SidebarCard from "../components/recipeSidebarCard/RecipeSidebarCard.tsx";
import type { Recipe, RecipesById } from "../types/recipe";
import Cards from "../features/cards/Cards.tsx";
import MealCalendar from "../features/mealCalendar/MealCalendar.tsx";
import RecipeCard from "../components/recipeCard/RecipeCard.tsx";
import { useMealPlansActions } from "../contexts/mealPlans/useMealPlansHook.ts";
import { useRecipesById } from "../contexts/recipeById/useRecipeById.ts";
import { getRecipes } from "../utils/api.ts";

export default function MealPlaner() {
    const [searchResultIds, setSearchResultIds] = useState<string[]>([]);
    const changeRemainingPortions = () => {};
    const nutrientsData = [];
    const meals = [];
    const { addRecipeToMealPlan } = useMealPlansActions();
    const setMeals = () => {};
    const addSidebarRecipe = (id: string) => {
        const recipe = recipesById.get(id);
        if (recipe) {
            addRecipeToMealPlan(recipe);
        }
    };
    const { recipesById, setRecipesById } = useRecipesById();

    const updateSearchedRecipes = (fetchedRecipes: Recipe[]): void => {
        setRecipesById((prev) => {
            const next = new Map(prev);
            fetchedRecipes.forEach((recipe) => {
                next.set(recipe._id, recipe);
            });

            return next;
        });
        setSearchResultIds(fetchedRecipes.map((recipe) => recipe._id));
    };

    const fetchAndUpdateRecipes = useCallback(async (searchQuery?: string) => {
        const fetchedRecipes = await getRecipes(searchQuery);
        updateSearchedRecipes(fetchedRecipes);
    }, []);

    useEffect(() => {
        const loadRecipes = async () => {
            const fetchedRecipes = await getRecipes();
            updateSearchedRecipes(fetchedRecipes);
        };
        loadRecipes();
    }, []);

    return (
        <div id="body">
            <Sidebar
                changeCardQuantity={changeRemainingPortions}
                nutrientsData={nutrientsData}
                SidebarCard={SidebarCard}
            />
            <div className="main-wrapper">
                <MealCalendar meals={meals} setMeals={setMeals} />
                <Cards
                    CardComponent={RecipeCard}
                    searchResultIds={searchResultIds}
                    addSidebarCard={addSidebarRecipe}
                    getCards={fetchAndUpdateRecipes}
                    cardsById={recipesById}
                />
            </div>
        </div>
    );
}
