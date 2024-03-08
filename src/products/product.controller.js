import Invoice from "../invoices/invoice.model.js";
import Product from "../products/product.model.js";
// ADMIN FUNCTIONS
export const addProduct = async (req, res) => {
  const { name, description, price, ...rest } = req.body;
  try {
    const newProduct = new Product({
      name,
      description,
      price,
    });
    Object.assign(newProduct, rest);
    await newProduct.save();
    res
      .status(201)
      .json({ msg: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const productDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const listProducts = async (req, res = response) => {
  const { limit, from } = req.query;
  const query = { status: true };

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(200).json({
    total,
    products,
  });
};

export const editProduct = async (req, res) => {
  const { id: productId } = req.params;
  const { ...rest } = req.body;

  try {
    let updates = {};
    if (rest.name) updates.name = rest.name;
    if (rest.description) updates.description = rest.description;
    if (rest.price) updates.price = rest.price;
    if (rest.stock) updates.stock = rest.stock;
    if (rest.category) updates.category = rest.category;
    updates.updated_at = new Date();

    const updatedUser = await User.findByIdAndUpdate(productId, updates, {
      new: true,
    });

    res
      .status(200)
      .json({ msg: "product was updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const outOfStock = async (req, res) => {
  try {
    const outOfStockProducts = await Product.find({ stock: 0, status: true });

    res.status(200).json({ outOfStockProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const bestSellingProducts = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    const productCounts = new Map();

    invoices.forEach((invoice) => {
      invoice.products.forEach((product) => {
        const productId = product.productId;
        const quantity = product.quantity;

        if (productCounts.has(productId)) {
          productCounts.set(productId, productCounts.get(productId) + quantity);
        } else {
          productCounts.set(productId, quantity);
        }
      });
    });
    const sortedProducts = [...productCounts.entries()].sort(
      (a, b) => b[1] - a[1]
    );
    res.status(200).json({ bestSellingProducts: sortedProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const existingProduct = await Product.findById(productId);
    existingProduct.status = false;
    await existingProduct.save();
    res.json({ msg: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// CLIENT FUNCTIONS
export const searchProductsByName = async (req, res) => {
  const { name } = req.query;

  try {
    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    });
    if (products.length === 0) {
      return res.status(404).json({ msg: "No products found with that name" });
    }
    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getBestSellingProducts = async (req, res) => {
  try {
    const bestSellingProducts = await Invoice.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalQuantitySold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 10 },
    ]);

    const products = await Product.find({
      _id: { $in: bestSellingProducts.map((item) => item._id) },
    });

    const bestSellingProductsDetails = bestSellingProducts.map((item) => {
      const product = products.find(
        (p) => p._id.toString() === item._id.toString()
      );
      return { ...item, product };
    });

    res.status(200).json({ bestSellingProducts: bestSellingProductsDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const products = await Product.find({ category: categoryId });

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
