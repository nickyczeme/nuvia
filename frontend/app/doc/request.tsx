// request.tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Text, Card, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

// Datos de ejemplo para solicitudes pendientes
const requests = [
  {
    id: '1',
    name: 'Paciente A',
    lastName: 'Apellido A',
    dni: '12345678',
    social: 'Obra Social A',
    method: 'Píldora',
    brand: 'Marca A',
  },
  {
    id: '2',
    name: 'Paciente B',
    lastName: 'Apellido B',
    dni: '87654321',
    social: 'Obra Social B',
    method: 'DIU',
    brand: 'Marca B',
  },
];

export default function RequestScreen() {
  const router = useRouter();

  const handleViewRequest = (request: any) => {
    router.push({
      pathname: '/doc/requestDetails',
      params: { request: JSON.stringify(request) }
    });
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="SOLICITUDES PENDIENTES" />
      </Appbar.Header>
      <ScrollView style={styles.container}>
        {requests.map((req) => (
          <Card key={req.id} style={styles.card}>
            <Card.Title
              title={`${req.name} ${req.lastName}`}
              subtitle={`Método: ${req.method}`}
            />
            <Card.Actions>
              <Button onPress={() => handleViewRequest(req)}>Ver solicitud</Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 16,
  },
  card: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
