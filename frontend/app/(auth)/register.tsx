import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<'medico' | 'paciente' | null>(null);

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError('');

      if (!selectedRole) {
        setError('Por favor, selecciona tu rol');
        return;
      }

      // Validación básica
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }

      // TODO: Implementar lógica de registro real aquí
      console.log('Registro con:', { dni, email, password, role: selectedRole });

      // Simular un delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navegar según el rol seleccionado
      if (selectedRole === 'medico') {
        router.replace('/doctor/dashboard');
      } else {
        router.replace('/patient/profile');
      }

    } catch (err) {
      setError('Error al registrarse. Por favor, intenta de nuevo.');
      console.error('Error de registro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        label="DNI"
        value={dni}
        onChangeText={setDni}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        label="Confirmar Contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      <Text style={styles.roleTitle}>Selecciona tu rol:</Text>
      <View style={styles.roleButtons}>
        <Button
          mode={selectedRole === 'medico' ? 'contained' : 'outlined'}
          onPress={() => setSelectedRole('medico')}
          style={[styles.roleButton, selectedRole === 'medico' && styles.selectedRole]}
        >
          Soy Médico
        </Button>
        <Button
          mode={selectedRole === 'paciente' ? 'contained' : 'outlined'}
          onPress={() => setSelectedRole('paciente')}
          style={[styles.roleButton, selectedRole === 'paciente' && styles.selectedRole]}
        >
          Soy Paciente
        </Button>
      </View>

      <Button
        mode="contained"
        onPress={handleRegister}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Registrarse
      </Button>

      <Button
        mode="text"
        onPress={() => router.push('/(auth)/login')}
        style={styles.linkButton}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
  },
  linkButton: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  selectedRole: {
    backgroundColor: '#6200ee',
  },
}); 