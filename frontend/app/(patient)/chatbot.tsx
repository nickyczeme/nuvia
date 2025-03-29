"use client"

import { useState, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { TextInput } from "react-native-gesture-handler"
import { ChevronLeft, Send } from "lucide-react-native"
import { GestureHandlerRootView } from 'react-native-gesture-handler'  // Import GestureHandlerRootView
export default function ChatbotScreen() {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hola, soy MediBot. Puedo responder tus preguntas sobre ciclo menstrual y anticonceptivos. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
    },
  ])
  const flatListRef = useRef(null)

  const handleSend = () => {
    if (message.trim() === "") return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
    }

    setMessages((prevMessages) => [...prevMessages, userMessage])
    setMessage("")

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(message),
        sender: "bot",
      }

      setMessages((prevMessages) => [...prevMessages, botResponse])
    }, 1000)
  }

  // Simple bot response logic - in a real app, this would be more sophisticated
  const getBotResponse = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase()

    if (lowerCaseMessage.includes("anticonceptivo") || lowerCaseMessage.includes("pastilla")) {
      return "Los anticonceptivos hormonales como las pastillas, parches o anillos funcionan principalmente evitando la ovulación. Es importante tomarlos regularmente según las indicaciones de tu médico."
    } else if (
      lowerCaseMessage.includes("ciclo") ||
      lowerCaseMessage.includes("periodo") ||
      lowerCaseMessage.includes("menstrua")
    ) {
      return "El ciclo menstrual promedio dura 28 días, pero puede variar entre 21 y 35 días. La menstruación suele durar de 3 a 7 días. Si notas cambios significativos en tu ciclo, es recomendable consultar con tu médico."
    } else if (lowerCaseMessage.includes("efecto") || lowerCaseMessage.includes("secundario")) {
      return "Los efectos secundarios comunes de los anticonceptivos pueden incluir náuseas, sensibilidad en los senos, dolores de cabeza y cambios de humor. La mayoría suelen disminuir después de unos meses de uso. Si persisten, consulta con tu médico."
    } else if (lowerCaseMessage.includes("olvid") || lowerCaseMessage.includes("olvidé")) {
      return "Si olvidaste tomar una pastilla, tómala tan pronto como lo recuerdes. Si han pasado más de 24 horas, sigue las instrucciones específicas del prospecto de tu anticonceptivo o consulta con tu médico. Puede ser necesario usar un método anticonceptivo adicional."
    } else {
      return "No estoy seguro de entender tu pregunta. ¿Podrías reformularla? Puedo ayudarte con información sobre ciclo menstrual, anticonceptivos y sus efectos."
    }
  }
  const renderMessage = ({ item }: { item: { sender: string; text: string; id: string } }) => (
    <View style={[
      { 
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        maxWidth: '80%',
        borderRadius: 10
      },
      item.sender === "user" ? {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
      } : {
        alignSelf: 'flex-start', 
        backgroundColor: '#E9ECEF',
      }
    ]}>
      <Text style={[
        {
          fontSize: 16,
          lineHeight: 20
        },
        item.sender === "user" ? {
          color: '#fff'
        } : {
          color: '#212529'
        }
      ]}>{item.text}</Text>
    </View>
  )
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>  {/* Wrap everything inside GestureHandlerRootView */}
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15, backgroundColor: "white", borderBottomWidth: 1, borderBottomColor: "#e0e0e0" }}>
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>MediBot</Text>
          <View style={{ width: 24 }} />
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 15, paddingBottom: 20 }}
          onContentSizeChange={() => {
            if (flatListRef.current) {
              (flatListRef.current as any).scrollToEnd({ animated: true });
            }
          }}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            backgroundColor: "white",
            borderTopWidth: 1,
            borderTopColor: "#e0e0e0"
          }}>
            <TextInput
              style={{
                flex: 1,
                padding: 10,
                backgroundColor: "#f8f9fa",
                borderRadius: 20,
                marginRight: 10
              }}
              placeholder="Escribe tu pregunta aquí..."
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity 
              style={{
                backgroundColor: '#4a6fa5',
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center'
              }} 
              onPress={handleSend}
            >
              <Send size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  messagesContainer: {
    padding: 15,
    paddingBottom: 20,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#4a6fa5",
    borderBottomRightRadius: 5,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderBottomLeftRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#4a6fa5",
    borderBottomRightRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  botMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "white", 
    borderBottomLeftRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#4a6fa5",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    alignSelf: "flex-end",
  },
})
