import { Model, ModelStatic } from 'sequelize';
type PaginateModel<T extends Model> = ModelStatic<T>;
/**
 * Generic pagination function to handle pagination for queries.
 *
 * @param {number} page - Current page number.
 * @param {number} limit - Number of items per page.
 * @param {FindAndCountOptions} queryOptions - Query options to be passed to the Sequelize query.
 * @param {PaginateModel<T>} Model - The Sequelize model to perform the query on.
 * @returns {object} - An object containing the paginated data and metadata.
 */
declare const paginate: <T extends Model>(page: number | undefined, limit: number | undefined, queryOptions: any, Model: PaginateModel<T>) => Promise<{
    data: T[];
    pagination: {
        currentPage: number;
        totalCount: number;
        totalPages: number;
    };
}>;
export default paginate;
