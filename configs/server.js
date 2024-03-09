"use strict";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "../src/auth/auth.routes.js";
import categoryRoutes from "../src/categories/category.routes.js";
import productRoutes from "../src/products/product.routes.js";
import shoppingRoutes from "../src/shopping/shoppingCart.routes.js";
import userRoutes from "../src/users/user.routes.js";
import { dbConnection } from "./mongo.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.userPath = "/salesRecordAPI/v1/users";
    this.authPath = "/salesRecordAPI/v1/auth";
    this.productPath = "/salesRecordAPI/v1/products";
    this.categoryPath = "/salesRecordAPI/v1/categories";
    this.shoppingPath = "/salesRecordAPI/v1/shoppingCart";

    this.middlewares();
    this.connectDB();
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(morgan("dev"));
  }

  routes() {
    this.app.use(this.userPath, userRoutes);
    this.app.use(this.authPath, authRoutes);
    this.app.use(this.productPath, productRoutes);
    this.app.use(this.categoryPath, categoryRoutes);
    this.app.use(this.shoppingPath, shoppingRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port ", this.port);
    });
  }
}

export default Server;
