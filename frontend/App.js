import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Text, Button } from 'react-native-paper';
import NotificationService from './NotificationService';  // Asegúrate de importar correctamente el servicio

export default function App() {

  useEffect(() => {
    // Inicializar el servicio de notificaciones cuando el componente se monta
    const notificationService = NotificationService.getInstance();

    // Configurar la notificación automática (envío de notificaciones)
    notificationService.setAutomatic(true);

    // Configurar los detalles de la receta (configuración de notificación)
    notificationService.setConfig({
      method: 'Anticonceptivo',
      startDate: new Date('2025-01-01'), // Fecha de inicio
      pillsPerPack: 30,
      daysPerPack: 30,
      notificationThreshold: 5,  // Notificar 5 días antes de que se terminen las pastillas
      doctorId: '123',
      patientId: '456',
    });

    // Probar el envío de una notificación de prueba
    notificationService.sendTestNotification();

    // Este efecto se ejecuta solo una vez cuando el componente se monta
  }, []);
  
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