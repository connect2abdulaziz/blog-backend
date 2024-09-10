/**
 * Generic pagination function to handle pagination for queries.
 *
 * @param {number} page - Current page number.
 * @param {number} limit - Number of items per page.
 * @param {object} queryOptions - Query options to be passed to the Sequelize query.
 * @param {Model} Model - The Sequelize model to perform the query on.
 * @returns {object} - An object containing the paginated data and metadata.
 */
const paginate = async (page = 1, limit = 10, queryOptions = {}, Model) => {
  // Ensure page and limit are numbers and page is greater than 0
  page = page > 0 ? page : 1;
  limit = limit > 0 ? limit : 10;

  // Calculate the offset
  const offset = (page - 1) * limit;

  // Perform the query with pagination
  const { count, rows } = await Model.findAndCountAll({
    ...queryOptions,
    limit,
    offset,
  });

  return {
    data: rows,
    pagination: {
      currentPage: page,
      totalCount: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};

export default paginate;
