import { Trash, Check } from 'phosphor-react';
import { useCallback, useState } from 'react';

import styles from './Todo.module.css';

interface TodoProps {
  isDone: boolean;
  content: string;
  timestamp: number;
  onDelete: (timestamp: number) => void;
  onDoneChange: (timestamp: number) => void;
}

export function Todo({ content, isDone, timestamp, onDelete, onDoneChange }: TodoProps) {

  const [isTodoDone, setIsTodoDone] = useState(isDone);

  const handleCheckClick = useCallback(() => {
    setIsTodoDone(!isTodoDone);
    onDoneChange(timestamp);
  }, [onDoneChange, timestamp, isDone]);

  const handleDelete = useCallback(() => {
    onDelete(timestamp);
  }, [onDelete, timestamp]);

  return (
    <div className={styles.todo}>
      <button
        className={`${styles.checkButton} ${isDone ? styles.done : ''}`}
        onClick={handleCheckClick}
      >
        <Check />
      </button>
      <p className={`${styles.content} ${isDone ? styles.dashed : ''}`}>
        {content}
      </p>
      <button
        className={styles.deleteButton}
        onClick={handleDelete}
      >
        <Trash size={20} />
      </button>
    </div>
  )
}