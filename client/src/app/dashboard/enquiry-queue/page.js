import QueueHeader from "@/components/QueueHeader";
import EnquiryQueueTable from "@/components/EnquiryQueueTable";

export const dynamic = "force-dynamic"; // always fetch fresh data

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
