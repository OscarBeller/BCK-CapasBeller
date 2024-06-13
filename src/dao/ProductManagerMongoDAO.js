import { productsModel } from "./models/productsModel.js";
export default class ProductManagerMongoDAO {
  async create({
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails = [], // tambien pasar en el body de la request como array
  }) {
    let productAdded = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    await productsModel.create(productAdded);
  }

  async getPaginate(limit = 10, page = 1, price, query) {
    if (price) {
      if (price == "asc") {
        price = 1;
      } else if (price == "desc") {
        price = -1;
      }
    }
    let options = {
      limit,
      page,
      lean: true,
      sort: price ? { price } : undefined,
    };

    let filter = query ? query : undefined;
    try {
      let {
        docs: payload,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
      } = await productsModel.paginate(filter, options);

      let paginationInfo = {
        status: "success",
        payload,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? `/products/?page=${prevPage}` : null,
        nextLink: hasNextPage ? `/products/?page=${nextPage}` : null,
      };
      return paginationInfo;
    } catch (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  }

  async getAll() {
    return await productsModel.find().lean();
  }

  async getBy(filtro) {
    return await productsModel.findOne(filtro);
  }

  async update(id, productData) {
    return await productsModel.findByIdAndUpdate(id, productData, {
      runValidators: true,
      returnDocument: "after",
    });
  }

  async delete(productId) {
    return await productsModel.deleteOne({ _id: productId });
  }
}
