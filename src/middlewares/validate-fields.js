import { validationResult } from "express-validator";

export const validateFields = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  next();
};

export const confirmAction = (req, res, next) => {
  const { confirmation } = req.body;
  if (!confirmation || confirmation !== "confirm") {
    return res.status(400).json({ msg: "Confirmation required" });
  }
  next();
};
