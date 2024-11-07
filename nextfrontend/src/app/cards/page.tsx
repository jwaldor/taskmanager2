"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { TaskRow } from "../components/Task"
import useTaskStore from '../tasks' // Adjust the import path based on your project structure
import { v4 as uuidv4 } from 'uuid';
const TravelComponent = ({ title, subtitle, description }: { title: string; subtitle: string; description: string }) => {
  return (
    <div className="w-64 p-4 bg-white rounded-lg shadow-md relative group">
      <p className="text-sm text-gray-800 mb-2">
        {title}
      </p>
      {subtitle.length > 0 && <button className="bg-yellow-400 text-gray-800 text-xs font-bold py-1 px-2 rounded mb-3">
        {subtitle}
      </button>}
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-sm">
          {description.length > 100 ? description.slice(0, 100) + '...' : description}
        </span>
        <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-gray-700 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {description}
        </span>
      </div>
    </div>
  );
};


export default function AllTasks() {
  const { epics, themes, currentTheme, tasks, editingCell, editValue, setEditValue, cancelEditing, saveEdit, startEditing, deleteTask, createTask } = useTaskStore()


  return (
    <div className="w-full h-full overflow-auto">
      <div className="flex flex-col md:flex-row m-8 gap-8">
        <div className="flex flex-col max-sm:w-1/3 bg-gray-200 mt-14 rounded text-gray-500 font-semibold p-1 md:w-3/4 gap-2">
          <span className="pt-1 pl-2 pb-1">PENDING</span>
          {tasks.map((task, index) => (
            <TravelComponent
              key={index}
              title={task.title}
              subtitle={epics.find(epic => epic.id === task.epic)?.title || ""}
              description={task.description}
            />
          ))}
        </div>
        <div className="flex flex-col max-sm:w-1/3 bg-gray-200 mt-14 rounded text-gray-500 font-semibold p-1 md:w-3/4">
          <span className="pt-1 pl-2 pb-1">IN PROGRESS</span>
        </div>
        <div className="flex flex-col max-sm:w-1/3 bg-gray-200 mt-14 rounded text-gray-500 font-semibold p-1 md:w-3/4">
          <span className="pt-1 pl-2 pb-1">COMPLETED</span>
        </div>
      </div>
    </div>
  )
}