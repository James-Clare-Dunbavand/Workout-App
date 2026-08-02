import {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from "react";
import type { MealPlan } from "../types/meal";
import {
    createMealPlanApi,
    deleteMealPlanApi,
    fetchAllMealPlansApi,
    modifyMealPlanApi,
} from "./api";
import type { Recipe, RecipeInstance } from "../types/recipe";

type MealPlanAction =
    | {
          type: "mealPlanAdded";
          mealPlan: MealPlan;
      }
    | {
          type: "mealPlanRemoved";
          id: string;
      }
    | {
          type: "mealPlanReplaced";
          mealPlan: MealPlan;
          tempId: string;
      }
    | {
          type: "recipeAdded";
          recipe: Recipe;
          focusedMealPlan: MealPlan;
      }
    | {
          type: "changeMealPlanName";
          newName: string;
          focusedMealPlan: MealPlan;
      }
    | {
          type: "replaceWhole";
          mealPlansDb: MealPlan[];
      }
    | {
          type: "changeRecipePortions";
          newTotalPortions: number;
          newRemainingPortions: number;
          focusedMealPlan: MealPlan;
          recipeId: string;
      }
    | {
          type: "removeRecipe";
          recipeId: string;
          focusedMealPlan: MealPlan;
      };
const formatRecipeInstance = (recipe: Recipe): RecipeInstance => {
    return {
        recipeId: recipe._id,
        remainingPortions: recipe.portions ?? "1",
        totalPortions: recipe.portions ?? "1",
    };
};

const mealPlanReducer = (state: MealPlan[], action: MealPlanAction) => {
    switch (action.type) {
        case "mealPlanAdded":
            return [...state, action.mealPlan];

        case "mealPlanRemoved":
            return state.filter((mealPlan) => mealPlan._id !== action.id);

        case "mealPlanReplaced":
            return state.map((mealPlan) =>
                mealPlan._id === action.tempId ? action.mealPlan : mealPlan,
            );
        case "recipeAdded":
            return state.map((mealPlan) =>
                mealPlan._id === action.focusedMealPlan._id
                    ? {
                          ...mealPlan,
                          recipeInstances: [
                              ...mealPlan.recipeInstances,
                              formatRecipeInstance(action.recipe),
                          ],
                      }
                    : mealPlan,
            );
        case "changeMealPlanName":
            return state.map((mealPlan) =>
                mealPlan._id === action.focusedMealPlan._id
                    ? { ...mealPlan, name: action.newName }
                    : mealPlan,
            );
        case "replaceWhole":
            return action.mealPlansDb;
        case "changeRecipePortions":
            return state.map((mealPlan) =>
                mealPlan._id === action.focusedMealPlan._id
                    ? changeRecipePortion(
                          mealPlan,
                          action.newRemainingPortions,
                          action.newTotalPortions,
                          action.recipeId,
                      )
                    : mealPlan,
            );
        case "removeRecipe":
            return state.map((mealPlan) =>
                mealPlan._id === action.focusedMealPlan._id
                    ? removeRecipe(mealPlan, action.recipeId)
                    : mealPlan,
            );
        default:
            return state;
    }
};
const removeRecipe = (mealPlan: MealPlan, recipeId: string) => {
    return {
        ...mealPlan,
        recipeInstances: mealPlan.recipeInstances.filter(
            (recipeInstance) => recipeInstance.recipeId !== recipeId,
        ),
    };
};
const changeRecipePortion = (
    mealPlan: MealPlan,
    newRemainingPortions: number,
    newTotalPortions: number,
    recipeId: string,
) => {
    return {
        ...mealPlan,
        recipeInstances: mealPlan.recipeInstances.map((recipeInstance) =>
            recipeInstance.recipeId === recipeId
                ? {
                      ...recipeInstance,
                      remainingPortions: newRemainingPortions,
                      totalPortions: newTotalPortions,
                  }
                : recipeInstance,
        ),
    };
};

export function useMealPlans(initialValue: MealPlan[] = []) {
    const [mealPlans, dispatch] = useReducer(mealPlanReducer, initialValue);
    const [focusedMealPlanId, setfocusedMealPlanId] = useState<string>("");
    const incrementingId = useRef(0);
    const focusedMealPlan = useMemo(
        () =>
            mealPlans.find((mealPlan) => mealPlan._id === focusedMealPlanId) ??
            null,
        [mealPlans, focusedMealPlanId],
    );

    const optimisticMealPlanRendering = async (changeFunction, apiCall) => {
        const prev = [...mealPlans];
        changeFunction();
        try {
            await apiCall();
        } catch (error) {
            console.error(error);
            dispatch({ type: "replaceWhole", mealPlansDb: prev });
        }
    };
    useEffect(() => {
        fetchAllMealPlansApi().then((mealPlansDb) =>
            dispatch({ type: "replaceWhole", mealPlansDb: mealPlansDb }),
        );
    }, []);

    const changeFocusedMealPlan = (id: string): void => {
        setfocusedMealPlanId(id);
    };

    const addRecipeToMealPlan = (recipe: Recipe): void => {
        if (!focusedMealPlan) {
            return;
        }
        if (
            focusedMealPlan.recipeInstances.find(
                (recipeInstance) => recipeInstance.recipeId === recipe._id,
            )
        ) {
            alert("Recipe is already present in meal plan!");
            return;
        }
        optimisticMealPlanRendering(
            () =>
                dispatch({
                    type: "recipeAdded",
                    recipe: recipe,
                    focusedMealPlan: focusedMealPlan,
                }),
            async () => {
                const updatedMealPlan = {
                    ...focusedMealPlan,
                    recipeInstances: [
                        ...focusedMealPlan.recipeInstances,
                        formatRecipeInstance(recipe),
                    ],
                };

                if (!updatedMealPlan) {
                    throw new Error("no focused MealPlan");
                }
                const response = await modifyMealPlanApi(
                    focusedMealPlanId,
                    updatedMealPlan,
                );
            },
        );
    };
    const removeRecipeFromMealPlan = (recipeId: string) => {
        if (!focusedMealPlan) return;
        optimisticMealPlanRendering(
            () => {
                dispatch({
                    type: "removeRecipe",
                    focusedMealPlan: focusedMealPlan,
                    recipeId: recipeId,
                });
            },
            () => {
                modifyMealPlanApi(
                    focusedMealPlanId,
                    removeRecipe(focusedMealPlan, recipeId),
                );
            },
        );

        //todo
    };

    const changeMealPlanName = (id: string, newName: string) => {
        if (!focusedMealPlan) return;
        optimisticMealPlanRendering(
            () => {
                dispatch({
                    type: "changeMealPlanName",
                    newName: newName,
                    focusedMealPlan: focusedMealPlan,
                });
            },
            () => {
                const updatedMealPlan = {
                    ...focusedMealPlan,
                    name: newName,
                };

                if (!updatedMealPlan) {
                    throw new Error("no focused MealPlan");
                }
                modifyMealPlanApi(id, updatedMealPlan);
            },
        );
    };

    const addMealPlan = async (newMealPlan: Omit<MealPlan, "_id">) => {
        const tempId = String(incrementingId.current++);
        dispatch({
            type: "mealPlanAdded",
            mealPlan: { ...newMealPlan, _id: tempId },
        });
        const prevFocusedMealPlanId = focusedMealPlanId;
        changeFocusedMealPlan(tempId);
        try {
            const dbMealPlan = await createMealPlanApi(newMealPlan);

            dispatch({
                type: "mealPlanReplaced",
                tempId: tempId,
                mealPlan: dbMealPlan,
            });
            changeFocusedMealPlan(dbMealPlan._id);
        } catch (error) {
            console.log("failed to create meal plan", error);
            removeMealPlan(tempId);
            changeFocusedMealPlan(prevFocusedMealPlanId);
        }
    };
    const removeMealPlan = async (mealPlanId: string) => {
        const prev = mealPlans.find((mealPlan) => mealPlan._id === mealPlanId);
        if (!prev) {
            console.log("couldn't find meal plan to remove");
            return;
        }
        dispatch({ type: "mealPlanRemoved", id: mealPlanId });
        try {
            await deleteMealPlanApi(mealPlanId);
        } catch (error) {
            console.error(error);
            dispatch({ type: "mealPlanAdded", mealPlan: prev });
        }
    };
    const createDefaultMealPlan = async () => {
        const newMealPlan: Omit<MealPlan, "_id"> = {
            recipeInstances: [],
            name: "Unnamed",
            meals: [],
            shoppingState: new Map(),
        };
        await addMealPlan(newMealPlan);
    };
    const changeRecipePortions = useCallback(
        (
            newTotalPortions: number,
            newRemainingPortions: number,
            recipeId: string,
        ) => {
            if (!focusedMealPlan) return;
            optimisticMealPlanRendering(
                () =>
                    dispatch({
                        type: "changeRecipePortions",
                        newTotalPortions: newTotalPortions,
                        newRemainingPortions: newRemainingPortions,
                        focusedMealPlan: focusedMealPlan,
                        recipeId: recipeId,
                    }),
                () =>
                    modifyMealPlanApi(
                        focusedMealPlanId,
                        changeRecipePortion(
                            focusedMealPlan,
                            newRemainingPortions,
                            newTotalPortions,
                            recipeId,
                        ),
                    ),
            );
        },
        [focusedMealPlan, optimisticMealPlanRendering],
    );

    const actionsValue = useMemo(
        () => ({
            addMealPlan,
            removeMealPlan,
            createDefaultMealPlan,
            changeFocusedMealPlan,
            addRecipeToMealPlan,
            removeRecipeFromMealPlan,
            changeMealPlanName,
            changeRecipePortions,
        }),
        [
            addMealPlan,
            removeMealPlan,
            createDefaultMealPlan,
            changeFocusedMealPlan,
            addRecipeToMealPlan,
            removeRecipeFromMealPlan,
            changeRecipePortions,
            changeMealPlanName,
        ],
    );

    const focusedMealPlanValue = useMemo(
        () => focusedMealPlan,
        [focusedMealPlan],
    );
    const mealPlansValue = useMemo(() => mealPlans, [mealPlans]);

    return {
        actions: actionsValue,
        focusedMealPlan: focusedMealPlanValue,
        mealPlans: mealPlansValue,
    };
}
