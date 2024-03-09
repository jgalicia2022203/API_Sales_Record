export const provideStock = (req, res, next) => {
  console.log(req.body);
  const { stock } = req.body;
  if (!stock || stock <= 0) {
    return res
      .status(400)
      .send({ message: "Stock must be provided and greater than 0" });
  }
  next();
};
