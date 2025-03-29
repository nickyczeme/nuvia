import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Avatar, List, Divider } from 'react-native-paper';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const handleLogout = () => {
    // TODO: Implement actual logout logic
    router.replace('/');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={80} label="MC" style={styles.avatar} />
        <Text style={styles.name}>María Castillo</Text>
        <Text style={styles.email}>maria.castillo@example.com</Text>
      </View>

      <List.Section>
        <List.Subheader>Información Personal</List.Subheader>
        <List.Item
          title="Editar Perfil"
          left={props => <List.Icon {...props} icon="account-edit" />}
          onPress={() => console.log('Editar perfil')}
        />
        <List.Item
          title="Método Anticonceptivo"
          left={props => <List.Icon {...props} icon="pill" />}
          onPress={() => console.log('Método anticonceptivo')}
        />
        <List.Item
          title="Historial Médico"
          left={props => <List.Icon {...props} icon="file-document" />}
          onPress={() => console.log('Historial médico')}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Configuración</List.Subheader>
        <List.Item
          title="Notificaciones"
          left={props => <List.Icon {...props} icon="bell" />}
          onPress={() => console.log('Notificaciones')}
        />
        <List.Item
          title="Privacidad"
          left={props => <List.Icon {...props} icon="shield" />}
          onPress={() => console.log('Privacidad')}
        />
        <List.Item
          title="Ayuda"
          left={props => <List.Icon {...props} icon="help-circle" />}
          onPress={() => console.log('Ayuda')}
        />
      </List.Section>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          Cerrar Sesión
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#6200ee',
  },
  avatar: {
    backgroundColor: '#ffffff20',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  buttonContainer: {
    padding: 20,
  },
  logoutButton: {
    borderColor: '#ff5252',
  },
}); 