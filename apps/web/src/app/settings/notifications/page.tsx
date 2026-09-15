"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { TelegramConnectCard } from "../../../features/notifications/components/TelegramConnectCard";
import { NotificationSettingsCard } from "../../../features/notifications/components/NotificationSettingsCard";
import { NotificationHistoryTable } from "../../../features/notifications/components/NotificationHistoryTable";

export default function NotificationSettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <PageHeader 
        title="Notification Settings" 
        description="Manage your Telegram integration and alert preferences."
        breadcrumbItems={[
          { label: "Settings" },
          { label: "Notifications" }
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <TelegramConnectCard />
          <NotificationSettingsCard />
        </div>
        <div>
          <NotificationHistoryTable />
        </div>
      </div>
    </div>
  );
}
