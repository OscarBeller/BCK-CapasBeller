import { Router } from "express";
import { ProductController } from "../controller/productController.js";
export const router = Router();

router.get("/", ProductController.getProducts);

router.get("/:pid", ProductController.getProductById);

router.post("/", ProductController.addProduct);

router.put("/:pid", ProductController.updateProduct);

router.delete("/:pid", ProductController.deleteProduct);
