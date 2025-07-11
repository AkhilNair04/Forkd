# Fork'd App Design Language

## 🎨 Color Palette

### Primary Colors

- **Primary Orange**: `#C67C4E` - Used for CTAs, active states, and accents
- **Secondary Orange**: `#D4A373` - Used in welcome screen and some buttons
- **Accent Orange**: `#f59e0b` - Used for cart buttons and some highlights

### Background Colors

- **Primary Background**: `#000` (Black) - Main app background
- **Secondary Background**: `#1a1a1a` - Cards, search bars, and secondary elements
- **Tertiary Background**: `#2c2c2c` - Tab bar background
- **Card Background**: `#ffffff` - White cards for content

### Text Colors

- **Primary Text**: `#fff` (White) - Main text on dark backgrounds
- **Secondary Text**: `#999` - Subdued text and placeholders
- **Tertiary Text**: `#ccc`, `#aaa` - Less prominent text
- **Dark Text**: `#1a1a1a` - Text on white backgrounds

## 📱 Typography System

### Text Variants (via ThemedText component)

- **Title**: 32px, bold, line-height 32px
- **Subtitle**: 20px, bold
- **Default**: 16px, line-height 24px
- **Default SemiBold**: 16px, line-height 24px, weight 600
- **Link**: 16px, line-height 30px, color `#0a7ea4`

### Common Font Sizes

- Large headings: 24px, 22px
- Section titles: 20px
- Body text: 16px, 14px
- Small text: 12px, 10px

## 🔲 Component Design Patterns

### Cards & Containers

- **Border Radius**: 12px-16px for cards, 15px-20px for larger containers
- **Padding**: 12px-20px standard padding
- **Shadows**: Subtle shadows with `shadowOpacity: 0.3`, `shadowRadius: 8`
- **Background**: White cards on dark backgrounds, dark cards on dark backgrounds

### Buttons

- **Primary Buttons**: Orange background (`#C67C4E`), white text, 10px-20px border radius
- **Secondary Buttons**: Dark background (`#1a1a1a`), white text
- **Icon Buttons**: Circular or rounded square, 32px-50px dimensions
- **Height**: 50px for standard buttons, 14px-16px padding

### Input Fields

- **Search Bars**: Dark background (`#1a1a1a`), 12px border radius, 50px height
- **Text Inputs**: White text on dark backgrounds, 16px font size
- **Placeholders**: `#999` color

## 🎯 Interactive Elements

### Icons

- **Icon Library**: Expo Vector Icons (Ionicons, MaterialCommunityIcons, Feather)
- **Icon Sizes**: 16px-28px (most common: 20px, 24px)
- **Icon Colors**: White for dark backgrounds, orange for accents

### Navigation

- **Tab Bar**: Dark background (`#2c2c2c`), rounded top corners (25px), 65px height
- **Active Tab Color**: `#C67C4E`
- **Inactive Tab Color**: `#fff`
- **Tab Icons**: 28px size

### Modals & Overlays

- **Filter Modal**: Orange background (`#C67C4E`), rounded top corners (20px)
- **Overlays**: `rgba(0, 0, 0, 0.6)` for modal backgrounds
- **Chips**: White borders, orange background when selected

## 📐 Layout & Spacing

### Grid System

- **2-Column Layout**: Used for dish/chef cards with `width: "48%"`
- **Horizontal Lists**: Featured content with 15px margins
- **Vertical Lists**: Standard list layouts

### Spacing

- **Container Padding**: 16px-20px horizontal padding
- **Section Margins**: 30px between major sections
- **Element Spacing**: 8px-16px between related elements
- **Card Margins**: 15px-16px between cards

### Responsive Design

- Uses `Dimensions.get('window')` for responsive sizing
- Font sizes scale with screen width: `Math.min(32, width * 0.08)`
- Flexible layouts with percentage-based widths

## 🌟 Visual Hierarchy

### Content Organization

- **Headers**: Large white text (24px, bold)
- **Section Titles**: 20px, bold, white
- **Body Content**: 16px, various gray shades
- **Metadata**: 12px-14px, lighter colors

### Visual Weight

- **Primary Actions**: Orange buttons with bold text
- **Secondary Actions**: Dark buttons or text links
- **Information**: Gray text with varying opacity
- **Highlights**: Orange accents for important information

## 🎨 Theme System

### Light/Dark Mode Support

- Uses `useColorScheme` hook for theme detection
- `ThemedText` and `ThemedView` components for theme-aware styling
- Color constants defined for both light and dark modes
- **Current Implementation**: Primarily dark theme focused

### Brand Consistency

- Consistent orange accent color throughout
- Unified border radius system
- Standardized spacing and typography
- Consistent icon usage and sizing

## 🔧 Design Tokens

### Border Radius

- Small: 10px-12px
- Medium: 15px-16px
- Large: 20px-25px
- Circular: 50% (for avatars and small buttons)

### Shadows

- Light: `shadowOpacity: 0.1`, `shadowRadius: 10`
- Medium: `shadowOpacity: 0.3`, `shadowRadius: 8`
- Heavy: `shadowOpacity: 0.25`, `shadowRadius: 3.84`

### Transitions

- Uses React Native's built-in animation system
- Modal animations with `animationType="slide"`
- Smooth state transitions for interactive elements

## 📋 Component Examples

### Search Bar

```typescript
const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
  },
});
```

### Primary Button

```typescript
const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: "#C67C4E",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
```

### Card Component

```typescript
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
```

## 🎯 Usage Guidelines

### When to Use Each Color

- **Primary Orange (`#C67C4E`)**: Call-to-action buttons, active states, important highlights
- **Secondary Orange (`#D4A373`)**: Welcome screens, secondary actions
- **Accent Orange (`#f59e0b`)**: Cart actions, special promotions
- **Dark Backgrounds**: Main app areas, cards, input fields
- **White Text**: Primary content on dark backgrounds
- **Gray Text**: Secondary information, metadata

### Typography Guidelines

- Use **Title** for main page headings
- Use **Subtitle** for section headers
- Use **Default** for body text
- Use **Default SemiBold** for emphasized text
- Use **Link** for clickable text elements

### Spacing Guidelines

- Always use consistent spacing multiples (8px, 16px, 24px, 32px)
- Maintain visual breathing room between sections
- Use smaller spacing for related elements
- Use larger spacing for major content divisions

This design system creates a cohesive, modern food delivery app experience with a strong emphasis on readability, usability, and visual hierarchy, using a dark theme with orange accents to create an engaging and appetizing interface.
