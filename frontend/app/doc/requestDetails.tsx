// requestDetails.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Appbar, Text, Card, Button, TextInput, Surface, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RequestDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const theme = useTheme();
  
  // Validación: Si no se pasó request, se muestra un mensaje o se regresa
  if (!params.request) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Appbar.Header style={styles.header} elevation={0}>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Detalle de Solicitud" />
        </Appbar.Header>
        <View style={styles.container}>
          <Surface style={styles.errorCard}>
            <Text style={styles.errorText}>No se encontraron detalles para la solicitud.</Text>
            <Button 
              onPress={() => router.back()} 
              mode="contained" 
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Volver
            </Button>
          </Surface>
        </View>
      </SafeAreaView>
    );
  }

  const request = JSON.parse(params.request as string);
  
  // Estados para editar método y marca
  const [method, setMethod] = useState(request.method);
  const [brand, setBrand] = useState(request.brand);

  const handleAccept = () => {
    console.log('Solicitud aceptada', { ...request, method, brand });
    // Aquí iría la lógica para aceptar la solicitud
    router.push('/doc/home');
  };

  const handleReject = () => {
    console.log('Solicitud rechazada', request.id);
    // Aquí iría la lógica para rechazar la solicitud
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Appbar.Header style={styles.header} elevation={0}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Detalle de Solicitud" />
      </Appbar.Header>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.mainCard}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Personal</Text>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nombre</Text>
              <Text style={styles.value}>{request.name}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Apellido</Text>
              <Text style={styles.value}>{request.lastName}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>DNI</Text>
              <Text style={styles.value}>{request.dni}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Médica</Text>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Obra Social</Text>
              <Text style={styles.value}>{request.social}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Método Anticonceptivo</Text>
              <TextInput
                mode="outlined"
                value={method}
                onChangeText={setMethod}
                style={styles.input}
                theme={{ roundness: 8 }}
                outlineColor="#E0E0E0"
                activeOutlineColor={theme.colors.primary}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Marca</Text>
              <TextInput
                mode="outlined"
                value={brand}
                onChangeText={setBrand}
                style={styles.input}
                theme={{ roundness: 8 }}
                outlineColor="#E0E0E0"
                activeOutlineColor={theme.colors.primary}
              />
            </View>
          </View>
        </Surface>

        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={handleAccept} 
            style={[styles.button, styles.acceptButton]}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.buttonContent}
          >
            Aceptar Solicitud
          </Button>
          <Button 
            mode="outlined" 
            onPress={handleReject} 
            style={[styles.button, styles.rejectButton]}
            labelStyle={[styles.buttonLabel, styles.rejectButtonLabel]}
            contentStyle={styles.buttonContent}
          >
            Rechazar
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  mainCard: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  acceptButton: {
    backgroundColor: '#007AFF',
  },
  rejectButton: {
    borderColor: '#FF3B30',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  rejectButtonLabel: {
    color: '#FF3B30',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  errorCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  errorText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
});
