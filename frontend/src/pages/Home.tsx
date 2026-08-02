import Cards from "../features/cards/Cards.tsx";
import Sidebar from "../features/sidebar/Sidebar.tsx";
import { getIngredients } from "../utils/api.ts";
import type {
    Ingredient,
    IngredientData,
    NutrientData,
} from "../types/ingredient.ts";
import type {
    RemoveSidebarIngredient,
    ChangeIngredientQuantity,
} from "../types/actions.ts";

import { useMemo, useState } from "react";

const initialNutrientsData: { name: string; value: number }[] = [
    { name: "calorie", value: 0 },
    { name: "fat", value: 0 },
    { name: "fiber", value: 0 },
    { name: "protein", value: 0 },
    { name: "carbs", value: 0 },
    { name: "sodium", value: 0 },
];

export default function Home() {
    const addSidebarIngredient = (ingredient: Ingredient): void => {
        if (
            ingredientsData.filter((ing) => ing.name === ingredient.name)
                .length < 1
        ) {
            const formatedIngredient: IngredientData = {
                name: ingredient.name,
                ingredient,
                quantity: ingredient.servingSize,
            };
            setIngredientsData((prev) => [...prev, formatedIngredient]);
        } else {
            alert("Ingredient already in basket");
        }
    };

    const removeSidebarIngredient: RemoveSidebarIngredient = (
        ingredientData,
    ) => {
        const ingredientToRemove = ingredientsData.filter(
            (ing) => ing.name === ingredientData.name,
        );
        if (!ingredientToRemove) {
            console.error("Ingredient doesn't exist");
        } else {
            setIngredientsData((prev) =>
                prev.filter((ing) => ing.name !== ingredientData.name),
            );
        }
    };

    const [ingredientsData, setIngredientsData] = useState<IngredientData[]>(
        [],
    );

    const changeIngredientQuantity: ChangeIngredientQuantity<IngredientData> = (
        ingredientData,
        newQuantity,
    ) => {
        setIngredientsData((prev) => {
            return prev.map((ing) => {
                if (ing.name === ingredientData.name) {
                    return { ...ingredientData, quantity: newQuantity };
                } else {
                    return ing;
                }
            });
        });
    };

    const nutrientsData: NutrientData[] = useMemo(() => {
        const getNutrientValue = (nutrientName: string): number => {
            let value = 0;
            ingredientsData.forEach((ingredientData) => {
                value +=
                    (ingredientData.ingredient.foodNutrients[nutrientName] *
                        ingredientData.quantity) /
                    100;
                //the food nutrients are stored per 100g
            });

            return Math.round(value);
        };
        return initialNutrientsData.map((nutrient) => ({
            name: nutrient.name,
            value: getNutrientValue(nutrient.name),
        }));
    }, [ingredientsData]);

    return (
        <div>
            <div id="body">
                <Sidebar
                    removeSidebarIngredient={removeSidebarIngredient}
                    ingredientsData={ingredientsData}
                    changeIngredientQuantity={changeIngredientQuantity}
                    nutrientsData={nutrientsData}
                />
                <Cards
                    addSidebarCard={addSidebarIngredient}
                    getCards={getIngredients}
                />
            </div>
        </div>
    );
}
