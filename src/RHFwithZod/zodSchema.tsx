import * as z from "zod";

export const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  age: z.number().min(18, { message: "You must be 18 or older." }),
});

export type FormSchemaType = z.infer<typeof formSchema>;
