"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { TextInput } from "react-native-gesture-handler"
import { Search } from "lucide-react-native"

export default function SelectDoctorScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // Mock data for doctors
  const doctors = [
    {
      id: "1",
      name: "Dra. Ana García",
      specialty: "Ginecología",
      hospital: "Hospital Central",
      rating: 4.8,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "2",
      name: "Dr. Carlos Rodríguez",
      specialty: "Ginecología y Obstetricia",
      hospital: "Clínica San Martín",
      rating: 4.6,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "3",
      name: "Dra. Laura Fernández",
      specialty: "Ginecología",
      hospital: "Centro Médico Norte",
      rating: 4.9,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "4",
      name: "Dr. Miguel Sánchez",
      specialty: "Ginecología y Obstetricia",
      hospital: "Hospital Universitario",
      rating: 4.7,
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectDoctor = (doctor: {
    id: string
    name: string
    specialty: string
    hospital: string
    rating: number
    image: string
  }) => {
    // In a real app, you would send a connection request to the doctor
    router.push("/(patient)/dashboard")
  }

  const renderDoctorItem = ({ item }: { item: { 
    id: string
    name: string 
    specialty: string
    hospital: string
    rating: number
    image: string
  }}) => (
    <TouchableOpacity style={styles.doctorCard} onPress={() => handleSelectDoctor(item)}>
      <Image source={{ uri: item.image }} style={styles.doctorImage} />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
        <Text style={styles.doctorHospital}>{item.hospital}</Text>
      </View>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{item.rating}</Text>
        <Text style={styles.ratingLabel}>★</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Selecciona tu Médico</Text>
        <Text style={styles.subtitle}>Elige un médico para conectarte y recibir atención personalizada</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, especialidad o centro médico"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredDoctors}
        renderItem={renderDoctorItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>No encuentras a tu médico? Puedes invitarlo a unirse a la plataforma.</Text>
        <TouchableOpacity style={styles.inviteButton}>
          <Text style={styles.inviteButtonText}>Invitar Médico</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
    marginLeft: 5,
  },
  searchInput: {
    flex: 1,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
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
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f7ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4a6fa5",
    marginRight: 2,
  },
  ratingLabel: {
    fontSize: 14,
    color: "#ffc107",
    fontWeight: "bold",
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