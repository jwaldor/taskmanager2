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
import { TaskRow } from "../components/renderCell"
import useTaskStore from '../tasks' // Adjust the import path based on your project structure

export default function AllTasks() {
  const { themes, currentTheme, tasks, editingCell, editValue, setEditValue, cancelEditing, saveEdit, startEditing, deleteTask, createTask } = useTaskStore()


  return (
    <div className="w-full h-full overflow-auto">
      <Table>
        <TableCaption>A list of your editable tasks.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[300px]">Description</TableHead>
            <TableHead className="w-[150px]">Status</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task, index) => {
            // const taskTheme = themes.find(t => t.name === currentTheme) || themes[0]
            return (
              <TaskRow key={index} task={task} rowIndex={index} editingCell={editingCell} editValue={editValue} setEditValue={setEditValue} cancelEditing={cancelEditing} saveEdit={saveEdit} startEditing={startEditing} themes={themes} currentTheme={currentTheme} deleteTask={deleteTask} />
              // <TableRow key={index} style={{ backgroundColor: taskTheme.background }}>
              //   <TableCell className="font-medium">{RenderCell({ task, rowIndex: index, column: "title", editingCell, editValue, setEditValue, cancelEditing, saveEdit, startEditing, themes, currentTheme })}</TableCell>
              //   <TableCell>{RenderCell({ task, rowIndex: index, column: "description", editingCell, editValue, setEditValue, cancelEditing, saveEdit, startEditing, themes, currentTheme })}</TableCell>
              //   <TableCell>{RenderCell({ task, rowIndex: index, column: "state", editingCell, editValue, setEditValue, cancelEditing, saveEdit, startEditing, themes, currentTheme })}</TableCell>
              //   <TableCell>
              //     <Button
              //       size="icon"
              //       variant="outline"
              //       onClick={() => deleteTask(index)}
              //       aria-label="Delete task"
              //     >
              //       <X className="h-4 w-4" style={{ color: taskTheme.accent }} />
              //     </Button>
              //   </TableCell>
              // </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => {
            createTask();
          }}
          className="bg-blue-500 text-white"
        >
          Add Task
        </Button>
      </div>
    </div>
  )
}