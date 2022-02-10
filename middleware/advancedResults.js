const advancedResults = (model, populate) => async (req, res, next) => {
  let query
  const reqQuery = { ...req.query }
  const removeField = ['select', 'sort', 'page', 'limit']
  removeField.forEach((param) => delete reqQuery[param])
  let queryStr = JSON.stringify(reqQuery)

  //create operators like ( $gt, $lte etc) MongoDB documentation
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

  query = model.find(JSON.parse(queryStr))

  //Select fields return only selected data
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await model.countDocuments()
  query = query.skip(startIndex).limit(limit)

  if (populate) {
    query = query.populate(populate)
  }
  //Executing query
  const results = await query

  //Pagination result
  const pagination = {}
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res.advancedResults = {
    succes: true,
    count: results.length,
    pagination,
    data: results,
  }
  next()
}

module.exports = advancedResults
