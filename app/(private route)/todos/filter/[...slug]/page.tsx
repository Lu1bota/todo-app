import TodosView from "@/components/TodosView/TodosView";
import React from "react";

interface TodosProps {
  params: Promise<{ slug: string[] }>;
}

export default async function Todos({ params }: TodosProps) {
  const { slug } = await params;
  const status = slug[0] === "all" ? undefined : slug[0];

  return <TodosView />;
}
