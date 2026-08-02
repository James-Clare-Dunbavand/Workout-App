import {
    MealPlansContext,
    MealPlansActionsContext,
    FocusedMealPlanContext,
} from "./MealPlansContext";
import { useContext } from "react";

export function useMealPlansState() {
    const context = useContext(MealPlansContext);
    if (context === undefined) {
        throw new Error(
            "use of useMealPlans must be used within MealnplansProvider",
        );
    }
    return context;
}

export function useMealPlansActions() {
    const context = useContext(MealPlansActionsContext);
    if (context === undefined) {
        throw new Error(
            "use of useMealPlans must be used within MealnplansProvider",
        );
    }
    return context;
}

export function useFocusedMealPlan() {
    const context = useContext(FocusedMealPlanContext);
    if (context === undefined) {
        throw new Error(
            "use of useMealPlans must be used within MealnplansProvider",
        );
    }
    return context;
}
