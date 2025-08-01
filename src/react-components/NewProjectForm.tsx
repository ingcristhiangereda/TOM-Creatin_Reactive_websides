import * as React from "react";
import { IProject, Project, ProjectStatus, UserRole } from "../classes/Project";
import * as Firestore from "firebase/firestore";
import { getCollection } from "../firebase";
import { ProjectsManager } from "../classes/ProjectsManager";
import { ProjectCard} from "./ProjectCard";
import { Navigate, useNavigate } from "react-router-dom";

interface Props {
  projectsManager: ProjectsManager;
  project?: Project; // si se pasa, estamos en modo edición
  onProjectUpdated?: () => void; // callback opcional para actualizar la lista
}

const projectsCollection = getCollection<IProject>("projects");

export function NewProjectForm(props: Props) {
  const isEditing = !!props.project;
  const navigate = useNavigate();

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const projectForm = e.target as HTMLFormElement;
    const formData = new FormData(projectForm);

    const projectData: IProject = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as ProjectStatus,
      userRole: formData.get("userRole") as UserRole,
      finishDate: new Date(formData.get("finishDate") as string),
      Todos: []
    };

    try {
      if (isEditing && props.project) {
        const docRef = Firestore.doc(projectsCollection, props.project.id);
        await Firestore.updateDoc(docRef, {
          name: projectData.name,
          description: projectData.description,
          status: projectData.status,
          userRole: projectData.userRole,
          finishDate: Firestore.Timestamp.fromDate(projectData.finishDate),
        });

        // Actualizar localmente en ProjectsManager (si quieres reflejar en UI)
        props.project.name = projectData.name;
        props.project.description = projectData.description;
        props.project.status = projectData.status;
        props.project.userRole = projectData.userRole;
        props.project.finishDate = projectData.finishDate;
        navigate(`/project/${docRef.id}`);

      } else {
        const docRef = await Firestore.addDoc(projectsCollection, {
          ...projectData,
        });

        props.projectsManager.newProject(
          {
            ...projectData,
          },
          docRef.id
        );
      }

      // Notificar al padre
      if (props.onProjectUpdated) props.onProjectUpdated();

      projectForm.reset();
      const modal = document.getElementById("new-project-modal");
      if (modal && modal instanceof HTMLDialogElement) modal.close();
    } catch (err) {
      alert("Error al guardar el proyecto, revisa que los campos sean validos y haya fecha");
      console.error(err);
    }
  };

  return (
    <dialog id="new-project-modal">
      <form onSubmit={onFormSubmit} id="new-project-form">
        <h2>{isEditing ? "Edit Project" : "New Project"}</h2>
        <div className="input-list">
          <div className="form-field-container">
            <label>
              <span className="material-icons-round">apartment</span>Name
            </label>
            <input
              name="name"
              type="text"
              defaultValue={props.project?.name}
              placeholder="What's the name of your project?"
            />
          </div>

          <div className="form-field-container">
            <label>
              <span className="material-icons-round">subject</span>Description
            </label>
            <textarea
              name="description"
              cols={30}
              rows={5}
              placeholder="Give your project a description"
              defaultValue={props.project?.description}
            />
          </div>

          <div className="form-field-container">
            <label>
              <span className="material-icons-round">person</span>Role
            </label>
            <select name="userRole" defaultValue={props.project?.userRole || "Architect"}>
              <option>Architect</option>
              <option>Engineer</option>
              <option>Developer</option>
            </select>
          </div>

          <div className="form-field-container">
            <label>
              <span className="material-icons-round">not_listed_location</span>Status
            </label>
            <select name="status" defaultValue={props.project?.status || "Pending"}>
              <option>Pending</option>
              <option>Active</option>
              <option>Finished</option>
            </select>
          </div>

          <div className="form-field-container">
            <label htmlFor="finishDate">
              <span className="material-icons-round">calendar_month</span>Finish Date
            </label>
            <input
              name="finishDate"
              type="date"
              defaultValue={
                props.project
                  ? new Date(props.project.finishDate).toISOString().split("T")[0]
                  : ""
              }
            />
          </div>

          <div style={{ display: "flex", margin: "10px 0px 10px auto", columnGap: 10 }}>
            <button
              type="button"
              style={{ backgroundColor: "transparent" }}
              onClick={() => {
                const modal = document.getElementById("new-project-modal");
                if (modal && modal instanceof HTMLDialogElement) modal.close();
              }}
            >
              Cancel
            </button>           
            <button type="submit" style={{ backgroundColor: "rgb(18, 145, 18)" }}>
              {isEditing ? "Save" : "Accept"}
            </button>
          </div>
        </div>
      </form>
    </dialog>
  );
}
