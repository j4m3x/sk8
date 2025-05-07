"use client"

import { useState } from "react"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="w-40 h-40 rounded-full overflow-hidden border border-gray-200 cursor-pointer"
          style={{ background: color }}
          aria-label="Pick a color"
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="center">
        <HexColorPicker color={color} onChange={onChange} />
      </PopoverContent>
    </Popover>
  )
}
