"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import humanizeDuration from "humanize-duration"
import { MeetingGetMany } from "../../types"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { 
  CircleCheckIcon,
  CircleXIcon,
  CircleArrowUpIcon,
  ClockFadingIcon,
  CornerDownRightIcon,
  LoaderIcon,
 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"


function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1000, {
    largest: 2,
    round: true,
    units: ['h', 'm', 's'],
  })
}

const statusIconMap = {
  upcoming: CircleArrowUpIcon,
  progressing: ClockFadingIcon,
  completed: CircleCheckIcon,
  cancelled: CircleXIcon,
  active: LoaderIcon,
}

const statusColorMap = {
  upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
  active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
  completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
  cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
  progressing: "bg-gray-500/20 text-gray-800 border-gray-800/5",
}
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: ({ row }) => {

      return (
        <div className="flex flex-col gap-y-1">
          <span>{row.original.name}</span>
          <div className="flex items-center gap-x-2">
            <div className="flex items-center gap-x-2">
              <CornerDownRightIcon className="size-3 text-muted-foreground" />
              <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
                {row.original.agent?.name}
              </span>
            </div>
            <GeneratedAvatar
              seed={row.original.agent?.name}
              variants="botttsNeutral"
              className="size-4"
            />
            <span>{row.original.startedAt ? format(row.original.startedAt, 'MMM d') : ''}</span>
          </div>
        </div>
      ); 
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const Icon = statusIconMap[row.original.status as keyof typeof statusIconMap];
      return (
        <Badge variant="outline" className={
          cn(
            "capitalize [&>svg]:size-4 text-muted-foreground",
            statusColorMap[row.original.status as keyof typeof statusColorMap]
          )
        }>
          <Icon className={cn(
            row.original.status === "processing" && "animate-spin"
          )} />
          { row.original.status }
        </Badge>
      );
    }
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      return (
        <Badge
          variant="outline"
          className={cn(
            "capitalize [&>svg]:size-4 flex items-center gap-x-2",
            statusColorMap[row.original.status as keyof typeof statusColorMap]
          )}
        >
          <ClockFadingIcon className="text-blue-700" />
          { row.original.duration ? formatDuration(row.original.duration) : 'No duration' }
        </Badge>
      );
    }
  }
]