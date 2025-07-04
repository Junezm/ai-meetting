import { useTRPC } from "@/trpc/client";
import { MeetingGetOne } from "../../types";
// import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { meetingsInsertSchema } from "../../schema";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import CommandSelect from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agents-dialog";

interface MeetingFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

export const MeetingForm = ({ onCancel, onSuccess, initialValues }: MeetingFormProps) => {

  const trpc = useTRPC();
  // const router = useRouter();
  const queryClient = useQueryClient();

  const [openAgentDialog, setOpenAgentDialog] = useState(false);
  const [agentSearch, setAgentSearch] = useState('');
  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    }),
  );

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );

        onSuccess?.(data.id);
      },
      onError: (error) => {
        console.log(error);
        toast.error(error.message);

        // todo check if error code is forbidden
      },
    })
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({
              id: initialValues.id,

            }),
          );
        }
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);

        // todo check if error code is forbidden
      },
    })
  )

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? '',
    }, 
  })

  const isEdit = !!initialValues?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
    if (isEdit) {
      console.log(values);
      updateMeeting.mutateAsync({
        id: initialValues!.id,
        ...values,
      })
    } else {
      createMeeting.mutateAsync(values);
    }
  };

  return (
    <>
      <NewAgentDialog open={openAgentDialog} onOpenChange={setOpenAgentDialog} />
      <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Math consultations" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        >
        </FormField>
        <FormField
          name="agentId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent</FormLabel>
              <FormControl>
                <CommandSelect
                  options={(agents.data?.items?? []).map((agent) => ({
                    id: agent.id,
                    value: agent.name,
                    children: (
                      <div className="flex items-center gap-x-2">
                        <GeneratedAvatar seed={agent.name} variants="botttsNeutral" className="border size-6"/>
                        {agent.name}
                      </div>
                    ),
                  }))}
                  onSelect={field.onChange}
                  onSearch={setAgentSearch}
                  value={field.value}
                  placeholder="Select an agent"
                />
              </FormControl>
              <FormDescription>
                Not Found what you are looking for?
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:underline"
                  onClick={() => setOpenAgentDialog(true)}
                >
                  Create new agent
                </Button>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        >
        </FormField>
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button 
              variant="ghost"
              disabled={isPending}
              type="button"
              onClick={() => onCancel()}
            >
              Cancel
            </Button>
          )}
           <Button 
              disabled={isPending}
              type="submit"
            >
              { isEdit ? "Update" : "Create" }
            </Button>
        </div>
      </form>
    </Form>
    </>
  );
}