import QueueHeader from "@/components/QueueHeader";
import EnquiryQueueTable from "@/components/EnquiryQueueTable";

export const dynamic = "force-dynamic"; // render fresh each load

export default function EnquiryQueuePage() {
  return (
    <div className="min-h-screen bg-white">
      <QueueHeader />

      <main className="p-8">
        <EnquiryQueueTable />
      </main>
    </div>
  );
}
