import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>¡Hola!</Text>
        <Text style={styles.subtitle}>Aquí está tu resumen diario</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Próxima Dosis</Text>
          <Text variant="bodyMedium" style={styles.cardText}>
            Hoy a las 20:00
          </Text>
          <Button
            mode="contained"
            onPress={() => console.log('Marcar como tomada')}
            style={styles.button}
          >
            Marcar como tomada
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Estado del Tratamiento</Text>
          <Text variant="bodyMedium" style={styles.cardText}>
            Llevas 15 días de tratamiento
          </Text>
          <Button
            mode="outlined"
            onPress={() => console.log('Ver detalles')}
            style={styles.button}
          >
            Ver detalles
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Próxima Consulta</Text>
          <Text variant="bodyMedium" style={styles.cardText}>
            15 de Mayo, 2024
          </Text>
          <Button
            mode="outlined"
            onPress={() => console.log('Ver cita')}
            style={styles.button}
          >
            Ver detalles de la cita
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#6200ee',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  card: {
    margin: 10,
    elevation: 2,
  },
  cardText: {
    marginVertical: 10,
  },
  button: {
    marginTop: 10,
  },
}); 