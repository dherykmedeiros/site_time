import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import CentralCalendarView from "@/components/calendar/CentralCalendarView";

export default async function CalendarPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return <CentralCalendarView />;
}
