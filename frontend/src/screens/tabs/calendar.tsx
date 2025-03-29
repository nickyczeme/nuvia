import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { Calendar, DateData } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';

export default function CalendarScreen() {
  const [selected, setSelected] = useState<string>('');

  // Example marked dates (you would get this from your backend)
  const markedDates: MarkedDates = {
    '2024-04-15': { marked: true, dotColor: '#6200ee' },
    '2024-04-16': { marked: true, dotColor: '#6200ee' },
    '2024-04-17': { marked: true, dotColor: '#6200ee' },
    '2024-04-18': { selected: true, marked: true, dotColor: '#6200ee' },
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day: DateData) => {
          setSelected(day.dateString);
        }}
        markedDates={{
          ...markedDates,
          [selected]: {
            selected: true,
            marked: markedDates[selected]?.marked || false,
            dotColor: markedDates[selected]?.dotColor || '#6200ee',
          },
        }}
        theme={{
          selectedDayBackgroundColor: '#6200ee',
          todayTextColor: '#6200ee',
          dotColor: '#6200ee',
          arrowColor: '#6200ee',
        }}
      />

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Resumen del Mes</Text>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text variant="headlineMedium">28</Text>
              <Text variant="bodySmall">Días Totales</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="headlineMedium">26</Text>
              <Text variant="bodySmall">Dosis Tomadas</Text>
            </View>
            <View style={styles.stat}>
              <Text variant="headlineMedium">2</Text>
              <Text variant="bodySmall">Dosis Perdidas</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 10,
    elevation: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  stat: {
    alignItems: 'center',
  },
}); 