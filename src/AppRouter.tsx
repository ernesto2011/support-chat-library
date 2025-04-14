import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AuthLayout } from "@/auth/layout/AuthLayout";
import { LoginPage, RegisterPage } from "@/auth/pages";
import { sleep } from "./lib/sleep";
import { PrivateRoute } from "./auth/components/PrivateRoute";

const ChatLayout = lazy(async () => {
  await sleep(1500);
  return import("@/chat/layout/ChatLayout");
});
const ChatPage = lazy(() => import("@/chat/pages/ChatPage"));
const NoChatPage = lazy(() => import("@/chat/pages/NoChatPage"));
export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route
          path="/chat"
          element={
            <Suspense
              fallback={
                <div className="flex flex-col justify-center gap-2 items-center h-screen">
                  <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                  <p className="ml-4 text-2xl font-medium animate-pulse">
                    Loading...
                  </p>
                </div>
              }
            >
              <PrivateRoute isAuthenticated={false}>
                <ChatLayout />
              </PrivateRoute>
            </Suspense>
          }
        >
         <Route index element={<NoChatPage />} />
          <Route path=":chatId" element={<ChatPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
};
