'use client';

import css from './TodosList.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { TodosResponse } from '@/types/todo';
import { deleteTodo } from '@/lib/api';

interface TodosListProps {
  todos: TodosResponse[];
}

export default function TodosList({ todos }: TodosListProps) {
  const queryClient = useQueryClient();
  const mutationDelete = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Done! The note has been deleted.');
    },
    onError: () => {
      toast.error("Oops! Something went wrong — the note wasn't deleted.");
    },
  });

  function handleDelete(todoId: string) {
    mutationDelete.mutate(todoId);
  }
  return (
    <>
      <ul className={css.list}>
        {todos.length > 0 &&
          todos.map(todo => (
            <li className={css.listItem} key={todo._id}>
              <h2 className={css.title}>{todo.name}</h2>
              <p className={css.content}>{todo.description}</p>
              <div className={css.footer}>
                <span className={css.tag}>{todo.status}</span>
                {/* <Link href={`/notes/${note.id}`} className={css.link}>
                  View details
                </Link> */}
                <button
                  className={css.button}
                  onClick={() => {
                    handleDelete(todo._id);
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>
    </>
  );
}
