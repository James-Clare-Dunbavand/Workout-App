import { Routes, Route } from "react-router";
import Home from "./pages/Home.tsx";
import RecipeBuilder from "./pages/RecipeBuilder.tsx";
import Layout from "./features/layout/Layout.tsx";
import MealPlaner from "./pages/MealPlaner.tsx";
import MealPlansHookProvider from "./contexts/mealPlans/MealPlansProvider.tsx";
import RecipeByIdProvider from "./contexts/recipeById/RecipeByIdProvider.tsx";

export default function App() {
    return (
        <RecipeByIdProvider>
            <MealPlansHookProvider>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/builder/ingredient"
                            element={<RecipeBuilder />}
                        />

                        <Route path="/planer/meals" element={<MealPlaner />} />
                    </Route>
                </Routes>
            </MealPlansHookProvider>
        </RecipeByIdProvider>
    );
}
