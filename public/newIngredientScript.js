const ingredientForm = document.getElementById("ingredient-form");
const imageInput = document.getElementById("image-input");
let imageUrl = "defaultPath";

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
        } else if (name === "imageUrl" && value != null) {
            ingredient[name] = imageUrl;
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

imageInput.addEventListener("change", async () => {
    const file = imageInput.files[0];
    console.log(file);
    const formData = new FormData();
    formData.append("image", file);
    console.log(formData);

    try {
        const response = await fetch("api/v1/upload/image", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        imageUrl = data.image.src;
    } catch (error) {
        console.log(error);
    }
});
