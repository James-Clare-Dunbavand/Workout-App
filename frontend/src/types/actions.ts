import type { Ingredient } from "./ingredient";

export type SetSidebarIngredients = (ingredients: Ingredient[]) => void;

export type AddSidebarCard = (id: string) => void;
export type AddSidebarRecipe = (recipeId: string) => void;

export type RemoveSidebarIngredient = (ingredientId: string) => void;
export type ChangeIngredientQuantity = (
    newQuantity: number,
    ingredientId: string,
) => void;

export type RemoveSidebarCard = (id: string) => void;
export type ChangeCardQuantity = (newQuantity: number, id: string) => void;

export type GetCards<T> = (fetchedCards: T[]) => Promise<void>;
