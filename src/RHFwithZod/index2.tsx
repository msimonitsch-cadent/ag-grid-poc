import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
});

type FormData = z.infer<typeof schema>;

export function MyForm() {
  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });

  // 👇 Store initial values to compare against
  const initialValues = useRef(getValues());

  // Track if the field is dirty manually
  const isDirty = (name: keyof FormData) => {
    return getValues(name) !== initialValues.current[name];
  };

  const handleBlur = async (name: keyof FormData) => {
    if (isDirty(name)) {
      await trigger(name);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof FormData;

    if (isDirty(name) && errors[name]) {
      await trigger(name);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
  };

  console.log({ errors, getValues: getValues() });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("email")}
        name="email"
        placeholder="Email"
        onBlur={() => handleBlur("email")}
        onChange={handleChange}
      />
      {errors.email && <span>{errors.email.message}</span>}

      <button type="submit">Save</button>
    </form>
  );
}
