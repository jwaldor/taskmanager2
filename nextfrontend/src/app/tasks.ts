import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export enum TaskState {
  Pending = "Pending",
  InProgress = "In Progress",
  Completed = "Completed",
}
export interface Theme {
  name: string;
  background: string;
  text: string;
  primary: string;
  secondary: { [key in TaskState]: string };
  accent: string;
}

export interface Task {
  title: string;
  description: string;
  state: TaskState;
  epic?: Epics;
}

export interface Epics {
  id: string;
  title: string;
  description: string;
}

interface TaskStore {
  tasks: Task[];
  epics: Epics[];
  createEpic: () => void;
  editEpic: (id: string, updatedEpic: Partial<Epics>) => void;
  deleteEpic: (id: string) => void;
  themes: Theme[];
  createTheme: () => void;
  editTheme: (updatedTheme: Partial<Theme>) => void;
  currentTheme: Theme["name"];
  editingTheme: Theme;
  //   setEditingTheme: (theme: Theme) => v;
  createTask: () => void;
  createProvidedTasks: (
    tasks: {
      title: string;
      description: string;
      state: TaskState;
    }[]
  ) => void;
  //   editTask: (index: number, updatedTask: Partial<Task>) => void;
  editingCell: { index: number | null; column: keyof Task | null };
  editValue: string;
  setEditing: (index: number, column: keyof Task) => void;
  setEditValue: (value: string) => void;
  cancelEditing: () => void;
  saveEdit: (taskIndex: number, updatedTask: Partial<Task>) => void;
  startEditing: (index: number, column: keyof Task, value: string) => void;
  deleteTask: (index: number) => void;
  editThemeSecondary: (key: keyof Theme["secondary"], value: string) => void;
  setCurrentTheme: (theme: Theme["name"]) => void;
}

const useTaskStore = create(
  persist<TaskStore>(
    (set) => ({
      tasks: [],
      epics: [],
      createEpic: () => {
        set((state) => {
          const newEpic: Epics = { id: uuidv4(), title: "", description: "" };
          return { epics: [...state.epics, newEpic] };
        });
      },
      editEpic: (id: string, updatedEpic: Partial<Epics>) => {
        set((state) => {
          const epics = [...state.epics];
          const index = epics.findIndex((epic) => epic.id === id);
          epics[index] = { ...epics[index], ...updatedEpic };
          return { epics };
        });
      },
      deleteEpic: (id: string) => {
        set((state) => {
          const epics = [...state.epics];
          const index = epics.findIndex((epic) => epic.id === id);
          epics.splice(index, 1);
          return { epics };
        });
      },
      createProvidedTasks: (
        tasks: {
          title: string;
          description: string;
          state: TaskState;
        }[]
      ) =>
        set((state) => {
          const newTasks = structuredClone(state.tasks);
          newTasks.push(...tasks);
          console.log("newTasks", newTasks);
          return { tasks: newTasks };
        }),
      setStore: (store: TaskStore) => set(() => ({ ...store })),
      currentTheme: "light",
      setCurrentTheme: (theme: Theme["name"]) =>
        set(() => ({ currentTheme: theme })),
      editingTheme: {
        name: "light",
        background: "#ffffff",
        text: "#000000",
        primary: "#000000",
        secondary: {
          Pending: "#ffcc00",
          "In Progress": "#007bff",
          Completed: "#28a745",
        },
        accent: "#000000",
      },
      createTheme: () => {
        set((state) => {
          if (
            !state.themes.find(
              (theme) => theme.name === state.editingTheme.name
            )
          ) {
            return { themes: [...state.themes, state.editingTheme] };
          }
          return { themes: state.themes };
        });
      },
      editTheme: (updatedTheme: Partial<Theme>) => {
        set((state) => {
          const editingTheme = { ...state.editingTheme, ...updatedTheme };
          return { editingTheme };
        });
      },
      editThemeSecondary: (key: keyof Theme["secondary"], value: string) => {
        set((state) => {
          const editingTheme = {
            ...state.editingTheme,
            secondary: { ...state.editingTheme.secondary, [key]: value },
          };
          return { editingTheme };
        });
      },
      themes: [
        {
          name: "light",
          background: "#ffffff",
          text: "#000000",
          primary: "#000000",
          secondary: {
            Pending: "#ffcc00", // Yellow for pending
            "In Progress": "#007bff", // Blue for in-progress
            Completed: "#28a745", // Green for completed
          },
          accent: "#000000",
        },
        {
          name: "dark",
          background: "#000000",
          text: "#ffffff",
          primary: "#ffffff",
          secondary: {
            Pending: "#ffcc00", // Yellow for pending
            "In Progress": "#007bff", // Blue for in-progress
            Completed: "#28a745", // Green for completed
          },
          accent: "#ffffff",
        },
      ],
      createTask: () =>
        set((state) => {
          const newTask: Task = {
            title: "",
            description: "",
            state: TaskState.Pending,
          };
          return { tasks: [...state.tasks, newTask] };
        }),
      //   editTask: (index, updatedTask) =>
      //     set((state) => {
      //       const tasks = [...state.tasks];
      //       tasks[index] = { ...tasks[index], ...updatedTask };
      //       return { tasks };
      //     }),
      editingCell: { index: null, column: null },
      editValue: "",
      setEditing: (index: number, column: keyof Task) =>
        set(() => ({
          editingCell: { index, column },
        })),
      setEditValue: (value: string) =>
        set((state) => ({ ...state, editValue: value })),
      // New functions added
      cancelEditing: () =>
        set(() => ({
          editingCell: { index: null, column: null },
          editValue: "",
        })),
      saveEdit: (taskIndex: number, updatedTask: Partial<Task>) =>
        set((state) => {
          const tasks = [...state.tasks];
          tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
          return {
            ...state,
            tasks,
            editingCell: { index: null, column: null },
            editValue: "",
          };
        }),
      startEditing: (index: number, column: keyof Task, value: string) =>
        set(() => ({
          editingCell: { index, column },
          editValue: value,
        })),
      deleteTask: (index: number) =>
        set((state) => {
          const tasks = [...state.tasks];
          tasks.splice(index, 1);
          return { tasks };
        }),
    }),
    {
      name: "task-store",
    }
  )
);

export default useTaskStore;
