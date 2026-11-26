import {
  CalendarCheck,
  Clock,
  HeartHandshake,
  Languages,
  MapPin,
  MessageCircle,
  Moon,
  Phone,
  ShieldCheck,
  Sparkles,
  Sun,
  TriangleAlert,
} from "lucide-react";
import { CallButton } from "@/components/call-button";
import { CallCard } from "@/components/call-card";
import { CallProvider } from "@/components/call-provider";
import { HeroAura } from "@/components/hero-aura";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/use-theme";

const STATS = [
  { value: "24/7", label: "Always answering" },
  { value: "3", label: "Hindi, English, Hinglish" },
  { value: "~2 min", label: "To book a visit" },
];

const STEPS = [
  {
    icon: Phone,
    title: "Tap Talk to Doctor",
    text: "Allow your microphone and the assistant answers right away. No app to install and no sign-up.",
  },
  {
    icon: MessageCircle,
    title: "Tell us what is wrong",
    text: "Describe your concern in your own words, in Hindi, English or Hinglish. The assistant listens with care and asks a few simple questions.",
  },
  {
    icon: CalendarCheck,
    title: "Book your visit",
    text: "Share your name, phone number and preferred time. The clinic team then confirms your slot.",
  },
];

const TREATMENTS = [
  { title: "Braces and clear aligners", text: "Straighten teeth and correct bite alignment with Dr. Soni, an orthodontist." },
  { title: "Root canal treatment", text: "Relief from tooth pain and infection, while saving your natural tooth where possible." },
  { title: "Dental implants", text: "A lasting way to replace missing teeth." },
  { title: "Smile designing", text: "Aesthetic dental care planned around your face and your smile." },
  { title: "Gum disease treatment", text: "Care for bleeding, swollen or receding gums." },
];

const ALWAYS_ON = [
  { icon: Clock, title: "Answers any hour", text: "Toothache at midnight or a question on Sunday. Someone is always there to listen and take your request." },
  { icon: Languages, title: "Speaks your language", text: "Talk in Hindi, English or a mix of both. Switch whenever you like." },
  { icon: HeartHandshake, title: "Calm and unhurried", text: "Gentle, patient and focused on understanding what you need before anything else." },
  { icon: ShieldCheck, title: "Clear handoff", text: "It never gives medical advice or quotes prices. Dr. Soni's team confirms every appointment." },
];

const FAQ = [
  {
    q: "Am I speaking with a real person?",
    a: "No. You are speaking with an AI assistant. It listens, answers basic questions about the clinic and records your appointment request. The clinic team confirms your slot.",
  },
  {
    q: "Can it give medical advice or tell me the cost?",
    a: "No. For any diagnosis, treatment advice or pricing, Dr. Sneha Soni explains your options and costs during your consultation.",
  },
  {
    q: "Which languages can I use?",
    a: "Hindi, English and Hinglish. You can switch between them during the call.",
  },
  {
    q: "What information do you collect?",
    a: "Only what is needed to book: your name, phone number, the reason for your visit and your preferred time. Please do not share other sensitive details on the call.",
  },
  {
    q: "Is my appointment confirmed on the call?",
    a: "The assistant records your request. The clinic team contacts you to confirm the exact slot.",
  },
  {
    q: "What do I need to use this?",
    a: "A modern browser and a microphone, on your phone or computer. Your browser will ask for permission to use the microphone.",
  },
];

export default function App() {
  return (
    <CallProvider>
      <Page />
    </CallProvider>
  );
}

function Page() {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen scroll-smooth bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="size-5" aria-hidden />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold">Dr. Sneha Soni</span>
              <span className="block text-xs text-muted-foreground">The Smile &amp; Glow Studio</span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex" aria-label="Sections">
            <a className="transition-colors hover:text-foreground" href="#how">How it works</a>
            <a className="transition-colors hover:text-foreground" href="#treatments">Treatments</a>
            <a className="transition-colors hover:text-foreground" href="#faq">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
              {theme === "dark" ? <Sun aria-hidden /> : <Moon aria-hidden />}
            </Button>
            <CallButton />
          </div>
        </div>
      </header>

      <main id="top">
        <section className="relative isolate overflow-hidden">
          <HeroAura />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
            <div>
              <Badge variant="outline" className="mb-5 gap-2 py-1 pl-2 pr-3 text-sm">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                Available 24/7
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Speak to Dr. Soni&apos;s care assistant, any hour of the day.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                Tell us what is troubling you in your own words. Our voice assistant listens, explains how the clinic can
                help, and books your appointment in about two minutes.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <CallButton size="lg" className="h-12 px-6 text-base" />
                <Button size="lg" variant="outline" className="h-12 px-6 text-base" asChild>
                  <a href="#how">See how it works</a>
                </Button>
              </div>

              <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="text-3xl font-semibold tracking-tight">{s.value}</dd>
                    <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </dl>
            </div>

            <CallCard />
          </div>
        </section>

        <section id="how" className="scroll-mt-20 border-y bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">How it works</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance">Three simple steps to your appointment</h2>
            </div>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <li key={step.title}>
                  <Card className="h-full">
                    <CardHeader>
                      <div className="mb-2 flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <step.icon className="size-5" aria-hidden />
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">Step {i + 1}</span>
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <CardDescription className="leading-relaxed">{step.text}</CardDescription>
                    </CardHeader>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="treatments" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 md:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Treatments</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance">Care you can ask about on the call</h2>
            <p className="mt-3 text-muted-foreground">
              Dr. Sneha Soni is an orthodontist and dental surgeon (BDS, MDS in Orthodontics). Ask the assistant about any
              of these and it will arrange a consultation.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TREATMENTS.map((t) => (
              <Card key={t.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{t.title}</CardTitle>
                  <CardDescription className="leading-relaxed">{t.text}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-y bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">Always on</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance">
                Never miss a patient, whatever the hour
              </h2>
              <p className="mt-3 text-muted-foreground">
                The clinic generally opens around 9 AM. Outside those hours, the assistant still answers and passes your
                request to the team, who confirm exact timings.
              </p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {ALWAYS_ON.map((f) => (
                <div key={f.title} className="rounded-xl border bg-card p-5">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <f.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
              <TriangleAlert className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
              <p>
                <span className="font-medium">In an emergency</span> such as heavy bleeding, swelling that affects
                breathing or swallowing, or severe pain with fever, go to the nearest hospital or call 112. Do not wait
                for a call back.
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16 sm:px-6 md:py-20">
          <p className="text-sm font-medium text-primary">FAQ</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Questions, answered</h2>
          <Accordion type="single" collapsible className="mt-8">
            {FAQ.map((item, i) => (
              <AccordionItem key={item.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base">{item.q}</AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 md:pb-24">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:flex-row sm:items-center sm:px-10">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Ready to book your visit?</h2>
              <p className="mt-1 opacity-90">It takes about two minutes, and you can start right now.</p>
            </div>
            <CallButton size="lg" variant="secondary" className="h-12 px-6 text-base" />
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col justify-between gap-6 sm:flex-row">
            <div>
              <p className="font-semibold">Dr. Sneha Soni | The Smile &amp; Glow Studio</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" aria-hidden /> Kankarbagh, Patna, Bihar 800020
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4" aria-hidden />
                <a href="tel:+919279022287" className="hover:text-foreground">+91 92790 22287</a>
              </p>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              This is a demonstration of an AI voice assistant for appointment booking. It does not provide medical advice.
            </p>
          </div>
          <Separator className="my-6" />
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} The Smile &amp; Glow Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
