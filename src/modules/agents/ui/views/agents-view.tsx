"use client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";
import { EmptyState } from "@/components/empty-state";

export const AgentsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return (
    <div className="flex-1 pb-4 md:px-8 flex flex-col gap-y-4">
      <DataTable
        columns={columns}
        data={data}
      />
      {data.length === 0 && (
        <EmptyState
          title="No agents found"
          description="You can create one by clicking the button below."
        />
      )}
    </div>
  )
}

export const AgentsViewLoading = () => {
  return <LoadingState title="Loading Agents" description="This many take few seconds" />;
}

export const AgentsViewError = () => {
 return <ErrorState title="Failed to load agents" description="Please try again later" />;
}