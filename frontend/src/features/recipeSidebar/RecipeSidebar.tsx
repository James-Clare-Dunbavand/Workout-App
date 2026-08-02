import "./sidebar.css";
import { nutrientConfig } from "../../utils/nutrients.ts";
import NutrientDisplay from "../../components/nutrientDisplay/NutrientDisplay.tsx";
import SidebarRecipeForm from "../../components/sidebarRecipeForm/SidebarRecipeForm.tsx";
import MealPlans from "../../components/mealPlans/MealPlans.tsx";
import FocusedMealPlan from "../../components/mealPlans/FocusedMealPlan.tsx";
import type { NutrientData } from "../../types/ingredient.ts";
import type {
    RemoveSidebarCard,
    ChangeCardQuantity,
} from "../../types/actions.ts";
import { createMealPlanApi } from "../../utils/api.ts";
import type {
    Meal,
    MealEvent,
    RecipesById,
    SideBarRecipe,
} from "../../types/recipe.ts";
import { useEffect, useRef } from "react";
import { Draggable } from "@fullcalendar/interaction/index.js";

import { useRecipesById } from "../../contexts/recipeById/useRecipeById.ts";
import {
    useFocusedMealPlan,
    useMealPlansActions,
} from "../../contexts/mealPlans/useMealPlansHook.ts";

type Props = {
    removeSidebarCard: RemoveSidebarCard;
    cardsData: SideBarRecipe[];
    changeCardQuantity: ChangeCardQuantity;
    nutrientsData: NutrientData[];
    SidebarCard: React.ComponentType<{
        removeSidebarRecipe: RemoveSidebarCard;
        recipeData: SideBarRecipe;
        changeCardQuantity: ChangeCardQuantity;
    }>;
    meals: Meal[];
};

export default function Sidebar({
    cardsData,
    changeCardQuantity,
    nutrientsData,
    SidebarCard,
}: Props) {
    const recipesRef = useRef<HTMLUListElement>(null);
    const { createDefaultMealPlan } = useMealPlansActions();
    const focusedMealPlan = useFocusedMealPlan();
    const { recipesById } = useRecipesById();

    useEffect(() => {
        if (!recipesRef.current) return;

        const draggable = new Draggable(recipesRef.current, {
            itemSelector: ".sidebar-card",
            eventData: function (eventEl) {
                if (!eventEl.dataset.recipeId) {
                    throw new Error("no recipe id");
                }
                const recipe = recipesById.get(eventEl.dataset.recipeId);
                const m = {
                    title: recipe?.name || "",
                    extendedProps: {
                        imageUrl: recipe?.imageUrl,
                        recipeId: recipe?._id,
                    },
                };
                return m;
            },
        });
        return () => draggable.destroy();
    }, [recipesById]);

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

    // const sidebarCards = cardsData.map((cardData) => (
    //     <SidebarCard
    //         key={cardData._id}
    //         removeSidebarRecipe={removeSidebarCard}
    //         recipeData={cardData}
    //         changeCardQuantity={changeCardQuantity}
    //     />
    // ));
    const createNewMealPlan = async () => {
        await createDefaultMealPlan();
    };

    return (
        <section id="sidebar">
            <button onClick={createNewMealPlan}>New Meal Plan</button>
            <MealPlans />
            <FocusedMealPlan />
            {/* <ul id="sidebar-ingredients" ref={recipesRef}> */}
            {/*     {sidebarCards} */}
            {/* </ul> */}
        </section>
    );
}
