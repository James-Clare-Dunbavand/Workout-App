import type { IngredientData } from "./ingredient.ts";

export type Recipe = {
    _id: string;
    name: string;
    ingredients: IngredientData[];
    foodNutrients: Record<string, number>;
    imageUrl: string;
    portions: number;
};
export type SideBarRecipe = {
    _id: string;
    remainingPortions: number;
    totalPortions: number;
};

export type RecipeInstance = {
    recipeId: string;
    remainingPortions: number;
    totalPortions: number;
};

export type RecipesById = Map<string, Recipe>;
