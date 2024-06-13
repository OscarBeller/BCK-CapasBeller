import CartManagerMongoDAO from "../dao/CartManagerMongoDAO.js";
import { isValidObjectId } from "mongoose";
const cartManager = new CartManagerMongoDAO();

export class CartController {
  static getAllCarts = async (req, res) => {
    try {
      let getAllCarts = await cartManager.get();
      return res.json({ getAllCarts });
    } catch (error) {
      res.status(500).json({ error: `error getting carts: ${error.message}` });
    }
  };

  static createCart = async (req, res) => {
    try {
      await cartManager.create();
      return res.json({
        payload: `Cart created!`,
      });
    } catch (error) {
      res.status(500).json({ error: "error creating cart" });
    }
  };

  static getCartById = async (req, res) => {
    let { cid } = req.params;
    if (!isValidObjectId(cid)) {
      return res.status(400).json({
        error: `Enter a valid MongoDB id`,
      });
    }

    try {
      let cartById = await cartManager.getById(cid);
      if (!cartById) {
        return res.status(300).json({ error: "Cart not found" });
      } else {
        res.json({ cartById });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: `error getting cart ${cid}, ${error.message}` });
    }
  };

  static addProductToCart = async (req, res) => {
    let { cid, pid } = req.params;

    if (!isValidObjectId(cid, pid)) {
      return res.status(400).json({
        error: `Enter a valid MongoDB id`,
      });
    }

    if (!cid || !pid) {
      return res.status(300).json({ error: "Check unfilled fields" });
    }

    try {
      await cartManager.add(cid, pid);
      let cartUpdated = await cartManager.getById(cid);
      res.json({ payload: cartUpdated });
    } catch (error) {
      res
        .status(500)
        .json({ error: `error when adding product ${pid} to cart ${cid}` });
    }
  };

  static deleteProductInCart = async (req, res) => {
    let { cid, pid } = req.params;
    if (!isValidObjectId(cid)) {
      return res.status(400).json({
        error: `Enter a valid MongoDB id`,
      });
    }

    if (!cid || !pid) {
      return res.status(300).json({ error: "Check unfilled fields" });
    }

    try {
      await cartManager.delete(cid, pid);
      return res.json({ payload: `Product ${pid} deleted from cart ${cid}` });
    } catch (error) {
      return res.status(500).json({ error: `${error.message}` });
    }
  };

  static updateProductInCart = async (req, res) => {
    let { cid, pid } = req.params;
    let { quantity } = req.body;
    if (!isValidObjectId(cid)) {
      return res.status(400).json({
        error: `Enter a valid MongoDB id`,
      });
    }

    if (!cid || !pid) {
      return res.status(300).json({ error: "Check unfilled fields" });
    }

    try {
      await cartManager.update(cid, pid, quantity);
      res.json({ payload: `Product ${pid} updated` });
    } catch (error) {
      return res.status(500).json({ error: `${error.message}` });
    }
  };

  static deleteAllProductsInCart = async (req, res) => {
    let { cid } = req.params;
    if (!isValidObjectId(cid)) {
      return res.status(400).json({
        error: `Enter a valid MongoDB id`,
      });
    }

    if (!cid) {
      return res.status(300).json({ error: "Check unfilled fields" });
    }

    try {
      await cartManager.deleteAll(cid);
      res.json({ payload: `Products deleted from cart ${cid}` });
    } catch (error) {
      return res.status(500).json({ error: `${error.message}` });
    }
  };

  static updateAllCart = async (req, res) => {
    let { cid } = req.params;
    let toUpdate = req.body;
    if (!isValidObjectId(cid)) {
      return res.status(400).json({
        error: `Enter a valid MongoDB id`,
      });
    }

    if (!cid) {
      return res.status(400).json({ error: "Cart ID is missing" });
    }

    if (!toUpdate.product || !toUpdate.quantity) {
      return res.status(400).json({ error: "Invalid Cart" });
    }

    try {
      await cartManager.updateAll(cid, toUpdate);
      res.json({ payload: `Cart ${cid} updated` });
    } catch (error) {
      return res.status(500).json({ error: `${error.message}` });
    }
  };
}
