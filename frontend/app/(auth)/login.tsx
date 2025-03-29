import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      
      // TODO: Implement actual login logic here
      console.log('Login attempt with:', { email, password });
      
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to main app after successful login
      router.replace('/home');
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, intenta de nuevo.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
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
      
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Iniciar Sesión
      </Button>
      
      <Button
        mode="text"
        onPress={() => router.push('/(auth)/register')}
        style={styles.linkButton}
      >
        ¿No tienes cuenta? Regístrate
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
}); 