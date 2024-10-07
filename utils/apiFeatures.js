class ApiFeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	filter() {
		// BUILD QUERY
		const queryObj = { ...this.queryString }

		// 1) filtering
		const excludedQuery = ['sort', 'limit', 'page', 'fields']
		excludedQuery.forEach(excluded => delete queryObj[excluded])

		//! advance filtering
		// converts query str to mongodb query
		let queryStr = JSON.stringify(queryObj)
		queryStr = queryStr.replace(/\b(lte|lt|gte|ge)\b/g, match => `$${match}`)

		// GET QUERY OBJ
		this.query = this.query.find(JSON.parse(queryStr)) // returns a query object

		return this;
	}

	sorting() {
		if (this.queryString.sort) {
			const sorting = this.queryString.sort.split(",").join(' ')
			this.query = this.query.sort(sorting)
		} else {
			// if no sorting is passed
			this.query = this.query.sort("duration")
		}
		return this;
	}

	pagination() {
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit || 5;
		const skip = (page - 1) * limit;
		this.query = this.query.skip(skip).limit(limit)
		return this;
	}
}



module.exports = ApiFeatures;