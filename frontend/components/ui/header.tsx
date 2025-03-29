import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Menu } from 'lucide-react-native';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  greeting?: string;
  onMenuPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showMenuButton = false,
  greeting,
  onMenuPress,
}) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {showBackButton ? (
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
      ) : greeting ? (
        <Text style={styles.greeting}>Hola, {greeting}</Text>
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}

      {!greeting && !showBackButton && <Text style={styles.title}>{title}</Text>}

      {showMenuButton && (
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <Menu size={24} color="#333" />
        </TouchableOpacity>
      )}

      {!showMenuButton && !greeting && <View style={{ width: 24 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  menuButton: {
    padding: 5,
  },
});
