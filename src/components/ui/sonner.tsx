"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "#1f2937", // Tailwind's gray-800
          "--normal-text": "#ffffff", // White
          "--normal-border": "#374151", // Tailwind's gray-700 (optional)
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
