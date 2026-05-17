const { NotFoundError } = require('../errors')

const pathNotFound = (req, res) => {

	throw new NotFoundError(`Path not found ${req.url}`)
}

module.exports = pathNotFound
