type SidebarNutrientTotalProps = {
    nutrientName: string;
    value: number;
};

export default function SidebarNutrientTotal({
    nutrientName,
    value,
}: SidebarNutrientTotalProps) {
    const formatedNutrientName =
        nutrientName[0].toUpperCase() + nutrientName.slice(1);

    return (
        <li data-nutrient={nutrientName}>
            {formatedNutrientName}: <span className="value">{value}</span>
        </li>
    );
}
