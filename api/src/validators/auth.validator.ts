import { z } from "zod";
import { cpfSchema } from "./common/cpf.schema.js";

const signInSchema = z.object({
  cpf: cpfSchema,
  password: z.string().min(1, "The password input cannot be empty."),
});

type SignInInput = z.infer<typeof signInSchema>;

export { signInSchema, type SignInInput };
