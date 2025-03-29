"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { TextInput } from "react-native-gesture-handler"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import Constants from "expo-constants"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { User } from "lucide-react-native"

const API_URL = Constants.expoConfig?.extra?.apiUrl || "http://localhost:8000"

export default function SelectDoctorScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [doctors, setDoctors] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        const response = await fetch(`${API_URL}/api/usuarios/doctores/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        setDoctors(data)
      } catch (error) {
        console.error("Error al obtener doctores:", error)
      }
    }

    fetchDoctors()
  }, [])

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.apellido.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doctor.especialidad || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doctor.domicilio_atencion || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectDoctor = async (doctorId: number) => {
    try {
      const token = await AsyncStorage.getItem("token")
      await fetch(`${API_URL}/api/usuarios/asignar-doctor/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doctor_id: doctorId }),
      })

      router.push("/(patient)/dashboard")
    } catch (error) {
      console.error("Error al asignar el doctor:", error)
      Alert.alert("Error", "No se pudo asignar el doctor")
    }
  }

  const renderDoctorItem = ({ item }) => (
    <TouchableOpacity style={styles.doctorCard} onPress={() => handleSelectDoctor(item.id)}>
      <View style={styles.iconContainer}>
        <User size={28} color="#4a6fa5" />
      </View>
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.nombre} {item.apellido}</Text>
        <Text style={styles.doctorSpecialty}>{item.especialidad || "Sin especialidad"}</Text>
        <Text style={styles.doctorHospital}>{item.domicilio_atencion || "Sin dirección"}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Selecciona tu Médico</Text>
          <Text style={styles.subtitle}>Elige un médico para conectarte y recibir atención personalizada</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, especialidad o dirección"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FlatList
          data={filteredDoctors}
          renderItem={renderDoctorItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No encuentras a tu médico? Puedes invitarlo a unirse a la plataforma.</Text>
          <TouchableOpacity style={styles.inviteButton}>
            <Text style={styles.inviteButtonText}>Invitar Médico</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
  searchContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchInput: {
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  doctorCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  doctorInfo: {
    flex: 1,
    justifyContent: "center",
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#4a6fa5",
    marginBottom: 2,
  },
  doctorHospital: {
    fontSize: 14,
    color: "#666",
  },
  footer: {
    marginTop: 10,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  inviteButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#4a6fa5",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  inviteButtonText: {
    color: "#4a6fa5",
    fontSize: 14,
    fontWeight: "bold",
  },
})
