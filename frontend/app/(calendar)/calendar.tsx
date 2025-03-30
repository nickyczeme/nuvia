"use client"

import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { ChevronLeft, ChevronRight } from "lucide-react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"

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
      days.push(<View key={`empty-${i}`} style={styles.emptyCell} />)
    }

    // Sample patient data for styling
    const periodDays = [5, 6, 7, 8, 9]
    const fertileDays = [14, 15, 16, 17, 18]
    const ovulationDay = 16

    // Create cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      let cellStyle = [styles.dayCell, styles.defaultDay]
      let textStyle = styles.dayText

      if (periodDays.includes(day)) {
        cellStyle.push(styles.periodDay)
        textStyle = { ...textStyle, ...styles.periodDayText }
      } else if (day === ovulationDay) {
        cellStyle.push(styles.ovulationDay)
        textStyle = { ...textStyle, ...styles.ovulationDayText }
      } else if (fertileDays.includes(day)) {
        cellStyle.push(styles.fertileDay)
        textStyle = { ...textStyle, ...styles.fertileDayText }
      }

      days.push(
        <View key={day} style={cellStyle}>
          <Text style={textStyle}>{day}</Text>
        </View>
      )
    }

    return days
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header with month navigation */}
        <View style={styles.header}>
          <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
            <ChevronLeft size={24} color="#4a6fa5" />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Text>
          <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
            <ChevronRight size={24} color="#4a6fa5" />
          </TouchableOpacity>
        </View>

        {/* Weekday labels */}
        <View style={styles.weekDaysRow}>
          {daysOfWeek.map((day) => (
            <Text key={day} style={styles.weekDayText}>{day}</Text>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.calendarGrid}>{renderCalendar()}</View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.periodDay]} />
            <Text style={styles.legendText}>Menstruación</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.ovulationDay]} />
            <Text style={styles.legendText}>Ovulación</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.fertileDay]} />
            <Text style={styles.legendText}>Ventana Fértil</Text>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  navButton: { padding: 8 },
  monthTitle: { fontSize: 20, fontWeight: "bold", color: "#4a6fa5" },
  weekDaysRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    width: 40,
    textAlign: "center",
  },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap" },
  emptyCell: { width: 40, height: 40, margin: 4 },
  dayCell: {
    width: 40,
    height: 40,
    margin: 4,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  defaultDay: { borderWidth: 1, borderColor: "#ccc" },
  dayText: { fontSize: 14, color: "#333" },
  periodDay: { backgroundColor: "#ffcccc", borderColor: "#ff9999" },
  periodDayText: { color: "#a80000", fontWeight: "bold" },
  ovulationDay: { backgroundColor: "#cce5ff", borderColor: "#99ccff" },
  ovulationDayText: { color: "#0056b3", fontWeight: "bold" },
  fertileDay: { backgroundColor: "#e6f7ff", borderColor: "#99e6ff" },
  fertileDayText: { color: "#007bff", fontWeight: "bold" },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendColor: { width: 16, height: 16, borderRadius: 8, marginRight: 4 },
  legendText: { fontSize: 12, color: "#333" },
})
