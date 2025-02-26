import React from 'react';
import { Text, TextProps, TextStyle, useColorScheme } from 'react-native';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: string
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }
  return theme === 'light' ? '#000' : '#fff';
}

export interface ThemedTextProps extends TextProps {
  light?: string;
  dark?: string;
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label' | 'link';
}

const textStyles: Record<Required<ThemedTextProps>['type'], TextStyle> = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  h4: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  link: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    textDecorationLine: 'underline',
    color: '#0066cc',
  },
};

export function ThemedText(props: ThemedTextProps) {
  const { style, light, dark, type = 'body', ...otherProps } = props;
  const color = useThemeColor({ light, dark }, 'text');
  const baseStyle: TextStyle = type === 'link' ? {} : { color };
  const typeStyle = textStyles[type];

  return <Text style={[baseStyle, typeStyle, style]} {...otherProps} />;
}
