import {
    useMealPlansActions,
    useMealPlansState,
} from "../../contexts/mealPlans/useMealPlansHook";
import "./mealPlan.css";

export default function MealPlans() {
    const mealPlans = useMealPlansState();
    const { changeFocusedMealPlan } = useMealPlansActions();
    const plans = mealPlans.map((mealPlan) => (
        <li
            key={mealPlan._id}
            onClick={() => changeFocusedMealPlan(mealPlan._id)}
        >
            <h2>{mealPlan.name}</h2>
        </li>
    ));
    return <ul className="mealPlans">{plans}</ul>;
}
