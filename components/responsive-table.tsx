"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

interface Column {
  key: string
  title: string
  render?: (value: any, item: any) => React.ReactNode
}

interface ResponsiveTableProps {
  data: any[]
  columns: Column[]
  keyField: string
  className?: string
}

export function ResponsiveTable({ data, columns, keyField, className }: ResponsiveTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className={className}>
      {/* Desktop view */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.title}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item[keyField]}>
                {columns.map((column) => (
                  <TableCell key={`${item[keyField]}-${column.key}`}>
                    {column.render ? column.render(item[column.key], item) : item[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {data.map((item) => (
          <Card key={item[keyField]}>
            <CardContent className="p-4">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleRow(item[keyField])}
              >
                <div className="font-medium">
                  {/* Display the first column as the title */}
                  {columns[0].render ? columns[0].render(item[columns[0].key], item) : item[columns[0].key]}
                </div>
                {expandedRows[item[keyField]] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>

              {expandedRows[item[keyField]] && (
                <div className="mt-4 space-y-2">
                  {columns.slice(1).map((column) => (
                    <div key={`mobile-${item[keyField]}-${column.key}`} className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{column.title}</span>
                      <span className="text-sm">
                        {column.render ? column.render(item[column.key], item) : item[column.key]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
