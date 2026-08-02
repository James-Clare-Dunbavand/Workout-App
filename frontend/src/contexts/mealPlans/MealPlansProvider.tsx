import type { ReactNode } from "react";
type Props = { children: ReactNode };
import { useMealPlans } from "../../utils/customHooks";
import {
    MealPlansActionsContext,
    FocusedMealPlanContext,
    MealPlansContext,
} from "./MealPlansContext";

export default function MealPlansHookProvider({ children }: Props) {
    const mealPlansHook = useMealPlans([]);

    return (
        <MealPlansActionsContext.Provider value={mealPlansHook.actions}>
            <FocusedMealPlanContext.Provider
                value={mealPlansHook.focusedMealPlan}
            >
                <MealPlansContext.Provider value={mealPlansHook.mealPlans}>
                    {children}
                </MealPlansContext.Provider>
            </FocusedMealPlanContext.Provider>
        </MealPlansActionsContext.Provider>
    );
}
