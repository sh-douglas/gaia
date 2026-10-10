import express from "express";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import employeeRoutes from "./routes/employee.routes.js";

const app = express();

app.use(express.json());

app.use("/employees", employeeRoutes);

app.use(errorHandler);

export default app;
