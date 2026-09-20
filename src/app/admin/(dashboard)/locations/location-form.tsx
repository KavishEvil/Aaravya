import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field, ADMIN_INPUT_CLASS } from "@/components/admin/form";
import type { Location } from "@/generated/prisma";

export function LocationForm({
  action,
  location,
}: {
  action: (formData: FormData) => Promise<void>;
  location?: Location;
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <Field label="Name" htmlFor="name">
        <input id="name" name="name" required defaultValue={location?.name ?? "Aaravya Hospital"} className={ADMIN_INPUT_CLASS} />
      </Field>

      <Field label="Address" htmlFor="address">
        <Textarea id="address" name="address" rows={2} required defaultValue={location?.address} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone" htmlFor="phone">
          <input id="phone" name="phone" required defaultValue={location?.phone} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="WhatsApp Number" htmlFor="whatsapp" help="Digits only, e.g. 918733889957">
          <input id="whatsapp" name="whatsapp" defaultValue={location?.whatsapp ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" htmlFor="email">
          <input id="email" name="email" defaultValue={location?.email ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Hours" htmlFor="hours">
          <input id="hours" name="hours" defaultValue={location?.hours ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <Field label="Google Maps Embed URL" htmlFor="mapEmbedUrl">
        <input id="mapEmbedUrl" name="mapEmbedUrl" defaultValue={location?.mapEmbedUrl ?? ""} className={ADMIN_INPUT_CLASS} />
      </Field>

      <Field label="Google Business Profile URL" htmlFor="googleBusinessUrl">
        <input id="googleBusinessUrl" name="googleBusinessUrl" defaultValue={location?.googleBusinessUrl ?? ""} className={ADMIN_INPUT_CLASS} />
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPrimary" defaultChecked={location?.isPrimary ?? true} className="size-4 rounded border-input" />
        Primary location (used site-wide)
      </label>

      <Button type="submit" size="xl" className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
        Save Location
      </Button>
    </form>
  );
}
