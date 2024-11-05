import { create } from "zustand";

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
  theme: string;
}

interface TaskStore {
  tasks: Task[];
  themes: Theme[];
  createTheme: () => void;
  editTheme: (updatedTheme: Partial<Theme>) => void;
  currentTheme: Theme["name"];
  editingTheme: Theme;
  //   setEditingTheme: (theme: Theme) => v;
  createTask: () => void;
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

const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
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
        !state.themes.find((theme) => theme.name === state.editingTheme.name)
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
        theme: state.themes[0].name,
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
}));

export default useTaskStore;
