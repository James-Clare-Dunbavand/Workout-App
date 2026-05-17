const { CustomError } = require('../errors');

const errorHandler = (err, req, res, next) => {

	console.log(err);
	const error = {
		status: 500,
		message: "internal server error please try again."
	}
	if (err instanceof CustomError) {
		error.status = err.status;
		error.message = err.message;
	}
	else if (err.code === 11000) {
		error.status = 400;
		error.message = `${err.keyValue.name} already exists`;
	}
	else if (err.name === "CastError" && err.reason.code === "ERR_ASSERTION") {
		error.status = 400;
		error.message = err.message;
	}
	else if (err.name === "ValidationError") {

		error.status = 400;
		error.message = err.message;
	}

	res.status(error.status).json({ message: error.message })
}


module.exports = errorHandler
