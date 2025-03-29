"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>)
    }

    // Sample period data (for demonstration)
    const periodDays = [5, 6, 7, 8, 9]
    const fertileDays = [14, 15, 16, 17, 18]
    const ovulationDay = 16

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      let bgColor = ""
      let textColor = ""

      if (periodDays.includes(day)) {
        bgColor = "bg-red-100"
        textColor = "text-red-600"
      } else if (day === ovulationDay) {
        bgColor = "bg-blue-100"
        textColor = "text-blue-600"
      } else if (fertileDays.includes(day)) {
        bgColor = "bg-blue-50"
        textColor = "text-blue-500"
      }

      days.push(
        <div key={day} className={`h-10 w-10 rounded-full flex items-center justify-center ${bgColor} ${textColor}`}>
          {day}
        </div>,
      )
    }

    return days
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <header className="mb-6">
        <div className="flex items-center mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm" onPress={() => {}}>
              <div className="flex items-center gap-2">
                <ChevronLeft className="h-5 w-5" />
                <span>Back</span>
              </div>
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-center flex-1">Calendar</h1>
        </div>
      </header>
      <Card>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Button onPress={prevMonth} variant="ghost" size="sm">
                <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-medium">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <Button variant="ghost" size="sm" onPress={nextMonth}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-xs font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">{renderCalendar()}</div>
        </CardContent>
      </Card>

      <div className="mt-6 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-100"></div>
          <span className="text-sm">Period</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-100"></div>
          <span className="text-sm">Ovulation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-50"></div>
          <span className="text-sm">Fertile Window</span>
        </div>
      </div>
    </div>
  )
}