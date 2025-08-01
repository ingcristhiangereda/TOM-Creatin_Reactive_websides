import * as React from "react";
import * as Router from "react-router-dom";
import * as Firestore from "firebase/firestore";
import { IProject, Project } from "../classes/Project";
import { ProjectCard } from "./ProjectCard";
import { SearchBox } from "./SearchBox";
import { ProjectsManager } from "../classes/ProjectsManager";
import { getCollection } from "../firebase";
import { NewProjectForm } from "./NewProjectForm";

interface Props {
  projectsManager: ProjectsManager;
}

const projectsCollection = getCollection<IProject>("projects");

export function ProjectsPage(props: Props) {
  const [projects, setProjects] = React.useState<Project[]>(props.projectsManager.list);
  const [editingProject, setEditingProject] = React.useState<Project | undefined>(undefined);

  // Al crear un proyecto, actualiza la lista local
  props.projectsManager.OnProjectCreated = () => {
    setProjects([...props.projectsManager.list]);
  };

  // Cargar proyectos desde Firestore al montar
  const getFirestoreProjects = async () => {
    const firebaseProjects = await Firestore.getDocs(projectsCollection);
    for (const doc of firebaseProjects.docs) {
      const data = doc.data();
      const project: IProject = {
        ...data,
        finishDate: (data.finishDate as unknown as Firestore.Timestamp).toDate(),
      };
      try {
        props.projectsManager.newProject(project, doc.id);
      } catch (error) {
        // Si ya existe, ignora
      }
    }
    setProjects([...props.projectsManager.list]); // <- forzar actualización
  };

  React.useEffect(() => {
    getFirestoreProjects();
  }, []);

  // Abrir modal para nuevo proyecto
  const onNewProjectClick = () => {
    setEditingProject(undefined); // creación
    const modal = document.getElementById("new-project-modal");
    if (modal && modal instanceof HTMLDialogElement) modal.showModal();
  };

  // Abrir modal para editar proyecto
  const onEditProjectClick = (project: Project) => {
    setEditingProject(project); // edición
    const modal = document.getElementById("new-project-modal");
    if (modal && modal instanceof HTMLDialogElement) modal.showModal();
  };

  // Buscar proyectos
  const onProjectSearch = (value: string) => {
    setProjects(props.projectsManager.filterProjects(value));
  };

  // Exportar/Importar
  const onExportProject = () => {
    props.projectsManager.exportToJSON();
  };

  const onImportProject = () => {
    props.projectsManager.importFromJSON();
    setProjects([...props.projectsManager.list]);
  };

  // Construir tarjetas
  const projectCards = projects.map((project) => (
    <Router.Link to={`/project/${project.id}`} key={project.id}>
        <ProjectCard project={project} />
    </Router.Link>
  ));

  return (
    <div className="page" id="projects-page" style={{ display: "flex" }}>
      <NewProjectForm
        projectsManager={props.projectsManager}
        project={editingProject}
        onProjectUpdated={() => {
          setProjects([...props.projectsManager.list]);
        }}
      />

      <header>
        <h2>Projects</h2>
        <SearchBox onChange={(value) => onProjectSearch(value)} />
        <div style={{ display: "flex", alignItems: "center", columnGap: 15 }}>
          <span
            id="import-projects-btn"
            className="material-icons-round action-icon"
            onClick={onImportProject}
          >
            file_upload
          </span>
          <span
            id="export-projects-btn"
            className="material-icons-round action-icon"
            onClick={onExportProject}
          >
            file_download
          </span>
          <button onClick={onNewProjectClick} id="new-project-btn">
            <span className="material-icons-round">add</span>New Project
          </button>
        </div>
      </header>

      {projects.length > 0 ? (
        <div id="projects-list">{projectCards}</div>
      ) : (
        <p>There is no projects to display!</p>
      )}
    </div>
  );
}
