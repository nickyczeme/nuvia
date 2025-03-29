// setupProfile.tsx
"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { TextInput } from "react-native-gesture-handler"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import Constants from "expo-constants"
import AsyncStorage from "@react-native-async-storage/async-storage"

const API_URL = Constants.expoConfig?.extra?.apiUrl || "http://localhost:8000"

export default function SetupProfileScreen() {
  const [obraSocial, setObraSocial] = useState("")
  const [credencial, setCredencial] = useState("")
  const [startDate, setStartDate] = useState("")
  const [cajas, setCajas] = useState("")
  const [sexo, setSexo] = useState("")
  const [fechaNacimiento, setFechaNacimiento] = useState("")
  const [anticonceptivo, setAnticonceptivo] = useState("")
  const router = useRouter()

  const sexOptions = [
    { id: "M", label: "Masculino" },
    { id: "F", label: "Femenino" },
    { id: "O", label: "Otro" },
  ]

  const handleContinue = async () => {
    if (!sexo || !fechaNacimiento || !startDate || !cajas) {
      Alert.alert("Error", "Por favor completa todos los campos obligatorios")
      return
    }

    try {
      const token = await AsyncStorage.getItem("token")
      const payload = {
        obra_social: obraSocial,
        credencial: credencial,
        fecha_de_inicio_periodo: startDate,
        cantidad_de_cajas: parseInt(cajas),
        sexo,
        fecha_nacimiento: fechaNacimiento,
        anticonceptivo: anticonceptivo || null,
      }

      await axios.patch(`${API_URL}/api/usuarios/update/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      router.push("/(patient)/choose_doctor")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error al guardar el perfil:", error.response?.data || error.message)
      } else {
        console.error("Error al guardar el perfil:", error)
      }
      Alert.alert("Error", "No se pudo guardar el perfil")
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Completa tu Perfil</Text>

          {/* Información Personal */}
          <Text style={styles.sectionTitle}>Información Personal</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Sexo</Text>
            <View style={styles.methodContainer}>
              {sexOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.methodButton,
                    sexo === option.id && styles.methodButtonActive,
                  ]}
                  onPress={() => setSexo(option.id)}
                >
                  <Text
                    style={[
                      styles.methodText,
                      sexo === option.id && styles.methodTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Fecha de nacimiento</Text>
            <TextInput
              style={styles.input}
              placeholder="AAAA-MM-DD"
              value={fechaNacimiento}
              onChangeText={setFechaNacimiento}
            />
          </View>

          {/* Detalles del Método Anticonceptivo */}
          <Text style={styles.sectionTitle}>Cobertura y Ciclo</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Obra social</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: OSDE, Swiss Medical"
              value={obraSocial}
              onChangeText={setObraSocial}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Credencial</Text>
            <TextInput
              style={styles.input}
              placeholder="Número de credencial"
              value={credencial}
              onChangeText={setCredencial}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Fecha de inicio del período</Text>
            <TextInput
              style={styles.input}
              placeholder="AAAA-MM-DD"
              value={startDate}
              onChangeText={setStartDate}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cajas restantes completas</Text>
            <TextInput
              style={styles.input}
              placeholder="1-3"
              keyboardType="numeric"
              value={cajas}
              onChangeText={setCajas}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a6fa5",
    marginBottom: 15,
    marginTop: 25,
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
  methodContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  methodButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginRight: 8,
    borderRadius: 10,
  },
  methodButtonActive: {
    backgroundColor: "#4a6fa5",
    borderColor: "#4a6fa5",
  },
  methodText: {
    fontSize: 14,
    color: "#666",
  },
  methodTextActive: {
    color: "white",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#4a6fa5",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
