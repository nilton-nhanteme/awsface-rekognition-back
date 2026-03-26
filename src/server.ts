import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import faceRoutes from "./routes/face.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();
dotenv.config()

const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Configurando as rotas
app.use('/api', faceRoutes);
app.use('/api', adminRoutes);

try {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} catch (error) {
  console.log(error);
}