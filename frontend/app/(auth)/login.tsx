"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Link, useRouter } from "expo-router"
import { TextInput, GestureHandlerRootView } from "react-native-gesture-handler"
import axios from "axios"
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Constants.expoConfig?.extra?.apiUrl || "http://localhost:8000"

export default function LoginScreen() {
  const [dni, setDni] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/usuarios/login/`, {
        dni: parseInt(dni),
        password,
      })

      const { access, refresh, usuario } = response.data;

      // Store the token
      await AsyncStorage.setItem('token', access);
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      console.log("Login exitoso:", usuario);

      if (usuario.tipo_usuario === "paciente") {
        router.push({
          pathname: "/(patient)/dashboard",
          params: {
            tipo: usuario.tipo_usuario,
            nombre: usuario.nombre,
          },
        });
      } else if (usuario.tipo_usuario === "doctor") {
        router.push({
          pathname: "/(doc)/dashboard",
          params: {
            tipo: usuario.tipo_usuario,
            nombre: usuario.nombre,
          },
        });
      } else {
        Alert.alert("Error", "Tipo de usuario desconocido.");
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error de login:", error.response?.data || error.message)
      } else {
        console.error("Error de login:", error)
      }
      Alert.alert("Error de login", "DNI o contraseña incorrectos.")
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.logoContainer}>
              <Image source={{ uri: "/placeholder.svg?height=100&width=100" }} style={styles.logo} />
              <Text style={styles.appName}>Nuvia</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>Iniciar Sesión</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>DNI</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu DNI"
                  value={dni}
                  onChangeText={setDni}
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>¿No tienes una cuenta? </Text>
                <Link href="/(auth)/register" asChild>
                  <TouchableOpacity>
                    <Text style={styles.signupLink}>Regístrate</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4a6fa5",
    marginTop: 10,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#4a6fa5",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#4a6fa5",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: "#666",
    fontSize: 14,
  },
  signupLink: {
    color: "#4a6fa5",
    fontSize: 14,
    fontWeight: "bold",
  },
})
