
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Task, TaskState } from "@/app/tasks"
import { Check, X, Edit2 } from "lucide-react"
import { Theme } from "../tasks"
import { TableCell } from "@/components/ui/table"
import { TableRow } from "@/components/ui/table"

export function RenderCell({ task, rowIndex, column, editingCell, editValue, setEditValue, cancelEditing, saveEdit, startEditing, themes, currentTheme }: { task: Task, rowIndex: number, column: keyof Task, editingCell: { index: number | null, column: keyof Task | null }, editValue: string, setEditValue: (value: string) => void, cancelEditing: () => void, saveEdit: (rowIndex: number, value: { [key: string]: string }) => void, startEditing: (rowIndex: number, column: keyof Task, value: string) => void, themes: Theme[], currentTheme: string }) {

  const renderCell = (task: Task, rowIndex: number, column: keyof Task) => {
    const isEditing = editingCell.index === rowIndex && editingCell.column === column
    const value = column === "epic" ? task.epic!.title : task[column]

    // Find the theme object for this task
    const taskTheme = themes.find(t => t.name === currentTheme) || themes[0]

    // Define the text color based on the column
    const getTextColor = () => {
      switch (column) {
        case 'title':
          return taskTheme.primary
        case 'state':
          return taskTheme.secondary[task.state.replace('-', '') as keyof typeof taskTheme.secondary]
        default:
          return taskTheme.text
      }
    }

    if (isEditing) {
      return (
        <div className="flex items-center space-x-2" style={{ backgroundColor: taskTheme.background }}>
          {column === "state" ? (
            <select
              className="w-full"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              style={{ color: taskTheme.text, backgroundColor: taskTheme.background }}
            >
              {Object.values(TaskState).map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
          ) : (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full"
              autoFocus
              style={{ color: getTextColor(), backgroundColor: taskTheme.background }}
            />
          )}
          <Button size="icon" onClick={() => saveEdit(rowIndex, { [column]: editValue })} aria-label="Save">
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

export function TaskRow({ task, rowIndex, editingCell, editValue, setEditValue, cancelEditing, saveEdit, startEditing, themes, currentTheme, deleteTask }: { task: Task, rowIndex: number, editingCell: { index: number | null, column: keyof Task | null }, editValue: string, setEditValue: (value: string) => void, cancelEditing: () => void, saveEdit: (rowIndex: number, value: { [key: string]: string }) => void, startEditing: (rowIndex: number, column: keyof Task, value: string) => void, themes: Theme[], currentTheme: string, deleteTask: (rowIndex: number) => void }) {
  const taskTheme = themes.find(t => t.name === currentTheme) || themes[0]
  return (<TableRow key={rowIndex} style={{ backgroundColor: taskTheme.background }}>
    <TableCell className="font-medium">{RenderCell({ task, rowIndex: rowIndex, column: "title", editingCell, editValue, setEditValue, cancelEditing, saveEdit, startEditing, themes, currentTheme })}</TableCell>
    <TableCell>{RenderCell({ task, rowIndex: rowIndex, column: "description", editingCell, editValue, setEditValue, cancelEditing, saveEdit, startEditing, themes, currentTheme })}</TableCell>
    <TableCell>{RenderCell({ task, rowIndex: rowIndex, column: "state", editingCell, editValue, setEditValue, cancelEditing, saveEdit, startEditing, themes, currentTheme })}</TableCell>
    <TableCell>
      <Button
        size="icon"
        variant="outline"
        onClick={() => deleteTask(rowIndex)}
        aria-label="Delete task"
      >
        <X className="h-4 w-4" style={{ color: taskTheme.accent }} />
      </Button>
    </TableCell>
  </TableRow>
  )
}