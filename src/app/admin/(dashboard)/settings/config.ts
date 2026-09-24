import { AdminFormError } from "@/lib/admin/actions";
import { validEmail, validPhone, validUrl, validWhatsapp } from "@/lib/admin/validate";

type SettingDef = {
  key: string;
  label: string;
  help: string;
  placeholder?: string;
  validate: (value: string) => string;
};

export const SETTINGS_KEYS: readonly SettingDef[] = [
  {
    key: "phone",
    label: "Phone",
    help: "Header, footer, call buttons across the site, and booking emails",
    placeholder: "+91 87338 89957",
    validate: (v) => validPhone(v),
  },
  {
    key: "whatsapp",
    label: "WhatsApp Number",
    help: "Country code + number, digits only — every “WhatsApp us” link",
    placeholder: "918733889957",
    validate: (v) => validWhatsapp(v),
  },
  {
    key: "email",
    label: "Email",
    help: "Footer and the organisation details search engines read",
    validate: (v) => validEmail(v),
  },
  {
    key: "instagram_url",
    label: "Instagram URL",
    help: "Footer social link",
    validate: (v) => validUrl(v, "Instagram URL", ["instagram.com"]),
  },
  {
    key: "facebook_url",
    label: "Facebook URL",
    help: "Footer social link",
    validate: (v) => validUrl(v, "Facebook URL", ["facebook.com"]),
  },
  {
    key: "ga4_id",
    label: "Google Analytics (GA4) ID",
    help: "Format G-XXXXXXXXXX",
    placeholder: "G-XXXXXXXXXX",
    validate: (v) => {
      if (!/^G-[A-Z0-9]{4,20}$/.test(v)) throw new AdminFormError("GA4 ID must look like G-XXXXXXXXXX.");
      return v;
    },
  },
  {
    key: "gtm_id",
    label: "Google Tag Manager ID",
    help: "Format GTM-XXXXXXX",
    placeholder: "GTM-XXXXXXX",
    validate: (v) => {
      if (!/^GTM-[A-Z0-9]{4,12}$/.test(v)) throw new AdminFormError("Tag Manager ID must look like GTM-XXXXXXX.");
      return v;
    },
  },
];
