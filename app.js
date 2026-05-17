const express = require("express");
require("express-async-errors");
require("dotenv").config();
const pathNotFound = require("./middleware/pathNotFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const ingredientRouter = require("./routers/ingredientRouter.js");
const recipeRouter = require("./routers/recipeRouter.js");
const nutrientRouter = require("./routers/nutrientRouter.js");

const port = process.env.port || 5500;
const connectDB = require("./mongoDB/connectMongoDB.js");
app.use(express.json());
app.use(express.static("./public"));

app.use("/api/v1/ingredient", ingredientRouter);
app.use("/api/v1/recipe", recipeRouter);
app.use("/api/v1/nutrient", nutrientRouter);
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
