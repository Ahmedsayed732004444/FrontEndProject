// src/app/App.tsx
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { ThemeProvider } from "@/shared/components/theme/ThemeProvider";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { ThemedToaster } from "@/shared/components/ThemedToaster";
import MainRouter from "./routes";

import { NotificationsProvider } from "@/features/notifications/context/NotificationsContext";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <NotificationsProvider>
              <MainRouter />
              <ThemedToaster />
            </NotificationsProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
