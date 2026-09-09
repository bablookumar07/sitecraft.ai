import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Loader2,
  Monitor,
  Smartphone,
  Tablet,
  AlertTriangle,
} from "lucide-react";
import API from "../API/api";

const PreviewPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [device, setDevice] = useState("desktop");
  const [previewKey, setPreviewKey] = useState(0);

  const loadProject = async (silent = false) => {
    if (!projectId) {
      setError("Project ID is missing.");
      setLoading(false);
      return;
    }

    try {
      if (silent) setRefreshing(true);
      else setLoading(true);

      setError("");

      const response = await API.get(`/projects/${projectId}`);

      if (response.data.success) {
        setProject(response.data.project);
      }
    } catch (err) {
      console.error("Preview project error:", err);

      if (err.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load this project."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const files = useMemo(() => project?.files || [], [project]);

  const previewDocument = useMemo(() => {
    if (!files.length) return "";

    const fileMap = Object.fromEntries(
      files.map((file) => [normalizePath(file.path), file.content || ""])
    );

    const css = files
      .filter((file) => /\.(css|scss|sass|less)$/i.test(file.path))
      .map((file) => file.content || "")
      .join("\n\n");

    const serialisedFiles = JSON.stringify(fileMap);

    return `<!doctype html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(project?.name || "SiteCraft Preview")}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style id="project-styles">${escapeHtml(css)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')}</style>
  <style>
    html, body, #root {
      margin: 0;
      min-height: 100%;
      width: 100%;
    }
    body {
      background: white;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <script>
    window.__SITECRAFT_FILES__ = ${serialisedFiles};
  </script>

  <script>
    window.__SITECRAFT_RUNTIME__ = () => {
      const React = window.React;
      const ReactDOM = window.ReactDOM;
      const files = window.__SITECRAFT_FILES__ || {};

      const localReact = React;

      function normalize(path) {
        if (!path) return "/";
        let value = path.replace(/\\\\/g, "/");
        if (!value.startsWith("/")) value = "/" + value;
        value = value.replace(/\\/+/g, "/");

        const parts = [];
        value.split("/").forEach((part) => {
          if (!part || part === ".") return;
          if (part === "..") parts.pop();
          else parts.push(part);
        });

        return "/" + parts.join("/");
      }

      function resolveFile(path) {
        const normalized = normalize(path);

        const candidates = [
          normalized,
          normalized + ".jsx",
          normalized + ".js",
          normalized + ".tsx",
          normalized + ".ts",
          normalized + "/index.jsx",
          normalized + "/index.js",
          normalized + "/index.tsx",
          normalized + "/index.ts",
        ];

        for (const candidate of candidates) {
          if (Object.prototype.hasOwnProperty.call(files, candidate)) {
            return candidate;
          }
        }

        return normalized;
      }

      function resolveImport(fromFile, request) {
        if (!request) return request;

        if (request.startsWith("@/")) {
          return resolveFile("/src/" + request.slice(2));
        }

        if (request.startsWith(".")) {
          const base = fromFile.slice(0, fromFile.lastIndexOf("/"));
          return resolveFile(normalize(base + "/" + request));
        }

        if (request.startsWith("/")) {
          return resolveFile(request);
        }

        return request;
      }

      const iconProxy = new Proxy({}, {
        get(_target, name) {
          return function Icon(props) {
            return React.createElement(
              "span",
              {
                ...props,
                style: {
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: props?.size || 18,
                  height: props?.size || 18,
                  lineHeight: 1,
                  ...(props?.style || {})
                },
                "aria-hidden": "true"
              },
              "•"
            );
          };
        }
      });

      function routerProxy() {
        const listeners = [];
        const notify = () => listeners.forEach((fn) => fn());

        window.addEventListener("popstate", notify);

        function navigate(to) {
          if (!to) return;
          const target = typeof to === "number" ? to : String(to);
          if (typeof to === "number") {
            window.history.go(to);
          } else {
            window.history.pushState({}, "", target);
            notify();
          }
        }

        const BrowserRouter = ({ children }) => {
          const [, force] = React.useState(0);
          React.useEffect(() => {
            const fn = () => force((v) => v + 1);
            listeners.push(fn);
            return () => {
              const index = listeners.indexOf(fn);
              if (index >= 0) listeners.splice(index, 1);
            };
          }, []);
          return React.createElement(React.Fragment, null, children);
        };

        const Routes = ({ children }) => {
          const pathname = window.location.pathname;
          const routes = React.Children.toArray(children);
          const match = routes.find((child) => {
            const path = child?.props?.path;
            if (!path) return false;
            if (path === "*") return true;
            if (path === pathname) return true;
            if (path.includes(":")) {
              const pattern = "^" + path
                .replace(/[.*+?^\${}()|[\\]\\\\]/g, "\\\\$&")
                .replace(/\\\\:([^/]+)/g, "([^/]+)") + "$";
              return new RegExp(pattern).test(pathname);
            }
            return false;
          });
          return match ? match.props.element : null;
        };

        const Route = () => null;
        const Link = ({ to, children, ...props }) =>
          React.createElement(
            "a",
            {
              ...props,
              href: to,
              onClick: (event) => {
                if (
                  to &&
                  typeof to === "string" &&
                  !to.startsWith("http") &&
                  !event.metaKey &&
                  !event.ctrlKey &&
                  !event.shiftKey &&
                  !event.altKey
                ) {
                  event.preventDefault();
                  navigate(to);
                }
              }
            },
            children
          );

        const useNavigate = () => navigate;
        const useLocation = () => ({
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash
        });

        return {
          BrowserRouter,
          Routes,
          Route,
          Link,
          NavLink: Link,
          useNavigate,
          useLocation,
          Outlet: ({ children }) => children || null,
          Navigate: ({ to }) => {
            navigate(to);
            return null;
          }
        };
      }

      const router = routerProxy();

      function getPackage(name) {
        if (name === "react") return React;

        if (name === "react-dom/client") {
          return {
            createRoot: (element) => ({
              render: (node) => ReactDOM.createRoot(element).render(node)
            })
          };
        }

        if (name === "react-dom") return ReactDOM;

        if (name === "lucide-react") return iconProxy;

        if (name === "react-router-dom") return router;

        if (
          name.endsWith(".css") ||
          name.endsWith(".scss") ||
          name.endsWith(".sass") ||
          name.endsWith(".less")
        ) {
          return {};
        }

        throw new Error("Unsupported package: " + name);
      }

      const moduleCache = {};

      function executeModule(filePath) {
        const resolved = resolveFile(filePath);

        if (!files[resolved]) {
          throw new Error("File not found: " + resolved);
        }

        if (moduleCache[resolved]) return moduleCache[resolved].exports;

        const module = { exports: {} };
        moduleCache[resolved] = module;

        let source = files[resolved];

        source = source
          .replace(/import\\s+['"][^'"]+\\.css['"];?/g, "")
          .replace(/import\\s+['"][^'"]+\\.scss['"];?/g, "")
          .replace(/import\\s+['"][^'"]+\\.sass['"];?/g, "")
          .replace(/import\\s+['"][^'"]+\\.less['"];?/g, "");

        let transformed;

        try {
          transformed = Babel.transform(source, {
            presets: ["react"],
            plugins: ["transform-modules-commonjs"]
          }).code;
        } catch (error) {
          throw new Error(
            "Babel error in " + resolved + ": " + error.message
          );
        }

        const localRequire = (request) => {
          if (
            request.startsWith(".") ||
            request.startsWith("@/") ||
            request.startsWith("/")
          ) {
            return executeModule(resolveImport(resolved, request));
          }

          return getPackage(request);
        };

        try {
          const runner = new Function(
            "module",
            "exports",
            "require",
            "React",
            transformed
          );

          runner(module, module.exports, localRequire, localReact);
        } catch (error) {
          throw new Error(
            "Runtime error in " + resolved + ": " + error.message
          );
        }

        return module.exports;
      }

      window.addEventListener("error", (event) => {
        const root = document.getElementById("root");
        if (!root) return;

        root.innerHTML = "";

        const box = document.createElement("div");
        box.style.cssText =
          "font-family:Inter,Arial,sans-serif;padding:32px;color:#7f1d1d;background:#fef2f2;min-height:100vh;";

        box.innerHTML =
          "<h2 style='margin:0 0 8px;font-size:18px;'>Preview runtime error</h2>" +
          "<pre style='white-space:pre-wrap;font-size:13px;line-height:1.6;'>" +
          String(event.error?.message || event.message || "Unknown error") +
          "</pre>";

        root.appendChild(box);
      });

      try {
        const appModule = executeModule("/App.jsx");
        const App = appModule.default || appModule.App || appModule;

        if (!App) {
          throw new Error("No default App export found in /App.jsx");
        }

        ReactDOM.createRoot(document.getElementById("root")).render(
          React.createElement(App)
        );
      } catch (error) {
        console.error(error);

        const root = document.getElementById("root");
        root.innerHTML = "";

        const box = document.createElement("div");
        box.style.cssText =
          "font-family:Inter,Arial,sans-serif;padding:32px;color:#7f1d1d;background:#fef2f2;min-height:100vh;";

        box.innerHTML =
          "<h2 style='margin:0 0 8px;font-size:18px;'>Unable to render preview</h2>" +
          "<p style='font-size:14px;line-height:1.6;color:#991b1b;'>" +
          String(error.message || error) +
          "</p>" +
          "<p style='font-size:12px;line-height:1.6;color:#7f1d1d;'>" +
          "Check the generated App.jsx and imported files in the Builder." +
          "</p>";

        root.appendChild(box);
      }
    };
  </script>

  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script>
    window.__SITECRAFT_RUNTIME__();
  </script>
</body>
</html>`;
  }, [files, project?.name, previewKey]);

  const frameWidth =
    device === "mobile"
      ? "w-[390px]"
      : device === "tablet"
        ? "w-[768px]"
        : "w-full";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-white">
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <Loader2 size={17} className="animate-spin text-indigo-400" />
          Loading preview...
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] px-5 text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101012] p-8 text-center">
          <AlertTriangle className="mx-auto text-red-400" size={22} />
          <h1 className="mt-4 text-lg font-semibold">
            Unable to load preview
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {error || "Project could not be found."}
          </p>

          <button
            type="button"
            onClick={() => navigate(`/builder/${projectId}`)}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            <ArrowLeft size={15} />
            Back to Builder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#09090b] text-white">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#0b0b0e] px-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/builder/${projectId}`)}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
            title="Back to Builder"
          >
            <ArrowLeft size={17} />
          </button>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {project.name}
            </p>
            <p className="text-[10px] text-zinc-600">
              Live project preview · {files.length} files
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.025] p-1">
          {[
            ["desktop", Monitor],
            ["tablet", Tablet],
            ["mobile", Smartphone],
          ].map(([value, Icon]) => (
            <button
              key={value}
              type="button"
              onClick={() => setDevice(value)}
              className={`rounded-md p-2 transition ${
                device === value
                  ? "bg-white/10 text-white"
                  : "text-zinc-500 hover:text-white"
              }`}
              title={value}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setPreviewKey((key) => key + 1);
              loadProject(true);
            }}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/[0.05] hover:text-white"
            title="Refresh preview"
          >
            <RefreshCw
              size={15}
              className={refreshing ? "animate-spin" : ""}
            />
          </button>

          <button
            type="button"
            onClick={() => navigate(`/publish/${projectId}`)}
            className="hidden items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.05] hover:text-white sm:flex"
          >
            <ExternalLink size={13} />
            Publish
          </button>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-auto bg-[#111114] p-3 sm:p-5">
        <div className="flex min-h-full justify-center">
          <div
            className={`${frameWidth} max-w-full overflow-hidden rounded-xl border border-white/10 bg-white shadow-2xl transition-[width] duration-300`}
          >
            <div className="flex h-8 items-center gap-1.5 border-b border-zinc-200 bg-zinc-50 px-3">
              <span className="h-2 w-2 rounded-full bg-zinc-300" />
              <span className="h-2 w-2 rounded-full bg-zinc-300" />
              <span className="h-2 w-2 rounded-full bg-zinc-300" />
              <div className="ml-3 flex-1 truncate rounded-md bg-zinc-100 px-3 py-1 text-[9px] text-zinc-400">
                SiteCraft AI · {project.name}
              </div>
            </div>

            {files.length ? (
              <iframe
                key={previewKey}
                title={`${project.name} preview`}
                srcDoc={previewDocument}
                className="block min-h-[calc(100vh-110px)] w-full border-0 bg-white"
                sandbox="allow-scripts allow-forms allow-modals allow-popups"
              />
            ) : (
              <div className="flex min-h-[calc(100vh-110px)] items-center justify-center p-10 text-center text-zinc-500">
                No generated files are available yet.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

function normalizePath(path = "") {
  let value = String(path).replace(/\\/g, "/");

  if (!value.startsWith("/")) {
    value = "/" + value;
  }

  return value.replace(/\/+/g, "/");
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default PreviewPage;
