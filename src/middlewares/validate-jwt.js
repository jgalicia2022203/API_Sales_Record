import jwt from "jsonwebtoken";
import User from "../users/user.model.js";

export const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No token provided",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
    const user = await User.findById(uid);
    if (!user) {
      return res.status(401).json({
        msg: "User does not exist in the database",
      });
    }
    if (!user.status) {
      return res.status(401).json({
        msg: "Invalid token, user is inactive",
      });
    }
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).json({
      msg: "Invalid token",
    });
  }
};
