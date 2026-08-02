import type { RecipeInstance } from "./recipe";

export type MealPlan = {
    recipeInstances: RecipeInstance[];
    name: string;
    meals: Meal[];
    shoppingState: Map<string, ShoppingState>;
    _id: string;
};

export type ShoppingState = {
    checked: boolean;
    note: string;
    quantityOverride: number;
};
export type Meal = {
    name: string;
    start: Date;
    end: Date;
    servings: number;
    _id: string;
    recipe: string;
};
export type MealEvent = {
    title: string;
    start: Date;
    end: Date;
    extendedProps: {
        mealId: string;
        servings: number;
        imageUrl: string;
    };
};
