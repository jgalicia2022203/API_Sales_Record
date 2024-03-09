import Product from "../products/product.model.js";

export const validateStock = async (req, res, next) => {
  const { stock, product } = req.body;

  try {
    const productFromDB = await Product.findById(product);
    if (!productFromDB) {
      return res.status(404).send({ message: "Product not found" });
    }

    if (productFromDB.stock < stock) {
      return res.status(400).send({ message: "Not enough stock available" });
    }

    next();
  } catch (error) {
    console.error("Error validating stock:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
