
import * as React from "react";
import { IProject,Itodo,Todo,  Project, ProjectStatus, UserRole } from "../classes/Project";
import * as Firestore from "firebase/firestore";
import { getCollection } from "../firebase";
import { ProjectsManager } from "../classes/ProjectsManager";
import { ProjectCard} from "./ProjectCard";
import { Navigate, useNavigate } from "react-router-dom";

interface Props {
  project: Project;
  editingTodoIndex?: number;
  onProjectUpdated?: () => void;
}




export function ToDoForm(props: Props) {

    const navigate = useNavigate();
    const editingTodo = typeof props.editingTodoIndex === "number"
        ? props.project.Todos[props.editingTodoIndex]
        : null;

    const [task, setTask] = React.useState(editingTodo?.Task || "");
    const [priority, setPriority] = React.useState(editingTodo?.Priority || "medium");
    const [status, setStatus] = React.useState(editingTodo?.Status || "pending");
    React.useEffect(() => {
        if (editingTodo) {
        setTask(editingTodo.Task);
        setPriority(editingTodo.Priority);
        setStatus(editingTodo.Status);
        } else {
        setTask("");
        setPriority("medium");
        setStatus("pending");
        }
    }, [editingTodo]);
    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const todoForm = e.target as HTMLFormElement;
        const formData= new FormData(todoForm)
        const todoData: Itodo ={
            Task: formData.get("Task") as string,
            Priority: formData.get("Priority") as string,
            Status: formData.get("Status") as string,
            id: ""
        }
        
        try {

            if (editingTodo) {
                // Actualizar ToDo existente
                Object.assign(editingTodo, todoData);
            } else {
                props.project.TodoCreate(todoData);
            }

            
            const projectRef = Firestore.doc(getCollection<IProject>("projects"), props.project.id);
            await Firestore.updateDoc(projectRef, {
                Todos: props.project.Todos.map(todo => ({
                    Task: todo.Task,
                    Status: todo.Status,
                    Priority: todo.Priority,
                    id: todo.id,
                    })
                )
            });

            if (props.onProjectUpdated) props.onProjectUpdated();
            navigate(`/project/${projectRef.id}`);
            todoForm.reset();
            const modal = document.getElementById("new-ToDo-modal");
            if (modal && modal instanceof HTMLDialogElement) modal.close();

        }catch(err){
            alert("Error al guardar el ToDo");
            console.error(err);
        }
    }
    return(
        <dialog id="new-ToDo-modal">
            <form onSubmit={onFormSubmit} id="ToDo-form"  style={{ padding: "20px" }}>
            <label>
                Task to Do:
                <input type="text" name="Task" required defaultValue={editingTodo?.Task || ""}/>
            </label>
            <br /><br />
            <label>
                Prioridad:
                <select
                    name="Priority"
                    required
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                </select>
            </label>
            <br /><br />
            <br /><br />
            <label>
                Estado:
                <select
                    name="Status"
                    required
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="finished">Finished</option>
                </select>
            </label>
            <br /><br />
            <button type="submit">Guardar</button>
            </form>
        </dialog>
        )
}