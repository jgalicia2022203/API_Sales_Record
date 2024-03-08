import Category from "../categories/category.model.js";
import Invoice from "../invoices/invoice.model.js";
import Product from "../products/product.model.js";
import User from "../users/user.model.js";

export const usernameValid = async (username = "") => {
  const usernameValid = await User.findOne({ username });
  return !!usernameValid;
};

export const emailValid = async (email = "") => {
  const emailValid = await User.findOne({ email });
  return !!emailValid;
};

export const existsUsername = async (username = "") => {
  const existsUsername = await User.findOne({ username });
  if (existsUsername) {
    throw new Error(`the username ${username} is already registered`);
  }
};

export const existsEmail = async (email = "") => {
  const existsEmail = await User.findOne({ email });
  if (existsEmail) {
    throw new Error(`the email ${email} is already registered`);
  }
};

export const existsUserById = async (id = "") => {
  const existsUser = await User.findOne({ id });
  if (existsUser) {
    throw new Error(`the user with the id ${id} doesn't exist`);
  }
};

export const existsProductById = async (id = "") => {
  const existsProduct = await Product.findOne({ id });
  if (existsProduct) {
    throw new Error(`the product with the id ${id} doesn't exist`);
  }
};

export const existsCategoryById = async (id = "") => {
  const existsCategory = await Category.findOne({ id });
  if (existsCategory) {
    throw new Error(`the category with the id ${id} doesn't exist`);
  }
};

export const existsInvoiceById = async (id = "") => {
  const existsInvoice = await Invoice.findOne({ id });
  if (existsInvoice) {
    throw new Error(`the invoice with the id ${id} doesn't exist`);
  }
};
