"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LockEntry } from "@/app/ts_types/HydroBase.types";

enum LockupPeriod {
  "1m" = "1m",
  "3m" = "3m",
  "6m" = "6m",
  "12m" = "12m",
}

const formSchema = z.object({
  lockupPeriod: z.nativeEnum(LockupPeriod),
  statom: z.string(),
  hatom: z.coerce.number().min(0),
});

type EditLockupDurationProps = {
  lockup: LockEntry;
  onEditLockup: (lockup: LockEntry) => void;
};

export const EditLockupDuration = ({
  lockup,
  onEditLockup,
}: EditLockupDurationProps) => {
  console.log("LOCKUP", lockup);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lockupPeriod: LockupPeriod["1m"],
      statom: (parseFloat(lockup.funds.amount) / 1000000).toFixed(2),
      hatom: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onEditLockup({ ...lockup, ...values });
  }

  return (
    <Dialog>
      <DialogTrigger className="flex w-[90px] h-[40px] justify-center items-center gap-2.5 text-[#080815] text-center text-xl not-italic font-medium leading-[21px] bg-white px-6 rounded-[10px]">
        Edit
      </DialogTrigger>
      <DialogContent className="bg-neutral-900 rounded-[10px] border-none w-[698px] p-12">
        <DialogHeader className="pb-[34px]">
          <DialogTitle className="text-[32px] not-italic font-bold leading-[120%] tracking-[-0.4px] mb-[10px]">
            Edit Lockup Duration
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-5 mt-5 [&>*:last-child]:mt-[30px]"
          >
            <FormField
              control={form.control}
              name="lockupPeriod"
              render={({ field }) => (
                <FormItem>
                  <div className="gap-[56px] flex justify-start items-center">
                    <FormLabel className="text-sm not-italic font-normal leading-[120%] opacity-60 w-[100px]">
                      New Lockup Time:
                    </FormLabel>
                    <FormControl>
                      <ToggleGroup
                        type="single"
                        className="gap-[10px]"
                        defaultValue={form.getValues("lockupPeriod")}
                      >
                        {Object.entries(LockupPeriod).map(([value, label]) => (
                          <ToggleGroupItem
                            key={value}
                            value={value}
                            className="text-[#080815] text-center text-base not-italic font-medium leading-[21px] inline-flex h-[30px] justify-center items-center gap-2.5 shrink-0 bg-[rgba(255,255,255,0.40)] px-4 py-0 rounded-[100px]"
                          >
                            {label}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-[56px]">
              <FormLabel className="text-sm not-italic font-normal leading-[120%] opacity-60 w-[100px]">
                stATOMs:
              </FormLabel>
              <p className="text-[#646464] text-xl not-italic font-medium leading-[21px]">
                {form.watch("statom")}
              </p>
            </div>

            <div className="flex items-center gap-[56px]">
              <FormLabel className="text-sm not-italic font-normal leading-[120%] opacity-60 w-[100px]">
                Updated Voting Power:
              </FormLabel>
              <p className="text-xl not-italic font-medium leading-[21px]">
                {form.watch("hatom")}
              </p>
            </div>

            <Button variant="secondary" type="submit">
              Confirm
            </Button>
          </form>
        </Form>
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full border rounded-[10px] border-solid border-white hover:bg-white hover:text-black"
          >
            Cancel
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
