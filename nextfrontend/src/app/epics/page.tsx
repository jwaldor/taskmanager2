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
import { EpicRow } from "../components/Epic"
import useTaskStore from '../tasks' // Adjust the import path based on your project structure
import { TaskRow } from "../components/Task"
import { Fragment } from "react"

export default function Epics() {
  const { epics, createEpic, tasks } = useTaskStore()
  const { editingCell, editValue, setEditValue, cancelEditing, saveEdit, startEditing, themes, currentTheme, deleteTask } = useTaskStore()

  const getTasksForEpic = (epicId: string) => {
    return tasks.filter(task => task.epic === epicId)
  }
  return (
    <div className="w-full h-full overflow-auto">
      <Table>
        <TableCaption>A list of your editable epics.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[300px]">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {epics.map((epic, index) => {
            return (
              <Fragment key={epic.id}>
                <EpicRow key={index} task={epic} rowIndex={index} />
                {getTasksForEpic(epic.id).map((task, taskIndex) => {
                  return <TaskRow key={epic.id + taskIndex} task={task} rowIndex={taskIndex} editingCell={editingCell} editValue={editValue} setEditValue={setEditValue} cancelEditing={cancelEditing} saveEdit={saveEdit} startEditing={startEditing} themes={themes} currentTheme={currentTheme} deleteTask={deleteTask} />
                })}
              </Fragment>
            )
          })}
        </TableBody>
      </Table>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => {
            createEpic();
          }}
          className="bg-blue-500 text-white"
        >
          Add Epic
        </Button>
      </div>
    </div>
  )
}