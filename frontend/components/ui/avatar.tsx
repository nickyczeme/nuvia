import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface AvatarProps {
  source?: { uri: string };
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
  shape = 'circle',
}) => {
  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const getSize = () => {
    switch (size) {
      case 'sm':
        return { width: 40, height: 40, fontSize: 14 };
      case 'md':
        return { width: 50, height: 50, fontSize: 18 };
      case 'lg':
        return { width: 60, height: 60, fontSize: 24 };
      default:
        return { width: 50, height: 50, fontSize: 18 };
    }
  };

  const { width, height, fontSize } = getSize();

  return (
    <View
      style={[
        styles.container,
        { width, height },
        shape === 'circle' ? styles.circle : styles.square,
      ]}
    >
      {source ? (
        <Image
          source={source}
          style={[
            { width, height },
            shape === 'circle' ? styles.circle : styles.square,
          ]}
        />
      ) : name ? (
        <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
      ) : (
        <View
          style={[
            { width, height },
            shape === 'circle' ? styles.circle : styles.square,
            styles.placeholder,
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
  },
  circle: {
    borderRadius: 100,
  },
  square: {
    borderRadius: 8,
  },
  initials: {
    color: '#4a6fa5',
    fontWeight: 'bold',
  },
  placeholder: {
    backgroundColor: '#f5f5f5',
  },
});
