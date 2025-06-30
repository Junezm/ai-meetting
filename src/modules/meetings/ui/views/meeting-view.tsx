"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "@/components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";

export const MeetingView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}))
console.log(data);

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex-col gap-y-4">
      <DataTable
        data={data.items}
        columns={columns}
      ></DataTable>
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first meeting"
          description="Schedule your first meeting with your agents."
        />
      )}
    </div>
  )
}


export const MeetingsViewLoading = () => {
  return <LoadingState title="Loading Agents" description="This many take few seconds" />;
}

export const MeetingsViewError = () => {
  return <ErrorState title="Failed to load agents" description="Please try again later" />;
}