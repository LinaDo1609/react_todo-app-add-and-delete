import { useRef, useState } from 'react';

type Props = {
  handleAdd: (title: string) => Promise<void>;
  loading: boolean;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

export const NewTodo: React.FC<Props> = ({ handleAdd, loading, setError }) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setTitle('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');

      return;
    }

    handleAdd(trimmedTitle).then(reset);
  };

  if (!loading && inputRef.current) {
    inputRef.current.focus();
  }

  return (
    <form onSubmit={e => handleSubmit(e)}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={loading}
        autoFocus
      />
    </form>
  );
};
