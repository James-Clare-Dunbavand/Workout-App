const express = require("express");
require("express-async-errors");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const pathNotFound = require("./middleware/pathNotFound");
const errorHandler = require("./middleware/errorHandler");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();

const ingredientRouter = require("./routers/ingredientRouter.js");
const recipeRouter = require("./routers/recipeRouter.js");
const nutrientRouter = require("./routers/nutrientRouter.js");
const uploadRouter = require("./routers/uploadRouter.js");
const mealRouter = require("./routers/mealRouter.js");
const mealPlanRouter = require("./routers/mealPlanRouter.js");

const port = process.env.port || 5500;
const connectDB = require("./mongoDB/connectMongoDB.js");
app.use(express.json());
app.use(express.static("./public"));
app.use(fileUpload({ useTempFiles: true }));

app.use("/api/v1/ingredient", ingredientRouter);
app.use("/api/v1/meal", mealRouter);
app.use("/api/v1/recipe", recipeRouter);
app.use("/api/v1/nutrient", nutrientRouter);
app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1/mealplan", mealPlanRouter);
app.use("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
    return;
});
app.use(pathNotFound);
app.use(errorHandler);

const start = () => {
    try {
        connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`listening on port ${port}...`));
    } catch (error) {
        console.log(error);
    }
};

start();
