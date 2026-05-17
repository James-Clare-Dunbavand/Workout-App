const mongoose = require('mongoose');


mongoose.connection.on("connected", () => console.log("Mongo connected..."))
mongoose.connection.on("reconnected", () => console.log("Mongo reconnected..."))
mongoose.connection.on("disconnected", () => console.warn("Mongo disconnected..."))
mongoose.connection.on("error", (err) => console.error(`Mongo error : ${err}`))

const connectDB = async (url) => {

	try {
		mongoose.connect(url, { serverSelectionTimeoutMS: 5000 });
		return mongoose.connection;
	} catch (error) {
		console.error(`Failed to connect to mongoDB. Error : ${error}`);
		throw error;
	}


}

module.exports = connectDB
