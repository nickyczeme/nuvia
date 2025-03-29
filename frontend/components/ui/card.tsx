import type React from "react"
import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from "react-native"

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>
}

interface CardHeaderProps {
  children?: React.ReactNode
  title?: string
  subtitle?: string
  style?: ViewStyle
  titleStyle?: TextStyle
  subtitleStyle?: TextStyle
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  title,
  subtitle,
  style,
  titleStyle,
  subtitleStyle,
}) => {
  return (
    <View style={[styles.cardHeader, style]}>
      {title && <Text style={[styles.cardTitle, titleStyle]}>{title}</Text>}
      {subtitle && <Text style={[styles.cardSubtitle, subtitleStyle]}>{subtitle}</Text>}
      {children}
    </View>
  )
}

interface CardContentProps {
  children: React.ReactNode
  style?: ViewStyle
}

export const CardContent: React.FC<CardContentProps> = ({ children, style }) => {
  return <View style={[styles.cardContent, style]}>{children}</View>
}

interface CardFooterProps {
  children: React.ReactNode
  style?: ViewStyle
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, style }) => {
  return <View style={[styles.cardFooter, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 15,
    overflow: "hidden",
  },
  cardHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  cardContent: {
    padding: 15,
  },
  cardFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
})

