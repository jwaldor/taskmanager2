"use client"

import type { Theme } from "@/app/tasks"
import useTaskStore from '../tasks'
import { ChromePicker } from 'react-color'
import { useState } from 'react'
import { Input } from "@/components/ui/input"

export default function Theme() {
  const { themes, currentTheme, setCurrentTheme, createTheme, editTheme, editingTheme, editThemeSecondary } = useTaskStore()
  const [showPicker, setShowPicker] = useState<string | null>(null)

  // const handleColorChange = (color: string, property: keyof Theme) => {
  //   if (editingTheme) {
  //     editTheme({ [property]: color })
  //   }
  // }

  return (
    <div className="w-full h-full p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex mt-4">
        <label className="mr-2 font-semibold">Select Theme:</label>
        <select value={currentTheme} onChange={(e) => setCurrentTheme(e.target.value)} className="border rounded p-2">
          {themes.map((theme) => (
            <option key={theme.name} value={theme.name}>{theme.name}</option>
          ))}
        </select>
      </div>
      <h2 className="mt-4 text-lg font-bold">Create New Theme</h2>
      {editingTheme && (
        <div className="space-y-4">
          <div className="relative">
            <label className="block mb-2 font-semibold">Theme Name:</label>
            <Input
              value={editingTheme.name}
              onChange={(e) => editTheme({ name: e.target.value })}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="grid grid-cols-3 justify-items-center">
            {Object.entries(editingTheme).map(([key, value]) => (
              key !== "name" && key !== "secondary" && key !== "id" && (
                <div key={key} className="h-24 flex justify-center">
                  <div className="flex-grow h-20 w-20" style={{ backgroundColor: value, border: '1px solid #e5e7eb', borderRadius: '0.375rem', display: 'flex', flexDirection: 'column' }}>
                    <div className="relative flex-grow">
                      <div className="capitalize text-xs bg-white p-2 rounded justify-center flex border-b-2 border-gradient-to-r from-blue-500 to-green-500">{key}</div>
                      <div
                        className="flex items-center gap-2 p-2 rounded cursor-pointer transition h-full"
                        onClick={() => setShowPicker(showPicker === key ? null : key)}
                      >

                      </div>

                      {showPicker === key && (
                        <div className="absolute z-10">
                          <ChromePicker
                            color={value}
                            onChange={(color) => editTheme({ [key]: color.hex })}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            ))}
            {Object.entries(editingTheme["secondary"]).map(([key, value]) => (
              <div key={key} className="h-24 flex justify-center">
                <div className="flex-grow h-20 w-20" style={{ backgroundColor: value, border: '1px solid #e5e7eb', borderRadius: '0.375rem', display: 'flex', flexDirection: 'column' }}>
                  <div className="relative flex-grow">
                    <div className="capitalize text-xs bg-white p-2 rounded justify-center flex border-b-2 border-gradient-to-r from-blue-500 to-green-500">{key}</div>
                    <div
                      className="flex items-center gap-2 p-2 rounded cursor-pointer transition h-full"
                      onClick={() => setShowPicker(showPicker === key ? null : key)}
                    >
                    </div>

                    {showPicker === key && (
                      <div className="absolute z-10">
                        <ChromePicker
                          color={value}
                          onChange={(color) => editThemeSecondary(key as keyof Theme["secondary"], color.hex)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* {
            Object.entries(editingTheme["secondary"]).map(([key, value]) => (
              <div key={key} className="relative">
                <div className="flex items-center gap-4 p-3 border rounded cursor-pointer  transition" onClick={() => setShowPicker(showPicker === key ? null : key)}>
                  <div className="w-8 h-8 rounded border" style={{ backgroundColor: value }} />
                  <span className="capitalize">{key}: {value}</span>
                </div>
                {showPicker === key && (
                  <div className="absolute z-10 mt-2">
                    <ChromePicker
                      color={value}
                      onChange={(color) => editThemeSecondary(key as keyof Theme["secondary"], color.hex)}
                    />
                  </div>
                )}
              </div>
            ))
          } */}
        </div>
      )}
      <div className="flex justify-center mt-4">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          onClick={() => createTheme()}
        >
          Create Theme
        </button>
      </div>
    </div>
  )
}