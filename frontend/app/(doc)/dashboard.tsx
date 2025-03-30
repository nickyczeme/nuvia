"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { User, FileText, MessageCircle, Calendar, Menu, Check, X } from "lucide-react-native"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Constants from "expo-constants"

// Cambia esta URL a la de tu servidor (o toma de extra.apiUrl si lo configuras)
const API_URL = 'http://192.168.1.49:8000'

type PrescriptionStatus = 'pendiente' | 'aceptado' | 'rechazado'

type PrescriptionRequest = {
  id: number
  status: PrescriptionStatus
  fecha: string
  paciente: {
    nombre: string
    apellido: string
  }
  anticonceptivo: {
    marca: string
  }
  image?: string
}

export default function DoctorDashboardScreen() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState("patients")
  const [showPatientRequests, setShowPatientRequests] = useState(false)
  const [prescriptionRequests, setPrescriptionRequests] = useState<PrescriptionRequest[]>([])
  const [loading, setLoading] = useState(true)

  // Al montar el componente, cargamos las prescripciones
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = await AsyncStorage.getItem('token')
        if (!token) {
          console.error("No token found")
          
          return
        }
        // GET a /api/prescriptions/
        const response = await axios.get(`${API_URL}/api/prescriptions/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        console.log("Prescriptions response:", response.data)
        setPrescriptionRequests(response.data)
      } catch (error) {
        console.error("Error fetching prescriptions:", error)
      } finally {
        
      }
    }
    fetchPrescriptions()
  }, [])

  // PATCH para actualizar estado de la receta
  const updatePrescriptionStatus = async (id: number, status: PrescriptionStatus) => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        console.error("No token for patch")
        return
      }
      const res = await axios.patch(`${API_URL}/api/prescriptions/${id}/update/`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // Reemplazar en el state local
      setPrescriptionRequests(prev =>
        prev.map(p => p.id === id ? res.data : p)
      )
    } catch (err) {
      console.error("Error updating prescription", err)
    }
  }

  // Filtramos por pendientes vs no pendientes
  const pendingRequests = prescriptionRequests.filter(p => p.status === 'pendiente')
  const doneRequests = prescriptionRequests.filter(p => p.status !== 'pendiente')

  const statusStyle = {
    pendiente: { color: "#f0ad4e" },   // Amarillo anaranjado para pendiente
    aceptado: { color: "#5cb85c" },     // Verde para aceptado
    rechazado: { color: "#d9534f" }      // Rojo para rechazado
  };

  // EJEMPLO: supuestos "patientRequests" y "patients" (si querés mantenerlos mocks)
  const patientRequests = [
    { id: "1", name: "María López", age: 28, date: "29/03/2025", image: "/placeholder.svg?height=50&width=50" },
    { id: "2", name: "Laura Martínez", age: 32, date: "28/03/2025", image: "/placeholder.svg?height=50&width=50" },
  ]

  const patients = [
    { id: "1", name: "Julia Rodríguez", age: 30, lastVisit: "15/02/2025", nextVisit: "15/04/2025", image: "/placeholder.svg?height=50&width=50" },
    { id: "2", name: "Ana Gómez", age: 27, lastVisit: "10/03/2025", nextVisit: "10/05/2025", image: "/placeholder.svg?height=50&width=50" },
  ]

  // Render para las solicitudes “pacientes” (mock)
  const renderPatientRequestItem = ({ item }: { item: { image: string; name: string } }) => (
    <View style={styles.requestCard}>
      <Image source={{ uri: item.image }} style={styles.requestImage} />
      <View style={styles.requestInfo}>
        <Text style={styles.requestName}>{item.name}</Text>
        <Text style={styles.requestDetails}>Solicitud pendiente</Text>
      </View>
      <View style={styles.requestActions}>
        <TouchableOpacity style={styles.acceptButton}>
          <Check size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectButton}>
          <X size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  )

  // Render de cada prescripción real
  const renderPrescriptionRequestItem = ({ item }: { item: PrescriptionRequest }) => (
    
    <View style={styles.requestCard}>
      <View style={styles.requestInfo}>
        <Text style={styles.requestName}>
          {item.paciente.nombre} {item.paciente.apellido}
        </Text>
        <Text style={styles.requestDetails}>
        Marca: {item.anticonceptivo?.marca || "N/A"} • Método: {item.anticonceptivo?.tipo || "N/A"} • {(new Date(item.fecha)).toLocaleDateString()}
        </Text>
        <Text style={[styles.requestDetails, statusStyle[item.status]]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
      {item.status === 'pendiente' && (
        <View style={styles.requestActions}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => updatePrescriptionStatus(item.id, 'aceptado')}
          >
            <Check size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => updatePrescriptionStatus(item.id, 'rechazado')}
          >
            <X size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
  

  // Render de cada paciente (mock)
  const renderPatientItem = ({ item }: { item: { id: string; name: string; age: number; lastVisit: string; nextVisit: string; image: string } }) => (
    <TouchableOpacity style={styles.patientCard}>
      <Image source={{ uri: item.image }} style={styles.patientImage} />
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.name}</Text>
        <Text style={styles.patientAge}>{item.age} años</Text>
        <View style={styles.patientVisits}>
          <Text style={styles.patientVisitLabel}>Última visita: </Text>
          <Text style={styles.patientVisitDate}>{item.lastVisit}</Text>
        </View>
      </View>
      <View style={styles.patientActions}>
        <TouchableOpacity style={styles.patientActionButton}>
          <MessageCircle size={18} color="#4a6fa5" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.patientActionButton}>
          <Calendar size={18} color="#4a6fa5" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.patientActionButton}>
          <FileText size={18} color="#4a6fa5" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  // Tab "patients"
  const renderPatientsTab = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setShowPatientRequests(!showPatientRequests)}
      >
        <Text style={styles.sectionTitle}>Solicitudes de Pacientes (mock)</Text>
      </TouchableOpacity>
      {showPatientRequests && (
        <View style={styles.section}>
          {patientRequests.length > 0 ? (
            <FlatList
              data={patientRequests}
              renderItem={renderPatientRequestItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyText}>No hay solicitudes pendientes</Text>
          )}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis Pacientes (mock)</Text>
        <FlatList
          data={patients}
          renderItem={renderPatientItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>
    </View>
  )

  // Tab "prescriptions"
  const renderPrescriptionsTab = () => (
    <View style={styles.tabContent}>
      {/* Pendientes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Solicitudes de Recetas</Text>
        {pendingRequests.length > 0 ? (
          <FlatList
            data={pendingRequests}
            renderItem={renderPrescriptionRequestItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>No hay solicitudes</Text>
        )}
      </View>

      {/* Historial */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historial de Recetas</Text>
        {doneRequests.length > 0 ? (
          <FlatList
            data={doneRequests}
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

  // Tab "profile"
  const doctorProfile = {
    name: "Dr. Carlos Rodríguez",
    specialty: "Cardiología",
    experience: "15 años de experiencia",
    contact: "carlos.rodriguez@hospital.com",
  }

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Perfil del Médico</Text>
        <Text style={styles.profileText}>Nombre: {doctorProfile.name}</Text>
        <Text style={styles.profileText}>Especialidad: {doctorProfile.specialty}</Text>
        <Text style={styles.profileText}>Experiencia: {doctorProfile.experience}</Text>
        <Text style={styles.profileText}>Contacto: {doctorProfile.contact}</Text>
      </View>
    </View>
  )

//   if (loading) {
//     return (
//       <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text>Cargando prescripciones...</Text>
//       </SafeAreaView>
//     )
//   }

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
          <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("patients")}>
            <User size={24} color={activeTab === "patients" ? "#4a6fa5" : "#666"} />
            <Text style={[styles.tabButtonText, activeTab === "patients" && styles.tabButtonTextActive]}>
              Pacientes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("prescriptions")}>
            <FileText size={24} color={activeTab === "prescriptions" ? "#4a6fa5" : "#666"} />
            <Text style={[styles.tabButtonText, activeTab === "prescriptions" && styles.tabButtonTextActive]}>
              Recetas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("profile")}>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  menuButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tabContent: {
    flex: 1,
  },
  sectionHeader: {
    backgroundColor: "#e0e0e0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    padding: 20,
  },
  requestCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  requestImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  requestInfo: {
    flex: 1,
    justifyContent: "center",
  },
  requestName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  requestDetails: {
    fontSize: 14,
    color: "#666",
  },
  requestActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  rejectButton: {
    backgroundColor: "#F44336",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  patientCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  patientImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  patientInfo: {
    flex: 1,
    justifyContent: "center",
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  patientAge: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  patientVisits: {
    flexDirection: "row",
    alignItems: "center",
  },
  patientVisitLabel: {
    fontSize: 12,
    color: "#666",
  },
  patientVisitDate: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4a6fa5",
  },
  patientActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  patientActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
    backgroundColor: "#f0f7ff",
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
  tabButtonText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  tabButtonTextActive: {
    color: "#4a6fa5",
    fontWeight: "600",
  },
  profileText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
})
