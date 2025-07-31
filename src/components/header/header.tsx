import { NewTodo } from '../newTodo/newTodo';
import classNames from 'classnames';

type Props = {
  toggleAll: number;
  addPost: (title: string) => Promise<void>;
  loading: boolean;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

export const Header: React.FC<Props> = ({
  toggleAll,
  addPost,
  loading,
  setError,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: !toggleAll })}
        data-cy="ToggleAllButton"
      />

      <NewTodo handleAdd={addPost} setError={setError} loading={loading} />

      {/* Add a todo on form submit */}
    </header>
  );
};
