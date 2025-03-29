import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, type ViewStyle } from "react-native"

interface SectionProps {
  title: string
  children: React.ReactNode
  actionText?: string
  onActionPress?: () => void
  style?: ViewStyle
}

export const Section: React.FC<SectionProps> = ({ title, children, actionText, onActionPress, style }) => {
  return (
    <View style={[styles.section, style]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {actionText && onActionPress && (
          <TouchableOpacity style={styles.sectionAction} onPress={onActionPress}>
            <Text style={styles.sectionActionText}>{actionText}</Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  sectionAction: {
    padding: 5,
  },
  sectionActionText: {
    fontSize: 14,
    color: "#4a6fa5",
    fontWeight: "600",
  },
})

