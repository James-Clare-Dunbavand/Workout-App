import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import notFound from "../../images/Image-not-found.png";
import interactionPlugin, {
    type EventReceiveArg,
} from "@fullcalendar/interaction";
import "./mealCalendar.css";
import { useEffect, useMemo } from "react";
import type { EventContentArg } from "@fullcalendar/core/index.js";
import { addMeal, getMeals, removeMeal, getRecipe } from "../../utils/api";
import type { Meal, MealEvent } from "../../types/recipe";
import { useRecipesById } from "../../contexts/recipeById/useRecipeById";

let incrementingId = 0;

const mealSlots = { breakfast: 8, lunch: 12, dinner: 16 };
type Props = {
    meals: Meal[];
    setMeals: React.Dispatch<React.SetStateAction<Meal[]>>;
};

export default function MealCalendar({ meals, setMeals }: Props) {
    const { recipesById, setRecipesById } = useRecipesById();
    const mealEvents: MealEvent[] = useMemo(() => {
        return meals.map((meal) => {
            const recipe = recipesById.get(meal.recipe);
            return {
                title: meal.name,
                start: meal.start,
                end: meal.end,
                extendedProps: {
                    mealId: meal._id,
                    servings: meal.servings,
                    imageUrl: recipe?.imageUrl || notFound,
                },
            };
        });
    }, [meals, recipesById]);

    const dropHandler = async (info: EventReceiveArg) => {
        let mealType: "breakfast" | "lunch" | "dinner";
        const { title, start } = info.event;
        const startHours = info.event.start!.getHours();
        if (startHours < 12) {
            mealType = "breakfast";
        } else if (startHours < 16) {
            mealType = "lunch";
        } else {
            mealType = "dinner";
        }
        const snappedData = new Date(info.event.start!);
        snappedData.setHours(mealSlots[mealType], 0, 0, 0);
        const endSnappedData = new Date(start!);
        endSnappedData.setHours(mealSlots[mealType] + 4, 0, 0, 0);
        const meal: Omit<Meal, "_id"> = {
            name: title,
            start: snappedData,
            end: endSnappedData,
            recipe: info.event.extendedProps.recipeId,
            servings: info.event.extendedProps.servings || 1,
        };
        const tempId = incrementingId;
        incrementingId++;

        setMeals((prev) => [...prev, { ...meal, _id: String(tempId) }]);

        try {
            const response = await addMeal(meal);
            setMeals((prev) => {
                const next = prev.map((m) =>
                    m._id === String(tempId) ? { ...m, _id: response._id } : m,
                );
                return next;
            });
            if (!recipesById.has(response.recipe)) {
                try {
                    console.log("res", response);
                    const recipeResponse = await getRecipe(response.recipe);
                    setRecipesById((prev) => {
                        const next = new Map([
                            ...prev,
                            [recipeResponse._id, recipeResponse],
                        ]);
                        return next;
                    });
                } catch (error) {
                    console.log("failed to get recipe", error);
                }
            }
        } catch (error) {
            console.error(error);
            setMeals((prev) =>
                prev.filter(({ _id }) => _id !== String(tempId)),
            );
            info.revert();
        }
        info.event.remove();
    };
    const removeMealEvent = async (id: string) => {
        const mealToRemove = meals.find((e) => e._id === id);

        setMeals((prev) => prev.filter(({ _id }) => _id !== id));
        try {
            await removeMeal(id);
        } catch (error) {
            console.error(error);
            if (mealToRemove) {
                setMeals((prev) => [...prev, mealToRemove]);
            }
        }
    };

    const eventContentHanler = (arg: EventContentArg) => {
        const mealId = arg.event.extendedProps.mealId;
        const imageUrl = arg.event.extendedProps.imageUrl;
        return (
            <div
                className="meal-event"
                style={{
                    backgroundImage: `url(${imageUrl || notFound})`,
                }}
                data-_id={mealId}
            >
                <span>{arg.event.title}</span>
                <button onClick={() => removeMealEvent(mealId)}>X</button>
            </div>
        );
    };

    return (
        <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            expandRows={true}
            editable={true}
            allDaySlot={false}
            events={mealEvents}
            droppable={true}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            slotDuration="01:00:00"
            eventContent={eventContentHanler}
            eventReceive={dropHandler}
        />
    );
}
