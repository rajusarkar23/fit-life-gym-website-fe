"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAdminStore } from "@/store/admin-store";

export default function ChartOverView({ authCookie }: { authCookie: string }) {
  const { fetchMembers } = useAdminStore();

  React.useEffect(() => {
    const fetchMember = async () => {
      await fetchMembers({ authCookie });
    };
    fetchMember();
  }, []);
  const premium = useAdminStore
    .getState()
    .members.filter((member) => member.selectedPlan === "premium");
  const elite = useAdminStore
    .getState()
    .members.filter((member) => member.selectedPlan === "elite");
  const basic = useAdminStore
    .getState()
    .members.filter((member) => member.selectedPlan === "basic");

  const chartData = [
    {
      member: "Premium",
      memberCount: premium.length,
      fill: "var(--color-premium)",
    },
    { member: "Elite", memberCount: elite.length, fill: "var(--color-elite)" },
    { member: "Basic", memberCount: basic.length, fill: "var(--color-basic)" },
  ];

  const chartConfig = {
    Members: {
      label: "Members",
    },
    premium: {
      label: "Premium",
      color: "hsl(var(--chart-1))",
    },
    elite: {
      label: "Elite",
      color: "hsl(var(--chart-2))",
    },
    basic: {
      label: "Basic",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <div>
      <Card className="max-w-2xl">
        <CardHeader className="flex justify-center items-center">
          <CardTitle>Pie Chart - Members according to plans</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <ChartContainer config={chartConfig} className="max-h-[250px]">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="memberCount"
                nameKey="member"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {premium.length + elite.length + basic.length}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Member
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-[hsl(var(--chart-1))] w-3.5 h-3.5"></div>{" "}
            Premium: {premium.length}
            <div className="rounded-full bg-[hsl(var(--chart-2))] w-3.5 h-3.5"></div>{" "}
            Elite: {elite.length}
            <div className="rounded-full bg-[hsl(var(--chart-3))] w-3.5 h-3.5"></div>{" "}
            Basic: {basic.length}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
