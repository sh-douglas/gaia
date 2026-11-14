import express from "express";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import employeeRoutes from "./routes/employee.routes.js";
import authRoutes from "./routes/auth.routes.js";
import doctorNotesRoutes from "./routes/doctor-notes.routes.js";

const app = express();

app.use(express.json());

app.use("/doctor-notes", doctorNotesRoutes);
app.use("/employees", employeeRoutes);
app.use("/auth", authRoutes);

app.use(errorHandler);

export default app;
