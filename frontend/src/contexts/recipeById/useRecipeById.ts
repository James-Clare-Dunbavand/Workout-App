import { useContext } from "react";
import { RecipeByIdContext } from "./RecipeByIdContext";

export function useRecipesById() {
    const context = useContext(RecipeByIdContext);
    if (!context) {
        throw new Error("recipesById must be used ");
    }
    return context;
}
