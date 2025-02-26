import React from 'react';
import { View, ViewProps, useColorScheme } from 'react-native';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: 'background'
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }
  return theme === 'light' ? '#fff' : '#000';
}

export interface ThemedViewProps extends ViewProps {
  light?: string;
  dark?: string;
}

export function ThemedView(props: ThemedViewProps) {
  const { style, light, dark, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light, dark }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
