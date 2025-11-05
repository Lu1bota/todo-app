"use client";

import AuthForm from "@/components/AuthForm/AuthForm";
import { login } from "@/lib/api";

export default function SignIn() {
  return <AuthForm title="Логін" buttonTitle="Увійти" mutationFn={login} />;
}
