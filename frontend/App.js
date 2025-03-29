import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Text, Button } from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title} variant="headlineLarge">
          Bienvenido/a a la App de Anticonceptivos
        </Text>
        <Text style={styles.subtitle} variant="bodyLarge">
          Tu asistente personal para el control de anticonceptivos
        </Text>
        <View style={styles.buttonContainer}>
          <Button mode="contained" style={styles.button}>
            Iniciar Sesión
          </Button>
          <Button mode="outlined" style={styles.button}>
            Registrarse
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.7,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    marginVertical: 10,
  },
}); 