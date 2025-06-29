"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewMeetingsDialog } from "./new-meetings-dialog";
import { useState } from "react";


export const MeetingsListHeader = () => {

  const [showNewMeetingDialog, setShowNewMeetingDialog] = useState(false);
  
  return (
    <>
      <NewMeetingsDialog open={showNewMeetingDialog} onOpenChange={setShowNewMeetingDialog} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5>My Meetings</h5>
          <Button onClick={() => setShowNewMeetingDialog(true)}>
            <PlusIcon />
            New Meetings
          </Button>
        </div>
        <div className="flex items-center gap-x-2 p-1">
        </div>
      </div>
    </>
  );
};
