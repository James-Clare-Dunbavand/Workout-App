import { createContext } from "react";
import type { RecipesById } from "../../types/recipe";

type RecipeByIdContextType = {
    recipesById: RecipesById;
    setRecipesById: React.Dispatch<React.SetStateAction<RecipesById>>;
};

export const RecipeByIdContext = createContext<
    RecipeByIdContextType | undefined
>(undefined);
