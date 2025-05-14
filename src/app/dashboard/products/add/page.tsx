import { Metadata } from "next";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProductForm from "@/components/products/ProductForm";

export const metadata: Metadata = {
  title: "Add Product - Agrikul",
  description: "Add a new product to your inventory",
};

export default async function AddProductPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/products/add");
  }
  
  // Only farmers can add products
  if (session.user.userType !== "farmer") {
    redirect("/dashboard");
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <ProductForm />
    </div>
  );
} 