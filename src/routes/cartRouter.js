import { Router } from "express";
export const router = Router();
import { CartController } from "../controller/cartController.js";

router.get("/", CartController.getAllCarts);

router.post("/", CartController.createCart);

router.get("/:cid", CartController.getCartById);

router.post("/:cid/product/:pid", CartController.addProductToCart);

router.delete("/:cid/product/:pid", CartController.deleteProductInCart);

router.put("/:cid/product/:pid", CartController.updateProductInCart);

router.delete("/:cid", CartController.deleteAllProductsInCart);

router.put("/:cid", CartController.updateAllCart);
