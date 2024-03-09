import fs from "fs";
import PDFDocument from "pdfkit";
import Invoice from "../invoices/invoice.model.js";
import Product from "../products/product.model.js";
import Shopping from "./shoppingCart.model.js";

export const addProductToCart = async (req, res) => {
  try {
    const data = req.body;
    const product = await Product.findById(data.product);
    product.stock -= data.stock;
    await product.save();
    const shopping = new Shopping({
      product: data.product,
      user: req.user.id,
      stock: data.stock,
    });
    await shopping.save();
    return res.status(200).json({
      message: "Product added to the shopping cart successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Error adding product to the shopping cart" });
  }
};

export const makePurchase = async (req, res) => {
  try {
    const userId = req.user.id;
    const shopping = await Shopping.findOne({ user: userId }).populate(
      "product"
    );
    if (!shopping) {
      return res.status(404).send({ message: "Shopping cart not found" });
    }
    const item = {
      product: shopping.product,
      quantity: shopping.stock,
      subtotal: shopping.product.price * shopping.stock,
    };
    const newInvoice = new Invoice({
      user: userId,
      shopping: shopping._id,
      total: shopping.product.price * shopping.stock,
      items: [
        {
          product: shopping.product,
          quantity: shopping.stock,
          subtotal: shopping.product.price * shopping.stock,
        },
      ],
    });
    console.log(shopping);
    await newInvoice.save();
    await Shopping.findByIdAndDelete(shopping._id);
    return res.status(201).send({
      message: "Purchase completed successfully",
      invoice: newInvoice,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error making purchase" });
  }
};

export const generateInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const invoice = await Invoice.findById(invoiceId)
      .populate("user")
      .populate("shopping");

    if (!invoice) {
      return res.status(404).send({ message: "Invoice not found" });
    }

    // Makes a PDF with pdfkit module
    const doc = new PDFDocument();
    const filePath = `invoice${invoiceId}.pdf`;
    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(20).text("Invoice", { align: "center" }).moveDown();
    doc.fontSize(16).text(`Invoice ID: ${invoice._id}`).moveDown();
    doc.fontSize(14).text(`Date: ${invoice.date}`).moveDown();
    doc
      .fontSize(14)
      .text(`User: ${invoice.user.username} (${invoice.user.email})`)
      .moveDown();
    doc.moveDown();
    doc.fontSize(16).text("Items:").moveDown();
    invoice.items.forEach((item, index) => {
      doc.fontSize(12).text(`Item ${index + 1}:`);
      doc.fontSize(10).text(`Product: ${item.product.name}`);
      doc.fontSize(10).text(`Quantity: ${item.quantity}`);
      doc.fontSize(10).text(`Subtotal: ${item.subtotal}`).moveDown();
    });
    doc.fontSize(16).text(`Total: ${invoice.total}`).moveDown();
    doc.end();

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filePath}"`);

    // Send the PDF as response
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    // Remove the PDF file after sending
    stream.on("end", () => {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Error deleting PDF file:", err);
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error generating PDF invoice" });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const updatedInvoice = req.body;
    const updated = await Invoice.findByIdAndUpdate(invoiceId, updatedInvoice, {
      new: true,
    });

    for (const item of updated.items) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with ID ${item.product._id} not found` });
      }
      await product.save();
    }
    return res.status(200).json({
      message: "Invoice updated successfully",
      updatedInvoice: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating invoice" });
  }
};

export const getUserInvoices = async (req, res) => {
  try {
    const userId = req.user.id;
    const invoices = await Invoice.find({ user: userId });
    return res.status(200).json({ invoices });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving user invoices" });
  }
};
