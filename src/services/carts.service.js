import fs from "fs/promises";
import path from "node:path";
import { v4 as uuid } from "uuid";
import { __dirname } from "../dirname.js";

const cartsFilePath = path.resolve(__dirname, "./db/carts.json");

export class CartService {
  async createCart() {
    const carts = await this._readCartsFile();

    const newCart = {
      cartId: uuid(),
      products: [],
    };

    carts.push(newCart);
    await this._writeCartsFile(carts);

    return newCart;
  }
  async getCartById(cartId) {
    const carts = await this._readCartsFile();
    return carts.find((cart) => cart.cartId === cartId);
  }

  async getAllCarts() {
    return await this._readCartsFile();
  }

  async addProductToCart(cartId, productId) {
    const carts = await this._readCartsFile();
    const cart = carts.find((cart) => cart.cartId === cartId);

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    const product = cart.products.find((p) => p.productId === productId);
    if (product) {
      product.quantity += 1;
    } else {
      cart.products.push({ productId, quantity: 1 });
    }

    await this._writeCartsFile(carts);
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    const carts = await this._readCartsFile();
    const cart = carts.find((cart) => cart.cartId === cartId);

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    cart.products = cart.products.filter((p) => p.productId !== productId);

    await this._writeCartsFile(carts);
    return cart;
  }

  async _readCartsFile() {
    try {
      const data = await fs.readFile(cartsFilePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async _writeCartsFile(carts) {
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
  }
}
