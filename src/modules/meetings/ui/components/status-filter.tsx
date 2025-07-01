import { CircleXIcon, LoaderIcon } from "lucide-react"
import { MeetingStatus } from "../../types"
import CommandSelect from "@/components/command-select";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

const options = [
  {
    id: MeetingStatus.Upcoming,
    value: MeetingStatus.Upcoming,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <LoaderIcon />
        {MeetingStatus.Upcoming}
      </div>
    )
  },
  {
    id: MeetingStatus.Completed,
    value: MeetingStatus.Completed,
    children: (
      <div className="flex items-center gap-x-2">
        <LoaderIcon />
        {MeetingStatus.Completed}
      </div>
    )
  },
  {
    id: MeetingStatus.Active,
    value: MeetingStatus.Active,
    children: (
      <div className="flex items-center gap-x-2">
        <LoaderIcon />
        {MeetingStatus.Active}
      </div>
    )
  },
  {
    id: MeetingStatus.Processing,
    value: MeetingStatus.Processing,
    children: (
      <div className="flex items-center gap-x-2">
        <LoaderIcon />
        {MeetingStatus.Processing}
      </div>
    )
  },
  {
    id: MeetingStatus.Cancelled,
    value: MeetingStatus.Cancelled,
    children: (
      <div className="flex items-center gap-x-2">
        <CircleXIcon />
        {MeetingStatus.Cancelled}
      </div>
    )
  }
]

const StatusFilter = () => {
  const [filters, setFilters] = useMeetingsFilters();

  return (
    <CommandSelect
      className="h-9"
      options={options} 
      onSelect={value => setFilters({ status: value as MeetingStatus })}
      value={filters.status ?? ""}
      placeholder={"status"}
    >

    </CommandSelect>
  )
}

export { StatusFilter }