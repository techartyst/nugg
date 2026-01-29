import React, { useState } from 'react';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const handleChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim() !== '') {
      setTasks([...tasks, { text: newTask, done: false }]);
      setNewTask('');
    }
  };

  const handleEdit = (index, newValue) => {
    const newTasks = [...tasks];
    newTasks[index].text = newValue;
    setTasks(newTasks);
  };

  const handleToggleDone = (index) => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);
  };

  const handleDelete = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  return (
    <div>
      <h1>Simple To-Do App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add a task"
          value={newTask}
          onChange={handleChange}
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => handleToggleDone(index)}
            />
            <input
              type="text"
              value={task.text}
              onChange={(e) => handleEdit(index, e.target.value)}
              style={{ textDecoration: task.done ? 'line-through' : 'none' }}
            />
            <button onClick={() => handleDelete(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
