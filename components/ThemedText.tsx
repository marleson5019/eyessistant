import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useFontSize } from './FontSizeContext';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const { fontScale } = useFontSize();

  // Scale the default style values by fontScale, but do not override explicit fontSize passed via style prop
  const scaledDefaults: any = {
    default: { ...styles.default, fontSize: (styles.default.fontSize as number) * fontScale, lineHeight: (styles.default.lineHeight as number) * fontScale },
    defaultSemiBold: { ...styles.defaultSemiBold, fontSize: (styles.defaultSemiBold.fontSize as number) * fontScale, lineHeight: (styles.defaultSemiBold.lineHeight as number) * fontScale },
    title: { ...styles.title, fontSize: (styles.title.fontSize as number) * fontScale, lineHeight: (styles.title.lineHeight as number) * fontScale },
    subtitle: { ...styles.subtitle, fontSize: (styles.subtitle.fontSize as number) * fontScale },
    link: { ...styles.link, fontSize: (styles.link.fontSize as number) * fontScale, lineHeight: (styles.link.lineHeight as number) * fontScale },
  };

  return (
    <Text
      style={[
        { color },
        // use scaled defaults so ThemedText respects accessibility font scaling
        type === 'default' ? scaledDefaults.default : undefined,
        type === 'title' ? scaledDefaults.title : undefined,
        type === 'defaultSemiBold' ? scaledDefaults.defaultSemiBold : undefined,
        type === 'subtitle' ? scaledDefaults.subtitle : undefined,
        type === 'link' ? scaledDefaults.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
