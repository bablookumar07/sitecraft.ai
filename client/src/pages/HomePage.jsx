import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Bell,
  Blocks,
  Bot,
  Box,
  Braces,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  CircleDot,
  Cloud,
  Code2,
  Command,
  Copy,
  Database,
  Download,
  ExternalLink,
  Eye,
  FileCode2,
  FileJson,
  Folder,
  FolderOpen,
  GitBranch,
  Globe2,
  GripVertical,
  Layers3,
  LayoutDashboard,
  LayoutTemplate,
  LifeBuoy,
  Link2,
  Lock,
  Menu,
  MessageSquare,
  Monitor,
  Moon,
  MoreHorizontal,
  MousePointer2,
  Network,
  Palette,
  PanelLeft,
  Play,
  Plus,
  Rocket,
  Search,
  Server,
  Settings2,
  ShieldCheck,
  Sparkles,
  Split,
  Terminal,
  Trash2,
  Upload,
  UserRound,
  Users,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";

const ACCENT = "#6366f1";

const demoPresets = [
  {
    id: "saas",
    label: "SaaS Dashboard",
    prompt:
      "Create a dark SaaS analytics dashboard with revenue metrics, customer growth, activity charts, and a collapsible navigation.",
    code: `import { RevenueCard } from "./components/RevenueCard";
import { ActivityChart } from "./components/ActivityChart";

export default function Dashboard() {
  return (
    <main className="dashboard">
      <RevenueCard
        title="Monthly revenue"
        value="$84,240"
        trend="+18.4%"
      />

      <ActivityChart
        data={revenueData}
        period="30d"
      />
    </main>
  );
}`,
  },
  {
    id: "commerce",
    label: "E-commerce Page",
    prompt:
      "Build a premium e-commerce product page with product gallery, variant selector, reviews, shipping information, and sticky checkout.",
    code: `export default function ProductPage() {
  return (
    <main className="product-page">
      <ProductGallery images={product.images} />

      <section className="product-details">
        <Badge>New arrival</Badge>
        <h1>{product.name}</h1>
        <Rating value={product.rating} />

        <Price value={product.price} />

        <VariantSelector
          options={product.variants}
        />

        <AddToCartButton />
      </section>
    </main>
  );
}`,
  },
  {
    id: "portfolio",
    label: "Developer Portfolio",
    prompt:
      "Create a minimal developer portfolio with an editorial hero, selected projects, technical skills, experience timeline, and contact section.",
    code: `export default function Portfolio() {
  return (
    <main>
      <Hero
        eyebrow="Independent developer"
        title="I build useful software."
      />

      <ProjectGrid projects={projects} />

      <ExperienceTimeline
        items={experience}
      />

      <ContactSection />
    </main>
  );
}`,
  },
];

const testimonials = [
  {
    name: "Maya Chen",
    role: "Staff Product Engineer",
    company: "Northstar",
    initials: "MC",
    quote:
      "The important part isn't that SiteCraft writes code. It's that I can immediately take over the code it writes. That makes the generated output feel like a starting point rather than a dead-end prototype.",
  },
  {
    name: "Daniel Brooks",
    role: "Founder",
    company: "Arcform",
    initials: "DB",
    quote:
      "We went from a rough product brief to a working marketing surface in one afternoon. The ability to ask the agent for targeted changes without rebuilding the entire project is incredibly useful.",
  },
  {
    name: "Priya Nair",
    role: "Product Designer",
    company: "Frame Labs",
    initials: "PN",
    quote:
      "Most AI builders hide the implementation. SiteCraft does the opposite. I can see the structure, inspect individual files, change the design system, and still get the speed of AI generation.",
  },
  {
    name: "Lucas Martin",
    role: "Senior Frontend Engineer",
    company: "Orbit",
    initials: "LM",
    quote:
      "The workflow maps surprisingly well to how an engineering team actually works: specification, implementation, inspection, iteration, and deployment. That mental model makes the product easy to adopt.",
  },
  {
    name: "Aisha Williams",
    role: "Technical Founder",
    company: "Relay",
    initials: "AW",
    quote:
      "I don't need another visual toy. I need something that gets me to a real repository faster. The code-first workflow is what made SiteCraft stick for our team.",
  },
  {
    name: "Ethan Park",
    role: "Design Systems Lead",
    company: "Monument",
    initials: "EP",
    quote:
      "Being able to move between the visual result and the actual source code is the killer feature. Designers can iterate visually while engineers retain complete control.",
  },
];

const faqItems = [
  {
    question: "Do I own the code SiteCraft AI generates?",
    answer:
      "Yes. SiteCraft is designed around editable source code rather than a locked visual canvas. Generated projects can be inspected, changed, exported, and continued outside the builder.",
  },
  {
    question: "Can I use SiteCraft with the MERN stack?",
    answer:
      "Yes. SiteCraft's architecture is designed around modern React applications and can work alongside Node.js, Express, MongoDB, REST APIs, and other JavaScript services. The builder itself can generate and manage frontend source files while your backend remains under your control.",
  },
  {
    question: "Can I use Next.js instead of React + Vite?",
    answer:
      "The landing-page experience demonstrates React-oriented generation. The production architecture can be extended to support additional React frameworks such as Next.js, provided the corresponding project generator and runtime adapters are implemented.",
  },
  {
    question: "Can I use custom CSS and Tailwind?",
    answer:
      "Yes. Generated source remains editable, so custom CSS, Tailwind utility classes, design tokens, responsive rules, and component-level styling can be modified directly.",
  },
  {
    question: "Can I export my entire project?",
    answer:
      "Yes. The product workflow is designed around complete source ownership. Projects can be exported as a ZIP containing the generated files and folders.",
  },
  {
    question: "Where can I deploy my project?",
    answer:
      "You can use the built-in publishing workflow for hosted previews and connect the exported project to your preferred infrastructure, including Node-based deployments and platforms such as Vercel.",
  },
];

const logos = [
  "VERCEL",
  "GITHUB",
  "LINEAR",
  "STRIPE",
  "CLOUDFLARE",
  "SUPABASE",
];

const architectureSteps = [
  {
    number: "01",
    title: "Prompt Input",
    description:
      "Describe the product, page, interaction, or section you want to build.",
    icon: MessageSquare,
  },
  {
    number: "02",
    title: "AST Code Generation",
    description:
      "The AI converts intent into a structured React implementation and project file graph.",
    icon: Braces,
  },
  {
    number: "03",
    title: "Visual Editing",
    description:
      "Inspect generated files, preview the result, and make targeted source or AI-assisted changes.",
    icon: MousePointer2,
  },
  {
    number: "04",
    title: "Deploy",
    description:
      "Publish the finished experience or export the source and deploy it wherever your team works.",
    icon: Rocket,
  },
];

function SiteCraftLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06]">
        <div className="absolute h-4 w-4 rotate-45 rounded-[4px] border border-indigo-400/80" />
        <div className="relative h-2.5 w-2.5 rotate-45 rounded-[2px] bg-indigo-500" />
      </div>

      {!compact && (
        <span className="text-[15px] font-semibold tracking-[-0.02em] text-white">
          SiteCraft <span className="text-indigo-400">AI</span>
        </span>
      )}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}) {
  return (
    <div
      className={`max-w-3xl ${
        centered ? "mx-auto text-center" : ""
      }`}
    >
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-zinc-300">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
        {eyebrow}
      </div>

      <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-[48px] lg:leading-[1.05]">
        {title}
      </h2>

      {description && (
        <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  href,
  className = "",
  icon = true,
}) {
  const classes = `group inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_30px_rgba(99,102,241,0.2)] transition duration-200 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
        {icon && (
          <ArrowRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        )}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
      {icon && (
        <ArrowRight
          size={16}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      )}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
  href,
  className = "",
  icon,
}) {
  const classes = `group inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.025] px-5 py-3 text-sm font-medium text-zinc-200 transition duration-200 hover:border-white/20 hover:bg-white/[0.055] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/10 ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {icon}
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {icon}
      {children}
    </button>
  );
}

function CodeLine({ number, children, active = false }) {
  return (
    <div
      className={`flex min-h-6 text-[12px] leading-6 ${
        active ? "bg-indigo-500/[0.08]" : ""
      }`}
    >
      <span className="w-10 shrink-0 select-none pr-3 text-right text-zinc-700">
        {number}
      </span>
      <span className="whitespace-pre text-zinc-400">{children}</span>
    </div>
  );
}

function EditorMockup() {
  const [activeFile, setActiveFile] = useState("Hero.jsx");
  const [previewMode, setPreviewMode] = useState("preview");

  const files = [
    { name: "App.jsx", type: "react" },
    { name: "Hero.jsx", type: "react" },
    { name: "Features.jsx", type: "react" },
    { name: "Pricing.jsx", type: "react" },
    { name: "Navbar.jsx", type: "react" },
    { name: "styles.css", type: "css" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[720px]">
      <div className="absolute -inset-10 rounded-[40px] bg-indigo-500/[0.06] blur-3xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0d] shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
        <div className="flex h-11 items-center justify-between border-b border-white/10 bg-[#0e0e10] px-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          </div>

          <div className="hidden items-center gap-2 rounded-md border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] text-zinc-500 sm:flex">
            <CircleDot size={9} className="text-emerald-400" />
            sitecraft.dev / studio
          </div>

          <div className="flex items-center gap-1">
            <button className="rounded p-1.5 text-zinc-500 hover:bg-white/5 hover:text-zinc-300">
              <Bell size={13} />
            </button>
            <button className="rounded p-1.5 text-zinc-500 hover:bg-white/5 hover:text-zinc-300">
              <Settings2 size={13} />
            </button>
          </div>
        </div>

        <div className="grid min-h-[470px] grid-cols-[150px_1fr]">
          <aside className="hidden border-r border-white/10 bg-[#0d0d0f] sm:block">
            <div className="border-b border-white/10 px-3 py-3">
              <div className="flex items-center gap-2">
                <SiteCraftLogo compact />
                <span className="text-[10px] font-medium text-zinc-400">
                  Studio
                </span>
              </div>
            </div>

            <div className="p-2">
              <div className="mb-2 flex items-center justify-between px-2 py-1">
                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                  Files
                </span>
                <Plus size={11} className="text-zinc-600" />
              </div>

              <div className="space-y-0.5">
                {files.map((file) => (
                  <button
                    key={file.name}
                    onClick={() => setActiveFile(file.name)}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[10px] transition ${
                      activeFile === file.name
                        ? "bg-white/[0.07] text-white"
                        : "text-zinc-500 hover:bg-white/[0.035] hover:text-zinc-300"
                    }`}
                  >
                    {activeFile === file.name ? (
                      <FileCode2 size={12} className="text-indigo-400" />
                    ) : (
                      <FileCode2 size={12} />
                    )}
                    {file.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 border-t border-white/10 p-2">
              <div className="flex items-center gap-2 px-2 py-2 text-[10px] text-zinc-500">
                <GitBranch size={12} />
                main
              </div>
              <div className="flex items-center gap-2 px-2 py-2 text-[10px] text-zinc-500">
                <Cloud size={12} />
                Synced
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>
          </aside>

          <div className="flex min-w-0 flex-col">
            <div className="flex h-10 items-center justify-between border-b border-white/10 bg-[#101012] px-3">
              <div className="flex items-center gap-2">
                <FileCode2 size={13} className="text-indigo-400" />
                <span className="text-[10px] text-zinc-300">
                  {activeFile}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {["code", "preview"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPreviewMode(mode)}
                    className={`rounded px-2 py-1 text-[9px] ${
                      previewMode === mode
                        ? "bg-white/[0.08] text-white"
                        : "text-zinc-600 hover:text-zinc-400"
                    }`}
                  >
                    {mode === "code" ? "Code" : "Preview"}
                  </button>
                ))}
              </div>
            </div>

            {previewMode === "code" ? (
              <div className="flex-1 overflow-hidden bg-[#09090b] px-0 py-3 font-mono">
                <CodeLine number="01">
                  <span className="text-purple-400">import</span>{" "}
                  <span className="text-zinc-300">{"{ Sparkles }"}</span>{" "}
                  <span className="text-purple-400">from</span>{" "}
                  <span className="text-emerald-400">"lucide-react"</span>
                </CodeLine>

                <CodeLine number="02" />

                <CodeLine number="03">
                  <span className="text-purple-400">export default</span>{" "}
                  <span className="text-purple-300">function</span>{" "}
                  <span className="text-blue-300">Hero</span>
                  <span className="text-zinc-500">()</span>{" "}
                  <span className="text-zinc-500">{"{"}</span>
                </CodeLine>

                <CodeLine number="04">
                  {"  "}
                  <span className="text-purple-400">return</span>{" "}
                  <span className="text-zinc-500">(</span>
                </CodeLine>

                <CodeLine number="05" active>
                  {"    "}
                  <span className="text-zinc-500">&lt;</span>
                  <span className="text-blue-300">section</span>{" "}
                  <span className="text-sky-300">className</span>
                  <span className="text-zinc-500">=</span>
                  <span className="text-emerald-400">
                    "hero-section"
                  </span>
                  <span className="text-zinc-500">&gt;</span>
                </CodeLine>

                <CodeLine number="06">
                  {"      "}
                  <span className="text-zinc-500">&lt;</span>
                  <span className="text-blue-300">Badge</span>{" "}
                  <span className="text-sky-300">icon</span>
                  <span className="text-zinc-500">=</span>
                  <span className="text-zinc-300">{"{Sparkles}"}</span>
                  <span className="text-zinc-500"> /&gt;</span>
                </CodeLine>

                <CodeLine number="07">
                  {"      "}
                  <span className="text-zinc-500">&lt;</span>
                  <span className="text-blue-300">h1</span>
                  <span className="text-zinc-500">&gt;</span>
                </CodeLine>

                <CodeLine number="08">
                  {"        "}
                  <span className="text-emerald-400">
                    "Build without the busywork."
                  </span>
                </CodeLine>

                <CodeLine number="09">
                  {"      "}
                  <span className="text-zinc-500">&lt;/</span>
                  <span className="text-blue-300">h1</span>
                  <span className="text-zinc-500">&gt;</span>
                </CodeLine>

                <CodeLine number="10">
                  {"    "}
                  <span className="text-zinc-500">&lt;/</span>
                  <span className="text-blue-300">section</span>
                  <span className="text-zinc-500">&gt;</span>
                </CodeLine>

                <CodeLine number="11">
                  {"  "}
                  <span className="text-zinc-500">);</span>
                </CodeLine>

                <CodeLine number="12">
                  <span className="text-zinc-500">{"}"}</span>
                </CodeLine>
              </div>
            ) : (
              <div className="relative flex-1 bg-[#111113] p-4">
                <div className="absolute right-4 top-4 rounded-md border border-white/10 bg-[#0a0a0c]/90 px-2 py-1 text-[8px] text-zinc-500">
                  Live preview
                </div>

                <div className="mx-auto mt-5 max-w-[410px] overflow-hidden rounded-xl border border-white/10 bg-[#f7f7f5] shadow-xl">
                  <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="h-5 w-5 rounded-md bg-zinc-950" />
                      <span className="text-[8px] font-semibold text-zinc-900">
                        Acme
                      </span>
                    </div>
                    <div className="hidden gap-3 sm:flex">
                      <span className="text-[7px] text-zinc-500">Product</span>
                      <span className="text-[7px] text-zinc-500">Pricing</span>
                      <span className="text-[7px] text-zinc-500">About</span>
                    </div>
                    <div className="rounded bg-zinc-900 px-2 py-1 text-[7px] text-white">
                      Get started
                    </div>
                  </div>

                  <div className="px-6 py-12 text-center">
                    <div className="mx-auto mb-3 flex w-fit items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-1">
                      <Sparkles size={7} className="text-indigo-600" />
                      <span className="text-[6px] font-medium text-indigo-600">
                        AI-powered workflow
                      </span>
                    </div>

                    <h3 className="text-xl font-bold tracking-tight text-zinc-950">
                      Ship your next idea
                      <br />
                      before lunch.
                    </h3>

                    <p className="mx-auto mt-3 max-w-[220px] text-[7px] leading-4 text-zinc-500">
                      Turn product ideas into polished interfaces and editable
                      React code.
                    </p>

                    <div className="mt-5 flex justify-center gap-2">
                      <div className="rounded-md bg-zinc-950 px-3 py-2 text-[7px] font-medium text-white">
                        Start building
                      </div>
                      <div className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-[7px] text-zinc-600">
                        View demo
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-px border-t border-black/10 bg-black/10">
                    {["Fast", "Editable", "Deployable"].map((item) => (
                      <div key={item} className="bg-white p-3 text-center">
                        <div className="text-[8px] font-semibold text-zinc-900">
                          {item}
                        </div>
                        <div className="mt-1 text-[6px] text-zinc-400">
                          Built for teams
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#0c0c0e] p-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
            <Sparkles size={14} className="shrink-0 text-indigo-400" />
            <span className="min-w-0 flex-1 truncate text-[10px] text-zinc-500">
              Ask SiteCraft to change the navbar color...
            </span>
            <button className="rounded-lg bg-indigo-500 p-1.5 text-white transition hover:bg-indigo-400">
              <ArrowUpRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSection({ onStart }) {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-500/[0.055] blur-[120px]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
              </span>

              <span className="text-xs font-medium text-zinc-300">
                SiteCraft v2.0 Released
              </span>

              <ChevronRight size={13} className="text-zinc-600" />
            </div>

           <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[2.75rem] lg:text-[3.5rem]">
  <span className="block text-white">
    Build production-ready
  </span>

  <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
    React sites in seconds.
  </span>

  <span className="block text-zinc-400">
    Edit every line of code.
  </span>
</h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
              Describe what you want to build. SiteCraft turns the idea into
              structured React code you can inspect, edit, preview, publish,
              and export without giving up control.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton onClick={onStart}>
                Start Building Free
              </PrimaryButton>

              <SecondaryButton
                icon={<Play size={15} />}
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                See how it works
              </SecondaryButton>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" />
                No credit card
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" />
                Export your code
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" />
                Built for developers
              </div>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-2 gap-5 border-t border-white/10 pt-6 sm:grid-cols-4">
              <div>
                <div className="text-xl font-semibold tracking-tight text-white">
                  50k+
                </div>
                <div className="mt-1 text-[11px] text-zinc-600">
                  sites generated
                </div>
              </div>

              <div>
                <div className="text-xl font-semibold tracking-tight text-white">
                  4.9/5
                </div>
                <div className="mt-1 text-[11px] text-zinc-600">
                  builder rating
                </div>
              </div>

              <div>
                <div className="text-xl font-semibold tracking-tight text-white">
                  99.9%
                </div>
                <div className="mt-1 text-[11px] text-zinc-600">
                  successful builds
                </div>
              </div>

              <div>
                <div className="text-xl font-semibold tracking-tight text-white">
                  24/7
                </div>
                <div className="mt-1 text-[11px] text-zinc-600">
                  cloud preview
                </div>
              </div>
            </div>
          </div>

          <div id="product-showcase" className="lg:pt-4">
            <EditorMockup />
          </div>
        </div>

        <div className="mt-20 border-y border-white/10">
          <div className="grid grid-cols-2 divide-x divide-y divide-white/10 sm:grid-cols-4 sm:divide-y-0">
            {[
              ["100/100", "Lighthouse-ready performance"],
              ["< 200ms", "Instant editor interactions"],
              ["Zero lock-in", "Exportable source code"],
              ["99.99%", "Deployment uptime target"],
            ].map(([value, label]) => (
              <div key={value} className="px-4 py-6 sm:px-6">
                <div className="text-sm font-semibold text-zinc-100">
                  {value}
                </div>
                <div className="mt-1 text-[11px] leading-4 text-zinc-600">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 py-9 opacity-40 grayscale">
          {logos.map((logo) => (
            <span
              key={logo}
              className="text-[11px] font-bold tracking-[0.16em] text-zinc-300"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function BentoFeatureSection() {
  return (
    <section
      id="features"
      className="border-t border-white/10 bg-[#0a0a0c] py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The builder, rethought"
          title="AI speed without the black box."
          description="SiteCraft combines prompt-driven generation with the source-level control developers expect from a real project."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          <FeatureCard
            className="lg:col-span-2"
            icon={<WandSparkles size={19} />}
            title="AI Prompt-to-React Engine"
            description="Turn product requirements into a coherent component architecture instead of a pile of disconnected snippets."
          >
            <div className="mt-7 overflow-hidden rounded-xl border border-white/10 bg-[#08080a]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Terminal size={13} className="text-indigo-400" />
                  <span className="text-[10px] text-zinc-400">
                    generation-plan.json
                  </span>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] text-emerald-400">
                  Generated
                </span>
              </div>

              <div className="grid md:grid-cols-[0.9fr_1.1fr]">
                <div className="border-b border-white/10 p-5 md:border-b-0 md:border-r">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                    Structure
                  </div>

                  <div className="mt-4 space-y-2 font-mono text-[10px]">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <FolderOpen size={12} className="text-indigo-400" />
                      src
                    </div>

                    <div className="ml-4 flex items-center gap-2 text-zinc-500">
                      <Folder size={12} />
                      components
                    </div>

                    <div className="ml-8 flex items-center gap-2 text-zinc-500">
                      <FileCode2 size={11} />
                      Hero.jsx
                    </div>

                    <div className="ml-8 flex items-center gap-2 text-zinc-500">
                      <FileCode2 size={11} />
                      Navbar.jsx
                    </div>

                    <div className="ml-8 flex items-center gap-2 text-zinc-500">
                      <FileCode2 size={11} />
                      Pricing.jsx
                    </div>

                    <div className="ml-4 flex items-center gap-2 text-zinc-500">
                      <FileJson size={12} />
                      App.jsx
                    </div>
                  </div>
                </div>

                <div className="p-5 font-mono text-[10px] leading-6">
                  <div>
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-blue-300">architecture</span>{" "}
                    <span className="text-zinc-600">=</span>{" "}
                    <span className="text-zinc-400">{"{"}</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-zinc-500">framework:</span>{" "}
                    <span className="text-emerald-400">"react"</span>
                    <span className="text-zinc-600">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-zinc-500">styling:</span>{" "}
                    <span className="text-emerald-400">"tailwind"</span>
                    <span className="text-zinc-600">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-zinc-500">components:</span>{" "}
                    <span className="text-zinc-400">14</span>
                    <span className="text-zinc-600">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-zinc-500">routes:</span>{" "}
                    <span className="text-zinc-400">5</span>
                    <span className="text-zinc-600">,</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">{"}"}</span>
                  </div>

                  <div className="mt-4 rounded-lg border border-indigo-500/20 bg-indigo-500/[0.05] p-3 text-zinc-500">
                    <span className="text-indigo-400">AI</span> generated
                    project graph successfully.
                  </div>
                </div>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={<Network size={19} />}
            title="Full MERN Integration"
            description="Keep your API, database, and application logic connected to the generated frontend."
          >
            <div className="mt-7 rounded-xl border border-white/10 bg-[#08080a] p-4">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                  <Code2 size={16} className="text-indigo-400" />
                </div>

                <ArrowRight size={14} className="text-zinc-700" />

                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                  <Server size={16} className="text-zinc-400" />
                </div>

                <ArrowRight size={14} className="text-zinc-700" />

                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                  <Database size={16} className="text-zinc-400" />
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-black/30 p-3 font-mono text-[9px] text-zinc-500">
                GET /api/projects
                <br />
                <span className="text-emerald-400">200</span> · application/json
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={<MousePointer2 size={19} />}
            title="Visual Drag & Drop Canvas"
            description="Move from generated structure to visual iteration without losing your underlying component hierarchy."
          >
            <div className="mt-7 rounded-xl border border-white/10 bg-[#08080a] p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[9px] text-zinc-600">
                  COMPONENT TREE
                </span>
                <GripVertical size={13} className="text-zinc-700" />
              </div>

              <div className="space-y-1.5">
                {[
                  ["Page", "Layout"],
                  ["Navbar", "Header"],
                  ["Hero", "Section"],
                  ["Features", "Grid"],
                ].map(([name, type], index) => (
                  <div
                    key={name}
                    className={`flex items-center gap-2 rounded-md border px-2.5 py-2 ${
                      index === 2
                        ? "border-indigo-500/30 bg-indigo-500/[0.06]"
                        : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <Blocks
                      size={11}
                      className={
                        index === 2 ? "text-indigo-400" : "text-zinc-600"
                      }
                    />
                    <span className="text-[9px] text-zinc-300">{name}</span>
                    <span className="ml-auto text-[8px] text-zinc-700">
                      {type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={<Globe2 size={19} />}
            title="One-Click Deployment"
            description="Publish a generated project and get a public URL without manually wiring a deployment pipeline."
          >
            <div className="mt-7 rounded-xl border border-white/10 bg-[#08080a] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06]">
                  <ShieldCheck size={17} className="text-emerald-400" />
                </div>

                <div>
                  <div className="text-[10px] font-medium text-zinc-300">
                    Production deployment
                  </div>
                  <div className="mt-1 text-[9px] text-zinc-600">
                    SSL · Edge CDN · Custom domain
                  </div>
                </div>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                <div className="h-full w-[82%] rounded-full bg-indigo-500" />
              </div>

              <div className="mt-2 flex justify-between text-[8px] text-zinc-700">
                <span>Build</span>
                <span>82%</span>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={<Palette size={19} />}
            title="Tailwind Design Tokens"
            description="Keep colors, spacing, type scale, radii, and component primitives consistent as the project evolves."
          >
            <div className="mt-7 grid grid-cols-4 gap-2">
              {[
                ["#6366F1", "Primary"],
                ["#18181B", "Surface"],
                ["#E4E4E7", "Border"],
                ["#A1A1AA", "Muted"],
              ].map(([value, label]) => (
                <div key={label}>
                  <div
                    className="aspect-square rounded-lg border border-white/10"
                    style={{
                      backgroundColor: value,
                    }}
                  />
                  <div className="mt-2 text-[8px] text-zinc-600">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </FeatureCard>

          <FeatureCard
            icon={<Code2 size={19} />}
            title="Clean, Exportable Code"
            description="Treat generated projects as real codebases. Branch, review, merge, and continue development with your existing workflow."
          >
            <div className="mt-7 rounded-xl border border-white/10 bg-[#08080a] p-4">
              <div className="flex items-center gap-2 text-[9px] text-zinc-500">
                <GitBranch size={12} />
                feature/sitecraft-home
              </div>

              <div className="mt-4 space-y-2">
                {[
                  ["Generated project", "2m ago"],
                  ["AI revision", "14m ago"],
                  ["Design update", "31m ago"],
                ].map(([name, time]) => (
                  <div
                    key={name}
                    className="flex items-center gap-2 rounded-md border border-white/5 bg-white/[0.02] px-2.5 py-2"
                  >
                    <Check size={11} className="text-emerald-400" />
                    <span className="text-[9px] text-zinc-400">{name}</span>
                    <span className="ml-auto text-[8px] text-zinc-700">
                      {time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-y border-white/[0.07] bg-[#0c0c0f] py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/[0.06] px-3 py-1.5 text-xs font-medium text-indigo-300">
            <Sparkles size={13} />
            How it works
          </div>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">From idea to production in four simple steps.</h2>
          <p className="mt-4 text-base leading-7 text-zinc-500">Describe your idea, let AI generate the React project, refine every detail, and publish when you're ready.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7">
            <span className="font-mono text-xs text-zinc-600">01</span>
            <h3 className="mt-5 text-xl font-semibold text-white">Describe your idea</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-500">Start with a simple prompt describing the website you want to build.</p>
            <div className="mt-7 rounded-xl border border-white/[0.07] bg-[#08080a] p-4 font-mono text-xs text-zinc-400"><span className="text-indigo-400">&gt;</span>{" "}Build a modern SaaS dashboard...</div>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7">
            <span className="font-mono text-xs text-zinc-600">02</span>
            <h3 className="mt-5 text-xl font-semibold text-white">AI generates React</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-500">SiteCraft turns your prompt into a structured React project with components and styling.</p>
            <div className="mt-7 rounded-xl border border-white/[0.07] bg-[#08080a] p-4 font-mono text-xs text-zinc-500"><div className="text-indigo-400">Generating project...</div><div className="mt-2">✓ Header.jsx</div><div>✓ Hero.jsx</div><div>✓ Features.jsx</div></div>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7">
            <span className="font-mono text-xs text-zinc-600">03</span>
            <h3 className="mt-5 text-xl font-semibold text-white">Edit everything</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-500">Preview your website visually while keeping complete control over the generated source code.</p>
            <div className="mt-7 flex items-center gap-2 rounded-xl border border-white/[0.07] bg-[#08080a] p-4"><Code2 size={15} className="text-indigo-400" /><span className="font-mono text-xs text-zinc-500">Edit source → Preview changes</span></div>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7">
            <span className="font-mono text-xs text-zinc-600">04</span>
            <h3 className="mt-5 text-xl font-semibold text-white">Publish when ready</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-500">Publish your finished website and get a live public URL or export the project source.</p>
            <div className="mt-7 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.03] p-4 font-mono text-xs text-emerald-400">✓ Production build ready</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  children,
  className = "",
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0f] p-6 transition duration-200 hover:-translate-y-0.5 hover:border-white/15 ${className}`}
    >
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-indigo-500/[0.025] blur-3xl transition duration-300 group-hover:bg-indigo-500/[0.06]" />

      <div className="relative">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] text-indigo-400">
          {icon}
        </div>

        <h3 className="mt-5 text-lg font-semibold tracking-[-0.025em] text-white">
          {title}
        </h3>

        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
          {description}
        </p>

        {children}
      </div>
    </article>
  );
}

function LiveDemoSection() {
  const [activePreset, setActivePreset] = useState("saas");
  const [activeTab, setActiveTab] = useState("prompt");
  const [prompt, setPrompt] = useState(demoPresets[0].prompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const selectedPreset = useMemo(
    () => demoPresets.find((item) => item.id === activePreset),
    [activePreset]
  );

  const selectPreset = (preset) => {
    setActivePreset(preset.id);
    setPrompt(preset.prompt);
    setGenerated(false);
  };

  const generate = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    window.setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
      setActiveTab("visual");
    }, 900);
  };

  return (
    <section className="border-t border-white/10 py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Interactive sandbox"
          title="Give it an idea. Then take the wheel."
          description="The interface below is a miniature representation of the product workflow: prompt, inspect, preview, iterate."
        />

        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0e] shadow-2xl">
          <div className="flex flex-col border-b border-white/10 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex overflow-x-auto">
              {[
                ["prompt", "Prompt Studio", MessageSquare],
                ["visual", "Visual View", Eye],
                ["code", "Clean Code View", Code2],
              ].map(([id, label, Icon]) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-4 text-xs font-medium transition ${
                    activeTab === id
                      ? "border-indigo-500 text-white"
                      : "border-transparent text-zinc-600 hover:text-zinc-300"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 px-4 py-3">
              <span className="text-[10px] text-zinc-600">
                {generated ? "Generated just now" : "Ready to generate"}
              </span>
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  generated ? "bg-emerald-400" : "bg-zinc-700"
                }`}
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r lg:p-7">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                Prompt Studio
              </div>

              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className="mt-4 min-h-[150px] w-full resize-none rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-300 outline-none transition placeholder:text-zinc-700 focus:border-indigo-500/40"
                placeholder="Describe what you want to build..."
              />

              <div className="mt-4">
                <div className="mb-2 text-[10px] text-zinc-600">
                  Try a preset
                </div>

                <div className="flex flex-wrap gap-2">
                  {demoPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => selectPreset(preset)}
                      className={`rounded-md border px-2.5 py-1.5 text-[10px] transition ${
                        activePreset === preset.id
                          ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
                          : "border-white/10 bg-white/[0.02] text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generate}
                disabled={isGenerating}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-3 text-xs font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGenerating ? (
                  <>
                    <Activity size={14} className="animate-pulse" />
                    Generating project...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Generate with SiteCraft
                  </>
                )}
              </button>
            </div>

            <div className="min-h-[420px] bg-[#09090b]">
              {activeTab === "prompt" && (
                <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.06]">
                    <Bot size={24} className="text-indigo-400" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-white">
                    Describe the experience.
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-600">
                    SiteCraft will reason about the structure before producing
                    editable source files.
                  </p>
                </div>
              )}

              {activeTab === "visual" && (
                <div className="h-full p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-zinc-300">
                        {selectedPreset.label}
                      </div>
                      <div className="mt-1 text-[10px] text-zinc-600">
                        Responsive preview · desktop
                      </div>
                    </div>

                    <div className="flex items-center gap-1 rounded-md border border-white/10 p-1">
                      <button className="rounded bg-white/10 p-1.5 text-zinc-300">
                        <Monitor size={12} />
                      </button>
                      <button className="p-1.5 text-zinc-600">
                        <LayoutTemplate size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-100">
                    <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded bg-zinc-900" />
                        <span className="text-[8px] font-semibold text-zinc-800">
                          Product
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-[7px] text-zinc-500">
                          Overview
                        </span>
                        <span className="text-[7px] text-zinc-500">
                          Analytics
                        </span>
                        <span className="text-[7px] text-zinc-500">
                          Settings
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4 p-5 sm:grid-cols-3">
                      <div className="rounded-lg border border-zinc-200 bg-white p-4">
                        <div className="text-[7px] text-zinc-400">
                          Revenue
                        </div>
                        <div className="mt-2 text-lg font-bold text-zinc-900">
                          $84.2k
                        </div>
                        <div className="mt-2 text-[7px] text-emerald-600">
                          +18.4%
                        </div>
                      </div>

                      <div className="rounded-lg border border-zinc-200 bg-white p-4">
                        <div className="text-[7px] text-zinc-400">
                          Customers
                        </div>
                        <div className="mt-2 text-lg font-bold text-zinc-900">
                          12,480
                        </div>
                        <div className="mt-2 text-[7px] text-emerald-600">
                          +12.2%
                        </div>
                      </div>

                      <div className="rounded-lg border border-zinc-200 bg-white p-4">
                        <div className="text-[7px] text-zinc-400">
                          Conversion
                        </div>
                        <div className="mt-2 text-lg font-bold text-zinc-900">
                          8.42%
                        </div>
                        <div className="mt-2 text-[7px] text-emerald-600">
                          +2.4%
                        </div>
                      </div>
                    </div>

                    <div className="mx-5 mb-5 h-36 rounded-lg border border-zinc-200 bg-white p-4">
                      <div className="text-[7px] text-zinc-400">
                        Performance
                      </div>

                      <div className="mt-4 flex h-20 items-end gap-1">
                        {[20, 32, 27, 48, 42, 61, 54, 73, 67, 82, 74, 91].map(
                          (height, index) => (
                            <div
                              key={index}
                              className="flex-1 rounded-t-sm bg-indigo-500/80"
                              style={{ height: `${height}%` }}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "code" && (
                <div className="h-full overflow-auto p-5 font-mono text-[10px] leading-6">
                  {selectedPreset.code.split("\n").map((line, index) => (
                    <div key={`${line}-${index}`} className="flex">
                      <span className="mr-5 w-5 select-none text-right text-zinc-800">
                        {index + 1}
                      </span>
                      <span className="whitespace-pre text-zinc-400">
                        {line}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  return (
    <section className="border-t border-white/10 bg-[#0a0a0c] py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Under the hood"
          title="From intent to deployable software."
          description="The workflow mirrors an engineering process rather than hiding everything behind a single Generate button."
        />

        <div className="relative mt-16">
          <div className="absolute left-[12%] right-[12%] top-12 hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent lg:block" />

          <div className="grid gap-10 lg:grid-cols-4">
            {architectureSteps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="relative">
                  <div className="flex items-center gap-4 lg:block">
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0a0a0c] text-indigo-400">
                      <Icon size={18} />
                    </div>

                    <span className="font-mono text-[10px] tracking-[0.14em] text-zinc-700 lg:absolute lg:left-0 lg:top-16">
                      {step.number}
                    </span>
                  </div>

                  <div className="ml-16 mt-4 lg:ml-0 lg:pt-10">
                    <h3 className="text-base font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0f]">
          <div className="grid lg:grid-cols-3">
            <div className="border-b border-white/10 p-7 lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                <Activity size={14} className="text-indigo-400" />
                Generation status
              </div>

              <div className="mt-8 text-3xl font-semibold tracking-tight text-white">
                89%
              </div>

              <div className="mt-2 text-xs text-zinc-600">
                8 of 9 files generated
              </div>

              <div className="mt-6 h-1.5 rounded-full bg-white/5">
                <div className="h-full w-[89%] rounded-full bg-indigo-500" />
              </div>
            </div>

            <div className="border-b border-white/10 p-7 lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                <Layers3 size={14} className="text-indigo-400" />
                Project graph
              </div>

              <div className="mt-6 space-y-2 font-mono text-[10px]">
                <div className="text-zinc-500">
                  <span className="text-indigo-400">src/</span>
                </div>
                <div className="pl-4 text-zinc-600">
                  components/
                </div>
                <div className="pl-8 text-zinc-700">
                  Hero.jsx
                </div>
                <div className="pl-8 text-zinc-700">
                  Navbar.jsx
                </div>
                <div className="pl-4 text-zinc-600">
                  pages/
                </div>
                <div className="pl-8 text-zinc-700">
                  Home.jsx
                </div>
              </div>
            </div>

            <div className="p-7">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                <ShieldCheck size={14} className="text-emerald-400" />
                Ready for review
              </div>

              <p className="mt-4 text-sm leading-6 text-zinc-600">
                Generated files remain inspectable so developers can review,
                modify, test, and continue development using their normal
                workflow.
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs text-zinc-400">
                <CheckCircle2 size={14} className="text-emerald-400" />
                Source available
              </div>

              <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
                <CheckCircle2 size={14} className="text-emerald-400" />
                Preview available
              </div>

              <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
                <CheckCircle2 size={14} className="text-emerald-400" />
                Export available
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="border-t border-white/10 py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Wall of love"
          title="Built for people who actually ship."
          description="Engineers, designers, and founders use SiteCraft as an acceleration layer—not as a replacement for judgment."
          centered
        />

        <div className="mt-14 columns-1 gap-4 md:columns-2 lg:columns-3">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.name}
              className={`mb-4 break-inside-avoid rounded-2xl border border-white/10 bg-[#0d0d0f] p-6 ${
                index % 3 === 1 ? "lg:translate-y-8" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[10px] font-semibold text-zinc-300">
                  {testimonial.initials}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-xs font-medium text-zinc-200">
                      {testimonial.name}
                    </span>
                    <BadgeCheck
                      size={12}
                      className="shrink-0 text-indigo-400"
                    />
                  </div>

                  <div className="truncate text-[10px] text-zinc-600">
                    {testimonial.role} · {testimonial.company}
                  </div>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-zinc-400">
                “{testimonial.quote}”
              </p>

              <div className="mt-5 flex items-center gap-1 text-[9px] text-zinc-700">
                <CheckCircle2 size={11} className="text-emerald-500" />
                Verified builder
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      description: "For exploring the SiteCraft workflow.",
      monthly: 0,
      annual: 0,
      cta: "Start for free",
      popular: false,
      features: [
        "3 generated projects",
        "React project generation",
        "Basic AI revisions",
        "Live preview",
        "Source code export",
      ],
    },
    {
      name: "Pro",
      description: "For developers shipping real products.",
      monthly: 29,
      annual: 23,
      cta: "Start Pro",
      popular: true,
      features: [
        "Unlimited projects",
        "Advanced AI generation",
        "Unlimited AI revisions",
        "Full code editor",
        "Clean, exportable code",
        "Custom deployments",
        "Priority generation",
      ],
    },
    {
      name: "Enterprise",
      description: "For teams building at scale.",
      monthly: 99,
      annual: 79,
      cta: "Talk to sales",
      popular: false,
      features: [
        "Everything in Pro",
        "Team workspaces",
        "Role-based access",
        "Shared project libraries",
        "Enterprise support",
        "Advanced security controls",
        "Custom integrations",
      ],
    },
  ];

  return (
    <section id="pricing" className="border-t border-white/10 bg-[#0a0a0c] py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Pricing"
            title="Start small. Scale when you ship."
            description="Simple plans for experimentation, professional development, and teams that need centralized workflows."
          />

          <div className="flex w-fit items-center rounded-lg border border-white/10 bg-white/[0.025] p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-md px-4 py-2 text-xs font-medium transition ${
                !annual ? "bg-white/10 text-white" : "text-zinc-600"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-xs font-medium transition ${
                annual ? "bg-white/10 text-white" : "text-zinc-600"
              }`}
            >
              Annual
              <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] text-emerald-400">
                20% off
              </span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = annual ? plan.annual : plan.monthly;

            return (
              <article
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  plan.popular
                    ? "border-indigo-500/60 bg-indigo-500/[0.045] shadow-[0_0_50px_rgba(99,102,241,0.07)]"
                    : "border-white/10 bg-[#0d0d0f]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-6 rounded-full border border-indigo-400/30 bg-[#11111a] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-indigo-300">
                    Most popular
                  </div>
                )}

                <div>
                  <h3 className="text-base font-semibold text-white">
                    {plan.name}
                  </h3>

                  <p className="mt-2 min-h-10 text-xs leading-5 text-zinc-600">
                    {plan.description}
                  </p>

                  <div className="mt-7 flex items-end gap-1">
                    <span className="text-4xl font-semibold tracking-tight text-white">
                      ${price}
                    </span>
                    <span className="pb-1 text-xs text-zinc-600">
                      / month
                    </span>
                  </div>
                </div>

                <button
                  className={`mt-7 w-full rounded-lg px-4 py-3 text-xs font-semibold transition ${
                    plan.popular
                      ? "bg-indigo-500 text-white hover:bg-indigo-400"
                      : "border border-white/10 bg-white/[0.035] text-zinc-300 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  {plan.cta}
                </button>

                <div className="my-7 border-t border-white/10" />

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-2.5 text-xs text-zinc-500"
                    >
                      <Check
                        size={14}
                        className="mt-0.5 shrink-0 text-emerald-400"
                      />
                      {feature}
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="border-t border-white/10 py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions developers usually ask."
          description="A few details about ownership, compatibility, customization, exports, and deployment."
          centered
        />

        <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
          {faqItems.map((item, index) => {
            const open = openIndex === index;

            return (
              <div key={item.question}>
                <button
                  onClick={() =>
                    setOpenIndex(open ? -1 : index)
                  }
                  className="flex w-full items-center justify-between gap-5 py-6 text-left"
                >
                  <span className="text-sm font-medium text-zinc-200 sm:text-base">
                    {item.question}
                  </span>

                  <ChevronDown
                    size={17}
                    className={`shrink-0 text-zinc-600 transition-transform duration-200 ${
                      open ? "rotate-180 text-zinc-300" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-200 ${
                    open
                      ? "grid-rows-[1fr] pb-6 opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-3xl pr-8 text-sm leading-7 text-zinc-600">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTASection({ onStart }) {
  return (
    <section className="px-5 pb-20 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-[#101014]">
        <div className="absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/[0.09] blur-[100px]" />

        <div className="relative px-6 py-20 text-center sm:px-10 lg:py-28">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/[0.08]">
            <Rocket size={21} className="text-indigo-400" />
          </div>

          <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
            Ready to ship your next big idea?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-zinc-500 sm:text-base">
            Start with a prompt. Leave with real code. Iterate until it feels
            like yours.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryButton onClick={onStart}>
              Start Building Free
            </PrimaryButton>

            <SecondaryButton
              onClick={() =>
                document
                  .getElementById("pricing")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Compare plans
            </SecondaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function DocsSection() {
  const docs = [
    ["Getting Started", "Create your first React project from a prompt and understand the builder workflow."],
    ["API Reference", "Learn how SiteCraft projects, files, previews, and publishing fit together."],
    ["Guides & Examples", "Explore practical patterns for dashboards, portfolios, SaaS pages, and business sites."],
  ];

  return (
    <section id="docs" className="scroll-mt-24 border-t border-white/[0.07] bg-[#09090b] py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/[0.06] px-3 py-1.5 text-xs font-medium text-indigo-300"><FileCode2 size={13} />Documentation</div>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Build with confidence.</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-500">Everything you need to understand the SiteCraft workflow, from your first prompt to a published React application.</p>
            <button type="button" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-white">Need help? Talk to us <ArrowRight size={15} /></button>
          </div>
          <div className="grid gap-3">
            {docs.map(([title, description], index) => (
              <article key={title} className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:border-indigo-400/20 hover:bg-white/[0.035]">
                <div className="flex items-start gap-4"><span className="font-mono text-xs text-zinc-600">0{index + 1}</span><div className="min-w-0 flex-1"><h3 className="text-sm font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p></div><ArrowUpRight size={16} className="mt-0.5 shrink-0 text-zinc-700 transition group-hover:text-indigo-400" /></div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 border-t border-white/[0.07] bg-[#0c0c0f] py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-zinc-300"><MessageSquare size={13} />Contact</div>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Have a question? Let's build something useful.</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-500">Tell us what you're trying to build or where you're stuck. Connect this form to your backend contact endpoint when you're ready.</p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-zinc-400"><span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]"><LifeBuoy size={16} className="text-indigo-400" /></span>Product and technical support</div>
              <div className="flex items-center gap-3 text-sm text-zinc-400"><span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]"><Globe2 size={16} className="text-indigo-400" /></span>Built for teams shipping React</div>
            </div>
          </div>
          <form onSubmit={(event) => event.preventDefault()} className="rounded-2xl border border-white/[0.08] bg-[#09090b] p-6 sm:p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <label><span className="text-xs font-medium text-zinc-400">Name</span><input required type="text" placeholder="Your name" className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-indigo-400/40" /></label>
              <label><span className="text-xs font-medium text-zinc-400">Email</span><input required type="email" placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-indigo-400/40" /></label>
              <label className="sm:col-span-2"><span className="text-xs font-medium text-zinc-400">Subject</span><input required type="text" placeholder="What can we help with?" className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-indigo-400/40" /></label>
              <label className="sm:col-span-2"><span className="text-xs font-medium text-zinc-400">Message</span><textarea required rows={5} placeholder="Tell us a little about your project..." className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-indigo-400/40" /></label>
            </div>
            <button type="submit" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 active:scale-[0.99]">Send message <ArrowRight size={15} /></button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  const columns = [
    {
      title: "Product",
      links: [
        "Features",
        "Product Showcase",
        "Pricing",
        "Changelog",
        "Roadmap",
      ],
    },
    {
      title: "Developers",
      links: [
        "Documentation",
        "API Reference",
        "GitHub",
        "Integrations",
        "Examples",
      ],
    },
    {
      title: "Resources",
      links: [
        "Guides",
        "Templates",
        "Community",
        "Help Center",
        "Status",
      ],
    },
    {
      title: "Company",
      links: [
        "About",
        "Careers",
        "Customers",
        "Contact",
        "Blog",
      ],
    },
    {
      title: "Legal",
      links: [
        "Privacy",
        "Terms",
        "Security",
        "Cookies",
        "Licenses",
      ],
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#08080a]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <SiteCraftLogo />

            <p className="mt-5 max-w-xs text-sm leading-6 text-zinc-600">
              An AI-native development workspace for turning ideas into
              editable, production-ready web experiences.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {[
                
                { icon: TwitterIcon, label: "X" },
                { icon: LinkedinIcon, label: "LinkedIn" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-zinc-600 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-zinc-300"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                  {column.title}
                </h3>

                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href={
                          link === "Documentation" || link === "API Reference" || link === "Guides"
                            ? "#docs"
                            : link === "Contact"
                              ? "#contact"
                              : link === "Features" || link === "Bento Features"
                                ? "#features"
                                : link === "Product Showcase"
                                  ? "#product-showcase"
                                  : link === "Pricing"
                                    ? "#pricing"
                                    : link === "Testimonials"
                                      ? "#testimonials"
                                      : "#"
                        }
                        className="text-xs text-zinc-700 transition hover:text-zinc-300"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-[10px] text-zinc-700 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {currentYear} SiteCraft AI. All rights reserved.
          </span>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              All systems operational
            </span>

            <span>Made for people who ship.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function TwitterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-3.5 w-3.5"
    >
      <path d="M18.9 2.5h3.2l-7 8 8.2 11h-6.4l-5-6.6-5.7 6.6H3l7.5-8.6L2.7 2.5h6.6l4.5 6 5.1-6Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-3.5 w-3.5"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 10v6M8 8.5v.01M12 16v-3.2a2.8 2.8 0 0 1 5.6 0V16M12 10v6" />
    </svg>
  );
}

function Navbar({ mobileOpen, setMobileOpen, onStart, onLogin }){
  const navItems = [
    ["Features", "features"],
    ["How It Works", "how-it-works"],
    ["Product Showcase", "product-showcase"],
    ["Bento Features", "features"],
    ["Pricing", "pricing"],
    ["Testimonials", "testimonials"],
    ["Docs", "docs"],
  ];

  const scrollTo = (id) => {
    setMobileOpen(false);

    window.setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <a href="#" aria-label="SiteCraft AI home">
          <SiteCraftLogo />
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map(([label, id]) => (
            <button
              key={label}
              onClick={() => scrollTo(id)}
              className="rounded-md px-3 py-2 text-xs font-medium text-zinc-500 transition duration-200 hover:bg-white/[0.04] hover:text-zinc-200"
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <button type="button" onClick={onLogin} className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition-all duration-200 hover:bg-zinc-200 hover:shadow-lg active:scale-95">
            Log In
          </button>

          <PrimaryButton
            onClick={onStart}
            className="px-4 py-2.5 text-xs"
          >
            Start Building Free
          </PrimaryButton>
        </div>

        <button
          onClick={() => setMobileOpen((value) => !value)}
          className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:text-white lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950 px-5 py-4 lg:hidden">
          <div className="space-y-1">
            {navItems.map(([label, id]) => (
              <button
                key={label}
                onClick={() => scrollTo(id)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm text-zinc-400 hover:bg-white/[0.04] hover:text-white"
              >
                {label}
                <ChevronRight size={15} />
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
            <button type="button" onClick={onLogin} className="rounded-lg border border-white/10 px-4 py-3 text-xs font-medium text-zinc-400 transition hover:border-white/20 hover:text-white">
              Log In
            </button>

            <button
              onClick={onStart}
              className="rounded-lg bg-indigo-500 px-4 py-3 text-xs font-semibold text-white"
            >
              Start Free
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleStartBuilding = () => {
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#09090b] text-zinc-100 selection:bg-indigo-500/30 selection:text-white">
      <Navbar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onStart={handleStartBuilding}
        onLogin={handleLogin}
      />

      <main>
        <HeroSection onStart={handleStartBuilding} />

        <BentoFeatureSection />

        <HowItWorksSection />

        <LiveDemoSection />

        <ArchitectureSection />

        <TestimonialsSection />

        <PricingSection />

        <FAQSection />

        <CTASection onStart={handleStartBuilding} />

        <DocsSection />

        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}