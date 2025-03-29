import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: '#4a6fa5', color: 'white' };
      case 'secondary':
        return { backgroundColor: '#f0f7ff', color: '#4a6fa5' };
      case 'success':
        return { backgroundColor: '#4CAF50', color: 'white' };
      case 'danger':
        return { backgroundColor: '#F44336', color: 'white' };
      case 'warning':
        return { backgroundColor: '#FFC107', color: '#333' };
      case 'info':
        return { backgroundColor: '#2196F3', color: 'white' };
      default:
        return { backgroundColor: '#4a6fa5', color: 'white' };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 2, paddingHorizontal: 6, fontSize: 10 };
      case 'md':
        return { paddingVertical: 4, paddingHorizontal: 8, fontSize: 12 };
      case 'lg':
        return { paddingVertical: 6, paddingHorizontal: 10, fontSize: 14 };
      default:
        return { paddingVertical: 4, paddingHorizontal: 8, fontSize: 12 };
    }
  };

  const { backgroundColor, color } = getVariantStyle();
  const { paddingVertical, paddingHorizontal, fontSize } = getSizeStyle();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor, paddingVertical, paddingHorizontal },
        style,
      ]}
    >
      <Text style={[styles.text, { color, fontSize }, textStyle]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: 'bold',
  },
});