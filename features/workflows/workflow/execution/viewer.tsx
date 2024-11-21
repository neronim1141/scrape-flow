"use client";

import {
  ExecutionLog,
  ExecutionPhase,
  executionPhaseStatusEnum,
  WorkflowExecution,
} from "@/features/database/schema";
import { useQuery } from "@tanstack/react-query";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { getExecution, getExecutionPhase } from "./get-execution.action";
import {
  CalendarIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  CircleXIcon,
  ClockIcon,
  CoinsIcon,
  Loader2Icon,
  LucideIcon,
  WorkflowIcon,
} from "lucide-react";
import { formatDistanceToNow, isBefore } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTimeDuration } from "@/lib/dates";
import { getPhasesTotalCost } from "@/lib/phases";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const ExecutionViewer: FC<{
  initialData: WorkflowExecution & {
    phases: (ExecutionPhase & { logs: ExecutionLog[] })[];
  };
}> = ({ initialData }) => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>();
  const [autoSelectedPhaseId, setAutoSelectedPhaseId] = useState<string>();
  const query = useQuery({
    queryKey: ["execution", initialData.id],
    queryFn: () => getExecution(initialData.id),
    initialData,
    refetchInterval: (q) => (q.state.data?.status === "RUNNING" ? 1000 : false),
  });
  useEffect(() => {
    if (!query.data) return;
    const lastRunning = query.data.phases.toSorted((a, b) =>
      a.completedAt! > b.completedAt! ? -1 : 1
    )[0];
    if (lastRunning) setAutoSelectedPhaseId(lastRunning.id);
  }, [query.data]);

  const duration = getTimeDuration(
    query.data?.completedAt,
    query.data?.startedAt
  );
  const totalCost = getPhasesTotalCost(query.data?.phases);
  const selectedId = selectedPhaseId ?? autoSelectedPhaseId;

  const selectedPhase = useMemo(() => {
    return query.data?.phases.find((p) => p.id === selectedId);
  }, [selectedId, query.data]);

  return (
    <div className="flex size-full">
      <aside className="w-[440px] min-w-[440px] max-w-[440px] border-r-2 flex flex-col overflow-hidden">
        <div className="py-4 px-2">
          <ExecutionLabel
            icon={CircleDashedIcon}
            label="Status"
            value={query.data?.status}
          />
          <ExecutionLabel
            icon={CalendarIcon}
            label="Started at"
            value={
              <span className="lowercase">
                {query.data?.startedAt
                  ? formatDistanceToNow(query.data.startedAt, {
                      addSuffix: true,
                    })
                  : "-"}
              </span>
            }
          />
          <ExecutionLabel
            icon={ClockIcon}
            label="Duration"
            value={
              duration ?? <Loader2Icon size={20} className="animate-spin" />
            }
          />
          <ExecutionLabel
            icon={CoinsIcon}
            label="Credits consumed"
            value={totalCost}
          />
        </div>
        <Separator />
        <div className="flex justify-center items-center py-2 px-4">
          <div className="text-muted-foreground flex items-center gap-2">
            <WorkflowIcon size={20} className="text-muted-foreground/80" />
            <span className="font-semibold">Phases</span>
          </div>
        </div>
        <Separator />
        <div className="overflow-auto h-full px-2 py-4">
          {query.data?.phases.map((phase, index) => (
            <Button
              key={phase.id}
              className="w-full justify-between"
              variant={selectedId === phase.id ? "secondary" : "ghost"}
              onClick={() => {
                setSelectedPhaseId(phase.id);
              }}
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline">{index + 1}</Badge>
                <p className="font-semibold">{phase.name}</p>
              </div>
              <StatusBadge status={phase.status} />
            </Button>
          ))}
        </div>
      </aside>
      <div className="flex size-full">
        <PhaseDetails phase={selectedPhase} />
      </div>
    </div>
  );
};

const StatusBadge: FC<{
  status: (typeof executionPhaseStatusEnum.enumValues)[number];
}> = ({ status }) => {
  switch (status) {
    case "CREATED":
      return <CircleXIcon size={20} className="text-destructive" />;
    case "RUNNING":
      return <Loader2Icon size={20} className="animate-spin text-yellow-500" />;

    case "COMPLETED":
      return <CircleCheckIcon size={20} className="text-primary" />;

    case "FAILED":
      return <CircleXIcon size={20} className="text-destructive" />;

    case "PENDING":
      return <CircleDashedIcon size={20} className="text-muted-foreground" />;
    default:
      return <div className="rounded-full">{status}</div>;
  }
};

const PhaseDetails: FC<{
  phase?: ExecutionPhase & { logs: ExecutionLog[] };
}> = ({ phase }) => {
  if (!phase)
    return (
      <div className="flex items-center flex-col gap-2 justify-center size-full">
        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">No phase selected</p>
          <p className="text-sm text-muted-foreground">
            Select a phase to view details
          </p>
        </div>
      </div>
    );
  if (phase.status === "RUNNING")
    return (
      <div className="flex items-center flex-col gap-2 justify-center size-full">
        <p className="font-bold">Phase is running, please wait</p>
      </div>
    );

  return (
    <div className="flex flex-col py-4 container gap-4 overflow-auto">
      <div className="flex gap-2 items-center">
        <Badge variant="outline" className="space-x-4">
          <div className="flex gap-1 items-center">
            <CoinsIcon size={18} className="text-muted-foreground" />
            <span>Credits</span>
          </div>
          <span>TODO</span>
        </Badge>
        <Badge variant="outline" className="space-x-4">
          <div className="flex gap-1 items-center">
            <ClockIcon size={18} className="text-muted-foreground" />
            <span>Duration</span>
          </div>
          <span>
            {getTimeDuration(phase.completedAt, phase.startedAt) ?? "-"}
          </span>
        </Badge>
      </div>
      <ParameterViewer
        title="Inputs"
        subtitle="Inputs used for this phase"
        params={phase.inputs}
      />
      <ParameterViewer
        title="Outputs"
        subtitle="Outputs generated by this phase"
        params={phase.outputs}
      />
      <LogViewer logs={phase.logs} />
    </div>
  );
};

const LogViewer: FC<{ logs: ExecutionLog[] }> = ({ logs }) => {
  if (logs.length === 0) return null;
  return (
    <Card>
      <CardHeader className="rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background">
        <CardTitle className="text-base">Logs</CardTitle>
        <CardDescription>Logs generated by this phase</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="text-muted-foreground text-sm">
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="text-muted-foreground">
                <TableCell
                  width={190}
                  className="text-sx text-muted-foreground p-[2px] pl-4"
                >
                  {log.timestamp.toISOString()}
                </TableCell>
                <TableCell
                  width={80}
                  className={cn("text-sx font-bold p-[3px] pl-4", {
                    "text-destructive": log.level === "ERROR",
                    "text-primary": log.level === "INFO",
                  })}
                >
                  {log.level}
                </TableCell>
                <TableCell className="text-sm flex-1 p-[3px] pl-4">
                  {log.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const ParameterViewer: FC<{
  title: string;
  subtitle: string;
  params: Record<string, string> | null;
}> = ({ title, subtitle, params }) => {
  return (
    <Card>
      <CardHeader className="rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <div className="flex flex-col gap-2">
          {(!params || Object.keys(params).length === 0) && (
            <p className="text-sm">No parameters generated by this phase</p>
          )}
          {params &&
            Object.entries(params).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground flex-1 basis-1/3">
                  {key}
                </p>
                <Input readOnly className="flex-1 basis-2/3" value={value} />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ExecutionLabel: FC<{
  icon: LucideIcon;
  label: ReactNode;
  value: ReactNode;
}> = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex justify-between items-center py-2 px-4 text-sm">
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon size={20} className="text-muted-foreground/80" />
        <span>{label}</span>
      </div>
      <div className="font-semibold capitalize flex gap-2 items-center">
        {value}
      </div>
    </div>
  );
};
