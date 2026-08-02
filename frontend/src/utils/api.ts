import type { Ingredient } from "../types/ingredient";
import type { MealPlan } from "../types/meal";
import type { Recipe, Meal } from "../types/recipe";

export const getIngredients = async () => {
    const response = await fetch("/api/v1/ingredient");

    if (!response.ok) {
        throw new Error(`Failed to fetch ingredients: ${response.status}`);
    }
    return response.json();
};
export const addIngredientApi = async (ingredient: Partial<Ingredient>) => {
    const uri = "/api/v1/ingredient";

    const response = await fetch(uri, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: [ingredient] }),
    });

    const json = await response.json();
    if (!response.ok) {
        throw new Error(`failed to create ingredient ${JSON.stringify(json)}}`);
    }
    return json;
};

export const getRecipes = async (searchQuerie?: string) => {
    try {
        const response = await fetch("/api/v1/recipe");

        if (!response.ok) {
            throw new Error(`Failed to fetch ingredients: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error(error);
    }
};

export const getMeals = async () => {
    const response = await fetch("/api/v1/meal");
    const json = await response.json();

    if (!response.ok) {
        throw new Error(`Failed to fetch meals: ${JSON.stringify(json)}`);
    }
    return json;
};

export const getRecipe = async (id: string): Promise<Recipe> => {
    const response = await fetch(`/api/v1/meal/${id}`);
    const json = await response.json();

    if (!response.ok) {
        throw new Error(`Failed to fetch meals: ${JSON.stringify(json)}`);
    }
    return json;
};

export const addMeal = async (meal: Omit<Meal, "_id">) => {
    const response = await fetch("/api/v1/meal", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(meal),
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch meals: ${JSON.stringify(response)}`);
    }
    const json = await response.json();
    return json;
};

export const uploadImage = async (image: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch("/api/v1/upload/image", {
        method: "POST",
        body: formData,
    });

    const json = await response.json();
    if (!response.ok) {
        throw new Error(`Image upload failed ${JSON.stringify(json)}`);
    }
    return json.image.src;
};

export const postRecipe = async (recipe: Recipe): Promise<void> => {
    const response = await fetch("/api/v1/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
    });
    const json = await response.json();

    if (!response.ok) {
        throw new Error(`Post new recipe failed ${JSON.stringify(json)}`);
    }
};

export const removeMeal = async (id: string): Promise<void> => {
    const url = `/api/v1/meal/${id}`;
    const response = await fetch(url, {
        method: "DELETE",
    });
    const json = await response.json();

    if (!response.ok) {
        throw new Error(`Post new recipe failed ${JSON.stringify(json)}`);
    }
};

export const createMealPlanApi = async (
    mealPlan: Omit<MealPlan, "_id">,
): Promise<MealPlan> => {
    const url = "/api/v1/mealPlan";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(mealPlan),
    });
    const json = response.json();
    if (!response.ok) {
        throw new Error(`Bad response: ${json}`);
    }
    return json;
};

export const deleteMealPlanApi = async (id: string): Promise<void> => {
    const response = await fetch(`/api/v1/mealPlan/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    const json = response.json();
    if (!response.ok) {
        throw new Error(`Bad response: ${json}`);
    }
    return json;
};

export const fetchAllMealPlansApi = async (): Promise<MealPlan[]> => {
    const response = await fetch("/api/v1/mealPlan");

    if (!response.ok) {
        throw new Error(`Failed to fetch ingredients: ${response.status}`);
    }
    return response.json();
};
export const modifyMealPlanApi = async (
    id: string,
    updatedMealPlan: MealPlan,
): Promise<MealPlan> => {
    const url = `/api/v1/mealPlan/${id}`;
    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ mealPlan: updatedMealPlan }),
    });
    const json = response.json();
    if (!response.ok) {
        throw new Error(`Bad response: ${json}`);
    }
    return json;
};
