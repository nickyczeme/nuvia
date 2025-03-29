import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Appbar, Text, Card, Button, Badge, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';

// Datos de ejemplo (reemplázalos con tus datos reales)
const pendingRequests = [
  { id: '1', name: 'Paciente A' },
  { id: '2', name: 'Paciente B' },
];

const patients = [
  { id: '1', name: 'Paciente 1', method: 'Píldora' },
  { id: '2', name: 'Paciente 2', method: 'DIU' },
  { id: '3', name: 'Paciente 3', method: 'Implante' },
];

export default function HomeScreen() {
  const router = useRouter();
  const pendingCount = pendingRequests.length;

  const handlePendingPress = () => {
    router.push('/doc/request');
  };

  const handleAddPatient = () => {
    console.log('Agregar Paciente');
    // Implementa la lógica para agregar paciente aquí
  };

  const handleViewPatient = (patient: any) => {
    console.log('Ver detalles de', patient.id);
    // Aquí podrías navegar a una pantalla de detalles del paciente si lo necesitas
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="TUS PACIENTES" />
        <Appbar.Action icon="plus" onPress={handleAddPatient} accessibilityLabel="Agregar Paciente" />
      </Appbar.Header>

      <ScrollView style={styles.container}>
        {/* Barra de solicitudes pendientes */}
        <TouchableOpacity style={styles.pendingBar} onPress={handlePendingPress}>
          <Text style={styles.pendingText}>SOLICITUDES PENDIENTES</Text>
          {pendingCount > 0 && <Badge style={styles.badge}>{pendingCount}</Badge>}
        </TouchableOpacity>

        {/* Botón de Asistente Virtual */}
        <TouchableOpacity 
          style={styles.assistantButton} 
          onPress={() => router.push('/doc/chat')}
        >
          <View style={styles.assistantContent}>
            <IconButton
              icon="robot"
              size={24}
              iconColor="#007AFF"
              style={styles.assistantIcon}
            />
            <View style={styles.assistantTextContainer}>
              <Text style={styles.assistantTitle}>Asistente Virtual</Text>
              <Text style={styles.assistantSubtitle}>Consulta con nuestra asistente especializada</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Lista de pacientes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lista de Pacientes</Text>
          {patients.map((patient) => (
            <Card key={patient.id} style={styles.card}>
              <Card.Title title={patient.name} subtitle={`Método: ${patient.method}`} />
              <Card.Actions>
                <Button onPress={() => handleViewPatient(patient)}>
                  Ver detalles
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  pendingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 16,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  pendingText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  badge: {
    backgroundColor: '#FF3B30',
    color: 'white',
    fontSize: 15,
    height: 24,
    minWidth: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginVertical: 12,
    color: '#000000',
  },
  card: {
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  assistantButton: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  assistantContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  assistantIcon: {
    margin: 0,
  },
  assistantTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  assistantTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  assistantSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
}); 