import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowUpRight,
  ChevronDown,
  Clock3,
  Code2,
  FileCode2,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  X,
} from "lucide-react";

import API from "../API/api";
import { useAuth } from "../context/AuthContext";


// ============================================================
// QUICK PROMPTS
// ============================================================

const quickPrompts = [
  {
    title: "Restaurant",
    description: "A modern restaurant website",
    prompt:
      "Build a modern restaurant website with a hero section, menu, about section, testimonials and contact form.",
  },
  {
    title: "Personal",
    description: "A personal portfolio",
    prompt:
      "Build a clean personal portfolio website with a hero section, projects, skills, experience and contact section.",
  },
  {
    title: "Business",
    description: "A business website",
    prompt:
      "Build a professional business website with a strong hero section, services, company information and contact section.",
  },
  {
    title: "Marketing",
    description: "A marketing landing page",
    prompt:
      "Build a high-converting SaaS marketing landing page with features, pricing, testimonials and a call to action.",
  },
];


// ============================================================
// HELPERS
// ============================================================

const getInitials = (name = "") => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[
    parts.length - 1
  ][0]}`.toUpperCase();
};


const formatUpdatedTime = (date) => {
  if (!date) {
    return "Recently";
  }

  const updatedDate = new Date(date);

  if (Number.isNaN(updatedDate.getTime())) {
    return "Recently";
  }

  const now = new Date();

  const difference =
    now.getTime() - updatedDate.getTime();

  const minutes = Math.floor(
    difference / (1000 * 60)
  );

  const hours = Math.floor(
    difference / (1000 * 60 * 60)
  );

  const days = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min${
      minutes === 1 ? "" : "s"
    } ago`;
  }

  if (hours < 24) {
    return `${hours} hour${
      hours === 1 ? "" : "s"
    } ago`;
  }

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  return updatedDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
};


const getStatusLabel = (status) => {
  if (!status) {
    return "Draft";
  }

  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
};


// ============================================================
// DASHBOARD PAGE
// ============================================================

const DashboardPage = () => {
  const navigate = useNavigate();

  const {
    user,
    logout,
    loading: authLoading,
  } = useAuth();

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  const [prompt, setPrompt] = useState("");

  const [projects, setProjects] = useState([]);

  const [projectsLoading, setProjectsLoading] =
    useState(true);

  const [projectsError, setProjectsError] =
    useState("");

  const [generating, setGenerating] =
    useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const [userMenuOpen, setUserMenuOpen] =
    useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);


  // ----------------------------------------------------------
  // USER
  // ----------------------------------------------------------

  const userName = user?.name || "User";

  const userEmail =
    user?.email || "user@example.com";

  const userInitials = getInitials(
    user?.name
  );


  // ==========================================================
  // GET USER PROJECTS
  // ==========================================================

  const fetchProjects = useCallback(
    async () => {
      try {
        setProjectsError("");

        setProjectsLoading(true);

        const response =
          await API.get("/projects");

        if (response.data.success) {
          setProjects(
            response.data.projects || []
          );
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error(
          "Fetch projects error:",
          error
        );

        if (
          error.response?.status === 401
        ) {
          navigate("/login", {
            replace: true,
          });

          return;
        }

        setProjectsError(
          error.response?.data?.message ||
            "Unable to load your projects."
        );
      } finally {
        setProjectsLoading(false);
      }
    },
    [navigate]
  );


  // ----------------------------------------------------------
  // FETCH PROJECTS AFTER AUTH IS READY
  // ----------------------------------------------------------

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    fetchProjects();
  }, [
    authLoading,
    user,
    navigate,
    fetchProjects,
  ]);


  // ==========================================================
  // CREATE PROJECT
  // ==========================================================

  const handlePromptSubmit = async (e) => {
    e.preventDefault();

    const trimmedPrompt =
      prompt.trim();

    if (
      !trimmedPrompt ||
      generating
    ) {
      return;
    }

    try {
      setGenerating(true);

      setProjectsError("");

      const response = await API.post(
        "/projects",
        {
          prompt: trimmedPrompt,
        }
      );

      if (response.data.success) {
        const createdProject =
          response.data.project;

        const projectId =
          createdProject?._id ||
          createdProject?.id;

        if (!projectId) {
          throw new Error(
            "Project ID was not returned by the server."
          );
        }

        setPrompt("");

        // Background generation has already
        // started on the server.
        navigate(
          `/builder/${projectId}`
        );

        return;
      }

      setProjectsError(
        response.data.message ||
          "Unable to create your project."
      );
    } catch (error) {
      console.error(
        "Create project error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      setProjectsError(
        error.response?.data?.message ||
          error.message ||
          "Unable to create your project. Please try again."
      );
    } finally {
      setGenerating(false);
    }
  };


  // ==========================================================
  // QUICK PROMPT
  // ==========================================================

  const handleQuickPrompt = (
    selectedPrompt
  ) => {
    setPrompt(selectedPrompt);

    setProjectsError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);

      await logout();

      setUserMenuOpen(false);

      setMobileSidebarOpen(false);

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    } finally {
      setLoggingOut(false);
    }
  };


  // ==========================================================
  // PROJECT CLICK
  // ==========================================================

  const handleProjectClick = (
    projectId
  ) => {
    if (!projectId) {
      return;
    }

    navigate(
      `/builder/${projectId}`
    );
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#09090b] text-white">

      {/* ====================================================
          MOBILE SIDEBAR OVERLAY
      ==================================================== */}

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() =>
            setMobileSidebarOpen(false)
          }
        />
      )}


      {/* ====================================================
          SIDEBAR
      ==================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-white/10 bg-[#0b0b0e] transition-transform duration-200 lg:translate-x-0 ${
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* Logo */}

        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            className="flex items-center gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500">
              <Sparkles size={16} />
            </div>

            <span className="text-sm font-semibold tracking-tight">
              SiteCraft AI
            </span>
          </button>


          <button
            type="button"
            onClick={() =>
              setMobileSidebarOpen(false)
            }
            className="text-zinc-600 transition hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>

        </div>


        {/* Navigation */}

        <div className="flex-1 px-3 py-5">

          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-700">
            Workspace
          </p>


          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg bg-white/[0.06] px-3 py-2.5 text-sm font-medium text-white"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>


          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              })
            }
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-500 transition hover:bg-white/[0.04] hover:text-zinc-200"
          >
            <FileCode2 size={16} />
            Projects
          </button>


          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              })
            }
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-500 transition hover:bg-white/[0.04] hover:text-zinc-200"
          >
            <Clock3 size={16} />
            Activity
          </button>


          <div className="my-6 h-px bg-white/5" />


          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-700">
            Account
          </p>


          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-500 transition hover:bg-white/[0.04] hover:text-zinc-200"
          >
            <Settings size={16} />
            Settings
          </button>

        </div>


        {/* User */}

        <div className="border-t border-white/10 p-3">

          <div className="flex items-center gap-3 rounded-lg px-2 py-2">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-semibold text-indigo-300">
              {userInitials}
            </div>


            <div className="min-w-0 flex-1">

              <p className="truncate text-xs font-medium text-zinc-200">
                {userName}
              </p>

              <p className="truncate text-[11px] text-zinc-600">
                {userEmail}
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                setUserMenuOpen(
                  (prev) => !prev
                )
              }
              className="text-zinc-600 transition hover:text-white"
              aria-label="Open user menu"
            >
              <MoreHorizontal size={17} />
            </button>

          </div>

        </div>

      </aside>


      {/* ====================================================
          MAIN
      ==================================================== */}

      <main className="lg:pl-[250px]">

        {/* Topbar */}

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#09090b]/90 px-5 backdrop-blur-md sm:px-8">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                setMobileSidebarOpen(true)
              }
              className="text-zinc-500 transition hover:text-white lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>


            <div className="hidden items-center gap-2 text-sm text-zinc-600 sm:flex">
              <span>Workspace</span>
              <span>/</span>
              <span className="text-zinc-300">
                Dashboard
              </span>
            </div>


            <span className="text-sm font-medium text-zinc-300 sm:hidden">
              Dashboard
            </span>

          </div>


          {/* User Menu */}

          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setUserMenuOpen(
                  (prev) => !prev
                )
              }
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-white/[0.04]"
              aria-expanded={
                userMenuOpen
              }
            >

              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/15 text-[10px] font-semibold text-indigo-300">
                {userInitials}
              </div>


              <span className="hidden max-w-[120px] truncate text-xs text-zinc-400 sm:block">
                {userName}
              </span>


              <ChevronDown
                size={14}
                className="text-zinc-600"
              />

            </button>


            {userMenuOpen && (
              <div className="absolute right-0 top-11 w-52 overflow-hidden rounded-lg border border-white/10 bg-[#111114] p-1 shadow-2xl">

                <div className="border-b border-white/5 px-3 py-2.5">

                  <p className="truncate text-xs font-medium text-zinc-200">
                    {userName}
                  </p>

                  <p className="mt-0.5 truncate text-[10px] text-zinc-600">
                    {userEmail}
                  </p>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setUserMenuOpen(
                      false
                    )
                  }
                  className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <Settings size={14} />
                  Account settings
                </button>


                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-zinc-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {loggingOut ? (
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <LogOut size={14} />
                  )}

                  {loggingOut
                    ? "Signing out..."
                    : "Sign out"}

                </button>

              </div>
            )}

          </div>

        </header>


        {/* ==================================================
            CONTENT
        ================================================== */}

        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10">

          {/* ==================================================
              HERO
          ================================================== */}

          <section className="mx-auto max-w-4xl pt-6 text-center">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/[0.06] px-3 py-1.5 text-[11px] font-medium text-indigo-300">
              <Sparkles size={13} />
              AI website builder
            </div>


            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              What do you want to build?
            </h1>


            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-[15px]">
              Describe your idea and SiteCraft AI
              will turn it into a production-ready
              React website that you can edit and
              customize.
            </p>


            {/* Prompt Box */}

            <form
              onSubmit={
                handlePromptSubmit
              }
              className="mx-auto mt-8 max-w-3xl"
            >

              <div className="group overflow-hidden rounded-xl border border-white/10 bg-[#0d0d10] text-left shadow-2xl shadow-black/20 transition focus-within:border-indigo-500/40">

                <textarea
                  value={prompt}
                  onChange={(e) =>
                    setPrompt(
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Describe the website you want to create..."
                  disabled={generating}
                  className="w-full resize-none bg-transparent px-5 py-4 text-sm leading-6 text-white outline-none placeholder:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
                />


                <div className="flex items-center justify-between border-t border-white/[0.07] px-4 py-3">

                  <div className="flex items-center gap-2 text-[11px] text-zinc-600">
                    <Code2 size={14} />
                    React + Tailwind
                  </div>


                  <button
                    type="submit"
                    disabled={
                      !prompt.trim() ||
                      generating
                    }
                    className="group flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >

                    {generating ? (
                      <>
                        <Loader2
                          size={14}
                          className="animate-spin"
                        />

                        Creating...
                      </>
                    ) : (
                      <>
                        Generate

                        <ArrowUpRight
                          size={14}
                          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </>
                    )}

                  </button>

                </div>

              </div>

            </form>


            {/* Error */}

            {projectsError && (
              <div className="mx-auto mt-4 flex max-w-3xl items-center justify-between gap-4 rounded-lg border border-red-500/20 bg-red-500/[0.05] px-4 py-3 text-left">

                <p className="text-xs leading-5 text-red-300">
                  {projectsError}
                </p>


                <button
                  type="button"
                  onClick={fetchProjects}
                  className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-zinc-400 transition hover:text-white"
                >
                  <RefreshCw size={12} />
                  Retry
                </button>

              </div>
            )}

          </section>


          {/* ==================================================
              QUICK PROMPTS
          ================================================== */}

          <section className="mx-auto mt-10 max-w-4xl">

            <div className="mb-4 flex items-center justify-between">

              <p className="text-xs font-medium text-zinc-400">
                Start with a template idea
              </p>

              <p className="hidden text-[11px] text-zinc-700 sm:block">
                Choose a prompt to get started
              </p>

            </div>


            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">

              {quickPrompts.map(
                (item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() =>
                      handleQuickPrompt(
                        item.prompt
                      )
                    }
                    disabled={generating}
                    className="group rounded-lg border border-white/10 bg-white/[0.02] p-4 text-left transition hover:-translate-y-0.5 hover:border-indigo-500/25 hover:bg-white/[0.035] disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-zinc-400 transition group-hover:border-indigo-500/20 group-hover:text-indigo-300">
                      <Sparkles size={15} />
                    </div>


                    <p className="text-sm font-medium text-zinc-200">
                      {item.title}
                    </p>


                    <p className="mt-1 text-[11px] leading-5 text-zinc-600">
                      {item.description}
                    </p>

                  </button>
                )
              )}

            </div>

          </section>


          {/* ==================================================
              RECENT PROJECTS
          ================================================== */}

          <section className="mt-16">

            <div className="mb-5 flex items-end justify-between">

              <div>

                <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-600">
                  Workspace
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-100">
                  Recent projects
                </h2>

              </div>


              {!projectsLoading &&
                projects.length > 0 && (
                  <button
                    type="button"
                    onClick={fetchProjects}
                    className="hidden items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-white sm:flex"
                  >
                    <RefreshCw size={12} />
                    Refresh
                  </button>
                )}

            </div>


            {/* Loading */}

            {projectsLoading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                {[1, 2, 3].map(
                  (item) => (
                    <div
                      key={item}
                      className="overflow-hidden rounded-xl border border-white/10 bg-[#0d0d10]"
                    >

                      <div className="h-36 animate-pulse border-b border-white/10 bg-white/[0.02]" />


                      <div className="space-y-3 p-4">

                        <div className="h-4 w-32 animate-pulse rounded bg-white/[0.05]" />

                        <div className="h-3 w-48 animate-pulse rounded bg-white/[0.04]" />

                        <div className="flex justify-between pt-2">

                          <div className="h-3 w-20 animate-pulse rounded bg-white/[0.04]" />

                          <div className="h-5 w-12 animate-pulse rounded-full bg-white/[0.05]" />

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>
            ) : projects.length > 0 ? (

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                {projects.map(
                  (project) => {

                    const projectId =
                      project._id ||
                      project.id;

                    return (
                      <button
                        key={projectId}
                        type="button"
                        onClick={() =>
                          handleProjectClick(
                            projectId
                          )
                        }
                        className="group overflow-hidden rounded-xl border border-white/10 bg-[#0d0d10] text-left transition hover:-translate-y-0.5 hover:border-white/15"
                      >

                        {/* Project Preview */}

                        <div className="relative h-36 overflow-hidden border-b border-white/10 bg-[#111115]">

                          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:20px_20px]" />


                          <div className="absolute left-6 right-6 top-5 rounded-lg border border-white/10 bg-[#18181c] p-3 shadow-xl">

                            <div className="mb-3 h-2 w-20 rounded bg-zinc-700/60" />


                            <div className="grid grid-cols-3 gap-2">

                              <div className="h-10 rounded bg-white/[0.05]" />

                              <div className="h-10 rounded bg-indigo-500/10" />

                              <div className="h-10 rounded bg-white/[0.05]" />

                            </div>

                          </div>


                          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md border border-white/10 bg-black/60 px-2 py-1 text-[9px] text-zinc-500 backdrop-blur-sm">
                            <Code2 size={10} />
                            React
                          </div>

                        </div>


                        {/* Project Info */}

                        <div className="p-4">

                          <div className="flex items-start justify-between gap-3">

                            <div className="min-w-0">

                              <h3 className="truncate text-sm font-medium text-zinc-200 transition group-hover:text-white">
                                {project.name ||
                                  "Untitled Project"}
                              </h3>


                              <p className="mt-1 truncate text-[11px] text-zinc-600">
                                {project.description ||
                                  "AI generated React website"}
                              </p>

                            </div>


                            <MoreHorizontal
                              size={16}
                              className="shrink-0 text-zinc-700"
                            />

                          </div>


                          <div className="mt-4 flex items-center justify-between">

                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-700">

                              <Clock3 size={11} />

                              {formatUpdatedTime(
                                project.updatedAt
                              )}

                            </div>


                            <span
                              className={`rounded-full px-2 py-1 text-[9px] font-medium ${
                                project.status ===
                                "ready"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : project.status ===
                                    "failed"
                                  ? "bg-red-500/10 text-red-400"
                                  : project.status ===
                                    "generating"
                                  ? "bg-indigo-500/10 text-indigo-400"
                                  : "bg-amber-500/10 text-amber-400"
                              }`}
                            >
                              {getStatusLabel(
                                project.status
                              )}
                            </span>

                          </div>

                        </div>

                      </button>
                    );
                  }
                )}


                {/* New Project Card */}

                <button
                  type="button"
                  onClick={() => {
                    setPrompt("");

                    setProjectsError("");

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  className="group flex min-h-[246px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.01] text-center transition hover:border-indigo-500/30 hover:bg-indigo-500/[0.02]"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-500 transition group-hover:border-indigo-500/20 group-hover:text-indigo-300">
                    <Plus size={18} />
                  </div>


                  <p className="mt-3 text-sm font-medium text-zinc-400">
                    Create a new project
                  </p>


                  <p className="mt-1 text-[11px] text-zinc-700">
                    Start with an AI prompt
                  </p>

                </button>

              </div>

            ) : (

              /* Empty State */

              <div className="rounded-xl border border-dashed border-white/10 px-6 py-16 text-center">

                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-600">
                  <Search size={17} />
                </div>


                <h3 className="mt-4 text-sm font-medium text-zinc-300">
                  No projects yet
                </h3>


                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-zinc-600">
                  Create your first project
                  using the prompt above.
                </p>


                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-zinc-400 transition hover:border-indigo-500/20 hover:text-white"
                >
                  <Plus size={13} />
                  Create project
                </button>

              </div>
            )}

          </section>


          {/* ==================================================
              BOTTOM NOTE
          ================================================== */}

          <div className="mt-16 border-t border-white/5 py-8 text-center">

            <p className="text-[11px] text-zinc-700">
              SiteCraft AI generates editable React
              source code. You remain in control of
              every line.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
};


export default DashboardPage;