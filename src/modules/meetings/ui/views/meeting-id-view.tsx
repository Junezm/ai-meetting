"use client";


import { useTRPC } from "@/trpc/client";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { useConfirm } from "@/hooks/useConfirm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UpdateMeetingDialog } from "../components/update-meetings-dialog";

interface Props {
  meetingId: string;
}

export const MeetingIdView = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  // const [filters, setFilters] = useMeetingsFilters();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({
    id: meetingId,
  }))

  const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);

  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
        // todo redirect to meetings page
        router.push("/meetings");
      },
      onError: (err) => {
        console.error(err);
        toast.error("Failed to remove agent");
      }
    }),
  )

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure",
    `This will remove the meeting of ${data.name}`,
  );
  
  const handleRemoveMeeting = async () => {
    const ok = await confirmRemove();
    if (!ok) return;

    await removeMeeting.mutateAsync({ id: meetingId });
  };
  
  return (
    <>
      <RemoveConfirmation />
      <UpdateMeetingDialog
        open={updateMeetingDialogOpen}
        onOpenChange={setUpdateMeetingDialogOpen} initialValues={data}
      />
      <div className="flex-1 py-4 md:px-8 flex flex-col gap-y-4">
        <MeetingIdViewHeader
         meetingId={meetingId}
          meetingName={data.name}
          onEdit={() => setUpdateMeetingDialogOpen(true)}
          onRemove={handleRemoveMeeting}
        />
      </div>
    </>
  );
}


export const MeetingIdViewLoading = () => {
  return <LoadingState title="Loading Meeting" description="This many take few seconds" />;
}

export const MeetingIdViewError = () => {
  return <ErrorState title="Failed to load meeting" description="Please try again later" />;
}