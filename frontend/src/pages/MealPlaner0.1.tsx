import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "../features/recipeSidebar/RecipeSidebar.tsx";
import SidebarCard from "../components/recipeSidebarCard/RecipeSidebarCard.tsx";
import type { SideBarRecipe, Recipe, RecipesById } from "../types/recipe";
import type { Meal } from "../types/meal.ts";
import type { NutrientData } from "../types/ingredient";
import { getIngredientNutrients, sumNutrients } from "../utils/nutrients.ts";
import Cards from "../features/cards/Cards.tsx";
import MealCalendar from "../features/mealCalendar/MealCalendar.tsx";
import { getMeals, getRecipes } from "../utils/api.ts";
import RecipeCard from "../components/recipeCard/RecipeCard.tsx";
export default function MealPlaner() {
    const [recipesById, setRecipesById] = useState<RecipesById>(new Map());
    const [searchResultIds, setSearchResultIds] = useState<string[]>([]);
    const [sideBarRecipes, setSideBarRecipes] = useState<SideBarRecipe[]>([]);
    const [meals, setMeals] = useState<Meal[]>([]);
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

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const responseMeals = await getMeals();
                setMeals(responseMeals);
            } catch (error) {
                console.error(error);
            }
        };
        fetchMeals();
    }, []);

    const changeRemainingPortions = (id: string, newQuantity: number): void => {
        const prev = sideBarRecipes;
        const update = prev.map((c) => {
            if (c._id === id) {
                return { ...c, remainingPortions: newQuantity };
            }
            return c;
        });
        setSideBarRecipes(update);
    };
    const removeSidebarCard = (id: string): void => {
        setSideBarRecipes((prev) => {
            return prev.filter((c) => c._id != id);
        });
    };
    const addSidebarRecipe = (id: string) => {
        const newRecipe = recipesById.get(id);
        if (!newRecipe) throw new Error("Recipe not in hexmap");
        if (
            sideBarRecipes.filter((recipe) => recipe._id === newRecipe._id)
                .length > 0
        ) {
            alert("Recipe already exists");
            throw new Error("Recipe already exists");
        }
        const newRecipeData: SideBarRecipe = {
            _id: newRecipe._id,
            remainingPortions: newRecipe.portions | 1,
            totalPortions: newRecipe.portions | 1,
        };
        setSideBarRecipes((prev) => [...prev, newRecipeData]);
    };

    const nutrientsData: NutrientData[] = useMemo(() => {
        return sumNutrients(
            sideBarRecipes.flatMap(({ _id }) => {
                const recipe = recipesById.get(_id);
                if (!recipe) return [];
                return recipe.ingredients.map(({ ingredient }) =>
                    getIngredientNutrients(ingredient),
                );
            }),
        );
    }, [sideBarRecipes, recipesById]);

    return (
        <div id="body">
            <Sidebar
                removeSidebarCard={removeSidebarCard}
                cardsData={sideBarRecipes}
                changeCardQuantity={changeRemainingPortions}
                nutrientsData={nutrientsData}
                SidebarCard={SidebarCard}
                recipesById={recipesById}
                meals={meals}
            />
            <div className="main-wrapper">
                <MealCalendar
                    recipesById={recipesById}
                    meals={meals}
                    setMeals={setMeals}
                    setRecipesById={setRecipesById}
                />
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
