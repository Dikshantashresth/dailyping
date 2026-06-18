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
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          duration={3000}
          toastOptions={{
            style: {
              background: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              borderRadius: "8px",
              padding: "10px 14px",
              fontSize: "13px",
              fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)",
              alignItems: "center",
              gap: "8px",
            },
            classNames: {
              success: "border-l-[3px] border-l-[var(--success)]",
              error: "border-l-[3px] border-l-[var(--danger)]",
              warning: "border-l-[3px] border-l-[var(--warning)]",
              info: "border-l-[3px] border-l-[var(--color-blue)]",
            },
          }}
        />
      </ThemeProvider>
    </Provider>
  );
}
