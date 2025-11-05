"use client";

// import { AuthRequest, login, register } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import css from "./AuthForm.module.css";
import { AuthRequest, RegisterResponse } from "@/types/todo";

interface AuthFormProps {
  title: string;
  buttonTitle: string;
  mutationFn: (data: AuthRequest) => Promise<RegisterResponse | any>;
}

export default function AuthForm({
  title,
  buttonTitle,
  mutationFn,
}: AuthFormProps) {
  const router = useRouter();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: mutationFn,
    onSuccess: (data) => {
      router.push("/todos");
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData);
    const loginData: AuthRequest = {
      email: formValues.email.toString(),
      password: formValues.password.toString(),
    };

    mutate(loginData);
  }

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <h1 className={css.formTitle}>{title}</h1>

      <div className={css.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          className={css.input}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="password">Пароль</label>
        <input
          id="password"
          type="password"
          name="password"
          className={css.input}
          required
        />
      </div>

      <div className={css.actions}>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          {isPending ? "Завантаження..." : buttonTitle}
        </button>
      </div>

      {isError && (
        <div className={css.error}>Неправильний email або пароль</div>
      )}
    </form>
  );
}
