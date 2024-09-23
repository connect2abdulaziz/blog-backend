"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Generic pagination function to handle pagination for queries.
 *
 * @param {number} page - Current page number.
 * @param {number} limit - Number of items per page.
 * @param {FindAndCountOptions} queryOptions - Query options to be passed to the Sequelize query.
 * @param {PaginateModel<T>} Model - The Sequelize model to perform the query on.
 * @returns {object} - An object containing the paginated data and metadata.
 */
const paginate = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10, queryOptions, Model) {
    // Ensure page and limit are numbers and page is greater than 0
    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;
    // Calculate the offset
    const offset = (page - 1) * limit;
    // Perform the query with pagination
    const { count, rows } = yield Model.findAndCountAll(Object.assign(Object.assign({}, queryOptions), { limit,
        offset }));
    return {
        data: rows,
        pagination: {
            currentPage: page,
            totalCount: count,
            totalPages: Math.ceil(count / limit),
        },
    };
});
exports.default = paginate;
