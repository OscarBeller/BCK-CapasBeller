import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async validateProduct({
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails = [], // tambien pasar en el body de la request como array
  }) {
    if (!title || !description || !code || !price || !stock || !category)
      return "Check unfilled fields";

    if (fs.existsSync(this.path)) {
      await this.addJsonProduct(
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
      );
    } else {
      await this.createJsonProduct(
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
      );
    }
  }

  async saveData(data) {
    await fs.promises.writeFile(this.path, JSON.stringify(data, null, 5));
  }

  async getProducts() {
    let productData = await fs.promises.readFile(this.path, {
      encoding: "utf-8",
    });
    let parsedData = JSON.parse(productData);
    return parsedData;
  }

  async addJsonProduct(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  ) {
    let productList = await this.getProducts();
    let productAdded = {
      id: productList.length + 1,
      title: title,
      description: description,
      code: code,
      price: "$" + price,
      status: status,
      stock: stock,
      category: category,
      thumbnails: thumbnails,
    };
    const codeValidation = productList.some((product) => product.code == code);
    productList.push(productAdded);
    if (codeValidation) {
      return `Code ${code} is already registered`;
    }
    await this.saveData(productList);
  }

  async createJsonProduct(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  ) {
    let cart = [];
    cart.push({
      id: cart.length + 1,
      title: title,
      description: description,
      code: code,
      price: "$" + price,
      status: status,
      stock: stock,
      category: category,
      thumbnails: thumbnails,
    });
    await this.saveData(cart);
  }

  async getProductsById(id) {
    let productList = await this.getProducts();
    const search = productList.find((product) => product.id === id);
    if (search) {
      return search;
    } else {
      return "Product not found";
    }
  }

  async updateProducts(id, productData) {
    // ---> 'PRODUCTDATA' se pasa por el body de postman<---
    let productList = await this.getProducts();
    let findProduct = productList.find((p) => p.id === id);
    let i = productList.indexOf(findProduct);
    if (!findProduct) {
      return "Product not found";
    }
    if (i !== -1) {
      const { id, ...rest } = productData;
      productList[i] = { ...productList[i], ...rest };
    }
    await this.saveData(productList);
  }

  async deleteProducts(productId) {
    let productList = await this.getProducts();
    let findProduct = productList.find((p) => p.id === productId);
    let i = productList.indexOf(findProduct);
    if (i !== -1) {
      productList.splice(i, 1);
    }
    if (!findProduct) {
      return "Product not found";
    }
    let newId = 1;
    productList.forEach((p) => {
      p.id = newId++;
    });
    await this.saveData(productList);
  }
}
