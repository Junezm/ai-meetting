"use client";

import { ErrorState } from "@/components/error-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CallProvider } from "../components/call-provider";

interface CallViewProps {
  meetingId: string;
}

export const CallView = ({ meetingId }: CallViewProps) => {
  const trpc = useTRPC();
  const { data: meeting } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({
      id: meetingId,
    })
  )
  
  if (meeting.status === "completed") {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorState 
          title="Meeting is completed"
          description="The meeting is ended."
        />
      </div> 
    )
  }

  return (
    <div className="h-screen">
      <CallProvider meetingId={meetingId} meetingName={meeting.name}>
      </CallProvider>
    </div>
  )
}
