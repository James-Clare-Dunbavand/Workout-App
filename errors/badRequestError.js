

const CustomError = require('./customError.js');

class BadRequestError extends CustomError {
	constructor(message) {
		super(message);
		this.status = 400;
	}
}

module.exports = BadRequestError
