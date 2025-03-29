import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Menu, TouchableRipple } from 'react-native-paper';
import { router } from 'expo-router';
import React from 'react';

export default function PatientProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  
  // Información personal
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [obraSocial, setObraSocial] = useState('');
  const [credencial, setCredencial] = useState('');
  
  // Información anticonceptiva
  const [tipoAnticonceptivo, setTipoAnticonceptivo] = useState('');
  const [marcaAnticonceptivo, setMarcaAnticonceptivo] = useState('');
  const [fechaInicioAnticonceptivo, setFechaInicioAnticonceptivo] = useState('');
  const [cajasRestantes, setCajasRestantes] = useState('');

  const tiposAnticonceptivos = [
    { value: 'pastillas', label: 'Pastillas' },
    { value: 'parche', label: 'Parche' },
    { value: 'anillo', label: 'Anillo' },
  ];

  const handleTipoAnticonceptivoSelect = (value: string) => {
    setTipoAnticonceptivo(value);
    setMenuVisible(false);
  };

  const getMarcaLabel = () => {
    switch (tipoAnticonceptivo) {
      case 'pastillas':
        return 'Marca de las pastillas *';
      case 'parche':
        return 'Marca del parche *';
      case 'anillo':
        return 'Marca del anillo *';
      default:
        return 'Marca del anticonceptivo *';
    }
  };

  const getFechaLabel = () => {
    switch (tipoAnticonceptivo) {
      case 'pastillas':
        return 'Fecha de inicio de las pastillas anticonceptivas *';
      case 'parche':
        return 'Fecha de aplicación del primer parche *';
      case 'anillo':
        return 'Fecha de inserción del anillo *';
      default:
        return 'Fecha de inicio del anticonceptivo *';
    }
  };

  const getCajasLabel = () => {
    switch (tipoAnticonceptivo) {
      case 'pastillas':
        return 'Cajas de pastillas restantes *';
      case 'parche':
        return 'Cajas de parches restantes *';
      case 'anillo':
        return 'Anillos restantes *';
      default:
        return 'Cajas restantes *';
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError('');

      // Validación básica
      if (!nombre || !apellido || !obraSocial || !credencial || 
          !tipoAnticonceptivo || !marcaAnticonceptivo || !fechaInicioAnticonceptivo || !cajasRestantes) {
        setError('Por favor, completa todos los campos obligatorios');
        return;
      }

      // TODO: Implementar lógica para guardar el perfil
      console.log('Guardando perfil:', {
        nombre,
        apellido,
        obraSocial,
        credencial,
        tipoAnticonceptivo,
        marcaAnticonceptivo,
        fechaInicioAnticonceptivo,
        cajasRestantes
      });

      // Simular un delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navegar a la selección de médico
      router.replace('/(patient)/choose_doctor');

    } catch (err) {
      setError('Error al guardar el perfil. Por favor, intenta de nuevo.');
      console.error('Error al guardar perfil:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Completar Perfil</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.sectionTitle}>Información Personal</Text>
      
      <TextInput
        label="Nombre *"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />

      <TextInput
        label="Apellido *"
        value={apellido}
        onChangeText={setApellido}
        style={styles.input}
      />

      <TextInput
        label="Obra Social *"
        value={obraSocial}
        onChangeText={setObraSocial}
        style={styles.input}
      />

      <TextInput
        label="Número de Credencial *"
        value={credencial}
        onChangeText={setCredencial}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.sectionTitle}>Información Anticonceptiva</Text>

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <TouchableRipple onPress={() => setMenuVisible(true)}>
            <View style={styles.dropdownButton}>
              <Text style={styles.dropdownText}>
                {tipoAnticonceptivo ? 
                  tiposAnticonceptivos.find(t => t.value === tipoAnticonceptivo)?.label 
                  : 'Selecciona el tipo de anticonceptivo *'}
              </Text>
            </View>
          </TouchableRipple>
        }
      >
        {tiposAnticonceptivos.map((tipo) => (
          <Menu.Item
            key={tipo.value}
            onPress={() => handleTipoAnticonceptivoSelect(tipo.value)}
            title={tipo.label}
            leadingIcon={tipoAnticonceptivo === tipo.value ? 'check' : undefined}
          />
        ))}
      </Menu>

      {tipoAnticonceptivo && (
        <>
          <TextInput
            label={getMarcaLabel()}
            value={marcaAnticonceptivo}
            onChangeText={setMarcaAnticonceptivo}
            style={styles.input}
          />

          <TextInput
            label={getFechaLabel()}
            value={fechaInicioAnticonceptivo}
            onChangeText={setFechaInicioAnticonceptivo}
            placeholder="DD/MM/AAAA"
            style={styles.input}
          />

          <TextInput
            label={getCajasLabel()}
            value={cajasRestantes}
            onChangeText={setCajasRestantes}
            keyboardType="numeric"
            style={styles.input}
          />
        </>
      )}

      <Button
        mode="contained"
        onPress={handleSaveProfile}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Guardar Perfil
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
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
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  }
}); 