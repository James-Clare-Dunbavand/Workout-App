export type Ingredient = {
    category: string;
    foodNutrients: Record<string, number>;
    imageUrl: string;
    name: string;
    servingSize: number;
    _id: string;
};
export type CreateIngredient = {
    category: string;
    foodNutrients: Partial<Record<Nutrient, number>>;
    imageUrl: string;
    name: string;
    servingSize: number;
    costPer100: number;
    fdcId?: string;
};
export type Nutrient =
    | "protein"
    | "calorie"
    | "fiber"
    | "fat"
    | "carbs"
    | "sodium";

export type IngredientData = {
    name: string;
    ingredient: Ingredient;
    quantity: number;
};

export type NutrientData = { name: string; value: number };
