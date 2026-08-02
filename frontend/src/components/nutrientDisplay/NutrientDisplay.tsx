import { memo } from "react";
import "./nutrientDisplay.css";
type CardProps = {
    nutrientName: string;
    nutrientValue: number;
    nutrientDaily: number;
};

const nutrientInfo = new Map([
    ["calorie", { icon: "fa-solid fa-fire-flame-curved icon", unit: " kcal" }],
    ["fat", { icon: "fa-solid fa-droplet icon", unit: " g" }],
    ["fiber", { icon: "fa-brands fa-pagelines icon", unit: " g" }],
    ["protein", { icon: "fa-solid fa-drumstick-bite icon", unit: " g" }],
    ["carbs", { icon: "fa-solid fa-wheat-awn icon", unit: " g" }],
    ["sodium", { icon: "fa-solid fa-mound icon", unit: " mg" }],
]);

function NutrientDisplay({
    nutrientName,
    nutrientValue,
    nutrientDaily,
}: CardProps) {
    const offset = Math.max(50 - ((nutrientValue / nutrientDaily) | 0) * 50, 0);

    return (
        <li className={`${nutrientName}-wrapper`}>
            <div className="wrapper">
                <svg>
                    <circle className="bg"></circle>
                    <circle
                        className="progress"
                        id="progressCircle"
                        style={{
                            strokeDashoffset: offset,
                        }}
                    ></circle>
                </svg>
                <i className={nutrientInfo.get(nutrientName)?.icon}></i>
            </div>
            <p className={`${nutrientName}-value nutrient-value`}>
                {nutrientValue}
                <span className="nutrient-unit">
                    {nutrientInfo.get(nutrientName)?.unit}
                </span>
            </p>
        </li>
    );
}
export default memo(NutrientDisplay);
