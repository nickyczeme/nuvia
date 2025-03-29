"use client"

import { useState, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { TextInput } from "react-native-gesture-handler"
import { ChevronLeft, Send } from "lucide-react-native"
import { GestureHandlerRootView } from 'react-native-gesture-handler';  // Import GestureHandlerRootView

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ChatbotScreen() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hola, soy MediBot. Puedo responder tus preguntas sobre ciclo menstrual y anticonceptivos. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
    },
  ]);
  const flatListRef = useRef(null);

  // El resto de tu código aquí
}


  const handleSend = async () => {
    if (message.trim() === "" || isLoading) return

    // Agrega mensaje del usuario
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
    }

    setMessages((prevMessages) => [...prevMessages, userMessage])
    setMessage("")
    setIsLoading(true)

    try {
      console.log('Intentando conectar a:', `${API_URL}/api/chat/`);
      const response = await fetch(`${API_URL}/api/chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json()

      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "No se obtuvo respuesta.",
        sender: "bot",
      }

      setMessages((prevMessages) => [...prevMessages, botResponse])
    } catch (error: any) {
      console.error('Error completo:', error);
      let errorMessage = "Ocurrió un error. Intenta nuevamente.";
      
      if (error.message.includes("Failed to fetch")) {
        errorMessage = "No se pudo conectar al servidor. Asegúrate de que el backend esté corriendo en el puerto 8000.";
      } else {
        errorMessage = error.message;
      }

      const errorResponse = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: "bot",
      }
      setMessages((prevMessages) => [...prevMessages, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const renderMessage = ({ item }: { item: { sender: string; text: string; id: string } }) => (
    <View style={[
      styles.messageContainer,
      item.sender === "user" ? styles.userMessage : styles.botMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.sender === "user" ? styles.userMessageText : styles.botMessageText
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
    lineHeight: 20,
  },
  userMessageText: {
    color: "#fff",
  },
  botMessageText: {
    color: "#212529",
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
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#4a6fa5',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4a6fa5',
  },
});
