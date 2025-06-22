"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agents-dialog";
import { useState } from "react";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { AgentsSearchFilter } from "./agents-search-filter";
import { DEFAULT_PAGE } from "@/constants";

export const AgentsListHeader = () => {
  const [filters, setFilters] = useAgentsFilters();
  const [showNewAgentDialog, setShowNewAgentDialog] = useState(false);
  
  const isAnyFilterModified = !!filters.search;
  const onClearFilters = () => setFilters({ search: "", page: DEFAULT_PAGE });
  
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
        <div className="flex items-center gap-x-2 p-1">
          <AgentsSearchFilter />
          {isAnyFilterModified && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              <XCircleIcon />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
