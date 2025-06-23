import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign'; // 👈 New import
// import { ComponentProps } from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

// Define your mapping of icon names
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'dish.fill': 'dining',
  'reel.fill': 'video-library',
  'person.fill': 'person',
  // 'caretdown' is intentionally omitted from MaterialIcons mapping
} as const;

type IconName = keyof typeof MAPPING | 'caretdown';

type IconSymbolProps = {
  name: IconName | 'chef.hat';
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: never;
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: IconSymbolProps) {
  // 👨‍🍳 Special case for chef icon (MaterialCommunityIcons)
  if (name === 'chef.hat') {
    return (
      <MaterialCommunityIcons
        name="chef-hat"
        size={size}
        color={color}
        style={style}
      />
    );
  }

  // ⬇️ Special case for caretdown (AntDesign)
  if (name === 'caretdown') {
    return (
      <AntDesign
        name="caretdown"
        size={size}
        color={color}
        style={style}
      />
    );
  }

  // Default to MaterialIcons for mapped names only
  if (name in MAPPING) {
    const materialIconName = MAPPING[name as keyof typeof MAPPING];
    return (
      <MaterialIcons
        name={materialIconName}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  // Should never reach here, but fallback to null
  return null;
}

// Optional: export allowed names
export type { IconName as IconSymbolName };
