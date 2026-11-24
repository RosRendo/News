import NewsletterBanner from "./NewsletterBanner";

export default function JournexCtaBanner(props: { pair?: string; contextMessage?: string }) {
  return <NewsletterBanner {...props} />;
}
