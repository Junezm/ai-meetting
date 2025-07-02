import { EmptyState } from "@/components/empty-state"

export const ProcessingStatus = () => {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8">
      <EmptyState
        image="/processing.svg"
        title="Meeting is processing"
        description="The meeting is processing."
      />
    </div>
  )
}