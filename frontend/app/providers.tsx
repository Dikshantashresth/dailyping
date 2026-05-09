"use client";

import { Provider } from "react-redux";

import { store } from "@/lib/store";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster position="bottom-right" richColors />
      </ThemeProvider>
    </Provider>
  );
}

