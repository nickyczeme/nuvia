"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { TextInput } from "react-native-gesture-handler"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import Constants from "expo-constants"
import AsyncStorage from "@react-native-async-storage/async-storage"
import DropDownPicker from "react-native-dropdown-picker"

const API_URL = Constants.expoConfig?.extra?.apiUrl || "http://localhost:8000"

export default function SetupProfileScreen() {
  const [obraSocial, setObraSocial] = useState("")
  const [credencial, setCredencial] = useState("")
  const [startDate, setStartDate] = useState("")
  const [cajas, setCajas] = useState("")
  const [fechaNacimiento, setFechaNacimiento] = useState("")

  const [allAnticonceptivos, setAllAnticonceptivos] = useState<any[]>([])
  const [tipoOptions, setTipoOptions] = useState<string[]>([])

  // "selectedTipo" is simply the string value of the selected type.
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null)

  // For “marca” we still use a dropdown:
  const [marcaOptions, setMarcaOptions] = useState<{label: string; value: number | undefined}[]>([])
  const [selectedMarca, setSelectedMarca] = useState<number | null>(null)
  const [openMarca, setOpenMarca] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const fetchAnticonceptivos = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        console.log("Token for GET anticonceptivos:", token)

        const response = await axios.get(`${API_URL}/api/usuarios/anticonceptivos/`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = response.data
        console.log("Anticonceptivos recibidos:", data)
        setAllAnticonceptivos(data)

        const tiposUnicos = Array.from(new Set(data.map((a: any) => a.tipo)))
        setTipoOptions(tiposUnicos)
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
      setSelectedMarca(null) // Reset the marca if tipo changes
    } else {
      setMarcaOptions([])
      setSelectedMarca(null)
    }
  }, [selectedTipo, allAnticonceptivos])

  const handleSelectTipo = (tipo: string) => {
    setSelectedTipo(tipo)
  }

  const handleContinue = async () => {
    if (!fechaNacimiento || !startDate || !cajas) {
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
        sexo: "F",
        fecha_nacimiento: fechaNacimiento,
        anticonceptivo: selectedMarca || null,
      }

      console.log("Payload a enviar:", payload)
      console.log("Token para PATCH:", token)

      const response = await axios.patch(`${API_URL}/api/usuarios/update/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log("Respuesta del servidor:", response.data)
      router.push("/(patient)/choose_doctor")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error al guardar el perfil:", error.response?.data || error.message)
      } else {
        console.error("Error inesperado:", error)
      }
      Alert.alert("Error", "No se pudo guardar el perfil")
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            <Text style={styles.title}>Completa tu Perfil</Text>

            <Text style={styles.sectionTitle}>Información Personal</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Fecha de nacimiento</Text>
              <TextInput
                style={styles.input}
                placeholder="AAAA-MM-DD"
                value={fechaNacimiento}
                onChangeText={setFechaNacimiento}
              />
            </View>

            <Text style={styles.sectionTitle}>Agregá tu anticonceptivo</Text>
            {/* Horizontal "segmented control" for tipo */}
            <View style={styles.tipoRow}>
              {tipoOptions.map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  onPress={() => handleSelectTipo(tipo)}
                  style={[
                    styles.tipoButton,
                    selectedTipo === tipo && styles.tipoButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.tipoButtonText,
                      selectedTipo === tipo && styles.tipoButtonTextSelected,
                    ]}
                  >
                    {tipo}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Marca dropdown (depends on selected “tipo”) */}
            <View style={styles.inputContainer}>
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
                // Make the modal smaller and themed
                listMode="MODAL"
                modalProps={{
                  animationType: "fade",
                  transparent: true,
                }}
                modalContentContainerStyle={styles.modalContentContainer}
                dropDownContainerStyle={styles.dropDownContainer}
              />
            </View>

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
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

const themeColor = "#4a6fa5"

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
    color: themeColor,
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

  // ========== TIPO BUTTON STYLES ==========
  tipoRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: themeColor,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
  },
  tipoButton: {
    flex: 1,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  tipoButtonSelected: {
    backgroundColor: themeColor,
  },
  tipoButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: themeColor,
  },
  tipoButtonTextSelected: {
    color: "#fff",
  },

  // ========== DROPDOWN MODAL STYLES ==========
  // This container is the small, themed modal background:
  modalContentContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: themeColor,
    padding: 20,
    maxHeight: 300,
    // On iOS, if you'd like a "formSheet" style, you could do:
    // ...Platform.select({ ios: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3 } })
  },
  // If you want the dropdown's open list to be smaller when not in modal:
  dropDownContainer: {
    marginTop: 5,
    borderColor: "#e0e0e0",
  },

  // ========== BOTTOM BUTTON STYLES ==========
  button: {
    backgroundColor: themeColor,
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
