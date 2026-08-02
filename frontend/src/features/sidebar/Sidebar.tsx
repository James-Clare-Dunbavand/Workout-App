import "./sidebar.css";
import { nutrientConfig } from "../../utils/nutrients.ts";
import SidebarIngredient from "../../components/sidebarIngredientCard/SidebarIngredientCard.tsx";
import NutrientDisplay from "../../components/nutrientDisplay/NutrientDisplay.tsx";
import type { IngredientData, NutrientData } from "../../types/ingredient.ts";
import type {
    RemoveSidebarIngredient,
    ChangeIngredientQuantity,
} from "../../types/actions.ts";
import { postRecipe, uploadImage } from "../../utils/api.ts";
import type { Recipe } from "../../types/recipe.ts";

type Props = {
    removeIngredient: RemoveSidebarIngredient;
    changeIngredientQuantity: ChangeIngredientQuantity;
    ingredientsData: IngredientData[];
    nutrientsData: NutrientData[];
};

export default function Sidebar({
    removeIngredient,
    ingredientsData,
    changeIngredientQuantity,
    nutrientsData,
}: Props) {
    const sidebarNutrients = nutrientConfig.map((nutrient) => {
        const match = nutrientsData.find(({ name }) => name === nutrient.name);
        const value = match?.value ?? 0;
        return (
            <NutrientDisplay
                key={nutrient.name}
                nutrientName={nutrient.name}
                nutrientValue={value}
                nutrientDaily={nutrient.value}
            />
        );
    });

    const ingredients = ingredientsData.map(
        (ingredientData: IngredientData) => (
            <SidebarIngredient
                key={ingredientData.name}
                removeIngredient={removeIngredient}
                ingredientData={ingredientData}
                changeIngredientQuantity={changeIngredientQuantity}
            />
        ),
    );
    const createRecipe: React.FormEventHandler<HTMLFormElement> = async (
        event,
    ) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);

            const image = formData.get("image");

            if (!(image instanceof File) || image.size === 0) {
                throw new Error("nplease select an image");
            }
            const imageUrl = await uploadImage(image);
            if (!imageUrl) {
                throw new Error("Failed to get imageUrl");
            }

            const recipeName = formData.get("name");

            if (typeof recipeName !== "string") {
                throw new Error("Please include recipe name");
            }
            const portions = formData.get("portions");

            if (typeof portions !== "string" || !/^\d+$/.test(portions)) {
                throw new Error("Please include portioning info");
            }

            const recipe: Recipe = {
                foodNutrients: {},
                name: recipeName,
                ingredients: ingredientsData,
                imageUrl: imageUrl,
                portions: Number(portions),
            };
            await postRecipe(recipe);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section id="sidebar">
            <form id="item-builder-header" onSubmit={createRecipe}>
                <label htmlFor="item-name">Recipe Name</label>
                <input
                    id="item-name"
                    type="text"
                    name="name"
                    placeholder="Recipe Name..."
                />
                <label htmlFor="item-portions">Number of portions</label>
                <input
                    id="item-portions"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    name="portions"
                    placeholder="Number..."
                    onChange={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, "");
                    }}
                />

                <input id="image-input" type="file" name="image" />
                <ul className="recipe-nutrients">{sidebarNutrients}</ul>
                <button>Create</button>
            </form>
            <ul id="sidebar-ingredients">{ingredients}</ul>
        </section>
    );
}
