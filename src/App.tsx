/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Footer } from './components/footer/Footer';
import { ErrorMessage } from './components/errorMessage/error';
import { Header } from './components/header/header';
import { TodoList } from './components/todoList/todoList';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const FILTERS = {
    all: 'all',
    completed: 'completed',
    active: 'active',
  };

  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [filteredList, setFilteredList] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [unCompletedCount, setUnCompletedCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterQuery, setFilterQuery] = useState('all');

  //  перша загрузка данних на сторінку
  useEffect(() => {
    getTodos()
      .then(data => {
        setTodoList(data);
        setFilteredList(data);
      })
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  // прибираємо помилку через 3 секунди, а після вже видаляємо таймер
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  // обробка фільтрів
  const handleFilter = (query: string) => {
    setFilterQuery(query);
    switch (query) {
      case FILTERS.completed:
        setFilteredList(todoList.filter(todo => todo.completed === true));
        break;
      case FILTERS.active:
        setFilteredList(todoList.filter(todo => todo.completed === false));
        break;
      default:
        setFilteredList(todoList);
    }
  };

  // ми перевіряємо чи всі todo виконані, аби для кнопки в header,
  // а також для лічильника активних todo в footer
  useEffect(() => {
    const uncompleted = todoList.filter(todo => todo.completed === false);

    setCompletedTodos(todoList.filter(todo => todo.completed === true)); //фільтруємо виконані todos
    setUnCompletedCount(uncompleted.length); // лічільник активних todos
    
    handleFilter(filterQuery); // застосовуємо фільтр до списку todos


  }, [todoList]);

  const addPost = (title: string) => {
    setError(null); // очищаємо помилку, якщо вона була

    setLoading(true);
    setTempTodo({
      id: 0,
      userId: 3217,
      title: title,
      completed: false,
    });

    return addTodo(title)
      .then(newPost => {
        setTodoList(prevList => [...prevList, newPost]);
        setLoading(false);
        setTempTodo(null);
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTempTodo(null);
        setLoading(false);
        throw new Error('Unable to add a todo');
      });
  };

  const deletePost = (postId: number) => {
    setError(null);

    return deleteTodo(postId)
      .then(() =>
        setTodoList(prevTodos => prevTodos.filter(todo => todo.id !== postId)),
      )
      .catch(() => {
        setError('Unable to delete a todo');
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          toggleAll={unCompletedCount}
          addPost={addPost}
          loading={loading}
          setError={setError}
        />

        <TodoList
          todoList={filteredList}
          todoTemp={tempTodo}
          deleteTodo={deletePost}
        />

        {todoList.length > 0 && (
          <Footer
            filter={handleFilter}
            unCompletedCount={unCompletedCount}
            completed={completedTodos}
            deleteAll={deletePost}
          />
        )}
      </div>

      <ErrorMessage error={error} hideError={setError} />
    </div>
  );
};
