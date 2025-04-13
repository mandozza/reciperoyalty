"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

/**
 * Theme variables and color schemes
 * These are applied via CSS variables in globals.css
 */
export const themeConfig = {
  light: {
    background: "hsl(0 0% 100%)",
    foreground: "hsl(240 10% 3.9%)",
    primary: "hsl(240 5.9% 10%)",
    secondary: "hsl(240 4.8% 95.9%)",
    muted: "hsl(240 4.8% 95.9%)",
    accent: "hsl(240 4.8% 95.9%)",
    popover: "hsl(0 0% 100%)",
    border: "hsl(240 5.9% 90%)",
  },
  dark: {
    background: "hsl(240 10% 3.9%)",
    foreground: "hsl(0 0% 98%)",
    primary: "hsl(0 0% 98%)",
    secondary: "hsl(240 3.7% 15.9%)",
    muted: "hsl(240 3.7% 15.9%)",
    accent: "hsl(240 3.7% 15.9%)",
    popover: "hsl(240 10% 3.9%)",
    border: "hsl(240 3.7% 15.9%)",
  },
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
