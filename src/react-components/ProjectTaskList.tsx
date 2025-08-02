import { Project, Itodo } from "../classes/Project";

interface Props {
  todos: Itodo[];
  onTodoClick: (index: number) => void;
}

export function ProjectTaskList(props: Props) {
  const { todos } = props;

  return (
    <div id="ToDo-list">
      <div className="todo-header-row">
        <div>No</div>
        <div>ToDo</div>
        <div>Status</div>
        <div>Priority</div>
      </div>

      {todos.map((todo, index) => (
        <div
          key={todo.id || `todo-${index}`}
          className={`todo-row`}
          data-id={index}
          onClick={() => props.onTodoClick(index)}
        >
          <div style={{ flex: "0.2", padding: 10 }}>{index + 1}</div>
          <div style={{ flex: 0.8, padding: 10 }}>{todo.Task}</div>
          
          <div
            className={`status-cell ${todo.Status.toLowerCase()}`}
            style={{ flex: "0.25", padding: 10 }}
          >
            {todo.Status}
          </div>

          <div
            className={`priority-cell ${todo.Priority.toLowerCase()}`}
            style={{ flex: "0.25", padding: 10 }}
          >
            {todo.Priority}
          </div>
        </div>
      ))}
    </div>
  );
}
