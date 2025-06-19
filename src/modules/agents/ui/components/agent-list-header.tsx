"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agents-dialog";
import { useState } from "react";

export const AgentsListHeader = () => {
  const [showNewAgentDialog, setShowNewAgentDialog] = useState(false);
  return (
    <>
      <NewAgentDialog 
        open={showNewAgentDialog}
        onOpenChange={setShowNewAgentDialog}
      />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5>My Agents</h5>
          <Button onClick={() => setShowNewAgentDialog(true)}>
            <PlusIcon />
            New Agents
          </Button>
        </div>
      </div>
    </>
  );
};
