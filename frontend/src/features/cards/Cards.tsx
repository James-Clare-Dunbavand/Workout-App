import type { AddSidebarCard } from "../../types/actions.ts";
import type { Ingredient } from "../../types/ingredient.ts";
import type { Recipe } from "../../types/recipe.ts";
import "./cards.css";
import { memo, type FC } from "react";

type Props<T extends Ingredient | Recipe> = {
    addSidebarCard: AddSidebarCard;
    getCards: (searchQuerie: string) => Promise<void>;
    cardsById: Map<string, T>;
    searchResultIds: string[];
    CardComponent: FC<{
        key: string;
        recipe: T;
        addSidebarRecipe: AddSidebarCard;
    }>;
};

function Cards<T extends Ingredient | Recipe>({
    addSidebarCard,
    searchResultIds,
    cardsById,
    CardComponent,
}: Props<T>) {
    const mapedCards = searchResultIds.map((id) => {
        const card = cardsById.get(id);
        if (!card) {
            return null;
        }
        return (
            <CardComponent
                key={id}
                recipe={card}
                addSidebarRecipe={addSidebarCard}
            />
        );
    });

    return <section id="cards">{mapedCards}</section>;
}

export default memo(Cards);
