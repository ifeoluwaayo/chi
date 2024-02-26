"use client";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { chi } from "@/lib/chimoney";

export function Banks({
  bank,
  setBank,
}: {
  bank: {
    id: number;
    code: string;
    name: string;
  };
  setBank: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [open, setOpen] = useState(false);
  const [banks, setBanks] = useState<any[] | null>([]);

  useEffect(() => {
    async function getBanks() {
      const rawBanks = await chi(`/info/country-banks?countryCode=NG`, {});
      const banks = [
        { id: 0, code: "", name: "Chi Money Wallet" },
        ...rawBanks?.data,
      ];

      // console.log(banks);
      setBanks(banks);
    }

    getBanks();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between">
          {bank.name
            ? banks?.find((b) => b.code === bank.code)?.name
            : "Select Bank..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Banks..." className="h-9" />
          <CommandEmpty>No Banks found.</CommandEmpty>
          <CommandGroup>
            {banks?.map((b) => (
              <CommandItem
                key={b.code}
                value={b}
                onSelect={(currentValue) => {
                  setBank(currentValue === b.code ? {} : { ...b });
                  setOpen(false);
                }}>
                {b.name}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    bank.code === b.code ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
