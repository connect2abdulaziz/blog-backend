// utils/pagination.js

/**
 * Generic pagination function to handle pagination for queries.
 *
 * @param {number} page - Current page number.
 * @param {number} limit - Number of items per page.
 * @param {object} queryOptions - Query options to be passed to the Sequelize query.
 * @returns {object} - An object containing the paginated data and metadata.
 */

const paginate = async (page, limit, queryOptions, Model) => {
  const offset = (page - 1) * limit;
  const { count, rows } = await Model.findAndCountAll({
    ...queryOptions,
    limit,
    offset,
  });

  return {
    totalItems: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    data: rows,
  };
};


export default paginate;

