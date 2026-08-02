import { useState } from "react";
import type { RecipesById } from "../../types/recipe";
import { RecipeByIdContext } from "./RecipeByIdContext";

type Props = {
    children: React.ReactNode;
};

export default function RecipeByIdProvider({ children }: Props) {
    const [recipesById, setRecipesById] = useState<RecipesById>(new Map());
    return (
        <RecipeByIdContext.Provider value={{ recipesById, setRecipesById }}>
            {children}
        </RecipeByIdContext.Provider>
    );
}
