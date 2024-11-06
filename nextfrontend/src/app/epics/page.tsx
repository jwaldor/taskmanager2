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

export default function Epics() {
  const { epics, createEpic } = useTaskStore()

  return (
    <div className="w-full h-full overflow-auto">
      <Table>
        <TableCaption>A list of your editable tasks.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[300px]">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {epics.map((epic, index) => {
            return (
              <EpicRow key={index} task={epic} rowIndex={index} />
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