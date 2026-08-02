import { createContext } from "react";
import { useMealPlans } from "../../utils/customHooks";

type MealPlansHookContextType = ReturnType<typeof useMealPlans>;

type MealPlansType = MealPlansHookContextType["mealPlans"];
type FocusedMealPlanType = MealPlansHookContextType["focusedMealPlan"];
type MealPlansActionsType = MealPlansHookContextType["actions"];

export const MealPlansActionsContext = createContext<
    MealPlansActionsType | undefined
>(undefined);

export const FocusedMealPlanContext = createContext<
    FocusedMealPlanType | null | undefined
>(undefined);

export const MealPlansContext = createContext<MealPlansType | undefined>(
    undefined,
);
