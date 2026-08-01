import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import ReportsHub from "@/components/reports/ReportsHub";

export default async function ReportsPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <ReportsHub />;
}
