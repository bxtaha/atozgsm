"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function SubjectFilter({ subjects, value, onChange }: {
  subjects: string[];
  value: string;
  onChange: (subject: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const select = (subject: string) => {
    onChange(subject);
    setOpen(false);
  };

  return (
    <div className="grid min-w-0 gap-1 text-sm">
      <span id="subject-label" className="font-semibold">Subject</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" aria-labelledby="subject-label subject-value" className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-left">
            <span id="subject-value" className="truncate">{value || "All subjects"}</span>
            <ChevronsUpDown aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] min-w-48 p-0">
          <Command label="Search subjects">
            <CommandInput autoFocus placeholder="Type a subject…" />
            <CommandList>
              <CommandEmpty>No matching subjects.</CommandEmpty>
              <CommandItem value="All subjects" onSelect={() => select("")}>All subjects</CommandItem>
              {subjects.map((subject) => (
                <CommandItem key={subject} value={subject} onSelect={() => select(subject)} className="justify-between gap-2">
                  {subject}
                  {subject === value && <Check aria-hidden="true" className="h-4 w-4 shrink-0" />}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
