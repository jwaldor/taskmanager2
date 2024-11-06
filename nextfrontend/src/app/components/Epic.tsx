
import { Button } from "@/components/ui/button"
import useTaskStore from "@/app/tasks"
import { Check, X, Edit2 } from "lucide-react"
import { TableCell } from "@/components/ui/table"
import { TableRow } from "@/components/ui/table"
import { Epics } from "../tasks"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export function RenderCell({ task, rowIndex, column, }: { task: Epics, rowIndex: number, column: keyof Epics }) {
  const { themes, currentTheme, saveEpic } = useTaskStore()
  const [editingCell, setEditingCell] = useState<{ index: number | null, column: keyof Epics | null }>({ index: null, column: null })
  const [editValue, setEditValue] = useState(task[column])

  const cancelEditing = () => {
    setEditingCell({ index: null, column: null })
    setEditValue("")
  }

  const startEditing = (rowIndex: number, column: keyof Epics, value: string) => {
    setEditingCell({ index: rowIndex, column })
    setEditValue(value)
  }

  const renderCell = (task: Epics, rowIndex: number, column: keyof Epics) => {
    const isEditing = editingCell.index === rowIndex && editingCell.column === column
    const value = task[column]

    // Find the theme object for this task
    const taskTheme = themes.find(t => t.name === currentTheme) || themes[0]

    // Define the text color based on the column
    const getTextColor = () => {
      switch (column) {
        case 'title':
          return taskTheme.primary
        default:
          return taskTheme.text
      }
    }

    if (isEditing) {
      return (
        <div className="flex items-center space-x-2" style={{ backgroundColor: taskTheme.background }}>
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full"
            autoFocus
            style={{ color: getTextColor(), backgroundColor: taskTheme.background }}
          />
          <Button size="icon" onClick={() => {
            saveEpic(task.id, { [column]: editValue })
            setEditingCell({ index: null, column: null })
          }} aria-label="Save">
            <Check className="h-4 w-4" style={{ color: taskTheme.accent }} />
          </Button>
          <Button size="icon" variant="outline" onClick={cancelEditing} aria-label="Cancel">
            <X className="h-4 w-4" style={{ color: taskTheme.accent }} />
          </Button>
        </div>
      )
    }

    return (
      <div
        className="flex items-center justify-between"
        style={{ backgroundColor: taskTheme.background }}
      >
        <span style={{ color: getTextColor() }}>{value}</span>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => startEditing(rowIndex, column, value)}
          aria-label={`Edit ${column}`}
        >
          <Edit2 className="h-4 w-4" style={{ color: taskTheme.accent }} />
        </Button>
      </div>
    )
  }

  return (
    <>{renderCell(task, rowIndex, column)}</>
  )
}

export function EpicRow({ task, rowIndex }: { task: Epics, rowIndex: number }) {
  const { themes, currentTheme, deleteEpic } = useTaskStore()
  const taskTheme = themes.find(t => t.name === currentTheme) || themes[0]
  return (<TableRow key={rowIndex} style={{ backgroundColor: taskTheme.background }}>
    <TableCell className="font-medium">{RenderCell({ task, rowIndex: rowIndex, column: "title" })}</TableCell>
    <TableCell>{RenderCell({ task, rowIndex: rowIndex, column: "description" })}</TableCell>
    <TableCell>
      <Button
        size="icon"
        variant="outline"
        onClick={() => deleteEpic(task.id)}
        aria-label="Delete an epic"
      >
        <X className="h-4 w-4" style={{ color: taskTheme.accent }} />
      </Button>
    </TableCell>
  </TableRow>
  )
}