import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EnquiriesTable from "@/components/dashboard/EnquiriesTable";

export default function Dashboard() {
  return (
    <div>
      <DashboardHeader />
      <main className="min-h-screen bg-white p-8">
        {/* <EnquiriesTable /> */}
      </main>
    </div>
  );
}

