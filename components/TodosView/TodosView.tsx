"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import css from "./TodosView.module.css";
import { useState } from "react";
import Link from "next/link";
import Loader from "../Loader/Loader";
import { getTodos } from "@/lib/api";
import { Status } from "@/types/todo";
import TodosList from "../TodosList/TodosList";

interface TodosViewProps {
  initialStatus?: Status;
}

export default function TodosView({ initialStatus }: TodosViewProps) {
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["todos", initialStatus],
    queryFn: () => getTodos(initialStatus),
    placeholderData: keepPreviousData,
    refetchOnMount: true,
  });

  if (isLoading) return <Loader />;

  // const notesRequest = data?.notes ?? [];
  // const totalPage = data?.totalPages ?? 1;

  // function handleChange(newQuery: string) {
  //   setQuery(newQuery);
  //   setCurrentPage(1);
  // }

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      {isSuccess && data && <TodosList todos={data} />}
    </div>
  );
}
