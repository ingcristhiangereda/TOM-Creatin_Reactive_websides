import * as React from "react";
import * as Router from "react-router-dom";
import * as Firestore from "firebase/firestore";
import { Project, IProject } from "../classes/Project";
import { getCollection } from "../firebase";
import { ProjectsManager } from "../classes/ProjectsManager";
import { NewProjectForm } from "./NewProjectForm";
import {ThreeViewer} from "./ThreeViewer"
import { deleteDocument } from "../firebase";
import { ToDoForm } from "./TodoForm";
import {ProjectTaskList} from "./ProjectTaskList"
import { SearchBox } from "./SearchBox";


const projectsCollection = getCollection<IProject>("projects");

interface Props {
  projectsManager: ProjectsManager;
  onEditTodo: (index: number) => void;
}

export function ProjectDetailsPage(props: Props) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [editingTodoIndex, setEditingTodoIndex] = React.useState<number | undefined>(undefined);
  const handleTodoClick = (index: number) => {
    setEditingTodoIndex(index);
      const modal = document.getElementById("new-ToDo-modal") as HTMLDialogElement;
      if (modal) modal.showModal();
  };

  const handleNewTodo = () => {
    setEditingTodoIndex(undefined);
    const modal = document.getElementById("new-ToDo-modal") as HTMLDialogElement;
    if (modal) modal.showModal();
  };
  const routeParams = Router.useParams<{id: string}>()
  if (!routeParams.id) {return (<p>Project ID is needed to see this page</p>)}
  const project = props.projectsManager.getProject(routeParams.id)
  if (!project) {return (<p>The project with ID {routeParams.id} wasn't found.</p>)}

  const navigateTo = Router.useNavigate()
  props.projectsManager.OnProjectDeleted = async (id) => {
    await deleteDocument("/projects", id)
    navigateTo("/")
  }

  
  const onEditClick =()  =>{
    const modal = document.getElementById("new-project-modal")
    if (!(modal && modal instanceof HTMLDialogElement)) {return}
    modal.showModal()

  }

  const filteredTodos = project.Todos.filter((todo) =>
    todo.Task.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (    
  <div className="page" id="project-details">
    <NewProjectForm projectsManager={props.projectsManager} project={project}/> 
    <ToDoForm
      project={project}
      editingTodoIndex={editingTodoIndex}
    />
    <header>
      <div>
        <h2 data-project-info="name">{project.name}</h2>
        <p style={{ color: "#969696" }}>{project.description}</p>
      </div>
      <button onClick={() => props.projectsManager.deleteProject(project.id)} style={{backgroundColor: "red"}}>Delete Project</button>
    </header>
    <div className="main-page-content">
      <div style={{ display: "flex", flexDirection: "column", rowGap: 30 }}>
        <div className="dashboard-card" style={{ padding: "30px 0" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0px 30px",
              marginBottom: 30
            }}
          >
            <p
              style={{
                fontSize: 20,
                backgroundColor: "#ca8134",
                aspectRatio: 1,
                borderRadius: "100%",
                padding: 12
              }}
            >
              HC
            </p>
            <button onClick={onEditClick} className="btn-secondary">
              <p style={{ width: "100%" }}>Edit</p>
            </button>
          </div>
          <div style={{ padding: "0 30px" }}>
            <div>
              <h5>{project.name}</h5>
              <p>{project.description}</p>
            </div>
            <div
              style={{
                display: "flex",
                columnGap: 30,
                padding: "30px 0px",
                justifyContent: "space-between"
              }}
            >
              <div>
                <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                  Status
                </p>
                <p>{project.status}</p>
              </div>
              <div>
                <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                  Cost
                </p>
                <p>$ {project.cost}</p>
              </div>
              <div>
                <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                  Role
                </p>
                <p>{project.userRole}</p>
              </div>
              <div>
                <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                  Finish Date
                </p>
                <p>{project.finishDate.toDateString()}</p>
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#404040",
                borderRadius: 9999,
                overflow: "auto"
              }}
            >
              <div
                style={{
                  width: `${project.progress * 100}%`,
                  backgroundColor: "green",
                  padding: "4px 0",
                  textAlign: "center"
                }}
              >
                {project.progress * 100}%
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-card" style={{ flexGrow: 1 }}>
          <div
            style={{
              padding: "20px 30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <h4>To-Do</h4>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                columnGap: 20
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", columnGap: 10 }}
              >
                <span className="material-icons-round">search</span>
                <SearchBox onChange={(value) => setSearchTerm(value)} />
              </div>
              <button onClick={handleNewTodo} className="icon-button">
                <span className="material-icons-round">add</span>
              </button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "10px 30px",
              rowGap: 20
            }}
          >
            <div className="todo-item">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div
                  style={{ display: "flex", columnGap: 15, alignItems: "center" }}
                >
                  <span
                    className="material-icons-round"
                    style={{
                      padding: 10,
                      backgroundColor: "#686868",
                      borderRadius: 10
                    }}
                  >
                    construction
                  </span>
                  <p>Make anything here as you want, even something longer.</p>
                </div>
                <p style={{ marginLeft: 10 }}>Fri, 20 sep</p>
              </div>
            </div>
            <div>
              TablaTodo
              <ProjectTaskList
                todos={filteredTodos}
                onTodoClick={handleTodoClick}
              />
            </div>
          </div>
        </div>
      </div>
      <ThreeViewer />
    </div>
  </div>
  )

}

  