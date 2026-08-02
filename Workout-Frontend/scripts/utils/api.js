export const getIngredients = async () => {
    const response = await fetch("api/v1/ingredient");

    if (!response.ok) {
        throw new Error(`Failed to fetch ingredients: ${response.status}`);
    }
    return response.json();
};

export const getRecipes = async () => {
    try {
        const response = await fetch("api/v1/recipe");
        console.log(response);

        if (!response.ok) {
            throw new Error(`Failed to fetch ingredients: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.log(error);
    }
};
