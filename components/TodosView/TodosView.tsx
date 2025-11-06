'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import css from './TodosView.module.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Loader from '../Loader/Loader';
import { getTodos } from '@/lib/api';
import { Status } from '@/types/todo';
import TodosList from '../TodosList/TodosList';

interface filterListTypes {
  linkName: string;
  filteredType: Status | 'all';
  value?: undefined | string;
}

const filtersList: filterListTypes[] = [
  {
    linkName: 'Всі нотатки',
    filteredType: 'all',
    value: undefined,
  },
  {
    linkName: 'Виконані',
    filteredType: 'done',
  },
  {
    linkName: 'У процесі',
    filteredType: 'in progress',
    value: 'progress',
  },
  {
    linkName: 'Активні',
    filteredType: 'todo',
  },
];

interface TodosViewProps {
  initialStatus?: Status;
}

export default function TodosView({ initialStatus }: TodosViewProps) {
  const [currentStatus, setCurrentStatus] = useState<Status | undefined>(
    initialStatus
  );

  useEffect(() => {
    setCurrentStatus(initialStatus);
  }, [initialStatus]);

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['todos', currentStatus],
    queryFn: () => getTodos(currentStatus),
    placeholderData: keepPreviousData,
    refetchOnMount: true,
  });

  if (isLoading) return <Loader />;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>

        <ul className={css.filters}>
          {filtersList.map((filter, index) => (
            <li key={index}>
              <Link
                href={
                  filter.filteredType === 'in progress'
                    ? '/todos/filter/progress'
                    : `/todos/filter/${filter.filteredType}`
                }
                className={
                  currentStatus ||
                  filter.value === undefined ||
                  filter.filteredType
                    ? css.activeFilter
                    : css.filter
                }
              >
                {filter.linkName}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {data && <TodosList todos={data} />}
    </div>
  );
}
