"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { GestureHandlerRootView } from 'react-native-gesture-handler'  // Import GestureHandlerRootView
import { User, FileText, MessageCircle, Calendar, Menu, Check, X } from "lucide-react-native"

export default function DoctorDashboardScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("patients")
  const [showPatientRequests, setShowPatientRequests] = useState(false)  // Estado para controlar la visibilidad

  // Información del médico
  const doctorProfile = {
    name: "Dr. Carlos Rodríguez",
    specialty: "Cardiología",
    experience: "15 años de experiencia",
    contact: "carlos.rodriguez@hospital.com",
  }

  // Mock data for patient requests
  const patientRequests = [
    {
      id: "1",
      name: "María López",
      age: 28,
      date: "29/03/2025",
      image: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "2",
      name: "Laura Martínez",
      age: 32,
      date: "28/03/2025",
      image: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "3",
      name: "Carolina Sánchez",
      age: 25,
      date: "27/03/2025",
      image: "/placeholder.svg?height=50&width=50",
    },
  ]

  // Mock data for prescription requests
  const prescriptionRequests = [
    {
      id: "1",
      name: "Julia Rodríguez",
      medication: "Yasmin",
      date: "29/03/2025",
      image: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "2",
      name: "Ana Gómez",
      medication: "Diane-35",
      date: "28/03/2025",
      image: "/placeholder.svg?height=50&width=50",
    },
  ]

  // Mock data for patients
  const patients = [
    {
      id: "1",
      name: "Julia Rodríguez",
      age: 30,
      lastVisit: "15/02/2025",
      nextVisit: "15/04/2025",
      image: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "2",
      name: "Ana Gómez",
      age: 27,
      lastVisit: "10/03/2025",
      nextVisit: "10/05/2025",
      image: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "3",
      name: "Sofía Pérez",
      age: 35,
      lastVisit: "05/03/2025",
      nextVisit: "05/05/2025",
      image: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "4",
      name: "Elena Torres",
      age: 29,
      lastVisit: "20/02/2025",
      nextVisit: "20/04/2025",
      image: "/placeholder.svg?height=50&width=50",
    },
  ]

  const renderPatientRequestItem = ({ item }: { item: { image: string; name: string } }) => (
    <View style={styles.requestCard}>
      <Image source={{ uri: item.image }} style={styles.requestImage} />
      <View style={styles.requestInfo}>
        <Text style={styles.requestName}>{item.name}</Text>
        <Text style={styles.requestDetails}>
          Solicitud pendiente
        </Text>
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

  const renderPrescriptionRequestItem = ({ item }: { item: { image: string; name: string; medication: string; date: string } }) => (
    <View style={styles.requestCard}>
      <Image source={{ uri: item.image }} style={styles.requestImage} />
      <View style={styles.requestInfo}>
        <Text style={styles.requestName}>{item.name}</Text>
        <Text style={styles.requestDetails}>
          Medicamento: {item.medication} • {item.date}
        </Text>
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

  const renderPatientsTab = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setShowPatientRequests(!showPatientRequests)}  // Alternar visibilidad
      >
        <Text style={styles.sectionTitle}>Solicitudes de Pacientes</Text>
      </TouchableOpacity>
      {showPatientRequests && (  // Mostrar lista solo si showPatientRequests es true
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
        <Text style={styles.sectionTitle}>Mis Pacientes</Text>
        <FlatList
          data={patients}
          renderItem={renderPatientItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>
    </View>
  )

  const renderPrescriptionsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Solicitudes de Recetas</Text>
        {prescriptionRequests.length > 0 ? (
          <FlatList
            data={prescriptionRequests}
            renderItem={renderPrescriptionRequestItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>No hay solicitudes de recetas pendientes</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historial de Recetas</Text>
        <Text style={styles.emptyText}>No hay recetas recientes</Text>
      </View>
    </View>
  )

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Dr. Carlos Rodríguez</Text>
            <TouchableOpacity style={styles.menuButton}>
            <Menu size={24} color="#333" />
            </TouchableOpacity>
        </View>

        {/* Eliminar o comentar la barra de pestañas */}
        {/* <View style={styles.tabsContainer}>
            <TouchableOpacity
            style={[styles.tab, activeTab === "patients" && styles.activeTab]}
            onPress={() => setActiveTab("patients")}
            >
            <Text style={[styles.tabText, activeTab === "patients" && styles.activeTabText]}>Pacientes</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={[styles.tab, activeTab === "prescriptions" && styles.activeTab]}
            onPress={() => setActiveTab("prescriptions")}
            >
            <Text style={[styles.tabText, activeTab === "prescriptions" && styles.activeTabText]}>Recetas</Text>
            </TouchableOpacity>
        </View> */}

        <ScrollView style={styles.content}>
            {activeTab === "patients" && renderPatientsTab()}
            {activeTab === "prescriptions" && renderPrescriptionsTab()}
            {activeTab === "profile" && renderProfileTab()}
        </ScrollView>

        <View style={styles.tabBar}>
            <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("patients")}>
            <User size={24} color={activeTab === "patients" ? "#4a6fa5" : "#666"} />
            <Text style={[styles.tabButtonText, activeTab === "patients" && styles.tabButtonTextActive]}>Pacientes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("prescriptions")}>
            <FileText size={24} color={activeTab === "prescriptions" ? "#4a6fa5" : "#666"} />
            <Text style={[styles.tabButtonText, activeTab === "prescriptions" && styles.tabButtonTextActive]}>
                Recetas
            </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab("profile")}>
            <User size={24} color={activeTab === "profile" ? "#4a6fa5" : "#666"} />
            <Text style={[styles.tabButtonText, activeTab === "profile" && styles.tabButtonTextActive]}>Perfil</Text>
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
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    paddingVertical: 15,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#4a6fa5",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  activeTabText: {
    color: "#4a6fa5",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tabContent: {
    flex: 1,
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
  requestCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
  emptyText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    padding: 20,
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
  sectionHeader: {
    backgroundColor: "#e0e0e0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  profileText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
})