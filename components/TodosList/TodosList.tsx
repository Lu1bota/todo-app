'use client';

import css from './TodosList.module.css';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { TodosResponse } from '@/types/todo';
import { deleteTodo, getTodoById } from '@/lib/api';
import { useState } from 'react';

interface TodosListProps {
  todos: TodosResponse[];
}

export default function TodosList({ todos }: TodosListProps) {
  const [todoId, setTodoId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

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

  const { data, isLoading } = useQuery({
    queryKey: ['note', todoId],
    queryFn: () => getTodoById(todoId),
    enabled: !!todoId,
  });

  function handleDelete(todoId: string) {
    mutationDelete.mutate(todoId);
  }

  function handleSetId(id: string) {
    setTodoId(id);
    setIsOpen(true);
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
                <button
                  className={css.button}
                  onClick={() => handleSetId(todo._id)}
                >
                  Деталі
                </button>
                <button
                  className={css.button}
                  onClick={() => {
                    handleDelete(todo._id);
                  }}
                >
                  Видалити
                </button>
              </div>
            </li>
          ))}
      </ul>
    </>
  );
}
