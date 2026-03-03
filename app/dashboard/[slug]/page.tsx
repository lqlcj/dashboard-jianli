import { notFound } from "next/navigation";

export const runtime = "edge";

import {
  HelpPageContent,
  PersonnelManagementPageContent,
  SearchPageContent,
  SettingsPageContent,
  TeamMembersReadOnlyPageContent,
} from "@/components/dashboard-subroute-pages";
import { CommandCenterPage } from "@/components/command-center";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dashboardPageConfigs } from "@/lib/dashboard-pages";

export default async function DashboardSubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = dashboardPageConfigs[slug];

  if (!config) {
    notFound();
  }

  if (slug === "project-management") {
    return <PersonnelManagementPageContent />;
  }

  if (slug === "team-members") {
    return <TeamMembersReadOnlyPageContent />;
  }

  if (slug === "command-center") {
    return <CommandCenterPage />;
  }

  if (slug === "settings") {
    return <SettingsPageContent />;
  }

  if (slug === "help") {
    return <HelpPageContent />;
  }

  if (slug === "search") {
    return <SearchPageContent />;
  }

  return (
    <div className="px-4 py-4 md:px-6 md:py-6">
      <Card>
        <CardHeader>
          <CardTitle>{config.title}</CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {config.highlights.map((item) => (
            <div
              key={item}
              className="rounded-lg border bg-muted/20 px-4 py-3 text-sm"
            >
              {item}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
