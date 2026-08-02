import type { ReactNode } from "react";
export default function SidebarRecipeForm({
    sidebarNutrients,
}: {
    sidebarNutrients: ReactNode[];
}) {
    return (
        <form id="item-builder-header">
            <label htmlFor="item-name">Week Name</label>
            <input
                id="item-name"
                type="text"
                name="name"
                placeholder="Week Name..."
            />
            <label htmlFor="item-portions">Number of portions</label>
            <input
                id="item-portions"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="portions"
                placeholder="Number..."
                onChange={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                }}
            />

            <input id="image-input" type="file" name="image" />
            <ul className="recipe-nutrients">{sidebarNutrients}</ul>
            <button>Create</button>
        </form>
    );
}
