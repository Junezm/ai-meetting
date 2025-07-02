import { EmptyState } from "@/components/empty-state"

export const CancelledStatus = () => {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8">
      <EmptyState
        image="/cancelled.svg"
        title="Meeting is cancelled"
        description="The meeting is cancelled."
      />
    </div>
  )
}