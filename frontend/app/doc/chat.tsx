import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { Appbar, Text, TextInput, Surface, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Llama al endpoint Django que integra DeepSeek
      const response = await fetch('http://localhost:8000/chatbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.text }),
      });
      
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      
      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || 'No se obtuvo respuesta.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: 'Ocurrió un error. Intenta nuevamente.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.assistantMessage,
      ]}
    >
      <Surface style={[
        styles.messageBubble,
        message.isUser ? styles.userBubble : styles.assistantBubble,
      ]}>
        <Text style={[
          styles.messageText,
          message.isUser ? styles.userMessageText : styles.assistantMessageText
        ]}>
          {message.text}
        </Text>
        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Surface>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Asistente Ginecológica" />
      </Appbar.Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(renderMessage)}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.loadingText}>Asistente escribiendo...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            value={inputText}
            onChangeText={setInputText}
            placeholder="Escribe tu consulta..."
            style={styles.input}
            multiline
            maxLength={500}
            right={
              <TextInput.Icon
                icon="send"
                onPress={handleSend}
                disabled={!inputText.trim() || isLoading}
              />
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C6C6C8',
    height: 44,
  },
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  userBubble: {
    backgroundColor: '#007AFF',
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  assistantMessageText: {
    color: '#000000',
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#C6C6C8',
  },
  input: {
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginTop: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#8E8E93',
  },
});
