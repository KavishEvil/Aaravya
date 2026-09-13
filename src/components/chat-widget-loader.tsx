import { getFaqs, getSiteSettings } from "@/lib/queries";
import { ChatWidget } from "@/components/chat-widget";

export async function ChatWidgetLoader() {
  const [faqs, settings] = await Promise.all([getFaqs(), getSiteSettings()]);

  return (
    <ChatWidget
      faqs={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))}
      phone={settings.phone ?? "+91 87338 89957"}
      whatsapp={settings.whatsapp ?? "918733889957"}
    />
  );
}
