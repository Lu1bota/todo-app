import TodosView from "@/components/TodosView/TodosView";
import { Status } from "@/types/todo";

interface TodosProps {
  params: Promise<{ slug: string[] }>;
}

export default async function Todos({ params }: TodosProps) {
  const { slug } = await params;
  const slugValue = slug[0];
  const status = slugValue === "all" ? undefined : (slugValue as Status);

  return <TodosView initialStatus={status} />;
}
