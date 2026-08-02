import { useEffect, useState } from "react";
import {
    useFocusedMealPlan,
    useMealPlansActions,
    useMealPlansState,
} from "../../contexts/mealPlans/useMealPlansHook";
import { useRecipesById } from "../../contexts/recipeById/useRecipeById";
import RecipeSidebarCard from "../recipeSidebarCard/RecipeSidebarCard";
export default function FocusedMealPlan() {
    const { changeMealPlanName, removeMealPlan } = useMealPlansActions();
    const mealPlans = useMealPlansState();
    const { recipesById } = useRecipesById();
    const [name, setName] = useState<string>("");

    const mealPlan = useFocusedMealPlan();

    useEffect(() => {
        if (mealPlan) {
            const updateName = () => setName(mealPlan.name);
            updateName();
        }
    }, [mealPlan]);

    if (!mealPlan) {
        return <></>;
    }
    const recipeInstances = mealPlan.recipeInstances.map((recipeInstance) => {
        const recipe = recipesById.get(recipeInstance.recipeId);

        if (!recipe) {
            return;
        }
        return (
            <RecipeSidebarCard
                key={recipeInstance.recipeId}
                recipeData={recipeInstance}
            ></RecipeSidebarCard>
        );
    });

    return (
        <>
            <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onBlur={() => changeMealPlanName(mealPlan._id, name)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.currentTarget.blur();
                    }
                }}
            />
            <button onClick={() => removeMealPlan(mealPlan._id)}>X</button>
            <ul>{recipeInstances}</ul>
        </>
    );
}
