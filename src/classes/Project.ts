import { v4 as uuidv4 } from 'uuid'

export type ProjectStatus = "pending" | "active" | "finished"
export type UserRole = "architect" | "engineer" | "developer"
export interface Itodo {
  Task: string,
  Status: string,
  Priority:string,
  id:string,
}

export class Todo implements Itodo{
  Task: string
  Status: string
  Priority:string
  id: string
  constructor(data: Itodo, id = uuidv4()) {
    Object.assign(this, data); // asigna solo Task, Status, Priority
    this.id = id;
  }
}

export interface IProject {
  name: string
	description: string
	status: ProjectStatus
	userRole: UserRole
	finishDate: Date
  Todos: Itodo[]

}


export class Project implements IProject {
	//To satisfy IProject
  name: string
	description: string
	status: "pending" | "active" | "finished"
	userRole: "architect" | "engineer" | "developer"
  finishDate: Date
  Todos: Itodo[]

  
  //Class internals
  cost: number = 0
  progress: number = 0
  id: string

  constructor(data: IProject, id = uuidv4()) {
    Object.assign(this, data);
    this.Todos ??= []
    this.id = id
  }
  TodoCreate(data: Itodo){
    const todo=new Todo(data)
    this.Todos.push(todo)
  }
  
}