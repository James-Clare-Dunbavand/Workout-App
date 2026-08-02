import { useEffect, useMemo, useState } from "react";
import Cards from "../features/cards/Cards";
import Sidebar from "../features/sidebar/Sidebar";
import type {
    Ingredient,
    IngredientData,
    NutrientData,
} from "../types/ingredient";
import SidebarIngredient from "../components/sidebarIngredientCard/SidebarIngredientCard.tsx";
import IngredientCard from "../components/ingredientCard/IngredientCard.tsx";
import { getIngredients } from "../utils/api.ts";
import type {
    ChangeIngredientQuantity,
    RemoveSidebarIngredient,
} from "../types/actions.ts";
import IngredientBuilder from "../features/ingredientBuilder/IngredientBuilder.tsx";

const initialNutrientsData: { name: string; value: number }[] = [
    { name: "calorie", value: 0 },
    { name: "fat", value: 0 },
    { name: "fiber", value: 0 },
    { name: "protein", value: 0 },
    { name: "carbs", value: 0 },
    { name: "sodium", value: 0 },
];

export default function RecipeBuilder() {
    const [isIngredientFormActive, setIsIngredientFormActive] =
        useState<boolean>(false);
    const [ingredientsData, setIngredientsData] = useState<IngredientData[]>(
        [],
    );
    const [searchResultIds, setSearchResultIds] = useState<string[]>([]);
    const [ingredientsById, setIngredientsById] = useState<
        Map<string, Ingredient>
    >(new Map());

    const updateSearchedIngredients = (
        fetchedIngredients: Ingredient[],
    ): void => {
        setIngredientsById((prev) => {
            const next = new Map(prev);
            fetchedIngredients.forEach((ingredient) => {
                next.set(ingredient._id, ingredient);
            });

            return next;
        });
        setSearchResultIds(
            fetchedIngredients.map((ingredient) => ingredient._id),
        );
    };
    const addSearchResultIngredients = (ingredients: Ingredient[]) => {
        setIngredientsById((prev) => {
            const next = new Map(prev);
            ingredients.forEach((ingredient) => {
                next.set(ingredient._id, ingredient);
            });
            return next;
        });
        setSearchResultIds((prev) => [
            ...prev,
            ...ingredients.map((ingredient) => ingredient._id),
        ]);
    };

    const changeIngredientQuantity: ChangeIngredientQuantity = (
        newQuantity,
        ingredientId,
    ) => {
        console.log(newQuantity);
        setIngredientsData((prev) =>
            prev.map((ingredientData) =>
                ingredientData.ingredient._id === ingredientId
                    ? { ...ingredientData, quantity: newQuantity }
                    : ingredientData,
            ),
        );
    };
    const removeIngredient: RemoveSidebarIngredient = (ingredientId) => {
        setIngredientsData((prev) =>
            prev.filter(
                (ingredientData) =>
                    ingredientData.ingredient._id !== ingredientId,
            ),
        );
    };

    useEffect(() => {
        const loadRecipes = async () => {
            const fetchedIngredients = await getIngredients();
            updateSearchedIngredients(fetchedIngredients);
        };
        loadRecipes();
    }, []);

    const formatIngredientData = (ingredient: Ingredient): IngredientData => {
        return {
            name: ingredient.name,
            ingredient: ingredient,
            quantity: ingredient.servingSize,
        };
    };

    const addSidebarIngredient = (ingredientId: string) => {
        const ingredient = ingredientsById.get(ingredientId);
        if (!ingredient) {
            throw new Error("ingredient doesn't exist");
        }
        setIngredientsData((prev) => [
            ...prev,
            formatIngredientData(ingredient),
        ]);
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
        <div id="body">
            {isIngredientFormActive && (
                <IngredientBuilder
                    addSearchResultIngredients={addSearchResultIngredients}
                />
            )}
            <Sidebar
                ingredientsData={ingredientsData}
                nutrientsData={nutrientsData}
                SidebarCard={SidebarIngredient}
                removeIngredient={removeIngredient}
                changeIngredientQuantity={changeIngredientQuantity}
            />
            <div className="main-wrapper">
                <Cards
                    CardComponent={IngredientCard}
                    searchResultIds={searchResultIds}
                    addSidebarCard={addSidebarIngredient}
                    cardsById={ingredientsById}
                />
                <button
                    onClick={() => {
                        console.log("click");
                        setIsIngredientFormActive((prev) => !prev);
                    }}
                >
                    +
                </button>
            </div>
        </div>
    );
}
