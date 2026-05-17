


const CustomError = require('./customError.js');

class DatabaseError extends CustomError {
	constructor(message) {
		super(message);
		this.status = 500;
	}
}

module.exports = DatabaseError
