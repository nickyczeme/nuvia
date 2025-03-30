"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import {
  MessageCircle,
  User,
  Pill,
  Calendar as CalendarIcon,
  Home,
  Menu
} from "lucide-react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import Constants from "expo-constants"
import DropDownPicker from "react-native-dropdown-picker"
import Calendar from "@/app/(calendar)/calendar"

const API_URL = Constants.expoConfig?.extra?.apiUrl || "http://localhost:8000"

export default function PatientDashboardScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")
  const [userData, setUserData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [cycleInfo, setCycleInfo] = useState<any>(null)
  const [showDoctorModal, setShowDoctorModal] = useState(false)
  const [showContraceptiveModal, setShowContraceptiveModal] = useState(false)
  const [autoRecipeActive, setAutoRecipeActive] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        const response = await axios.get(`${API_URL}/api/usuarios/me/`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        const data = response.data
        console.log("User data response:", data)
        setUserData(data)

        // Cálculo del ciclo
        if (data.fecha_de_inicio_periodo) {
          const start = new Date(data.fecha_de_inicio_periodo)
          const today = new Date()
          const diffDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 3600 * 24))
          const currentDay = (diffDays % 28) + 1

          let label = ""
          if (currentDay <= 5) label = "Menstruación"
          else if (currentDay <= 13) label = "Fase folicular"
          else if (currentDay <= 16) label = "Ventana fértil"
          else label = "Fase lútea"

          const daysUntilNext = 28 - currentDay
          const nextPeriodDate = new Date(today.getTime() + daysUntilNext * 24 * 60 * 60 * 1000)
          const nextPeriod = nextPeriodDate.toISOString().slice(0, 10)

          setCycleInfo({ currentDay, label, nextPeriod, daysUntilNext })
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  if (loading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <Text>Cargando...</Text>
        </SafeAreaView>
      </GestureHandlerRootView>
    )
  }

  const pedirRecetaUnica = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      if (!token) {
        console.error("No token found")
        return
      }
  
      const response = await axios.post(`${API_URL}/api/prescriptions/pedir-unica/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
  
      console.log("Receta única generada:", response.data)
      alert("Tu solicitud fue enviada al médico")
    } catch (error) {
      console.error("Error al pedir receta única:", error)
      alert("Hubo un error al crear la receta")
    }
  }

  const activarRecetaAutomatica = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const res = await axios.post(`${API_URL}/api/prescriptions/activar-automatica/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
  
      console.log("Receta automática activada:", res.data)
      setAutoRecipeActive(true)
    } catch (err) {
      console.error("Error activando receta automática", err)
    }
  }
  
  

  const renderHomeTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* SECCIÓN: MI MÉDICO */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mi Médico</Text>
          <TouchableOpacity
            style={styles.sectionAction}
            onPress={() => setShowDoctorModal(true)}
          >
            <Text style={styles.sectionActionText}>Ver Perfil</Text>
          </TouchableOpacity>
        </View>

        {userData.doctor ? (
          <View style={styles.doctorCard}>
            <User size={50} color="#4a6fa5" style={{ marginRight: 15 }} />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>
                {userData.doctor.nombre} {userData.doctor.apellido}
              </Text>
              <Text style={styles.doctorSpecialty}>
                {userData.doctor.especialidad}
              </Text>
              <Text style={styles.doctorHospital}>
                {userData.doctor.domicilio_atencion}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={{ color: "#666" }}>No tienes un médico asignado aún.</Text>
        )}
      </View>

      {/* SECCIÓN: MI CICLO */}
      {cycleInfo && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mi Ciclo</Text>
            <TouchableOpacity
              style={styles.sectionAction}
              onPress={() => setActiveTab("calendar")}
            >
              <Text style={styles.sectionActionText}>Ver Calendario</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cycleCard}>
            <View style={styles.cycleIndicator}>
              <View style={styles.cycleIndicatorInner}>
                <Text style={styles.cycleDay}>{cycleInfo.currentDay}</Text>
              </View>
            </View>
            <View style={styles.cycleInfo}>
              <Text style={styles.cycleInfoTitle}>
                Día {cycleInfo.currentDay} de tu ciclo
              </Text>
              <Text style={styles.cycleInfoSubtitle}>{cycleInfo.label}</Text>
              <View style={styles.cycleDetails}>
                <View style={styles.cycleDetailItem}>
                  <Text style={styles.cycleDetailLabel}>Próximo Período</Text>
                  <Text style={styles.cycleDetailValue}>
                    {cycleInfo.nextPeriod}
                  </Text>
                  <Text style={styles.cycleDetailSubvalue}>
                    En {cycleInfo.daysUntilNext} días
                  </Text>
                </View>
                <View style={styles.cycleDetailItem}>
                  <Text style={styles.cycleDetailLabel}>Duración del Ciclo</Text>
                  <Text style={styles.cycleDetailValue}>28 días</Text>
                  <Text style={styles.cycleDetailSubvalue}>Promedio</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* SECCIÓN: MI ANTICONCEPTIVO */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mi Anticonceptivo</Text>
          <TouchableOpacity
            style={styles.sectionAction}
            onPress={() => setShowContraceptiveModal(true)}
          >
            <Text style={styles.sectionActionText}>Editar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contraceptiveCard}>
          <View style={styles.contraceptiveHeader}>
            <Pill size={24} color="#4a6fa5" />
            <View style={styles.contraceptiveInfo}>
              <Text style={styles.contraceptiveMethod}>
                {userData.anticonceptivo?.tipo || "Pastillas"}
              </Text>
              <Text style={styles.contraceptiveBrand}>
                {userData.anticonceptivo?.marca || "Yasmin"}
              </Text>
            </View>
          </View>

          <View style={styles.contraceptiveDetails}>
            <View style={styles.contraceptiveDetailItem}>
              <Text style={styles.contraceptiveDetailLabel}>
                Inicio de Caja Actual
              </Text>
              <Text style={styles.contraceptiveDetailValue}>
                {userData.fecha_de_inicio_periodo || "15/03/2025"}
              </Text>
            </View>
            <View style={styles.contraceptiveDetailItem}>
              <Text style={styles.contraceptiveDetailLabel}>Cajas Restantes</Text>
              <Text style={styles.contraceptiveDetailValue}>
                {userData.cantidad_de_cajas ?? 2}
              </Text>
            </View>
          </View>

          <View style={styles.recipeButtonsContainer}>
            <TouchableOpacity
              style={styles.singleRecipeButton}
              onPress={pedirRecetaUnica}
            >
              <Text style={styles.singleRecipeButtonText}>Pedir receta única</Text>
              <Text style={styles.recipeDescription}>
                Se enviará una receta de forma inmediata.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.recurringRecipeButton,
                autoRecipeActive && styles.recurringRecipeActiveButton
              ]}
              onPress={activarRecetaAutomatica} // 👈 cambio importante
              disabled={autoRecipeActive} // 👈 lo deshabilita si ya está activado
            >
              <Text
                style={[
                  styles.recurringRecipeButtonText,
                  autoRecipeActive && styles.recurringRecipeActiveText
                ]}
              >
                {autoRecipeActive
                  ? "Receta automática activada"
                  : "Programar receta trimestral"}
              </Text>

              {!autoRecipeActive && (
                <Text style={styles.recipeDescription}>
                  Recibirás recetas automáticamente cada 3 meses.
                </Text>
              )}
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </ScrollView>
  )

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Mi Perfil</Text>
      {/* Aquí iría el contenido del perfil */}
    </View>
  )

  const renderCalendarTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Calendario</Text>
      <Calendar />
    </View>
  )

  // Modal para mostrar la información del médico (con la misma tarjeta que en Home)
  const DoctorModal = () => (
    <Modal
      visible={showDoctorModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowDoctorModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Información del Médico</Text>
            <TouchableOpacity onPress={() => setShowDoctorModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          {userData.doctor ? (
            <View style={styles.doctorCard}>
              <User size={80} color="#4a6fa5" style={{ marginRight: 15 }} />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>
                  {userData.doctor.nombre} {userData.doctor.apellido}
                </Text>
                <Text style={styles.doctorSpecialty}>
                  {userData.doctor.especialidad || "Sin especialidad"}
                </Text>
                <Text style={styles.doctorHospital}>
                  {userData.doctor.domicilio_atencion || "Sin consultorio asignado"}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={{ color: "#666" }}>
              No hay información del médico disponible.
            </Text>
          )}
        </View>
      </View>
    </Modal>
  )

  // Modal para editar el anticonceptivo
  const EditContraceptiveModal = ({
    visible,
    onClose
  }: {
    visible: boolean
    onClose: () => void
  }) => {
    const [selectedTipo, setSelectedTipo] = useState<string | null>(
      userData.anticonceptivo?.tipo || null
    )
    const [selectedMarca, setSelectedMarca] = useState<number | null>(
      userData.anticonceptivo?.id || null
    )
    const [allAnticonceptivos, setAllAnticonceptivos] = useState<any[]>([])
    const [tipoOptions, setTipoOptions] = useState<string[]>([])
    const [marcaOptions, setMarcaOptions] = useState<
      { label: string; value: number | undefined }[]
    >([])
    const [openMarca, setOpenMarca] = useState(false)

    useEffect(() => {
      const fetchAnticonceptivos = async () => {
        try {
          const token = await AsyncStorage.getItem("token")
          const response = await axios.get(`${API_URL}/api/usuarios/anticonceptivos/`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          const data = response.data
          setAllAnticonceptivos(data)
          const tiposUnicos = Array.from(new Set(data.map((a: any) => a.tipo)))
          setTipoOptions(tiposUnicos as string[])
        } catch (error) {
          console.error("Error al obtener anticonceptivos:", error)
        }
      }
      fetchAnticonceptivos()
    }, [])

    useEffect(() => {
      if (selectedTipo) {
        const marcasFiltradas = allAnticonceptivos.filter((a) => a.tipo === selectedTipo)
        const marcasUnicas = Array.from(new Set(marcasFiltradas.map((a) => a.marca)))
        const opcionesMarca = marcasUnicas.map((marca) => {
          const item = marcasFiltradas.find((a) => a.marca === marca)
          return { label: marca, value: item?.id }
        })
        setMarcaOptions(opcionesMarca)
      } else {
        setMarcaOptions([])
        setSelectedMarca(null)
      }
    }, [selectedTipo, allAnticonceptivos])

    const handleSave = async () => {
      if (!selectedMarca) {
        Alert.alert("Error", "Por favor selecciona la marca de anticonceptivo")
        return
      }
      try {
        const token = await AsyncStorage.getItem("token")
        const payload = { anticonceptivo: selectedMarca }
        console.log("Payload a enviar (editar anticonceptivo):", payload)
        const response = await axios.patch(`${API_URL}/api/usuarios/update/`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log("Respuesta del servidor:", response.data)
        // Actualizamos el estado global con la nueva info
        const updatedAnticonceptivo = allAnticonceptivos.find(
          (a) => a.id === selectedMarca
        )
        setUserData((prev: any) => ({
          ...prev,
          anticonceptivo: updatedAnticonceptivo
        }))
        onClose()
      } catch (error) {
        console.error("Error actualizando anticonceptivo:", error)
        Alert.alert("Error", "No se pudo actualizar el anticonceptivo")
      }
    }

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Editar Mi Anticonceptivo</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.label}>Tipo</Text>
              <View style={styles.tipoRow}>
                {tipoOptions.map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    onPress={() => setSelectedTipo(tipo)}
                    style={[
                      styles.tipoButton,
                      selectedTipo === tipo && styles.tipoButtonSelected
                    ]}
                  >
                    <Text
                      style={[
                        styles.tipoButtonText,
                        selectedTipo === tipo && styles.tipoButtonTextSelected
                      ]}
                    >
                      {tipo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.label}>Marca</Text>
              <DropDownPicker
                open={openMarca}
                value={selectedMarca}
                items={marcaOptions}
                setOpen={setOpenMarca}
                setValue={setSelectedMarca}
                setItems={setMarcaOptions}
                placeholder="Selecciona una marca"
                style={styles.input}
                disabled={!selectedTipo}
                listMode="MODAL"
                modalProps={{
                  animationType: "fade",
                  transparent: true
                }}
                modalContentContainerStyle={styles.modalContentContainer}
                dropDownContainerStyle={styles.dropDownContainer}
              />
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Guardar cambios</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hola, {userData.nombre || ""} {userData.apellido || ""}
          </Text>
          <TouchableOpacity style={styles.menuButton}>
            <Menu size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {activeTab === "home" && renderHomeTab()}
          {activeTab === "profile" && renderProfileTab()}
          {activeTab === "calendar" && renderCalendarTab()}
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "home" && styles.tabButtonActive]}
            onPress={() => setActiveTab("home")}
          >
            <Home size={24} color={activeTab === "home" ? "#4a6fa5" : "#666"} />
            <Text style={[styles.tabButtonText, activeTab === "home" && styles.tabButtonTextActive]}>
              Inicio
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "calendar" && styles.tabButtonActive]}
            onPress={() => setActiveTab("calendar")}
          >
            <CalendarIcon size={24} color={activeTab === "calendar" ? "#4a6fa5" : "#666"} />
            <Text style={[styles.tabButtonText, activeTab === "calendar" && styles.tabButtonTextActive]}>
              Calendario
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "profile" && styles.tabButtonActive]}
            onPress={() => setActiveTab("profile")}
          >
            <User size={24} color={activeTab === "profile" ? "#4a6fa5" : "#666"} />
            <Text style={[styles.tabButtonText, activeTab === "profile" && styles.tabButtonTextActive]}>
              Perfil
            </Text>
          </TouchableOpacity>
        </View>
        <DoctorModal />
        <EditContraceptiveModal
          visible={showContraceptiveModal}
          onClose={() => setShowContraceptiveModal(false)}
        />
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
  greeting: { fontSize: 18, fontWeight: "bold", color: "#333" },
  menuButton: { padding: 5 },
  content: { flex: 1 },
  tabContent: { flex: 1, padding: 20 },
  tabTitle: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 20 },
  section: { marginBottom: 25 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  sectionAction: { padding: 5 },
  sectionActionText: { fontSize: 14, color: "#4a6fa5", fontWeight: "600" },
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
    marginBottom: 10
  },
  doctorInfo: { flex: 1, justifyContent: "center" },
  doctorName: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 4 },
  doctorSpecialty: { fontSize: 14, color: "#4a6fa5", marginBottom: 2 },
  doctorHospital: { fontSize: 14, color: "#666" },
  cycleCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  cycleIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(74, 111, 165, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 15
  },
  cycleIndicatorInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(74, 111, 165, 0.3)",
    justifyContent: "center",
    alignItems: "center"
  },
  cycleDay: { fontSize: 24, fontWeight: "bold", color: "#4a6fa5" },
  cycleInfo: { alignItems: "center" },
  cycleInfoTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 4 },
  cycleInfoSubtitle: { fontSize: 14, color: "#4a6fa5", marginBottom: 15 },
  cycleDetails: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  cycleDetailItem: { flex: 1, alignItems: "center" },
  cycleDetailLabel: { fontSize: 12, color: "#666", marginBottom: 4 },
  cycleDetailValue: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 2 },
  cycleDetailSubvalue: { fontSize: 12, color: "#666" },
  contraceptiveCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  contraceptiveHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  contraceptiveInfo: { marginLeft: 15 },
  contraceptiveMethod: { fontSize: 16, fontWeight: "bold", color: "#333" },
  contraceptiveBrand: { fontSize: 14, color: "#666" },
  contraceptiveDetails: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  contraceptiveDetailItem: { flex: 1 },
  contraceptiveDetailLabel: { fontSize: 12, color: "#666", marginBottom: 4 },
  contraceptiveDetailValue: { fontSize: 16, fontWeight: "bold", color: "#333" },
  reminderButton: {
    backgroundColor: "#f0f7ff",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginVertical: 5
  },
  button: {
    backgroundColor: themeColor,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 20
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  singleRecipeButton: {
    backgroundColor: "#f0f7ff",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginVertical: 5
  },
  singleRecipeButtonText: { color: "#4a6fa5", fontSize: 14, fontWeight: "600" },
  recurringRecipeButton: {
    backgroundColor: "#f0f7ff",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginVertical: 5
  },
  recurringRecipeButtonText: { color: "#4a6fa5", fontSize: 14, fontWeight: "600" },
  recurringRecipeActiveButton: { backgroundColor: "#4a6fa5" },
  recurringRecipeActiveText: { color: "#fff" },
  recipeButtonsContainer: { marginTop: 10 },
  recipeDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center"
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 10
  },
  tabButton: { flex: 1, alignItems: "center", paddingVertical: 8 },
  tabButtonActive: { borderTopWidth: 2, borderTopColor: "#4a6fa5" },
  tabButtonText: { fontSize: 12, color: "#666", marginTop: 4 },
  tabButtonTextActive: { color: "#4a6fa5", fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    padding: 20
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  modalTitle: { fontSize: 24, fontWeight: "bold", color: "#333" },
  closeButton: { fontSize: 24, color: "#666" },
  // Estilos para el DropDownPicker en el modal
  modalContentContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: themeColor,
    padding: 20,
    maxHeight: 300
  },
  dropDownContainer: {
    marginTop: 5,
    borderColor: "#e0e0e0"
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 15
  },
  tipoRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: themeColor,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15
  },
  tipoButton: {
    flex: 1,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  tipoButtonSelected: { backgroundColor: themeColor },
  tipoButtonText: { fontSize: 16, fontWeight: "bold", color: themeColor },
  tipoButtonTextSelected: { color: "#fff" }
})
