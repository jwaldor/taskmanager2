"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Task } from "@/app/tasks"
import { Check, X, Edit2 } from "lucide-react"
import useTaskStore from '../tasks' // Adjust the import path based on your project structure

export default function AllTasks() {
  const { tasks, editingCell, editValue, setEditValue, cancelEditing, saveEdit, startEditing } = useTaskStore()


  // const startEditing = (rowIndex: number, column: string, value: string) => {
  //   setEditingCell({ rowIndex, column })
  //   setEditValue(value)
  // }

  // const cancelEditing = () => {
  //   setEditingCell({ rowIndex: -1, column: "" })
  //   setEditValue("")
  // }

  // const saveEdit = (taskIndex: number) => {
  //   const updatedTask = { ...tasks[taskIndex], [editingCell.column]: editValue }
  //   editTask(taskIndex, updatedTask)
  //   cancelEditing()
  // }

  const renderCell = (task: Task, rowIndex: number, column: keyof Task) => {
    const isEditing = editingCell.index === rowIndex && editingCell.column === column
    const value = task[column]

    if (isEditing) {
      return (
        <div className="flex items-center space-x-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full"
            autoFocus
          />
          <Button size="icon" onClick={() => saveEdit(rowIndex, { [column]: editValue })} aria-label="Save">
            <Check className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" onClick={cancelEditing} aria-label="Cancel">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-between">
        <span>{value}</span>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => startEditing(rowIndex, column, value)}
          aria-label={`Edit ${column}`}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full h-full overflow-auto">
      <Table>
        <TableCaption>A list of your editable tasks.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[300px]">Description</TableHead>
            <TableHead className="w-[150px]">Status</TableHead>
            <TableHead className="w-[150px]">Theme</TableHead> {/* Added Theme Column */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{renderCell(task, index, "title")}</TableCell>
              <TableCell>{renderCell(task, index, "description")}</TableCell>
              <TableCell>{renderCell(task, index, "state")}</TableCell>
              <TableCell>{renderCell(task, index, "theme")}</TableCell> {/* Added Theme Cell */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => {
            useTaskStore.getState().createTask();
          }}
          className="bg-blue-500 text-white"
        >
          Add Task
        </Button>
      </div>
    </div>
  )
}