import type { Ingredient, NutrientData } from "../types/ingredient";

export const nutrientConfig: NutrientData[] = [
    { name: "calorie", value: 2200 },
    { name: "fat", value: 80 },
    { name: "fiber", value: 38 },
    { name: "protein", value: 70 },
    { name: "carbs", value: 400 },
    { name: "sodium", value: 1500 },
];

export const sumNutrients = (
    nutrientsData: NutrientData[][],
): NutrientData[] => {
    return nutrientsData.reduce(
        (total, current) =>
            total.map(({ name, value }) => ({
                name,
                value:
                    value + (current.find((n) => n.name === name)?.value ?? 0),
            })),
        nutrientConfig.map(({ name }) => ({
            name,
            value: 0,
        })),
    );
};

export const getIngredientNutrients = (
    ingredient: Ingredient,
): NutrientData[] => {
    const nutrients = nutrientConfig.map(({ name }) => {
        return { name: name, value: ingredient.foodNutrients[name] };
    });
    return nutrients;
};
