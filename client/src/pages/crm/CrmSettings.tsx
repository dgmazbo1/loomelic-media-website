import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Settings, Mail, Calendar, Phone, FolderOpen, Send } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminSettings() {
  const { data: allSettings = [] } = trpc.dealerGrowth.settings.getAll.useQuery();
  const setSettingMutation = trpc.dealerGrowth.settings.set.useMutation({
    onSuccess: () => toast.success("Setting saved"),
  });

  const [calendarLink, setCalendarLink] = useState("");
  const [textingPhone, setTextingPhone] = useState("");
  const [emailProvider, setEmailProvider] = useState("");
  const [emailApiKey, setEmailApiKey] = useState("");
  const [emailFrom, setEmailFrom] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [driveFolderId, setDriveFolderId] = useState("");

  useEffect(() => {
    if (allSettings && (allSettings as any[]).length > 0) {
      const map = Object.fromEntries((allSettings as any[]).map((s: any) => [s.settingKey, s.settingValue]));
      setCalendarLink(map.calendar_link || "");
      setTextingPhone(map.texting_phone || "");
      setEmailProvider(map.email_provider || "resend");
      setEmailApiKey(map.email_api_key || "");
      setEmailFrom(map.email_from || "");
      setDriveFolderId(map.drive_root_folder_id || "");
    }
  }, [allSettings]);

  const saveSetting = (key: string, value: string) => {
    setSettingMutation.mutate({ key, value });
  };


  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" /> Admin Settings
        </h1>

        <Tabs defaultValue="email">
          <TabsList className="bg-muted">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="cta">CTA Config</TabsTrigger>
            <TabsTrigger value="drive">Drive / Assets</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4 mt-4">
            <Card>
              <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Mail className="h-4 w-4" /> Email Provider</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Provider</Label>
                  <Input value={emailProvider} onChange={e => setEmailProvider(e.target.value)} placeholder="resend / sendgrid / smtp" />
                </div>
                <div>
                  <Label>API Key</Label>
                  <Input type="password" value={emailApiKey} onChange={e => setEmailApiKey(e.target.value)} placeholder="re_..." />
                </div>
                <div>
                  <Label>From Address</Label>
                  <Input value={emailFrom} onChange={e => setEmailFrom(e.target.value)} placeholder="proposals@loomelicmedia.com" />
                </div>
                <Button onClick={() => {
                  saveSetting("email_provider", emailProvider);
                  saveSetting("email_api_key", emailApiKey);
                  saveSetting("email_from", emailFrom);
                }}>
                  Save Email Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Send className="h-4 w-4" /> Test Email</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Send test to</Label>
                  <Input type="email" value={testEmail} onChange={e => setTestEmail(e.target.value)} placeholder="your@email.com" />
                </div>
                <Button variant="outline" onClick={() => toast.success("Test email would be sent to " + testEmail)}>
                  Send Test Email
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cta" className="space-y-4 mt-4">
            <Card>
              <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Calendar className="h-4 w-4" /> Calendar Link</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Booking URL (Calendly, Cal.com, etc.)</Label>
                  <Input value={calendarLink} onChange={e => setCalendarLink(e.target.value)} placeholder="https://calendly.com/..." />
                </div>
                <Button onClick={() => saveSetting("calendar_link", calendarLink)}>Save</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Phone className="h-4 w-4" /> Texting Number</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Phone Number for "Text Me" CTA</Label>
                  <Input value={textingPhone} onChange={e => setTextingPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
                </div>
                <Button onClick={() => saveSetting("texting_phone", textingPhone)}>Save</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drive" className="space-y-4 mt-4">
            <Card>
              <CardHeader><CardTitle className="text-sm flex items-center gap-2"><FolderOpen className="h-4 w-4" /> Google Drive Integration</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Connect your Google Drive to sync brand assets. Assets are copied to CDN storage — dealers never see Drive links.
                </p>
                <div>
                  <Label>Root Folder ID</Label>
                  <Input value={driveFolderId} onChange={e => setDriveFolderId(e.target.value)} placeholder="1abc..." />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => saveSetting("drive_root_folder_id", driveFolderId)}>Save</Button>
                  <Button variant="outline" onClick={() => toast("Drive sync feature coming soon")}>Connect Google Drive</Button>
                  <Button variant="outline" onClick={() => toast("Sync feature coming soon")}>Sync Now</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
