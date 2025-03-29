import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Switch, List, Divider } from 'react-native-paper';
import { router } from 'expo-router';
import React from 'react';

// TODO: Reemplazar con datos reales de la base de datos
const RECETAS_MOCK = [
  {
    id: 1,
    fecha: '2024-03-15',
    medicamento: 'Anticonceptivo X',
    estado: 'Activa',
    proximaRenovacion: '2024-04-15'
  },
  {
    id: 2,
    fecha: '2024-02-15',
    medicamento: 'Anticonceptivo Y',
    estado: 'Vencida',
    proximaRenovacion: '2024-03-15'
  }
];

export default function PatientDashboardScreen() {
  const [prescripcionAutomatica, setPrescripcionAutomatica] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTogglePrescripcionAutomatica = async (value: boolean) => {
    try {
      setLoading(true);
      setError('');

      // TODO: Implementar lógica para actualizar preferencias en la base de datos
      console.log('Actualizando preferencias de prescripción automática:', value);
      
      // Simular un delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPrescripcionAutomatica(value);
      
      if (value) {
        // TODO: Implementar lógica para programar notificaciones
        console.log('Programando notificaciones para la doctora');
      }
    } catch (err) {
      setError('Error al actualizar las preferencias');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSolicitarReceta = async () => {
    try {
      setLoading(true);
      setError('');

      // TODO: Implementar lógica para enviar solicitud de receta
      console.log('Enviando solicitud de receta a la doctora');

      // Simular un delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Mostrar mensaje de éxito
    } catch (err) {
      setError('Error al enviar la solicitud de receta');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard del Paciente</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Prescripción de Recetas</Text>
          <View style={styles.switchContainer}>
            <Text>Prescripción Automática</Text>
            <Switch
              value={prescripcionAutomatica}
              onValueChange={handleTogglePrescripcionAutomatica}
              disabled={loading}
            />
          </View>
          <Text style={styles.switchDescription}>
            {prescripcionAutomatica 
              ? 'La doctora recibirá una notificación automática cuando necesites una nueva receta'
              : 'Deberás solicitar manualmente una nueva receta cuando la necesites'}
          </Text>
        </Card.Content>
      </Card>

      {!prescripcionAutomatica && (
        <Button
          mode="contained"
          onPress={handleSolicitarReceta}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Solicitar Nueva Receta
        </Button>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Historial de Recetas</Text>
          {RECETAS_MOCK.map((receta) => (
            <React.Fragment key={receta.id}>
              <List.Item
                title={receta.medicamento}
                description={`Fecha: ${receta.fecha}\nPróxima renovación: ${receta.proximaRenovacion}`}
                left={props => <List.Icon {...props} icon="file-document" />}
                right={props => (
                  <Text {...props} style={receta.estado === 'Activa' ? styles.estadoActivo : styles.estadoVencido}>
                    {receta.estado}
                  </Text>
                )}
              />
              <Divider />
            </React.Fragment>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  switchDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  button: {
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  estadoActivo: {
    color: 'green',
    fontWeight: '600',
  },
  estadoVencido: {
    color: 'red',
    fontWeight: '600',
  }
});
