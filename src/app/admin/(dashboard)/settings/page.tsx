import { Button } from "@/components/ui/button";
import { Field, ADMIN_INPUT_CLASS } from "@/components/admin/form";
import { getSiteSettings } from "@/lib/queries";
import { SETTINGS_KEYS } from "./config";
import { updateSettings } from "./actions";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">Site Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Contact info and analytics IDs used across the whole site.
      </p>

      <form action={updateSettings} className="mt-6 flex max-w-lg flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {SETTINGS_KEYS.map(({ key, label }) => (
          <Field key={key} label={label} htmlFor={key}>
            <input id={key} name={key} defaultValue={settings[key] ?? ""} className={ADMIN_INPUT_CLASS} />
          </Field>
        ))}

        <Button type="submit" size="xl" className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
          Save Settings
        </Button>
      </form>
    </div>
  );
}
