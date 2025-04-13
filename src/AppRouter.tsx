import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AuthLayout } from "@/auth/layout/AuthLayout";
import { LoginPage, RegisterPage } from "@/auth/pages";
import ChatPage from "./chat/pages/ChatPage";
import { sleep } from "./lib/sleep";

const ChatLayout = lazy(async() => {
  await sleep(1000)
  return import('@/chat/layout/ChatLayout')
})
export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<LoginPage/>} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        
        <Route path="/chat" element={
          <Suspense fallback={<div>Loading...</div>}>
            <ChatLayout/>
          </Suspense>
        }>
          <Route index element={<ChatPage/>}/>
        </Route>
        <Route path="/" element={<Navigate to='/auth'/>}/>
        <Route path="*" element={<Navigate to='/auth'/>}/>
      </Routes>
    </BrowserRouter>
  );
};
