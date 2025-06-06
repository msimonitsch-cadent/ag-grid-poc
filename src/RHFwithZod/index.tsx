import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormSchemaType } from "./zodSchema";
import { useRef } from "react";
import { getValue } from "@amcharts/amcharts4/.internal/core/utils/Type";

export function MyForm() {
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    // mode: "all",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: undefined,
    },
  });
  const initialValues = useRef(getValues());
  //   console.log({ initialValues });

  const onSubmit = (data: FormSchemaType) => {
    console.log(data);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof FormSchemaType;
    const currentVal = getValues(name);
    console.log({
      name,
      dirtyFields,
      currentVal,
      initialValue: initialValues.current[name],
    });
    if (currentVal !== initialValues.current[name]) {
      // works easily for primitives but what happens with select that contain objects etc.. this could be more complicated.
      console.log("running validation", name);
      trigger(name);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("firstName")}
        placeholder="First Name"
        // onBlur={handleBlur}
      />
      {errors.firstName && (
        <p style={{ color: "red" }}>{errors.firstName.message}</p>
      )}

      <input
        {...register("lastName")}
        placeholder="Last Name"
        // onBlur={handleBlur}
      />
      {errors.lastName && (
        <p style={{ color: "red" }}>{errors.lastName.message}</p>
      )}

      <input
        {...register("email")}
        placeholder="Email" /*  onBlur={handleBlur}  */
      />
      {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

      <input
        {...register("age", { valueAsNumber: true })}
        placeholder="Age"
        // onBlur={handleBlur}
      />
      {errors.age && <p style={{ color: "red" }}>{errors.age.message}</p>}

      <button type="submit">Submit</button>
    </form>
  );
}
