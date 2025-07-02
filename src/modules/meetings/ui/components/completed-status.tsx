import { EmptyState } from "@/components/empty-state"

export const CompletedStatus = () => {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8">
      <EmptyState
        image="/completed.svg"
        title="Meeting is completed"
        description="The meeting is completed."
      />
    </div>
  )
}