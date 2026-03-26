import express from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config()

const port = process.env.PORT || 3000;

try {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} catch (error) {
  console.log(error);
}