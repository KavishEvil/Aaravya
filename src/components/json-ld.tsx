export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so a field value can never break out of the script tag (e.g. "</script>").
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
