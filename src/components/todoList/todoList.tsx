import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/todo';
import { Loader } from '../loader/loader';

type Props = {
  todoList: Todo[];
  todoTemp: Todo | null;
  deleteTodo: (postId: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todoList,
  todoTemp,
  deleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <TodoItem todo={todo} key={todo.id} deleteTodo={deleteTodo} />
      ))}

      {/* todoTemp з'являється, коли йде загрузка запиту на додавання todo до серверу */}
      {todoTemp && (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: todoTemp.completed })}
          key={todoTemp.id}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todoTemp.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todoTemp.title}
          </span>

          <Loader />
        </div>
      )}
    </section>
  );
};
