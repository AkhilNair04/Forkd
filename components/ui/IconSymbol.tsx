import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

// Define your mapping of SF Symbol names to Material Icons names
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  
  // Custom icons
  'chef.hat': 'restaurant',
  'dish.fill': 'dining',
  'reel.fill': 'movie',
  'person.fill': 'person',
} as const;

// Create types based on your mapping
type IconName = keyof typeof MAPPING;
type MaterialIconName = typeof MAPPING[IconName];

type IconSymbolProps = {
  name: IconName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: never; // Not supported in MaterialIcons
};

/**
 * An icon component that uses Material Icons as a fallback for SF Symbols.
 * Only supports the icons defined in the MAPPING object.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: IconSymbolProps) {
  const materialIconName = MAPPING[name];
  return (
    <MaterialIcons 
      name={materialIconName}
      size={size}
      color={color}
      style={style}
    />
  );
}

// Optional: Export the type of available icon names
export type { IconName as IconSymbolName };