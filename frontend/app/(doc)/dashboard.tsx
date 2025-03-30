"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  Linking
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import {
  User,
  FileText,
  Check,
  X,
  Calendar as CalendarIcon,
  Menu
} from "lucide-react-native"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Constants from "expo-constants"

const API_URL = Constants.expoConfig?.extra?.apiUrl || "http://localhost:8000"

type PrescriptionStatus = "pendiente" | "aceptado" | "rechazado"

type PrescriptionRequest = {
  id: number
  status: PrescriptionStatus
  fecha: string
  paciente: {
    nombre: string
    apellido: string
  }
  anticonceptivo?: {
    marca: string
    tipo: string
  }
  archivo?: string
}

type Patient = {
  id: string
  name: string
  age: number | null
  lastVisit: string
  nextVisit: string
}

export default function DoctorDashboardScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("patients")
  const [prescriptionRequests, setPrescriptionRequests] = useState<PrescriptionRequest[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(true)
  const [loadingPatients, setLoadingPatients] = useState(true)

  // Fetch prescription requests
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        if (!token) {
          console.error("No token found")
          return
        }
        const response = await axios.get(`${API_URL}/api/prescriptions/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log("Prescriptions response:", response.data)
        setPrescriptionRequests(response.data)
      } catch (error) {
        console.error("Error fetching prescriptions:", error)
      } finally {
        setLoadingPrescriptions(false)
      }
    }
    fetchPrescriptions()
  }, [])

  // Fetch patients for the logged-in doctor
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        if (!token) {
          console.error("No token found")
          return
        }
        const response = await axios.get(`${API_URL}/api/usuarios/doctor/patients/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log("Patients response:", response.data)
        setPatients(response.data || [])
      } catch (error) {
        console.error("Error fetching patients:", error)
      } finally {
        setLoadingPatients(false)
      }
    }
    fetchPatients()
  }, [])

  // Update prescription status via PATCH
  const updatePrescriptionStatus = async (id: number, status: PrescriptionStatus) => {
    try {
      const token = await AsyncStorage.getItem("token")
      if (!token) {
        console.error("No token for patch")
        return
      }
      const res = await axios.patch(
        `${API_URL}/api/prescriptions/${id}/update/`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // Replace updated prescription in local state
      setPrescriptionRequests(prev =>
        prev.map(p => (p.id === id ? res.data : p))
      )
    } catch (err) {
      console.error("Error updating prescription", err)
    }
  }

  // Color styles for prescription statuses
  const statusStyle = {
    pendiente: { color: "#f0ad4e" },
    aceptado: { color: "#5cb85c" },
    rechazado: { color: "#d9534f" }
  }

  // Render each prescription request item
  const renderPrescriptionRequestItem = ({ item }: { item: PrescriptionRequest }) => (
    <View style={styles.requestCard}>
      <View style={styles.requestInfo}>
        <Text style={styles.requestName}>
          {item.paciente.nombre} {item.paciente.apellido}
        </Text>
        <Text style={styles.requestDetails}>
          Marca: {item.anticonceptivo?.marca || "N/A"} • Método: {item.anticonceptivo?.tipo || "N/A"} •{" "}
          {(new Date(item.fecha)).toLocaleDateString()}
        </Text>
        <Text style={[styles.requestDetails, statusStyle[item.status]]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
      {item.status === "pendiente" && (
        <View style={styles.requestActions}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => updatePrescriptionStatus(item.id, "aceptado")}
          >
            <Check size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => updatePrescriptionStatus(item.id, "rechazado")}
          >
            <X size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      {item.archivo && (
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => {
            Linking.openURL(item.archivo).catch(err => {
              console.error("Error al descargar archivo:", err)
              Alert.alert("Error", "No se pudo descargar el archivo.")
            })
          }}
        >
          <Text style={styles.downloadButtonText}>Descargar archivo</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  // Render each patient item (real data)
  const renderPatientItem = ({ item }: { item: Patient }) => (
    <TouchableOpacity style={styles.patientCard}>
      <View style={styles.iconContainer}>
        <User size={50} color="#4a6fa5" />
      </View>
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.name}</Text>
        {item.age !== null && <Text style={styles.patientAge}>{item.age} años</Text>}
      </View>
    </TouchableOpacity>
  )

  // Patients Tab: shows real patients or a friendly message if none exist
  const renderPatientsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Mis Pacientes</Text>
      {loadingPatients ? (
        <Text>Cargando pacientes...</Text>
      ) : patients.length > 0 ? (
        <FlatList
          data={patients}
          renderItem={renderPatientItem}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.emptyText}>No tienes pacientes asignados</Text>
      )}
    </View>
  )

  // Prescriptions Tab: pending and history
  const renderPrescriptionsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Solicitudes de Recetas</Text>
        {loadingPrescriptions ? (
          <Text>Cargando recetas...</Text>
        ) : prescriptionRequests.filter(p => p.status === "pendiente").length > 0 ? (
          <FlatList
            data={prescriptionRequests.filter(p => p.status === "pendiente")}
            renderItem={renderPrescriptionRequestItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>No hay solicitudes pendientes</Text>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historial de Recetas</Text>
        {loadingPrescriptions ? (
          <Text>Cargando recetas...</Text>
        ) : prescriptionRequests.filter(p => p.status !== "pendiente").length > 0 ? (
          <FlatList
            data={prescriptionRequests.filter(p => p.status !== "pendiente")}
            renderItem={renderPrescriptionRequestItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>No hay recetas recientes</Text>
        )}
      </View>
    </View>
  )

  // Profile Tab: static doctor profile info
  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Perfil del Médico</Text>
      <Text style={styles.profileText}>Nombre: Dr. Carlos Rodríguez</Text>
      <Text style={styles.profileText}>Especialidad: Cardiología</Text>
      <Text style={styles.profileText}>Experiencia: 15 años de experiencia</Text>
      <Text style={styles.profileText}>Contacto: carlos.rodriguez@hospital.com</Text>
    </View>
  )

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dr. Carlos Rodríguez</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Menu size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.content}>
          {activeTab === "patients" && renderPatientsTab()}
          {activeTab === "prescriptions" && renderPrescriptionsTab()}
          {activeTab === "profile" && renderProfileTab()}
        </ScrollView>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab("patients")}
          >
            <User size={24} color={activeTab === "patients" ? "#4a6fa5" : "#666"} />
            <Text style={[styles.tabButtonText, activeTab === "patients" && styles.tabButtonTextActive]}>
              Pacientes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab("prescriptions")}
          >
            <FileText size={24} color={activeTab === "prescriptions" ? "#4a6fa5" : "#666"} />
            <Text style={[styles.tabButtonText, activeTab === "prescriptions" && styles.tabButtonTextActive]}>
              Recetas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab("profile")}
          >
            <User size={24} color={activeTab === "profile" ? "#4a6fa5" : "#666"} />
            <Text style={[styles.tabButtonText, activeTab === "profile" && styles.tabButtonTextActive]}>
              Perfil
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

const themeColor = "#4a6fa5"

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0"
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  menuButton: { padding: 5 },
  content: { flex: 1, padding: 20 },
  tabContent: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 15 },
  emptyText: { fontSize: 14, color: "#666", fontStyle: "italic", textAlign: "center", padding: 20 },
  requestCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10
  },
  requestInfo: { flex: 1 },
  requestName: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 4 },
  requestDetails: { fontSize: 14, color: "#666" },
  requestActions: { flexDirection: "row", alignItems: "center" },
  acceptButton: {
    backgroundColor: "#4CAF50",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10
  },
  rejectButton: {
    backgroundColor: "#F44336",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10
  },
  recetaCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  downloadButton: {
    backgroundColor: themeColor,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginTop: 5
  },
  downloadButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  patientCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: "center"
  },
  iconContainer: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15
  },
  patientInfo: { flex: 1 },
  patientName: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 2 },
  patientAge: { fontSize: 14, color: "#666", marginBottom: 2 },
  tabBar:{
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 10
  },
  tabButton: { flex: 1, alignItems: "center", paddingVertical: 8 },
  tabButtonText: { fontSize: 12, color: "#666", marginTop: 4 },
  tabButtonTextActive: { color: "#4a6fa5", fontWeight: "600" },
  profileText: { fontSize: 14, color: "#333", marginBottom: 10 }
})
