import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { IconSymbol } from './IconSymbol';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useColorScheme } from 'react-native';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
}

export function Collapsible({ title, children }: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const theme = useColorScheme() ?? 'light';

  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(isOpen ? 'auto' : 0),
    opacity: withTiming(isOpen ? 1 : 0),
  }));

  return (
    <ThemedView>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <IconSymbol
            name={isOpen ? 'chevron.up' : 'chevron.down'}
            size={24}
            color={theme === 'dark' ? '#fff' : '#000'}
          />
        </View>
      </TouchableOpacity>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
});
