import { Toaster } from "sonner";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemedToaster = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Before mount, render a neutral Toaster to avoid hydration mismatch
  if (!mounted) {
    return <Toaster position="top-right" expand richColors closeButton />;
  }

  return (
    <Toaster
      position="top-right"
      expand
      richColors
      closeButton
      theme={resolvedTheme as "light" | "dark"}
    />
  );
};
