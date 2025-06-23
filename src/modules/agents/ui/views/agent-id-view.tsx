"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { agents } from "@/db/schema";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";
import { useState } from "react";
import { UpdateAgentDialog } from "@/modules/agents/ui/components/update-agents-dialog";

interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);
  const { data: agent } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId }),
  );

  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
        // todo redirect to agents page
        router.push("/agents");
      },
      onError: (err) => {
        console.error(err);
        toast.error("Failed to remove agent");
      }
    }),
  )

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure",
    `This will remove the agent of ${agent.meetingCount} meetings associated with it`,
  );

  const handleRemoveAgent = async () => {
    const ok = await confirmRemove();
    if (!ok) return;

    await removeAgent.mutateAsync({ id: agentId });
  };

  return (
    <>
      <RemoveConfirmation />
      <UpdateAgentDialog open={updateAgentDialogOpen} onOpenChange={setUpdateAgentDialogOpen} initialValues={agent} />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <AgentIdViewHeader
          agentId={agentId}
          agentName={agent.name}
          onEdit={() => setUpdateAgentDialogOpen(true)}
          onRemove={handleRemoveAgent}
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
    </>
  );
}

export const AgentIdViewLoading = () => {
  return <LoadingState title="Loading Agents" description="This many take few seconds" />;
}

export const AgentsIdViewError = () => {
 return <ErrorState title="Failed to load agents" description="Please try again later" />;
}