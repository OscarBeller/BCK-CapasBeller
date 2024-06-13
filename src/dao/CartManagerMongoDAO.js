import { cartsModel } from "./models/cartsModel.js";
import ProductManagerMongoDAO from "./ProductManagerMongoDAO.js";
const productManager = new ProductManagerMongoDAO();

export default class CartManagerMongoDAO {
  async create() {
    return await cartsModel.create({ products: [] });
  }

  async get() {
    const carts = await cartsModel.find().populate("products.product");
    return carts;
  }

  async getById(idCart) {
    const searchCart = await cartsModel
      .findOne({ _id: idCart })
      .populate("products.product");
    return searchCart;
  }

  async add(idCart, idProduct) {
    try {
      let searchCart = await this.getById(idCart);
      let isProductInCart = false;
      searchCart.products.forEach((p) => {
        let product = p.product;

        if (product._id == idProduct) {
          p.quantity = p.quantity + 1;
          isProductInCart = true;
        }
      });

      if (!isProductInCart) {
        let producto = await productManager.getBy({ _id: idProduct });
        searchCart.products.push({ product: producto._id, quantity: 1 });
      }

      await searchCart.save();
    } catch (error) {
      console.error(error);
    }
  }

  async delete(idCart, idProduct) {
    try {
      let searchCart = await this.getById(idCart);
      searchCart.products = searchCart.products.filter(
        (p) => p.product._id != idProduct
      );
      await searchCart.save();
    } catch (error) {
      return `Error: product ${idProduct} not found`;
    }
  }

  async update(idCart, idProduct, quantityUpdate) {
    try {
      let searchCart = await this.getById(idCart);
      searchCart.products.forEach((p) => {
        let product = p.product;

        if (product._id == idProduct) {
          p.quantity = quantityUpdate;
        }
      });
      await searchCart.save();
    } catch (error) {
      return `Error: product ${idProduct} not found`;
    }
  }

  async deleteAll(idCart) {
    try {
      let searchCart = await this.getById(idCart);

      if (searchCart) {
        searchCart.products.splice(0, searchCart.products.length);
        searchCart.save();
      }
    } catch (error) {
      return `Error: product ${id} not found`;
    }
  }
  async updateAll(idCart, toUpdate) {
    try {
      let searchCart = await this.getById(idCart);

      if (searchCart) {
        await this.deleteAll(idCart);
        searchCart.products.push(toUpdate);
      }

      await searchCart.save();
    } catch (error) {
      return `Error:  ${error.message} `;
    }
  }
}
