const ingredientForm = document.getElementById("ingredient-form");

ingredientForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const ingredient = { nutrients: {} };
    console.log(ingredient);
    const formData = new FormData(ingredientForm);
    const fields = ["calorie", "fat", "fiber", "protein", "carbs", "sodium"];
    for (let [name, value] of formData.entries()) {
        if (!value) {
            continue;
        }
        if (fields.includes(name)) {
            ingredient.nutrients[name] = Number(value);
        } else if (name === "name" || name === "category") {
            ingredient[name] = value;
        } else {
            ingredient[name] = Number(value);
        }
    }
    console.log(ingredient);
    let uri = "/api/v1/ingredient";

    const response = await fetch(uri, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: [ingredient] }),
    });
    const json = await response.json();
    console.log(json);
});
