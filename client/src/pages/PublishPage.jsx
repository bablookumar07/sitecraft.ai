

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe2,
  LockKeyhole,
  Rocket,
  Settings2,
  Sparkles,
  X,
} from "lucide-react";

const PublishPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [isPublished, setIsPublished] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const publishedUrl = `https://sitecraft.app/p/${projectId || "acme-website"}`;

  const handlePublish = () => {
    setIsPublished(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publishedUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error("Unable to copy URL:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#09090b]/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">

        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">

          <button
            type="button"
            onClick={() => navigate(`/builder/${projectId}`)}
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">
              Back to builder
            </span>
          </button>

          <div className="hidden h-5 w-px bg-white/10 sm:block" />

          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500">
              <Sparkles size={14} />
            </div>

            <span className="hidden text-sm font-semibold sm:inline">
              SiteCraft AI
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={() => navigate(`/preview/${projectId}`)}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 transition hover:bg-white/[0.04] hover:text-white"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">
              Preview
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="rounded-lg border border-white/10 p-2 text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
            title="Publish settings"
          >
            <Settings2 size={15} />
          </button>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-14">

        {/* Page heading */}
        <section className="text-center">

          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/[0.08] text-indigo-400">
            <Rocket size={21} />
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.18em] text-indigo-400">
            Deployment
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            {isPublished
              ? "Your site is live."
              : "Ready to publish?"}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-500">
            {isPublished
              ? "Your generated React website is now available on the web."
              : "Review your project and publish it when you're ready. You can update and republish your site at any time."}
          </p>
        </section>

        {/* ================= STATUS ================= */}
        <section className="mx-auto mt-10 max-w-3xl">

          <div
            className={`rounded-2xl border p-5 sm:p-6 ${
              isPublished
                ? "border-emerald-500/20 bg-emerald-500/[0.03]"
                : "border-white/10 bg-[#0d0d10]"
            }`}
          >

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-4">

                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    isPublished
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-indigo-500/10 text-indigo-400"
                  }`}
                >
                  {isPublished ? (
                    <CheckCircle2 size={19} />
                  ) : (
                    <Globe2 size={19} />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-zinc-200">
                    {isPublished
                      ? "Published successfully"
                      : "Production deployment"}
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    {isPublished
                      ? "Your project is publicly accessible."
                      : "React project • Production environment"}
                  </p>
                </div>
              </div>

              {!isPublished && (
                <button
                  type="button"
                  onClick={handlePublish}
                  className="flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-400"
                >
                  <Rocket size={14} />
                  Publish project
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ================= URL CARD ================= */}
        {isPublished && (
          <section className="mx-auto mt-4 max-w-3xl">

            <div className="rounded-2xl border border-white/10 bg-[#0d0d10] p-5 sm:p-6">

              <div className="flex items-center justify-between gap-4">

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                    Live URL
                  </p>

                  <p className="mt-2 truncate text-sm text-zinc-300">
                    {publishedUrl}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex shrink-0 items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 transition hover:bg-white/[0.04] hover:text-white"
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">

                <a
                  href={publishedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-400"
                >
                  Open live site
                  <ExternalLink size={13} />
                </a>

                <button
                  type="button"
                  onClick={() => navigate(`/builder/${projectId}`)}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-xs font-medium text-zinc-400 transition hover:bg-white/[0.04] hover:text-white"
                >
                  Continue editing
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ================= PROJECT DETAILS ================= */}
        <section className="mx-auto mt-10 max-w-3xl">

          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-700">
                Project
              </p>

              <h2 className="mt-1 text-lg font-semibold text-zinc-200">
                acme-website
              </h2>
            </div>

            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                isPublished
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-amber-500/10 text-amber-400"
              }`}
            >
              {isPublished ? "Live" : "Not published"}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">

            <div className="rounded-xl border border-white/10 bg-[#0d0d10] p-4">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-500">
                <CodeIcon />
              </div>

              <p className="text-[10px] text-zinc-700">
                Framework
              </p>

              <p className="mt-1 text-xs font-medium text-zinc-300">
                React + Vite
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0d0d10] p-4">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-500">
                <Globe2 size={15} />
              </div>

              <p className="text-[10px] text-zinc-700">
                Environment
              </p>

              <p className="mt-1 text-xs font-medium text-zinc-300">
                Production
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0d0d10] p-4">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-500">
                <LockKeyhole size={15} />
              </div>

              <p className="text-[10px] text-zinc-700">
                Visibility
              </p>

              <p className="mt-1 text-xs font-medium text-zinc-300">
                Public
              </p>
            </div>
          </div>
        </section>

        {/* ================= DEPLOYMENT CHECKLIST ================= */}
        <section className="mx-auto mt-10 max-w-3xl">

          <div className="rounded-2xl border border-white/10 bg-[#0d0d10] p-5 sm:p-6">

            <div className="mb-6">
              <h2 className="text-sm font-semibold text-zinc-200">
                Deployment checklist
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                Your project has passed the basic deployment checks.
              </p>
            </div>

            <div className="space-y-4">

              {[
                {
                  label: "Project files generated",
                  detail: "React source files are available",
                },
                {
                  label: "Dependencies configured",
                  detail: "Required packages are defined",
                },
                {
                  label: "Production build ready",
                  detail: "Project can be deployed",
                },
                {
                  label: "Public URL configured",
                  detail: "A shareable deployment URL is available",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                    <Check size={11} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-zinc-300">
                      {item.label}
                    </p>

                    <p className="mt-0.5 text-[10px] text-zinc-700">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* ================= SECURITY NOTE ================= */}
        <section className="mx-auto mt-8 max-w-3xl">

          <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.015] p-4">
            <LockKeyhole
              size={15}
              className="mt-0.5 shrink-0 text-zinc-700"
            />

            <p className="text-[10px] leading-5 text-zinc-700">
              Published projects are publicly accessible. Make sure your
              generated website does not contain private credentials,
              API keys, or other sensitive information.
            </p>
          </div>
        </section>

        {/* ================= BOTTOM ================= */}
        <div className="mx-auto mt-12 max-w-3xl border-t border-white/5 pt-6 text-center">
          <button
            type="button"
            onClick={() => navigate(`/builder/${projectId}`)}
            className="text-xs text-zinc-600 transition hover:text-zinc-300"
          >
            ← Return to editor
          </button>
        </div>
      </main>

      {/* ================= SETTINGS MODAL ================= */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111114] shadow-2xl">

            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">
                  Publish settings
                </h3>

                <p className="mt-1 text-[10px] text-zinc-600">
                  Configure your deployment.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="text-zinc-600 transition hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-5 p-5">

              <div>
                <label className="mb-2 block text-xs font-medium text-zinc-400">
                  Project name
                </label>

                <input
                  type="text"
                  defaultValue="acme-website"
                  className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs text-zinc-300 outline-none focus:border-indigo-500/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-zinc-400">
                  Visibility
                </label>

                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <div className="flex items-center gap-3">
                    <Globe2 size={15} className="text-zinc-500" />

                    <div>
                      <p className="text-xs text-zinc-300">
                        Public
                      </p>

                      <p className="mt-0.5 text-[10px] text-zinc-700">
                        Anyone with the URL can view the site.
                      </p>
                    </div>
                  </div>

                  <div className="h-4 w-4 rounded-full border-4 border-indigo-500 bg-transparent" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="w-full rounded-lg bg-indigo-500 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-400"
              >
                Save settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CodeIcon = () => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
};

export default PublishPage;

