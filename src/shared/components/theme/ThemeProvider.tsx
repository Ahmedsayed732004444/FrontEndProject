import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ReactNode } from "react";
import type { ThemeProviderProps as NextThemesProviderProps } from "next-themes";

type ThemeProviderProps = {
  children: ReactNode;
} & Omit<NextThemesProviderProps, 'children'>;

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "light",
  enableSystem = false,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      storageKey="freeqy-theme"
    >
      {children}
    </NextThemesProvider>
  );
}

