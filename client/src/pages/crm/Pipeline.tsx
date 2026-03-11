import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

const PIPELINE_STAGES = [
  { key: "Not Started", label: "Not Started", color: "bg-slate-400" },
  { key: "Visited", label: "Visited", color: "bg-blue-500" },
  { key: "Audit Run", label: "Audit Run", color: "bg-violet-500" },
  { key: "Proposal Sent", label: "Proposal Sent", color: "bg-amber-500" },
  { key: "Follow-Up 1", label: "Follow-Up 1", color: "bg-orange-400" },
  { key: "Follow-Up 2", label: "Follow-Up 2", color: "bg-orange-500" },
  { key: "Follow-Up 3", label: "Follow-Up 3", color: "bg-orange-600" },
  { key: "Meeting Set", label: "Meeting Set", color: "bg-green-500" },
  { key: "Contract Sent", label: "Contract Sent", color: "bg-teal-500" },
  { key: "Closed Won", label: "Closed Won", color: "bg-emerald-500" },
  { key: "On Hold", label: "On Hold", color: "bg-gray-400" },
  { key: "Closed Lost", label: "Closed Lost", color: "bg-red-500" },
];

export default function Pipeline() {
  const [, setLocation] = useLocation();
  const { data: allDealerships = [], isLoading } = trpc.dealerGrowth.dealership.list.useQuery({});

  const grouped = PIPELINE_STAGES.map(stage => ({
    ...stage,
    dealers: (allDealerships as any[]).filter(
      (d: any) => (d.visitStatus || "Not Started") === stage.key
    ),
  })).filter(stage => stage.dealers.length > 0 || ["Not Started", "Visited", "Proposal Sent", "Meeting Set", "Closed Won"].includes(stage.key));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-1">Track all dealerships by workflow stage</p>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 h-20" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {grouped.map(stage => (
              <Card key={stage.key} className="border-border/60">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                      {stage.label}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {stage.dealers.length} dealer{stage.dealers.length !== 1 ? "s" : ""}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4 px-4">
                  {stage.dealers.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No dealerships in this stage</p>
                  ) : (
                    <div className="grid gap-1">
                      {stage.dealers.map((d: any) => (
                        <div
                          key={d.id}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer transition-colors group"
                          onClick={() => setLocation(`/growth/dealership/${d.id}`)}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="text-sm truncate font-medium">{d.dealershipName}</span>
                            {d.areaBucket && (
                              <Badge variant="outline" className="text-[10px] shrink-0">{d.areaBucket}</Badge>
                            )}
                            {d.dayPlan && (
                              <span className="text-[10px] text-muted-foreground shrink-0">{d.dayPlan}</span>
                            )}
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
