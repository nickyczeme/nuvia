"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Calendar, MessageCircle, User, Pill, Calendar as CalendarIcon, Menu } from "lucide-react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"

export default function PatientDashboardScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        if (!token) {
          router.replace("/(auth)/login")
          return
        }

        const response = await axios.get("http://127.0.0.1:8000/api/usuarios/me/", {
          headers: { Authorization: `Bearer ${token}` },
        })

        setUserData(response.data)
      } catch (error) {
        console.error("Error fetching user data", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#4a6fa5" />
      </SafeAreaView>
    )
  }

  if (!userData) return null

  const doctor = userData.doctor_asignado

  const renderHomeTab = () => (
    <ScrollView style={styles.tabContent}>
      {doctor && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mi Médico</Text>
            <TouchableOpacity style={styles.sectionAction}>
              <Text style={styles.sectionActionText}>Ver Perfil</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.doctorCard}>
            <Image source={{ uri: "/placeholder.svg?height=60&width=60" }} style={styles.doctorImage} />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctor.nombre} {doctor.apellido}</Text>
              <Text style={styles.doctorSpecialty}>{doctor.especialidad}</Text>
              <Text style={styles.doctorHospital}>{doctor.domicilio_atencion}</Text>
            </View>
            <TouchableOpacity style={styles.messageButton}>
              <MessageCircle size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mi Anticonceptivo</Text>
        </View>

        <View style={styles.contraceptiveCard}>
          <View style={styles.contraceptiveHeader}>
            <Pill size={24} color="#4a6fa5" />
            <View style={styles.contraceptiveInfo}>
              <Text style={styles.contraceptiveMethod}>{userData.anticonceptivo?.tipo ?? "N/A"}</Text>
              <Text style={styles.contraceptiveBrand}>{userData.anticonceptivo?.marca ?? "N/A"}</Text>
            </View>
          </View>

          <View style={styles.contraceptiveDetails}>
            <View style={styles.contraceptiveDetailItem}>
              <Text style={styles.contraceptiveDetailLabel}>Inicio de Caja Actual</Text>
              <Text style={styles.contraceptiveDetailValue}>{userData.fecha_de_inicio_periodo ?? "No definido"}</Text>
            </View>
            <View style={styles.contraceptiveDetailItem}>
              <Text style={styles.contraceptiveDetailLabel}>Cajas Restantes</Text>
              <Text style={styles.contraceptiveDetailValue}>{userData.cantidad_de_cajas}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.reminderButton}>
            <Text style={styles.reminderButtonText}>Configurar Recordatorio</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Mi Perfil</Text>
      {/* Aquí podrías mostrar datos del paciente */}
    </View>
  )

  const renderCalendarTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Calendario</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, {userData.nombre}</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Menu size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === "home" && renderHomeTab()}
        {activeTab === "calendar" && renderCalendarTab()}
        {activeTab === "profile" && renderProfileTab()}
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "home" && styles.tabButtonActive]}
          onPress={() => setActiveTab("home")}
        >
          <Calendar size={24} color={activeTab === "home" ? "#4a6fa5" : "#666"} />
          <Text style={[styles.tabButtonText, activeTab === "home" && styles.tabButtonTextActive]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "calendar" && styles.tabButtonActive]}
          onPress={() => setActiveTab("calendar")}
        >
          <CalendarIcon size={24} color={activeTab === "calendar" ? "#4a6fa5" : "#666"} />
          <Text style={[styles.tabButtonText, activeTab === "calendar" && styles.tabButtonTextActive]}>Calendario</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "profile" && styles.tabButtonActive]}
          onPress={() => setActiveTab("profile")}
        >
          <User size={24} color={activeTab === "profile" ? "#4a6fa5" : "#666"} />
          <Text style={[styles.tabButtonText, activeTab === "profile" && styles.tabButtonTextActive]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  menuButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  tabTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  sectionAction: {
    padding: 5,
  },
  sectionActionText: {
    fontSize: 14,
    color: "#4a6fa5",
    fontWeight: "600",
  },
  doctorCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
  messageButton: {
    backgroundColor: "#4a6fa5",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  appointmentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f7ff",
    borderRadius: 10,
    padding: 15,
  },
  appointmentInfo: {
    marginLeft: 10,
  },
  appointmentLabel: {
    fontSize: 14,
    color: "#666",
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cycleCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cycleIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(74, 111, 165, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 15,
  },
  cycleIndicatorInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(74, 111, 165, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  cycleDay: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4a6fa5",
  },
  cycleInfo: {
    alignItems: "center",
  },
  cycleInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cycleInfoSubtitle: {
    fontSize: 14,
    color: "#4a6fa5",
    marginBottom: 15,
  },
  cycleDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cycleDetailItem: {
    flex: 1,
    alignItems: "center",
  },
  cycleDetailLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  cycleDetailValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  cycleDetailSubvalue: {
    fontSize: 12,
    color: "#666",
  },
  contraceptiveCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  contraceptiveHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  contraceptiveInfo: {
    marginLeft: 15,
  },
  contraceptiveMethod: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  contraceptiveBrand: {
    fontSize: 14,
    color: "#666",
  },
  contraceptiveDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  contraceptiveDetailItem: {
    flex: 1,
  },
  contraceptiveDetailLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  contraceptiveDetailValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  reminderButton: {
    backgroundColor: "#f0f7ff",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  reminderButtonText: {
    color: "#4a6fa5",
    fontSize: 14,
    fontWeight: "600",
  },
  chatbotButton: {
    flexDirection: "row",
    backgroundColor: "#4a6fa5",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  chatbotButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  tabButtonActive: {
    borderTopWidth: 2,
    borderTopColor: "#4a6fa5",
  },
  tabButtonText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  tabButtonTextActive: {
    color: "#4a6fa5",
    fontWeight: "600",
  },
})
