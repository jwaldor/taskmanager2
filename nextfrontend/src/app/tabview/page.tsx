"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TaskRow } from "../components/Task"
import { TaskState } from "@/app/tasks"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useTaskStore from '../tasks' // Adjust the import path based on your project structure

export default function AllTasks() {
  const { themes, currentTheme, tasks, editingCell, editValue, setEditValue, cancelEditing, saveEdit, startEditing, deleteTask } = useTaskStore()

  const taskStates = Object.values(TaskState)

  return (
    <div className="w-full h-full overflow-auto">
      <Tabs defaultValue={taskStates[0]} className="mb-4">
        <TabsList className="flex flex-row justify-start gap-4 bg-gray-800">
          {taskStates.map((state) => {
            const taskTheme = themes.find(t => t.name === currentTheme) || themes[0]
            return (
              <TabsTrigger
                className="border"
                key={state}
                value={state}
                style={{ color: taskTheme.secondary[state] }}
              >
                {state.charAt(0).toUpperCase() + state.slice(1)}
              </TabsTrigger>
            )
          })}
        </TabsList>
        {taskStates.map((state) => (
          <TabsContent key={state} value={state}>
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
                {tasks.filter(task => task.state === state).map((task, index) => {
                  return (
                    <TaskRow key={index} task={task} rowIndex={index} editingCell={editingCell} editValue={editValue} setEditValue={setEditValue} cancelEditing={cancelEditing} saveEdit={saveEdit} startEditing={startEditing} themes={themes} currentTheme={currentTheme} deleteTask={deleteTask} />
                  )
                })}
              </TableBody>
            </Table>
          </TabsContent>
        ))}
      </Tabs>
      {/* <div className="flex justify-end mb-4">
        <Button
          onClick={() => {
            createTask();
          }}
          className="bg-blue-500 text-white"
        >
          Add Task
        </Button>
      </div> */}
    </div>
  )
}