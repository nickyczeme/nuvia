"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { TextInput } from "react-native-gesture-handler"
import { GestureHandlerRootView } from 'react-native-gesture-handler'  // Import GestureHandlerRootView

export default function SetupProfileScreen() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [contraceptiveMethod, setContraceptiveMethod] = useState("")
  const [brand, setBrand] = useState("")
  const [startDate, setStartDate] = useState("")
  const [remainingBoxes, setRemainingBoxes] = useState("")
  const router = useRouter()

  const contraceptiveMethods = [
    { id: "pills", name: "Pastillas" },
    { id: "patch", name: "Parche" },
    { id: "ring", name: "Anillo" },
  ]

  const handleContinue = () => {
    // Validate fields
    if (!firstName || !lastName || !contraceptiveMethod || !brand || !startDate || !remainingBoxes) {
      Alert.alert("Error", "Por favor completa todos los campos")
      return
    }

    // In a real app, you would save the profile data here
    router.push("/(patient)/choose_doctor")
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>  {/* Wrap everything inside GestureHandlerRootView */}
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
          <Text style={styles.title}>Completa tu Perfil</Text>
          <Text style={styles.subtitle}>Necesitamos algunos datos para personalizar tu experiencia</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Personal</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu nombre"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Apellido</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu apellido"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Método Anticonceptivo</Text>

            <View style={styles.methodContainer}>
              {contraceptiveMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[styles.methodButton, contraceptiveMethod === method.id && styles.methodButtonActive]}
                  onPress={() => setContraceptiveMethod(method.id)}
                >
                  <Text style={[styles.methodText, contraceptiveMethod === method.id && styles.methodTextActive]}>
                    {method.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Marca</Text>
              <TextInput style={styles.input} placeholder="Ingresa la marca" value={brand} onChangeText={setBrand} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Primer día de ingesta (actual)</Text>
              <TextInput style={styles.input} placeholder="DD/MM/AAAA" value={startDate} onChangeText={setStartDate} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Cajas restantes completas</Text>
              <TextInput
                style={styles.input}
                placeholder="Número de cajas"
                value={remainingBoxes}
                onChangeText={setRemainingBoxes}
                keyboardType="number-pad"
              />
            </View>
          </View>
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
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a6fa5",
    marginBottom: 15,
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
    marginBottom: 15,
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
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
