import {
  ReactNode,
  useEffect,
  useRef, useState,
} from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { CommandEmpty, CommandInput, CommandItem, CommandList, CommandResponsiveDialog } from "@/components/ui/command";

interface Props {
  options: Array<{
    id: string;
    value: string;
    children: ReactNode;
  }>;
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
  value: string;
  placeholder: string;
  isSearchable?: boolean;
  className?: string;
}

export default function CommandSelect({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "Select an option",
  isSearchable = false,
  className,
}: Props) {

  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  const onClosed = (open: boolean) => {
    onSearch?.("");
    setOpen(open);
  }

  return (
    <>
      <Button
        type="button"
        variant={"outline"}
        className={cn(
          "h-9 justify-between font-normal px-2",
          !selectedOption && "text-muted-foreground",
          className
        )}
        onClick={() => setOpen(true)}
      >
        <div>
          {selectedOption?.children || placeholder}
        </div>
        <ChevronDownIcon
          className="h-4 w-4 opacity-50"
          aria-hidden="true"
        />
      </Button>
      <CommandResponsiveDialog
        shouldFilter={!onSearch}
        open={open}
        onOpenChange={onClosed}
      >
        <CommandInput placeholder="Search..." onValueChange={onSearch} />
        <CommandList>
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">No results found</span>
          </CommandEmpty>
          {options.map((option) => (
            <CommandItem
              key={option.id}
              onSelect={() => {
                onSelect(option.id);
                setOpen(false);
              }}
            >
              {option.children}
            </CommandItem>
          ))}
        </CommandList>
      </CommandResponsiveDialog>
    </>
  )
}
