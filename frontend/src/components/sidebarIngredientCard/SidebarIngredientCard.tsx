import type {
    ChangeIngredientQuantity,
    RemoveSidebarIngredient,
} from "../../types/actions";
import type { IngredientData } from "../../types/ingredient";

type Props = {
    ingredientData: IngredientData;
    changeIngredientQuantity: ChangeIngredientQuantity;
    removeIngredient: RemoveSidebarIngredient;
};

export default function IngredientSidebarCard({
    ingredientData,
    changeIngredientQuantity,
    removeIngredient,
}: Props) {
    const { ingredient, quantity } = ingredientData;
    const { name, _id: ingredientId, imageUrl } = ingredient;

    return (
        <li
            className="sidebar-card"
            draggable="true"
            data-name={name}
            data-imageurl={imageUrl}
            data-recipe-id={ingredientId}
        >
            <img src={imageUrl} alt="" draggable="false" />
            <div className="remainingPortions-selector">
                <button
                    type="button"
                    className="ingredient-button"
                    onClick={() => {
                        console.log(quantity, ingredient.servingSize);
                        console.log(quantity - ingredient.servingSize);
                        if (quantity <= 1) removeIngredient(ingredientId);
                        changeIngredientQuantity(
                            quantity - ingredient.servingSize,
                            ingredientId,
                        );
                    }}
                >
                    {Number(quantity) <= 1 ? "D" : "-"}
                </button>
                <div>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(event) => {
                            changeIngredientQuantity(
                                Number(event.target.value),
                                ingredientId,
                            );
                        }}
                    />
                </div>
                <button
                    type="button"
                    className="ingredient-button"
                    onClick={() => {
                        changeIngredientQuantity(
                            quantity + ingredient.servingSize,
                            ingredientId,
                        );
                    }}
                >
                    +
                </button>
            </div>
        </li>
    );
}
