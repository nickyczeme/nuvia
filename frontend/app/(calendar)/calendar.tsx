"use client"

import { useState } from "react"
import { Link, useRouter } from "expo-router"
import { ChevronLeft, ChevronRight } from "lucide-react-native"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Button } from "react-native-paper"

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const router = useRouter()

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
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />)
    }

    // Sample period data (for demonstration)
    const periodDays = [5, 6, 7, 8, 9]
    const fertileDays = [14, 15, 16, 17, 18]
    const ovulationDay = 16

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      let bgColor = styles.dayCell
      let textColor = styles.dayText

      if (periodDays.includes(day)) {
        bgColor = { ...styles.dayCell, backgroundColor: '#fee2e2' }
        textColor = { ...styles.dayText, color: '#dc2626' }
      } else if (day === ovulationDay) {
        bgColor = { ...styles.dayCell, backgroundColor: '#dbeafe' }
        textColor = { ...styles.dayText, color: '#2563eb' }
      } else if (fertileDays.includes(day)) {
        bgColor = { ...styles.dayCell, backgroundColor: '#eff6ff' }
        textColor = { ...styles.dayText, color: '#3b82f6' }
      }

      days.push(
        <View key={day} style={bgColor}>
          <Text style={textColor}>{day}</Text>
        </View>
      )
    }

    return days
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Button
            mode="text"
            onPress={() => router.back()}
            icon="chevron-left"
          >
            Back
          </Button>
        </View>
        <Text style={styles.monthTitle}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
      </View>

      <View style={styles.calendar}>
        <View style={styles.weekDays}>
          {daysOfWeek.map((day) => (
            <Text key={day} style={styles.weekDay}>
              {day}
            </Text>
          ))}
        </View>
        <View style={styles.daysGrid}>
          {renderCalendar()}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  calendar: {
    flex: 1,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekDay: {
    width: 40,
    textAlign: 'center',
    fontWeight: '500',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 16,
  },
})
