"use client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";


export const AgentsView = () => {
  const trpc = useTRPC();
  const { data, isLoading, isError } = useSuspenseQuery(trpc.agents.getMany.queryOptions());


  console.log(data)
  // if (isLoading) {
  //   return <LoadingState title="Loading Agents" description="This many take few seconds" />
  // }

  // if (isError) {
  //   return <ErrorState title="Failed to load agents" description="Please try again later" />
  // }

  return (
    <div>
      <h1>{ JSON.stringify(data) }</h1>
    </div>
  )
}

export const AgentsViewLoading = () => {
  return <LoadingState title="Loading Agents" description="This many take few seconds" />;
}

export const AgentsViewError = () => {
 return <ErrorState title="Failed to load agents" description="Please try again later" />;
}