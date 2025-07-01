"use client";
import { useState } from "react";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import CommandSelect from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";


export const AgentIdFilter = () => {
  const [filters, setFilters] = useMeetingsFilters();

  const trpc = useTRPC();
  const [agentSearch, setAgentSearch] = useState("");

  const { data } = useQuery(
    trpc.agents.getMany.queryOptions({
      page: 100,
      search: agentSearch,
    }),
  );

  return (
    <CommandSelect
      options={(data?.items ?? []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
          <div className="flex items-center gap-x-2">
            <GeneratedAvatar 
              seed={agent.name}
              variants="botttsNeutral"
              className="size-4"
            />
            {agent.name}
          </div>
        )
      }))}
      onSelect={value => setFilters({ agentId: value })}
      onSearch={setAgentSearch}
      placeholder={"agent"} 
      value={filters.agentId ?? ""}
    />
  )
}