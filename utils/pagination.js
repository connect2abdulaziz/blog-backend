// utils/pagination.js

/**
 * Generic pagination function to handle pagination for queries.
 *
 * @param {number} page - Current page number.
 * @param {number} limit - Number of items per page.
 * @param {object} queryOptions - Query options to be passed to the Sequelize query.
 * @returns {object} - An object containing the paginated data and metadata.
 */

const paginate = async (model, queryOptions) => {
  const { page = 1, limit = 10, ...restOptions } = queryOptions;
  const offset = (page - 1) * limit;

  const { count, rows } = await model.findAndCountAll({
    ...restOptions,
    limit,
    offset,
  });

  return {
    data: rows,
    pagination: {
      totalItems: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      perPage: limit,
    },
  };
};

export default paginate;

