import { useState } from "react";
import type {
    CreateIngredient,
    Ingredient,
    Nutrient,
} from "../../types/ingredient";
import { addIngredientApi } from "../../utils/api";
import "./ingredientBuilder.css";

type Props = {
    addSearchResultIngredients: (ingredients: Ingredient[]) => void;
};

export default function IngredientBuilder({
    addSearchResultIngredients,
}: Props) {
    const [imageUrl, setImageUrl] = useState("defaultPath");
    const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nutrientFields = [
            "calorie",
            "fat",
            "fiber",
            "protein",
            "carbs",
            "sodium",
        ] as const;
        const formData = new FormData(event.currentTarget);

        const foodNutrients: Partial<Record<Nutrient, number>> = {};
        nutrientFields.forEach((nutrient) => {
            const value = formData.get(nutrient);
            if (value !== null && value !== "") {
                foodNutrients[nutrient] = Number(value);
            }
        });

        const ingredient: CreateIngredient = {
            name: formData.get("name") as string,
            category: formData.get("category") as string,
            imageUrl: imageUrl,
            servingSize: Number(formData.get("servingSize")),
            costPer100: Number(formData.get("costPer100")),
            foodNutrients,
        };

        if (formData.get("fdcId") !== null && formData.get("fdcId") !== "") {
            ingredient.fdcId = formData.get("fdcId") as string;
        }

        try {
            const newIngredient = await addIngredientApi(ingredient);
            console.log(newIngredient);
            addSearchResultIngredients(newIngredient);
        } catch (error) {
            console.log(error);
        }
    };

    const imageUrlChangeHandler = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.currentTarget.files?.[0];
        if (!file) {
            return;
        }
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("/api/v1/upload/image", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            setImageUrl(data.image.src);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section id="form-wrapper">
            <form id="ingredient-form" onSubmit={submitHandler}>
                <h2>Ingredient Form</h2>

                <label htmlFor="ingredient-fdcId-input">
                    Ingredient fdc Id:
                </label>
                <input
                    type="text"
                    id="ingredient-fdcId-input"
                    name="fdcId"
                    placeholder="Fdc Id... (optional)"
                    defaultValue=""
                />

                <label htmlFor="ingredient-name-input">Ingredient Name:</label>
                <input
                    type="text"
                    id="ingredient-name-input"
                    name="name"
                    placeholder="Name... (optional)"
                    defaultValue=""
                />

                <label htmlFor="ingredient-serving-size-input">
                    Ingredient Serving Size:
                </label>
                <input
                    type="text"
                    id="ingredient-serving-size-input"
                    name="servingSize"
                    placeholder="Serving size... (optional)"
                    defaultValue=""
                />
                <label htmlFor="ingredient-cost-100-input">
                    Ingredient cost per 100g:
                </label>
                <input
                    type="text"
                    id="ingredient-cost-100-input"
                    name="costPer100"
                    placeholder="Cost per 100g... (optional)"
                    defaultValue=""
                />
                <label htmlFor="ingredient-category-input">
                    Ingredient Category:
                </label>
                <select name="category" id="ingredient-category-input">
                    <option value="">Category...</option>
                    <option value="vegetable">Vegetable</option>
                    <option value="meat">Meat</option>
                    <option value="fruit">Fruit</option>
                    <option value="grain">Grain</option>
                    <option value="desert">Desert</option>
                    <option value="other">Other</option>
                </select>
                <h3>Manual Nutrients</h3>

                <label htmlFor="calorie-per-100">Calorie per 100g:</label>
                <input
                    type="text"
                    name="calorie"
                    id="calorie-per-100"
                    placeholder="Calorie"
                    defaultValue=""
                />

                <label htmlFor="fat-per-100">Fat per 100g:</label>
                <input
                    type="text"
                    name="fat"
                    id="fat-per-100"
                    placeholder="Fat"
                    defaultValue=""
                />

                <label htmlFor="fiber-per-100">Fiber per 100g:</label>
                <input
                    type="text"
                    name="fiber"
                    id="fiber-per-100"
                    placeholder="Fiber"
                    defaultValue=""
                />

                <label htmlFor="protein-per-100">Protien per 100g:</label>
                <input
                    type="text"
                    name="protein"
                    id="protein-per-100"
                    placeholder="Protein"
                    defaultValue=""
                />

                <label htmlFor="carbs-per-100">Carbs per 100g:</label>
                <input
                    type="text"
                    name="carbs"
                    id="carbs-per-100"
                    placeholder="Carbs"
                    defaultValue=""
                />

                <label htmlFor="sodium-per-100">Sodium per 100g:</label>
                <input
                    type="text"
                    name="sodium"
                    id="sodium-per-100"
                    placeholder="Sodium"
                    defaultValue=""
                />
                <input
                    id="image-input"
                    type="file"
                    name="imageUrl"
                    onChange={imageUrlChangeHandler}
                />
                <button type="submit">Submit</button>
            </form>
        </section>
    );
}
