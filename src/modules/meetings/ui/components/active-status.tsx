import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { VideoIcon } from "lucide-react"
import Link from "next/link"

interface Props {
  meetingId: string;
}

export const ActiveStatus = ({ meetingId }: Props) => {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8">
      <EmptyState
        image="/upcoming.svg"
        title="Meeting is active"
        description="The meeting is active."
      />
      <div className="flex flex-col-reverse lg:flex-row lg:justify-center gap-2 w-full">
        <Button asChild className="w-full lg:w-auto">
          <Link href={`/call/${meetingId}`}>          
            <VideoIcon />
            Join meeting
          </Link>
        </Button>
      </div>
    </div>
  )
}