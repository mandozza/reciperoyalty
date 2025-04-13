/**
 * Spacing scale in pixels (multiplied by 4)
 */
export const spacing = {
  0: "0",
  1: "0.25rem", // 4px
  2: "0.5rem",  // 8px
  3: "0.75rem", // 12px
  4: "1rem",    // 16px
  5: "1.25rem", // 20px
  6: "1.5rem",  // 24px
  8: "2rem",    // 32px
  10: "2.5rem", // 40px
  12: "3rem",   // 48px
  16: "4rem",   // 64px
  20: "5rem",   // 80px
  24: "6rem",   // 96px
  32: "8rem",   // 128px
} as const

/**
 * Breakpoints for responsive design
 */
export const breakpoints = {
  sm: "640px",   // Small devices (phones)
  md: "768px",   // Medium devices (tablets)
  lg: "1024px",  // Large devices (laptops)
  xl: "1280px",  // Extra large devices (desktops)
  "2xl": "1536px", // 2X large devices
} as const

/**
 * Container max widths at different breakpoints
 */
export const containers = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const

/**
 * Grid column configurations for different types of layouts
 */
export const gridConfigs = {
  cards: {
    default: 1,
    sm: 2,
    md: 3,
    lg: 4,
  },
  list: {
    default: 1,
    md: 2,
  },
  gallery: {
    default: 2,
    sm: 3,
    md: 4,
    lg: 6,
  },
} as const
