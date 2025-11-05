"use client";

import AuthForm from "@/components/AuthForm/AuthForm";
import { register } from "@/lib/api";

export default function SignUp() {
  return (
    <AuthForm
      title="Реєстрація"
      buttonTitle="Зареєструватися"
      mutationFn={register}
    />
  );
}
