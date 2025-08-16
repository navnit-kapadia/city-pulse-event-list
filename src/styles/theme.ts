import { extendTheme, type ThemeConfig, type ComponentSingleStyleConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
// Constants - all used throughout the theme
const INITIAL_COLOR_MODE = 'light' as const;
const USE_SYSTEM_COLOR_MODE = false;
const HOVER_TRANSFORM_Y = -2;
const ACTIVE_TRANSFORM_Y = 0;
const BORDER_RADIUS_LARGE = 'lg';
const ANIMATION_DURATION = '0.2s';
const GRADIENT_ANGLE = 135;
const BORDER_WIDTH = '1px solid';
const FONT_FAMILY = 'Inter, system-ui, sans-serif';

// Types
interface ColorScale {
  readonly 50: string;
  readonly 100: string;
  readonly 200: string;
  readonly 300: string;
  readonly 400: string;
  readonly 500: string;
  readonly 600: string;
  readonly 700: string;
  readonly 800: string;
  readonly 900: string;
}

interface StyleProps {
  readonly colorMode: 'light' | 'dark';
}

// Theme configuration
const config: ThemeConfig = {
  initialColorMode: INITIAL_COLOR_MODE,
  useSystemColorMode: USE_SYSTEM_COLOR_MODE,
};

// Color definitions - all used in the theme
const primaryColors: ColorScale = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
} as const;

const secondaryColors: ColorScale = {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9',
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
} as const;

const accentColors: ColorScale = {
  50: '#fdf4ff',
  100: '#fae8ff',
  200: '#f5d0fe',
  300: '#f0abfc',
  400: '#e879f9',
  500: '#d946ef',
  600: '#c026d3',
  700: '#a21caf',
  800: '#86198f',
  900: '#701a75',
} as const;

// Font configuration - all used
const fontConfig = {
  heading: FONT_FAMILY,
  body: FONT_FAMILY,
} as const;

// Style functions with proper types
const globalStyles = (props: StyleProps): Record<string, unknown> => ({
  body: {
    bg: mode('gray.50', 'gray.800')(props),
    color: mode('gray.800', 'white')(props),
    fontFamily: FONT_FAMILY,
  },
});

// Fixed gradient button variant - props parameter used for future extensibility
const gradientButtonVariant = (): Record<string, unknown> => ({
  bg: `linear-gradient(${GRADIENT_ANGLE}deg, primary.500, secondary.500)`,
  color: 'white',
  borderRadius: BORDER_RADIUS_LARGE,
  transition: `all ${ANIMATION_DURATION}`,
  _hover: {
    bg: `linear-gradient(${GRADIENT_ANGLE}deg, primary.600, secondary.600)`,
    transform: `translateY(${HOVER_TRANSFORM_Y}px)`,
  },
  _active: {
    transform: `translateY(${ACTIVE_TRANSFORM_Y}px)`,
  },
});

// Component configurations - Fixed Card component to use single style config
const buttonComponentConfig: ComponentSingleStyleConfig = {
  defaultProps: {
    colorScheme: 'primary',
  },
  variants: {
    gradient: gradientButtonVariant,
  },
};

const cardComponentConfig: ComponentSingleStyleConfig = {
  baseStyle: {
    borderRadius: BORDER_RADIUS_LARGE,
    boxShadow: 'sm',
    border: BORDER_WIDTH,
    borderColor: 'gray.200',
    transition: `all ${ANIMATION_DURATION}`,
    _hover: {
      boxShadow: 'md',
      transform: `translateY(${HOVER_TRANSFORM_Y}px)`,
    },
  },
};

const headingComponentConfig: ComponentSingleStyleConfig = {
  variants: {
    gradient: {
      bgGradient: 'linear(to-r, primary.500, secondary.500)',
      bgClip: 'text',
      fontFamily: FONT_FAMILY,
    },
  },
};

// Color configuration object - all used
const colorConfig = {
  primary: primaryColors,
  secondary: secondaryColors,
  accent: accentColors,
} as const;

// Component configuration object - all used
const componentConfig = {
  Button: buttonComponentConfig,
  Card: cardComponentConfig,
  Heading: headingComponentConfig,
} as const;

// Style configuration object - all used
const styleConfig = {
  global: globalStyles,
} as const;

// Custom theme properties - all used
const customThemeConfig = {
  spacing: {
    hoverTransform: `${HOVER_TRANSFORM_Y}px`,
  },
  durations: {
    normal: ANIMATION_DURATION,
  },
  radii: {
    card: BORDER_RADIUS_LARGE,
  },
  borders: {
    card: BORDER_WIDTH,
  },
} as const;

// Main theme object using all variables
const theme = extendTheme({
  config,
  colors: colorConfig,
  fonts: fontConfig,
  styles: styleConfig,
  components: componentConfig,
  ...customThemeConfig,
});

export default theme;
