import { create } from "zustand";

export interface Task {
  title: string;
  description: string;
  state: "pending" | "in-progress" | "completed";
  theme: string;
}

interface TaskStore {
  tasks: Task[];
  createTask: () => void;
  //   editTask: (index: number, updatedTask: Partial<Task>) => void;
  editingCell: { index: number | null; column: keyof Task | null };
  editValue: string;
  setEditing: (index: number, column: keyof Task) => void;
  setEditValue: (value: string) => void;
  cancelEditing: () => void;
  saveEdit: (taskIndex: number, updatedTask: Partial<Task>) => void;
  startEditing: (index: number, column: keyof Task, value: string) => void;
}

const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  createTask: () =>
    set((state) => {
      const newTask: Task = {
        title: "",
        description: "",
        state: "pending",
        theme: "default",
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
    set(() => ({ editingCell: { index, column } })),
  setEditValue: (value: string) => set(() => ({ editValue: value })),
  // New functions added
  cancelEditing: () =>
    set(() => ({ editingCell: { index: null, column: null }, editValue: "" })),
  saveEdit: (taskIndex: number, updatedTask: Partial<Task>) =>
    set((state) => {
      const tasks = [...state.tasks];
      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
      return {
        tasks,
        editingCell: { index: null, column: null },
        editValue: "",
      };
    }),
  startEditing: (index: number, column: keyof Task, value: string) =>
    set(() => ({ editingCell: { index, column }, editValue: value })),
}));

export default useTaskStore;
