"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GestureHandlerRootView } from 'react-native-gesture-handler'  // Import GestureHandlerRootView
import { View, Text, StyleSheet } from "react-native"  // Import React Native components

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
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
      days.push(<View key={`empty-${i}`} style={{ height: 40, width: 40 }}></View>)
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
        <View key={day} style={[{ height: 40, width: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" }, { backgroundColor: bgColor }]}>
          <Text style={{ color: textColor }}>{day}</Text>
        </View>
      )
    }

    return days
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        <header style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <Link href="/">
              <Button variant="ghost" size="sm" onPress={() => {}}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ChevronLeft className="h-5 w-5" />
                  <Text>Back</Text>
                </View>
              </Button>
            </Link>
            <Text style={{ fontSize: 24, fontWeight: "bold", flex: 1, textAlign: "center" }}>Calendar</Text>
          </View>
        </header>

        <Card>
          <CardContent>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Button onPress={prevMonth} variant="ghost" size="sm">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Text style={{ fontSize: 18 }}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </Text>
              <Button variant="ghost" size="sm" onPress={nextMonth}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 8 }}>
              {daysOfWeek.map((day) => (
                <Text key={day} style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around" }}>
              {renderCalendar()}
            </View>
          </CardContent>
        </Card>

        <View style={{ marginTop: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <View style={{ width: 16, height: 16, backgroundColor: "#FFB3B3", borderRadius: 8 }}></View>
            <Text style={{ marginLeft: 8, fontSize: 14 }}>Period</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <View style={{ width: 16, height: 16, backgroundColor: "#B3D1FF", borderRadius: 8 }}></View>
            <Text style={{ marginLeft: 8, fontSize: 14 }}>Ovulation</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <View style={{ width: 16, height: 16, backgroundColor: "#D3E6FF", borderRadius: 8 }}></View>
            <Text style={{ marginLeft: 8, fontSize: 14 }}>Fertile Window</Text>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  )
}
