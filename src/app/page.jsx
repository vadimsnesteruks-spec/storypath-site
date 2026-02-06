"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  QrCode,
  Play,
  Sparkles,
  Building2,
  ShieldCheck,
  Globe,
  ArrowRight,
  Check,
  Mail,
  Phone,
  Languages,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

/**
 * StoryPath — Official website landing page (LV/EN toggle)
 * Paste into: src/app/page.jsx (Next.js + Tailwind + shadcn/ui)
 */

const fade = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const FOUNDERS = ["Vadims Nesteruks", "Artūrs Fomins", "Anastasija Plotņikova"];

const I18N = {
  en: {
    nav: {
      product: "Product",
      how: "How it works",
      pricing: "Pricing",
      partners: "Partners",
      founders: "Founders",
      contact: "Contact",
      requestDemo: "Buy now",
    },
    hero: {
      title: "Places that tell a story",
      desc:
        "StoryPath is a lightweight audio and storytelling guide for cities, museums, and nature parks. Users start for free. Partners pay for a modern QR-activated guide on the visitor's phone.",
      ctaPrimary: "Buy now",
      ctaSecondary: "Uzzināt vairāk",
      stats: [
        { k: "Live UI", v: "reāl interface" },
        { k: "QR", v: "partners acess" },
        { k: "LV", v: "launch in Latvia" },
      ],
    },
    phone: {
      routes: "Routes",
      nowPlaying: "Now playing",
      miniNote: "StoryPath app",
      free: "Free",
      partner: "Partner",
    },
    product: {
      kicker: "Product",
      title: "Interactive audio guide with custom development",
      desc:
        "Freemium for users + paid partner routes. Measure usage, prove willingness to pay, then scale.",
      cards: [
        {
          title: "Story routes",
          desc: "Map-based stops with short audio stories. Simple. Fast. Clear.",
        },
        {
          title: "Partner unlock",
          desc: "Museums & parks unlock routes instantly via QR — no extra devices.",
        },
        {
          title: "Tailored for each location",
          desc:
            "Individually designed for every museum, park, or city route. Custom content, branding, and flow — delivered with minimal setup and zero friction for visitors.",
        },
      ],
      insideTitle: "What’s included",
      inside: [
        "Route list (Free + Partner)",
        "Map with POIs + audio playback",
        "QR unlock for partner routes",
        "Basic analytics (usage counts)",
      ],
      launchKicker: "Launch in Latvia",
      launchDesc:
        "Start with Riga + 1 museum (or nature park). Validate real partner payments and visitor engagement.",
    },
    how: {
      kicker: "Flow",
      title: "A simple experience from start to finish",
      desc: "Designed for walking, museums, and parks — frictionless on a phone.",
      steps: [
        { n: "01", title: "Pick a route", desc: "Users discover free routes or partner routes in the app." },
        { n: "02", title: "Unlock on-site", desc: "At a museum or park, scan QR and start instantly." },
        { n: "03", title: "Listen as you move", desc: "Short audio stories. Clear next step. Minimal interaction." },
      ],
    },
    pricing: {
      kicker: "Pricing",
      title: "Simple tiers that match the business model",
      desc:
        "Freemium entry for users. Sustainable revenue from partners. Premium for power users.",
      note: "Prices may be adjusted based on partner size and seasonality.",
      tiers: [
        {
          name: "Freemium",
          price: "€0",
          note: "for users",
          highlight: false,
          badge: "Option",
          features: ["Access to free routes", "Basic map + audio", "LV / EN (pilot)"],
        },
        {
          name: "Premium",
          price: "€19",
          note: "per month",
          highlight: true,
          badge: "Recommended",
          features: ["All routes (incl. bundles)", "Offline downloads (phase 2)", "Smart guide (limited AI)", "Priority updates"],
        },
        {
          name: "Partner",
          price: "€400",
          note: "per month / location",
          highlight: false,
          badge: "Option",
          features: ["QR unlock for visitors", "Route content + updates", "Basic analytics", "Support & hosting", "Setup: €800 one-time"],
        },
      ],
      talk: "Talk to us",
    },
    partners: {
      kicker: "Partners",
      title: "Built for museums, parks, and cultural sites",
      desc: "A modern visitor experience that’s easy to deploy and easy to maintain.",
      valueTitle: "Partner value",
      valueSub: "Why it’s worth paying for",
      pilotTitle: "Pilot plan",
      pilotSub: "Launch in Latvia",
      bullets: [
        { title: "No extra devices", desc: "Visitors use their own phone. No hardware to maintain." },
        { title: "Instant multilingual", desc: "LV/EN from day one — expand later based on visitor mix." },
        { title: "Measurable impact", desc: "Basic analytics: uses, completion, popular stops." },
        { title: "Flexible setup", desc: "We can launch with 1 route and expand gradually." },
      ],
      plan: [
        { n: 1, title: "Week 1–2", desc: "Pick 1 route + collect assets (texts, audio, translations)." },
        { n: 2, title: "Week 3–4", desc: "Deploy QR, publish route, train staff (10–15 minutes)." },
        { n: 3, title: "Month 2+", desc: "Measure usage and expand content gradually." },
      ],
      promiseKicker: "Our promise",
      promiseDesc: "A clean, phone-first guide that can be live with one partner fast.",
    },
    founders: { kicker: "Team", title: "Founders", desc: "StoryPath is built by a small team in Latvia.", label: "Co-founders" },
    contact: {
      kicker: "Contact",
      title: "Request a demo",
      desc: "Tell us your location (museum, park, city route) and we’ll show a pilot plan.",
      quick: "Quick message",
      placeholder: "Email",
      send: "Send",
      helper: "We will get back to you shortly after receiving your request.",
      email: "Email",
      phone: "Phone",
      need: "What we need for a pilot",
      needs: ["1 route or 1 museum floor / park trail", "10–20 stops (POIs)", "LV/EN texts (we can help)", "Audio voice + QR placement"],
      resultKicker: "Result",
      resultDesc: "A live product your visitors can use immediately — and you can measure.",
      seePricing: "See pricing",
      seeHow: "See how it works",
      copyright: "All rights reserved.",
    },
  },

  lv: {
    nav: {
      product: "Produkts",
      how: "Kā tas strādā",
      pricing: "Cenas",
      partners: "Partneriem",
      founders: "Dibinātāji",
      contact: "Kontakti",
      requestDemo: "Pirkt tagad",
    },
    hero: {
      title: "Vietas, kas stāsta.",
      desc:
        "StoryPath ir viegls audio un stāstu gids pilsētām, muzejiem un dabas parkiem. Lietotāji sāk bez maksas. Partneri maksā par mūsdienīgu QR atvēršanas gidu apmeklētāja telefonā.",
      ctaPrimary: "Pirkt piekļuvi",
      ctaSecondary: "Uzzināt vairāk",
      stats: [
        { k: "Live UI", v: "reāls interfeiss" },
        { k: "QR", v: "partneru piekļuve" },
        { k: "LV", v: "starts Latvijā" },
      ],
    },
    phone: {
      routes: "Maršruti",
      nowPlaying: "Tagad skan",
      miniNote: "StoryPath aplikācija",
      free: "Bezmaksas",
      partner: "Partneris",
    },
    product: {
      kicker: "Product",
      title: "Interaktīvs audio gids ar individuālu izstrādi",
      desc:
        "Freemium lietotājiem + maksas partneru maršruti. Mēri lietojumu, pierādi gatavību maksāt, tad mērogo saturu.",
      cards: [
        { title: "Stāstu maršruti", desc: "Punkti kartē ar īsiem audio stāstiem. Vienkārši. Ātri. Skaidri." },
        { title: "Partneru atvēršana", desc: "Muzeji un parki atver maršrutus ar QR — bez papildu ierīcēm." },
        {
          title: "Individuāli pielāgots katrai lokācijai",
          desc:
            "Katram muzejam, parkam vai pilsētas maršrutam veidots atsevišķi — saturs, struktūra un pieredze, kas ieviešama ātri un bez liekas berzes apmeklētājiem.",
        },
      ],
      insideTitle: "Kas ir iekļauts",
      inside: [
        "Maršrutu saraksts (Bezmaksas + Partneru)",
        "Karte ar punktiem + audio atskaņošana",
        "QR atvēršana partneru maršrutiem",
        "Pamata analītika (lietošanas reizes)",
      ],
      launchKicker: "Starts Latvijā",
      launchDesc:
        "Sāc ar Rīgu + 1 muzeju (vai dabas parku). Validē reālus partneru maksājumus un apmeklētāju iesaisti.",
    },
    how: {
      kicker: "Plūsma",
      title: "Vienkārša pieredze no sākuma līdz beigām",
      desc: "Radīts pastaigām, muzejiem un parkiem — bez liekas klikšķināšanas.",
      steps: [
        { n: "01", title: "Izvēlies maršrutu", desc: "Lietotāji atrod bezmaksas vai partneru maršrutus aplikācijā." },
        { n: "02", title: "Atver uz vietas", desc: "Muzejā vai parkā noskenē QR kodu un sāc uzreiz." },
        { n: "03", title: "Klausies, ej, piedzīvo", desc: "Īsi audio stāsti. Skaidrs nākamais solis. Minimāla mijiedarbība." },
      ],
    },
    pricing: {
      kicker: "Cenas",
      title: "Vienkārši plāni, kas atbilst biznesa modelim",
      desc:
        "Freemium ieeja lietotājiem. Ilgtspējīgi ieņēmumi no partneriem. Premium aktīvajiem lietotājiem.",
      note: "Cenas var tikt pielāgotas atkarībā no partnera lieluma un sezonalitātes.",
      tiers: [
        {
          name: "Freemium",
          price: "0 €",
          note: "lietotājiem",
          highlight: false,
          badge: "Opcija",
          features: ["Piekļuve bezmaksas maršrutiem", "Karte + audio pamata režīmā", "LV / EN (pilots)"],
        },
        {
          name: "Premium",
          price: "19 €",
          note: "mēnesī",
          highlight: true,
          badge: "Ieteicams",
          features: ["Visi maršruti (t.sk. pakotnes)", "Offline lejupielādes (2. fāze)", "Viedais gids (ierobežots AI)", "Prioritāri atjauninājumi"],
        },
        {
          name: "Partneris",
          price: "400 €",
          note: "mēnesī / lokācijai",
          highlight: false,
          badge: "Opcija",
          features: ["QR atvēršana apmeklētājiem", "Maršruta saturs + atjauninājumi", "Pamata analītika", "Atbalsts + hostings", "Ieviešana: 800 € vienreizēji"],
        },
      ],
      talk: "Sazināties",
    },
    partners: {
      kicker: "Partneriem",
      title: "Radīts muzejiem, parkiem un kultūras objektiem",
      desc: "Mūsdienīga apmeklētāju pieredze, ko ir viegli ieviest un uzturēt.",
      valueTitle: "Vērtība partnerim",
      valueSub: "Kāpēc ir vērts maksāt",
      pilotTitle: "Pilota plāns",
      pilotSub: "Starts Latvijā",
      bullets: [
        { title: "Nav papildu ierīču", desc: "Apmeklētāji izmanto savu telefonu. Nav aparatūras uzturēšanas." },
        { title: "Daudzvalodu uzreiz", desc: "LV/EN no pirmās dienas — vēlāk paplašina pēc apmeklētāju profila." },
        { title: "Izmērāma ietekme", desc: "Pamata analītika: lietojumi, pabeigšana, populārākie punkti." },
        { title: "Elastīga ieviešana", desc: "Sākam ar 1 maršrutu un paplašinām saturu pakāpeniski." },
      ],
      plan: [
        { n: 1, title: "1.–2. nedēļa", desc: "Izvēlamies 1 maršrutu + savācam materiālus (teksti, audio, tulkojumi)." },
        { n: 2, title: "3.–4. nedēļa", desc: "Ieviešam QR, publicējam maršrutu, apmācām personālu (10–15 min)." },
        { n: 3, title: "2. mēnesis+", desc: "Mēram lietojumu un paplašinām saturu pakāpeniski." },
      ],
      promiseKicker: "Mūsu solījums",
      promiseDesc: "Tīrs, phone-first gids, kas var būt live ar vienu partneri ļoti ātri.",
    },
    founders: { kicker: "Komanda", title: "Dibinātāji", desc: "StoryPath veido neliela komanda Latvijā.", label: "" },
    contact: {
      kicker: "Kontakti",
      title: "Pieteikt demo",
      desc: "Pastāsti par lokāciju (muzejs, parks, pilsētas maršruts), un mēs parādīsim pilota plānu.",
      quick: "Ātra ziņa",
      placeholder: "E-pasts",
      send: "Sūtīt",
      helper: "Pēc pieteikuma saņemšanas ar jums sazināsimies tuvākajā laikā.",
      email: "E-pasts",
      phone: "Tālrunis",
      need: "Kas vajadzīgs pilotam",
      needs: ["1 maršruts vai 1 muzeja stāvs / parka taka", "10–20 punkti (POI)", "LV/EN teksti (varam palīdzēt)", "Audio balss + QR izvietojums"],
      resultKicker: "Rezultāts",
      resultDesc: "Darbojošs produkts, ko apmeklētāji var lietot uzreiz — un jūs varat to izmērīt.",
      seePricing: "Skatīt cenas",
      seeHow: "Skatīt plūsmu",
      copyright: "Visas tiesības aizsargātas.",
    },
  },
};

function Container({ children }) {
  return <div className="mx-auto w-full max-w-6xl px-6">{children}</div>;
}

function LangToggle({ lang, setLang }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-1 py-1 shadow-sm">
      <Button
        type="button"
        variant={lang === "lv" ? "default" : "ghost"}
        size="sm"
        className="rounded-full h-8 px-3"
        onClick={() => setLang("lv")}
      >
        LV
      </Button>
      <Button
        type="button"
        variant={lang === "en" ? "default" : "ghost"}
        size="sm"
        className="rounded-full h-8 px-3"
        onClick={() => setLang("en")}
      >
        EN
      </Button>
    </div>
  );
}

function Nav({ t, lang, setLang }) {
  const [open, setOpen] = useState(false);

  const scrollTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpen(false);
  };

  const closeMenu = () => setOpen(false);

  return (
    <div className="sticky top-0 z-50 border-b border-neutral-200/70 bg-white/80 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <a href="#top" onClick={scrollTop} className="flex items-center gap-2 cursor-pointer">
            <div className="h-9 w-9 rounded-2xl bg-neutral-900 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight text-neutral-900">StoryPath</div>
              <div className="text-[11px] text-neutral-500">Official website</div>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-6 text-sm text-neutral-600">
            <a className="hover:text-neutral-900" href="#product">{t.nav.product}</a>
            <a className="hover:text-neutral-900" href="#how">{t.nav.how}</a>
            <a className="hover:text-neutral-900" href="#pricing">{t.nav.pricing}</a>
            <a className="hover:text-neutral-900" href="#partners">{t.nav.partners}</a>
            <a className="hover:text-neutral-900" href="#founders">{t.nav.founders}</a>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <Languages className="h-4 w-4 text-neutral-500" />
              <LangToggle lang={lang} setLang={setLang} />
            </div>

            {/* Desktop demo */}
            <Button asChild className="rounded-full hidden md:inline-flex bg-neutral-900 text-white hover:bg-neutral-800">
              <Link href="/demo">Demo</Link>
            </Button>

            <Button asChild variant="ghost" className="rounded-full hidden md:inline-flex">
              <a href="#contact">{t.nav.contact}</a>
            </Button>

            <Button asChild className="rounded-full hidden md:inline-flex">
              <a href="#contact">
                {t.nav.requestDemo} <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white"
              onClick={() => setOpen((v) => !v)}
              aria-label="Open menu"
            >
              {open ? <X className="h-5 w-5 text-neutral-900" /> : <Menu className="h-5 w-5 text-neutral-900" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-neutral-200/70 bg-white">
          <Container>
            <div className="py-4 space-y-3">
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-neutral-500" />
                <LangToggle lang={lang} setLang={setLang} />
              </div>

              <div className="grid gap-2 text-sm">
                <a className="rounded-2xl px-3 py-3 hover:bg-neutral-50 border border-neutral-200" href="#product" onClick={closeMenu}>
                  {t.nav.product}
                </a>
                <a className="rounded-2xl px-3 py-3 hover:bg-neutral-50 border border-neutral-200" href="#how" onClick={closeMenu}>
                  {t.nav.how}
                </a>
                <a className="rounded-2xl px-3 py-3 hover:bg-neutral-50 border border-neutral-200" href="#pricing" onClick={closeMenu}>
                  {t.nav.pricing}
                </a>
                <a className="rounded-2xl px-3 py-3 hover:bg-neutral-50 border border-neutral-200" href="#partners" onClick={closeMenu}>
                  {t.nav.partners}
                </a>
                <a className="rounded-2xl px-3 py-3 hover:bg-neutral-50 border border-neutral-200" href="#founders" onClick={closeMenu}>
                  {t.nav.founders}
                </a>

                <Link
                  href="/demo"
                  onClick={closeMenu}
                  className="rounded-2xl px-3 py-3 border border-neutral-200 bg-neutral-900 text-white hover:bg-neutral-800 text-center font-medium"
                >
                  Demo
                </Link>

                <a
                  href="#contact"
                  onClick={closeMenu}
                  className="rounded-2xl px-3 py-3 border border-neutral-200 hover:bg-neutral-50 text-center font-medium"
                >
                  {t.nav.contact}
                </a>

                <a
                  href="#contact"
                  onClick={closeMenu}
                  className="rounded-2xl px-3 py-3 bg-neutral-900 text-white hover:bg-neutral-800 text-center font-medium"
                >
                  {t.nav.requestDemo}
                </a>
              </div>
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}

function Hero({ t }) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-neutral-200/40 blur-3xl" />

      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-2 md:py-20">
          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <div className="relative -mt-1 h-85 w-full max-w-md overflow-hidden rounded-3xl">
              <img
                src="/images/hero-audio.png"
                alt="Audio guide experience"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-white/95 via-white/45 to-white/7" />
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
              {t.hero.title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-600">{t.hero.desc}</p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="rounded-full">
                <a href="#contact">
                  {t.hero.ctaPrimary} <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="secondary" className="rounded-full">
                <a href="#contact">{t.contact.quick}</a>
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {t.hero.stats.map((s) => (
                <Stat key={s.k} k={s.k} v={s.v} />
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.55, delay: 0.05 }}
            className="relative"
          >
            <PhoneMock t={t} />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function Stat({ k, v }) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="text-lg font-semibold tracking-tight text-neutral-900">{k}</div>
      <div className="mt-1 text-xs text-neutral-500">{v}</div>
    </div>
  );
}

function PhoneMock({ t }) {
  const POIS = [
    { id: "ra", name: "Rātslaukums", x: 22, y: 38 },
    { id: "dp", name: "Doma laukums", x: 62, y: 28 },
    { id: "sb", name: "Zviedru vārti", x: 48, y: 62 },
    { id: "cr", name: "Centrāltirgus", x: 78, y: 66 },
  ];
  const [activePoi, setActivePoi] = useState(POIS[0]);

  return (
    <div className="mx-auto w-full max-w-[360px]">
      <div className="relative rounded-[48px] border border-neutral-300 bg-white shadow-[0_25px_80px_rgba(0,0,0,0.18)] overflow-hidden aspect-[9/19.5]">
        <div className="h-9 flex items-center justify-center bg-neutral-900">
          <div className="h-4 w-24 rounded-full bg-neutral-800" />
        </div>

        <div className="flex h-[calc(100%-36px)] flex-col px-5 pt-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-neutral-900">{t.phone.routes}</div>
            <div className="h-9 w-9 rounded-full border border-neutral-200 flex items-center justify-center">
              <QrCode className="h-4 w-4 text-neutral-700" />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <RouteMini title="Vecrīga — svarīgākie punkti" tag={t.phone.free} />
            <RouteMini title="Muzeja audio gids" tag={t.phone.partner} />
            <RouteMini title="Dabas parks — pastaiga" tag={t.phone.partner} />
          </div>

          <div className="mt-5 rounded-3xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-neutral-500">{t.phone.nowPlaying}</div>
                <div className="text-sm font-medium text-neutral-900">{activePoi.name}</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-neutral-900 flex items-center justify-center">
                <Play className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
              <div className="h-full w-2/5 rounded-full bg-neutral-900" />
            </div>
          </div>

          <div className="mt-4 flex-1">
            <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
              <div className="px-4 pt-4">
                <div className="text-xs font-medium text-neutral-500">{t.phone.routes}</div>
                <div className="mt-1 text-sm font-semibold tracking-tight text-neutral-900">Vecrīga</div>
              </div>

              <div className="relative mt-3 mx-4 mb-4 rounded-2xl border border-neutral-200 bg-neutral-50 overflow-hidden aspect-[16/10]">
                <div className="absolute inset-0 opacity-[0.35]">
                  <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-neutral-200" />
                  <div className="absolute top-6 right-2 h-28 w-28 rounded-full bg-neutral-200" />
                  <div className="absolute bottom-[-40px] left-[35%] h-52 w-52 rounded-full bg-neutral-200" />
                </div>

                <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path
                    d="M18,40 C30,22 55,22 64,30 C74,38 70,52 55,62 C44,70 34,74 24,78"
                    fill="none"
                    stroke="rgb(23 23 23)"
                    strokeOpacity="0.35"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>

                {POIS.map((p) => {
                  const isActive = p.id === activePoi.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      onClick={() => setActivePoi(p)}
                      aria-label={p.name}
                    >
                      <div
                        className={
                          "relative flex items-center justify-center rounded-full transition-all " +
                          (isActive
                            ? "h-8 w-8 bg-neutral-900 shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
                            : "h-7 w-7 bg-white border border-neutral-200 shadow-sm")
                        }
                      >
                        <MapPin className={"h-4 w-4 " + (isActive ? "text-white" : "text-neutral-900")} />
                        {isActive ? <span className="absolute inset-0 rounded-full animate-ping bg-neutral-900/25" /> : null}
                      </div>
                    </button>
                  );
                })}

                <div className="absolute bottom-2 right-2 rounded-full bg-white/80 border border-neutral-200 px-2 py-1 text-[10px] text-neutral-600">
                  Tap pins
                </div>
              </div>
            </div>
          </div>

          <div className="pb-3">
            <div className="mx-auto h-1.5 w-32 rounded-full bg-neutral-900/15" />
            <div className="mt-2 text-[11px] text-neutral-500 text-center">{t.phone.miniNote}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RouteMini({ title, tag }) {
  const isPartner = String(tag).toLowerCase().includes("partner");
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold tracking-tight text-neutral-900 leading-snug">{title}</div>
          <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
            <Badge variant={isPartner ? "default" : "secondary"} className="rounded-full">
              {tag}
            </Badge>
            <span>•</span>
            <span>Map + audio</span>
          </div>
        </div>
        <div className="h-9 w-9 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center">
          <ArrowRight className="h-4 w-4 text-neutral-700" />
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ kicker, title, desc, id }) {
  return (
    <div id={id} className="mx-auto max-w-3xl text-center">
      {kicker ? <div className="text-xs font-medium tracking-wide text-neutral-500">{kicker}</div> : null}
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">{title}</h2>
      {desc ? <p className="mt-4 text-base leading-relaxed text-neutral-600">{desc}</p> : null}
    </div>
  );
}

function Product({ t }) {
  const icons = [
    <Sparkles key="i1" className="h-5 w-5" />,
    <QrCode key="i2" className="h-5 w-5" />,
    <ShieldCheck key="i3" className="h-5 w-5" />,
  ];

  return (
    <section className="bg-neutral-50 py-16 md:py-20" id="product">
      <Container>
        <SectionTitle kicker={t.product.kicker} title={t.product.title} desc={t.product.desc} />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {t.product.cards.map((it, idx) => (
            <Card key={it.title} className="rounded-3xl border-neutral-200 shadow-sm">
              <CardContent className="p-6">
                <div className="h-11 w-11 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-900">
                  {icons[idx]}
                </div>
                <div className="mt-4 text-lg font-semibold tracking-tight text-neutral-900">{it.title}</div>
                <div className="mt-2 text-sm leading-relaxed text-neutral-600">{it.desc}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <div className="text-sm font-semibold tracking-tight text-neutral-900">{t.product.insideTitle}</div>
              <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                {t.product.inside.map((x) => (
                  <li key={x} className="flex gap-2">
                    <Check className="h-4 w-4 text-neutral-900 mt-0.5" /> {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
              <div className="text-xs font-medium text-neutral-500">{t.product.launchKicker}</div>
              <div className="mt-2 text-sm text-neutral-700 leading-relaxed">{t.product.launchDesc}</div>
              <div className="mt-5 flex gap-2">
                <Badge variant="secondary" className="rounded-full">LV / EN</Badge>
                <Badge variant="secondary" className="rounded-full">iOS + Android</Badge>
                <Badge variant="secondary" className="rounded-full">QR-first</Badge>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function HowItWorks({ t }) {
  const stepIcons = [
    <MapPin key="s1" className="h-5 w-5" />,
    <QrCode key="s2" className="h-5 w-5" />,
    <Play key="s3" className="h-5 w-5" />,
  ];

  return (
    <section className="bg-white py-16 md:py-20" id="how">
      <Container>
        <SectionTitle kicker={t.how.kicker} title={t.how.title} desc={t.how.desc} />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {t.how.steps.map((s, idx) => (
            <Card key={s.n} className="rounded-3xl border-neutral-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-neutral-500">{s.n}</div>
                  <div className="h-10 w-10 rounded-2xl border border-neutral-200 bg-white flex items-center justify-center">
                    {stepIcons[idx]}
                  </div>
                </div>
                <div className="mt-4 text-lg font-semibold tracking-tight text-neutral-900">{s.title}</div>
                <div className="mt-2 text-sm leading-relaxed text-neutral-600">{s.desc}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Pricing({ t }) {
  return (
    <section className="bg-neutral-50 py-16 md:py-20" id="pricing">
      <Container>
        <SectionTitle kicker={t.pricing.kicker} title={t.pricing.title} desc={t.pricing.desc} />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {t.pricing.tiers.map((tier) => (
            <Card key={tier.name} className="rounded-3xl border-neutral-200 shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold tracking-tight text-neutral-900">{tier.name}</div>
                    <div className="mt-2 flex items-end gap-2">
                      <div className="text-3xl font-semibold tracking-tight text-neutral-900">{tier.price}</div>
                      <div className="text-xs text-neutral-500 pb-1">{tier.note}</div>
                    </div>
                  </div>
                  {tier.highlight ? (
                    <Badge className="rounded-full">{tier.badge}</Badge>
                  ) : (
                    <Badge variant="secondary" className="rounded-full">{tier.badge}</Badge>
                  )}
                </div>

                <ul className="mt-5 space-y-2 text-sm text-neutral-600">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="h-4 w-4 text-neutral-900 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>

                <Button asChild className="mt-6 w-full rounded-full" variant={tier.highlight ? "default" : "secondary"}>
                  <a href="#contact">{t.pricing.talk}</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center text-xs text-neutral-500">{t.pricing.note}</div>
      </Container>
    </section>
  );
}

function Partners({ t }) {
  return (
    <section className="bg-white py-16 md:py-20" id="partners">
      <Container>
        <SectionTitle kicker={t.partners.kicker} title={t.partners.title} desc={t.partners.desc} />

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Card className="rounded-3xl border-neutral-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-neutral-900 text-white flex items-center justify-center">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-tight text-neutral-900">{t.partners.valueTitle}</div>
                  <div className="text-xs text-neutral-500">{t.partners.valueSub}</div>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {t.partners.bullets.map((b) => (
                  <div key={b.title} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="text-sm font-medium text-neutral-900">{b.title}</div>
                    <div className="mt-1 text-sm text-neutral-600 leading-relaxed">{b.desc}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-neutral-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl border border-neutral-200 bg-white flex items-center justify-center">
                  <Globe className="h-5 w-5 text-neutral-900" />
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-tight text-neutral-900">{t.partners.pilotTitle}</div>
                  <div className="text-xs text-neutral-500">{t.partners.pilotSub}</div>
                </div>
              </div>

              <ol className="mt-5 space-y-3 text-sm text-neutral-600">
                {t.partners.plan.map((p) => (
                  <li key={p.n} className="flex gap-3">
                    <div className="h-7 w-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs">{p.n}</div>
                    <div>
                      <div className="font-medium text-neutral-900">{p.title}</div>
                      <div>{p.desc}</div>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="text-xs font-medium text-neutral-500">{t.partners.promiseKicker}</div>
                <div className="mt-1 text-sm text-neutral-700 leading-relaxed">{t.partners.promiseDesc}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}

function Founders({ t }) {
  return (
    <section className="bg-neutral-50 py-16 md:py-20" id="founders">
      <Container>
        <SectionTitle kicker={t.founders.kicker} title={t.founders.title} desc={t.founders.desc} />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {FOUNDERS.map((name) => (
            <Card key={name} className="rounded-3xl border-neutral-200 shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="text-xs text-neutral-500">{t.founders.label}</div>
                <div className="mt-2 text-lg font-semibold tracking-tight text-neutral-900">{name}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Contact({ t, lang }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const submit = () => {
    setError(null);
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError(lang === "lv" ? "Lūdzu ievadi e-pastu." : "Please enter your email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError(lang === "lv" ? "Lūdzu ievadi korektu e-pastu." : "Please enter a valid email.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <section className="bg-neutral-50 py-16 md:py-20" id="contact">
      <Container>
        <SectionTitle kicker={t.contact.kicker} title={t.contact.title} desc={t.contact.desc} />

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Card className="rounded-3xl border-neutral-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold tracking-tight text-neutral-900">
                  {lang === "lv" ? "Sazinies" : "Contact"}
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="rounded-full"
                  onClick={() => document.getElementById("sp-message")?.focus()}
                >
                  {lang === "lv" ? "Ātra ziņa" : "Quick message"}
                </Button>
              </div>

              {!submitted ? (
                <div className="mt-4 grid gap-3">
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.contact.placeholder}
                    className="rounded-2xl"
                    inputMode="email"
                    autoComplete="email"
                  />

                  <textarea
                    id="sp-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      lang === "lv"
                        ? "Īss apraksts (muzejs / parks / pilsēta, vajadzīgās valodas, apmeklētāju plūsma)"
                        : "Short note (museum/park/city, needed languages, visitor volume)"
                    }
                    className="min-h-[120px] w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                  />

                  {error ? <div className="text-sm text-red-600">{error}</div> : null}

                  <Button className="rounded-full" onClick={submit}>
                    {lang === "lv" ? "Nosūtīt" : "Send"}
                  </Button>

                  <div className="text-xs text-neutral-500">
                    {lang === "lv"
                      ? "Paldies! Pēc pieteikuma saņemšanas mēs ar jums sazināsimies tuvākajā laikā."
                      : "Thanks! After receiving your request, we’ll get back to you shortly."}
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-3xl border border-neutral-200 bg-white p-6">
                  <div className="text-lg font-semibold tracking-tight text-neutral-900">
                    {lang === "lv" ? "Paldies!" : "Thank you!"}
                  </div>
                  <div className="mt-2 text-sm text-neutral-600 leading-relaxed">
                    {lang === "lv"
                      ? "Mēs esam saņēmuši jūsu ziņu un ar jums sazināsimies tuvākajā laikā."
                      : "We received your message and will reach out shortly."}
                  </div>

                  <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <Button
                      variant="secondary"
                      className="rounded-full"
                      onClick={() => {
                        setSubmitted(false);
                        setEmail("");
                        setMessage("");
                        setError(null);
                        setTimeout(() => document.getElementById("sp-message")?.focus(), 100);
                      }}
                    >
                      {lang === "lv" ? "Sūtīt vēl vienu" : "Send another"}
                    </Button>
                    <Button asChild className="rounded-full">
                      <a href="tel:+37120055500">{lang === "lv" ? "Piezvanīt" : "Call"}</a>
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-6 grid gap-3">
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-neutral-900">{t.contact.email}</div>
                    <a className="text-sm text-neutral-600 hover:text-neutral-900" href="mailto:hello@storypath.app">
                      hello@storypath.app
                    </a>
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-4 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full border border-neutral-200 bg-white flex items-center justify-center">
                    <Phone className="h-4 w-4 text-neutral-900" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-neutral-900">{t.contact.phone}</div>
                    <a className="text-sm text-neutral-600 hover:text-neutral-900" href="tel:+37120055500">
                      +371 20055500
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-neutral-200 shadow-sm">
            <CardContent className="p-6">
              <div className="text-sm font-semibold tracking-tight text-neutral-900">{t.contact.need}</div>
              <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                {t.contact.needs.map((x) => (
                  <li key={x} className="flex gap-2">
                    <Check className="h-4 w-4 text-neutral-900 mt-0.5" /> {x}
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="text-xs font-medium text-neutral-500">{t.contact.resultKicker}</div>
                <div className="mt-1 text-sm text-neutral-700 leading-relaxed">{t.contact.resultDesc}</div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <Button asChild className="rounded-full">
                  <a href="#pricing">
                    {t.contact.seePricing} <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="secondary" className="rounded-full">
                  <a href="#how">{t.contact.seeHow}</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} StoryPath. {t.contact.copyright}
        </div>
      </Container>
    </section>
  );
}

export default function Page() {
  const [lang, setLang] = useState("lv");
  const t = I18N[lang];

  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = prev;
    };
  }, []);

  return (
    <div id="top" className="min-h-screen bg-white text-neutral-900">
      <Nav t={t} lang={lang} setLang={setLang} />
      <Hero t={t} />
      <Product t={t} />
      <HowItWorks t={t} />
      <Pricing t={t} />
      <Partners t={t} />
      <Founders t={t} />
      <Contact t={t} lang={lang} />
    </div>
  );
}
