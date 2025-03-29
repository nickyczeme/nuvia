"use client"

import React, { useState } from "react"
import { TouchableOpacity, Animated, StyleSheet, type ViewStyle } from "react-native"

interface SwitchProps {
  value: boolean
  onValueChange: (value: boolean) => void
  disabled?: boolean
  activeColor?: string
  inactiveColor?: string
  style?: ViewStyle
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  activeColor = "#4a6fa5",
  inactiveColor = "#e0e0e0",
  style,
}) => {
  const [toggleAnimation] = useState(new Animated.Value(value ? 1 : 0))

  React.useEffect(() => {
    Animated.timing(toggleAnimation, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }, [value, toggleAnimation])

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value)
    }
  }

  const backgroundColor = toggleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  })

  const translateX = toggleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  })

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled}
      style={[styles.container, { opacity: disabled ? 0.5 : 1 }, style]}
    >
      <Animated.View style={[styles.track, { backgroundColor }]}>
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  track: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
})

