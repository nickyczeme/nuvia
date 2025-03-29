"use client"

import { useState } from "react"
import axios from "axios"
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
import { TextInput } from "react-native-gesture-handler"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:8000';

export default function SignupScreen() {
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [dni, setDni] = useState("")
  const [userType, setUserType] = useState("paciente")
  const router = useRouter()

  const handleSignup = async () => {
    try {
      const payload = {
        dni: parseInt(dni),
        email,
        password,
        password2: confirmPassword,
        tipo_usuario: userType,
        nombre,
        apellido,
      }

      // First register the user
      await axios.post(`${API_URL}/api/usuarios/registro/`, payload)

      // Then login to get the token
      const loginResponse = await axios.post(`${API_URL}/api/usuarios/login/`, {
        dni: parseInt(dni),
        password,
      });

      // Store the token
      const { access } = loginResponse.data;
      await AsyncStorage.setItem('token', access);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      if (userType === "paciente") {
        router.push("/(patient)/profile")
      } else {
        router.push("/(doc)/dashboard")
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error en el registro:", error.response?.data || error.message)
      } else {
        console.error("Error en el registro:", error)
      }
      Alert.alert("Error", "No se pudo registrar el usuario.")
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.logoContainer}>
              <Image source={{ uri: "/placeholder.svg?height=80&width=80" }} style={styles.logo} />
              <Text style={styles.appName}>Nuvia</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>Crear Cuenta</Text>

              <View style={styles.userTypeContainer}>
                <TouchableOpacity
                  style={[styles.userTypeButton, userType === "paciente" && styles.userTypeButtonActive]}
                  onPress={() => setUserType("paciente")}
                >
                  <Text style={[styles.userTypeText, userType === "paciente" && styles.userTypeTextActive]}>
                    Paciente
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.userTypeButton, userType === "doctor" && styles.userTypeButtonActive]}
                  onPress={() => setUserType("doctor")}
                >
                  <Text style={[styles.userTypeText, userType === "doctor" && styles.userTypeTextActive]}>
                    Médico
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu nombre"
                  value={nombre}
                  onChangeText={setNombre}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Apellido</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu apellido"
                  value={apellido}
                  onChangeText={setApellido}
                />
              </View>

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
                <Text style={styles.label}>Correo Electrónico</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Crea una contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmar Contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirma tu contraseña"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Registrarse</Text>
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity>
                    <Text style={styles.loginLink}>Inicia Sesión</Text>
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
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4a6fa5",
    marginTop: 8,
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  userTypeContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  userTypeButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  userTypeButtonActive: {
    backgroundColor: "#4a6fa5",
  },
  userTypeText: {
    fontSize: 16,
    color: "#666",
  },
  userTypeTextActive: {
    color: "white",
    fontWeight: "bold",
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
  button: {
    backgroundColor: "#4a6fa5",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    color: "#666",
    fontSize: 14,
  },
  loginLink: {
    color: "#4a6fa5",
    fontSize: 14,
    fontWeight: "bold",
  },
})
