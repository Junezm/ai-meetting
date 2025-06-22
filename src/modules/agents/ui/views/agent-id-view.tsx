"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";

interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const trpc = useTRPC();
  const { data: agent } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId }),
  );

  return (
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
      <AgentIdViewHeader
        agentId={agentId}
        agentName={agent.name}
        onEdit={() => {}}
        onRemove={() => {}}
      />
      <div className="bg-white rounded-lg border">
        <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
          <div className="flex items-center gap-x-3">
            <GeneratedAvatar 
              variants="botttsNeutral"
              seed={agent.name}
              className="size-10"
            />
            <h2 className="text-2xl font-medium">{agent.name}</h2>
          </div>
          <Badge
              variant="outline"
              className="flex items-center gap-x-2 [&>svg]:size-4"
            >
              <VideoIcon className="text-blue-700" />
              {agent.meetingCount} {agent.meetingCount === 1 ? "Meeting" : "Meetings"}
            </Badge>
            <div className="flex flex-col gap-y-4">
              <p className="text-sm font-medium">Instructions</p>
              <p className="text-sm text-neutral-800">{agent.instructions}</p>
            </div>
        </div> 
      </div>
    </div>
  );
}

export const AgentIdViewLoading = () => {
  return <LoadingState title="Loading Agents" description="This many take few seconds" />;
}

export const AgentsIdViewError = () => {
 return <ErrorState title="Failed to load agents" description="Please try again later" />;
}