import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { router } from 'expo-router';
import React from 'react';

export default function ChooseDoctorScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nombreMedico, setNombreMedico] = useState('');

  const handleSendRequest = async () => {
    try {
      setLoading(true);
      setError('');

      if (!nombreMedico.trim()) {
        setError('Por favor, ingresa el nombre del médico');
        return;
      }

      // TODO: Implementar lógica para enviar solicitud al médico
      console.log('Enviando solicitud al médico:', nombreMedico);

      // Simular un delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navegar al dashboard del paciente
      router.replace('/(patient)/dashboard');

    } catch (err) {
      setError('Error al enviar la solicitud. Por favor, intenta de nuevo.');
      console.error('Error al enviar solicitud:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Seleccionar Médico</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        label="Nombre del médico *"
        value={nombreMedico}
        onChangeText={setNombreMedico}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSendRequest}
        loading={loading}
        disabled={loading || !nombreMedico.trim()}
        style={styles.button}
      >
        Enviar Solicitud al Médico
      </Button>
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
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  }
});
