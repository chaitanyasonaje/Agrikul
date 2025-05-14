import { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account - Agrikul",
  description: "Create a new Agrikul account",
};

export default function RegisterPage() {
  return <RegisterForm />;
} 