const recipes = document.getElementById("recipes");
const calorieDaily = 2200;
const fatDaily = 80;
const fiberDaily = 38;
const proteinDaily = 70;
const carbsDaily = 400;
const sodiumDaily = 1500;

const createRecipe = (recipeName, nutrientValues) => {
    const {
        calorieValue,
        fatValue,
        fiberValue,
        proteinValue,
        carbsValue,
        sodiumValue,
    } = nutrientValues;
    const newRecipe = document.createElement("article");
    newRecipe.innerHTML = `<article class="recipe">
                <img src="images/download.jfif" alt="" />
                <h3>${recipeName}</h3>

                <div class="recipe-info">
                    <ul class="recipe-nutrients">
                        <li class="calorie-wrapper">
                            <div class="wrapper">
                                <svg>
                                    <circle class="bg"></circle>
                                    <circle
                                        class="progress"
                                        id="progressCircle"
                                        style="stroke-dashoffset:${Math.max(50 - (calorieValue / calorieDaily) * 50, 0)};"
                                    ></circle>
                                </svg>
                                <i
                                    class="fa-solid fa-fire-flame-curved icon"
                                ></i>
                            </div>
                            <p class="calorie-value nutrient-value">${calorieValue}<span class="nutrient-unit"> kcal</span></p>
                        </li>
                        <li class="fat-wrapper">
                            <div class="wrapper">
                                <svg>
                                    <circle class="bg"></circle>
                                    <circle
                                        class="progress"
                                        id="progressCircle"
                                        style="stroke-dashoffset:${Math.max(50 - (fatValue / fatDaily) * 50, 0)};"
                                    ></circle>
                                </svg>
                                <i class="fa-solid fa-droplet icon" ></i>
                            </div>
                            <p class="fat-value nutrient-value">${fatValue}<span class="nutrient-unit"> g</span></p>
                        </li>
                        <li class="fiber-wrapper">
                            <div class="wrapper">
                                <svg>
                                    <circle class="bg"></circle>
                                    <circle
                                        class="progress"
                                        id="progressCircle"
                                        style="stroke-dashoffset:${Math.max(50 - (fiberValue / fiberDaily) * 50, 0)};"
                                    ></circle>
                                </svg>
                                <i class="fa-brands fa-pagelines icon"></i>
                            </div>
                            <p class="fiber-value nutrient-value">${fiberValue}<span class="nutrient-unit"> g</span></p>
                        </li>
                        <li class="protein-wrapper">
                            <div class="wrapper">
                                <svg>
                                    <circle class="bg"></circle>
                                    <circle
                                        class="progress"
                                        id="progressCircle"
                                        style="stroke-dashoffset:${Math.max(50 - (proteinValue / proteinDaily) * 50, 0)};"
                                    ></circle>
                                </svg>
                                <i class="fa-solid fa-drumstick-bite icon"></i>
                            </div>
                            <p class="protein-value nutrient-value">${proteinValue}<span class="nutrient-unit"> g</span></p>
                        </li>
                        <li class="carbs-wrapper">
                            <div class="wrapper">
                                <svg>
                                    <circle class="bg"></circle>
                                    <circle
                                        class="progress"
                                        id="progressCircle"
                                        style="stroke-dashoffset:${Math.max(50 - (carbsValue / carbsDaily) * 50, 0)};"
                                    ></circle>
                                </svg>
                                <i class="fa-solid fa-wheat-awn icon"></i>
                            </div>
                            <p class="carbs-value nutrient-value">${carbsValue}<span class="nutrient-unit"> g</span></p>
                        </li>
                        <li class="sodium-wrapper">
                            <div class="wrapper">
                                <svg>
                                    <circle class="bg"></circle>
                                    <circle
                                        class="progress"
                                        id="progressCircle"
                                        style="stroke-dashoffset:${Math.max(50 - (sodiumValue / sodiumDaily) * 50, 0)};"
                                    ></circle>
                                </svg>
                                <i class="fa-solid fa-mound icon"></i>
                            </div>
                            <p class="sodium-value nutrient-value">${sodiumValue}<span class="nutrient-unit"> mg</span></p>
                        </li>
                    </ul>
                </div>
                <button type="button" class="recipe-add-button">Add</button>
            </article>`;

    recipes.appendChild(newRecipe);
};

const calculateNutrientValue = (ingredients) => {
    const nutrientValues = {
        calorie: 0,
        fat: 0,
        fiber: 0,
        protein: 0,
        carbs: 0,
        sodium: 0,
    };
    console.log(ingredients);
    ingredients.forEach((ingredientWraper) => {
        console.log(ingredientWraper);
        console.log(ingredientWraper.ingredient.caloriePer100);
        nutrientValues.calorie +=
            (ingredientWraper.ingredient.caloriePer100 / 100) *
            ingredientWraper.quantity;
        nutrientValues.fat +=
            (ingredientWraper.ingredient.fatPer100 / 100) *
            ingredientWraper.quantity;
        nutrientValues.fiber +=
            (ingredientWraper.ingredient.fiberPer100 / 100) *
            ingredientWraper.quantity;
        nutrientValues.protein +=
            (ingredientWraper.ingredient.proteinPer100 / 100) *
            ingredientWraper.quantity;
        nutrientValues.carbs +=
            (ingredientWraper.ingredient.carbsPer100 / 100) *
            ingredientWraper.quantity;
        nutrientValues.sodium +=
            (ingredientWraper.ingredient.sodiumPer100 / 100) *
            ingredientWraper.quantity;
    });
    console.log(nutrientValues);
    return nutrientValues;
};
const addRecipeToDisplay = (recipe) => {
    const nutrientValues = calculateNutrientValue(recipe.ingredients);
    createRecipe(recipe.name, nutrientValues);
};

const getAllRecipes = async () => {
    try {
        const response = await fetch("/api/v1/recipe", {});
        const recipes = await response.json();
        return recipes;
    } catch (error) {
        console.error(error);
    }
};

const recipe = fetch("/api/v1/recipe/Tomato&cucumber", {})
    .then((response) => response.json())
    .then((recipe) => addRecipeToDisplay(recipe));
