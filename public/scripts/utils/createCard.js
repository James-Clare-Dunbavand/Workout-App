export const createCard = (cardName, nutrientValues, imageUrl) => {
    const calorieDaily = 2200;
    const fatDaily = 80;
    const fiberDaily = 38;
    const proteinDaily = 70;
    const carbsDaily = 400;
    const sodiumDaily = 1500;
    const { calorie, fat, fiber, protein, carbs, sodium } = nutrientValues;
    if (!imageUrl) {
        imageUrl = "/images/Image-not-found.png";
    }

    const newCard = document.createElement("article");
    newCard.innerHTML = `<article class="card">
                <img src=${imageUrl} alt="" />
                <h3>${cardName}</h3>

                <div class="card-info">
                    <ul class="card-nutrients">
                        <li class="calorie-wrapper">
                            <div class="wrapper">
                                <svg>
                                    <circle class="bg"></circle>
                                    <circle
                                        class="progress"
                                        id="progressCircle"
                                        style="stroke-dashoffset:${Math.max(50 - (calorie / calorieDaily) * 50, 0)};"
                                    ></circle>
                                </svg>
                                <i
                                    class="fa-solid fa-fire-flame-curved icon"
                                ></i>
                            </div>
                            <p class="calorie-value nutrient-value">${calorie}<span class="nutrient-unit"> kcal</span></p>
                        </li>
                        <li class="fat-wrapper">
                            <div class="wrapper">
                                <svg>
                                    <circle class="bg"></circle>
                                    <circle
                                        class="progress"
                                        id="progressCircle"
                                        style="stroke-dashoffset:${Math.max(50 - (fat / fatDaily) * 50, 0)};"
                                    ></circle>
                                </svg>
                                <i class="fa-solid fa-droplet icon" ></i>
                            </div>
                            <p class="fat-value nutrient-value">${fat}<span class="nutrient-unit"> g</span></p>
                        </li>
                        <li class="fiber-wrapper">
                            <div class="wrapper">
                                <svg>
                                    <circle class="bg"></circle>
                                    <circle
                                        class="progress"
                                        id="progressCircle"
                                        style="stroke-dashoffset:${Math.max(50 - (fiber / fiberDaily) * 50, 0)};"
                                    ></circle>
                                </svg>
                                <i class="fa-brands fa-pagelines icon"></i>
                            </div>
                            <p class="fiber-value nutrient-value">${fiber}<span class="nutrient-unit"> g</span></p>
                        </li>
                        <li class="protein-wrapper">
                            <div class="wrapper">
                                <svg>
                                    <circle class="bg"></circle>
                                    <circle
                                        class="progress"
                                        id="progressCircle"
                                        style="stroke-dashoffset:${Math.max(50 - (protein / proteinDaily) * 50, 0)};"
                                    ></circle>
                                </svg>
                                <i class="fa-solid fa-drumstick-bite icon"></i>
                            </div>
                            <p class="protein-value nutrient-value">${protein}<span class="nutrient-unit"> g</span></p>
                        </li>
                        <li class="carbs-wrapper">
                            <div class="wrapper">
                                <svg>
                                    <circle class="bg"></circle>
                                    <circle
                                        class="progress"
                                        id="progressCircle"
                                        style="stroke-dashoffset:${Math.max(50 - (carbs / carbsDaily) * 50, 0)};"
                                    ></circle>
                                </svg>
                                <i class="fa-solid fa-wheat-awn icon"></i>
                            </div>
                            <p class="carbs-value nutrient-value">${carbs}<span class="nutrient-unit"> g</span></p>
                        </li>
                        <li class="sodium-wrapper">
                            <div class="wrapper">
                                <svg>
                                    <circle class="bg"></circle>
                                    <circle
                                        class="progress"
                                        id="progressCircle"
                                        style="stroke-dashoffset:${Math.max(50 - (sodium / sodiumDaily) * 50, 0)};"
                                    ></circle>
                                </svg>
                                <i class="fa-solid fa-mound icon"></i>
                            </div>
                            <p class="sodium-value nutrient-value">${sodium}<span class="nutrient-unit"> mg</span></p>
                        </li>
                    </ul>
                </div>
                <button type="button" class="card-add-button">Add</button>
            </article>`;

    return newCard;
};
