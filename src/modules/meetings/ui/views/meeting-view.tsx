"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

export const MeetingView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}))

  return (
    <div>
        <h1>Meeting View</h1>
      {JSON.stringify(data, null, 2)}
    </div>
  )
}


export const MeetingsViewLoading = () => {
  return <LoadingState title="Loading Agents" description="This many take few seconds" />;
}

export const MeetingsViewError = () => {
  return <ErrorState title="Failed to load agents" description="Please try again later" />;
}