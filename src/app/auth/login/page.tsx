import { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login - Agrikul",
  description: "Login to your Agrikul account",
};

export default function LoginPage() {
  return <LoginForm />;
} 