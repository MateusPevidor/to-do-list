import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { PlusCircle, ClipboardText } from 'phosphor-react';

import { Header } from './components/Header';
import { Todo } from './components/Todo';

import styles from './App.module.css';

import './global.css'

interface Todo {
  isDone: boolean;
  content: string;
  timestamp: number;
}

function App() {

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [taskText, setTaskText] = useState('');

  const handleTaskTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTaskText(e.target.value);
  }, [taskText]);

  // Load todos
  useEffect(() => {
    const storedTodos = localStorage.getItem('@to-do-list:todos');
    if (!storedTodos) {
      setTodos([]);
      return;
    }

    setTodos(JSON.parse(storedTodos));
    setLoaded(true);
  }, []);

  // Save todos whenever they are modified
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem('@to-do-list:todos', JSON.stringify(todos));
  }, [todos, loaded]);

  const handleAddTodo = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTodo = {
      content: taskText,
      isDone: false,
      timestamp: Date.now(),
    }
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    setTaskText('');
  }, [taskText, todos]);

  const handleTodoDelete = useCallback((timestamp: number) => {
    const newTodos = todos.filter(todo => todo.timestamp !== timestamp);
    setTodos(newTodos);
  }, [todos]);

  const handleTodoDone = useCallback((timestamp: number) => {
    const index = todos.findIndex(todo => todo.timestamp === timestamp);
    const newTodos = todos.slice();
    newTodos[index].isDone = !newTodos[index].isDone;

    setTodos(newTodos);
  }, [todos]);

  const doneTasksCount = useMemo(() => {
    const n = todos.reduce((acc, curr) => {
      if (curr.isDone) acc += 1;
      return acc;
    }, 0);
    return n;
  }, [todos])

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <form
          className={styles.newTask}
          onSubmit={(e) => handleAddTodo(e)}
        >
          <input
            type="text"
            placeholder='Adicione uma nova tarefa'
            maxLength={255}
            value={taskText}
            onChange={(e) => handleTaskTextChange(e)}
            required
          />
          <button type='submit'>
            Criar <PlusCircle size={20}></PlusCircle>
          </button>
        </form>
        <div>
          <div className={styles.titles}>
            <div>
              <p>Tarefas criadas</p>
              <span>{todos.length}</span>
            </div>
            <div>
              <p>Concluídas</p>
              <span>{doneTasksCount} de {todos.length}</span>
            </div>
          </div>
          <div>
            {todos.map(todo => (
              <Todo
                key={todo.timestamp}
                content={todo.content}
                isDone={todo.isDone}
                timestamp={todo.timestamp}
                onDelete={handleTodoDelete}
                onDoneChange={handleTodoDone}
              />
            ))}
          </div>
          {todos.length === 0 && <div className={styles.emptySection}>
            <ClipboardText size={64} />
            <b>Você ainda não tem tarefas cadastradas</b>
            <p>Crie tarefas e organize seus itens a fazer</p>
          </div>}
        </div>
      </div>
    </>
  )
}

export default App
