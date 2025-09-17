import { useTheme } from "next-themes"
import { Toaster as SonnerToaster } from "sonner"

const Toaster = (props: React.ComponentProps<typeof SonnerToaster>) => {
  const { theme = "system" } = useTheme()

  return (
    <SonnerToaster
      theme={theme as "light" | "dark" | "system"}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }

