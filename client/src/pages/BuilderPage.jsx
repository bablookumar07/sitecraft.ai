import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../API/api";

const BuilderPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editedCode, setEditedCode] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("code");

  /* =========================================================
     FETCH PROJECT
  ========================================================= */

  const fetchProject = useCallback(
    async (showLoader = false) => {
      if (!projectId) return;

      try {
        if (showLoader) {
          setLoading(true);
        }

        const response = await API.get(`/projects/${projectId}`);

        const projectData = response.data;

        setProject(projectData);

        setSelectedFile((currentFile) => {
          if (!projectData.files?.length) {
            return null;
          }

          if (currentFile) {
            const updatedFile = projectData.files.find(
              (file) => file.path === currentFile.path
            );

            if (updatedFile) {
              setEditedCode(updatedFile.content || "");
              return updatedFile;
            }
          }

          const firstFile = projectData.files[0];

          setEditedCode(firstFile.content || "");

          return firstFile;
        });

        setError("");
      } catch (err) {
        console.error("❌ Failed to fetch project:", err);

        setError(
          err?.response?.data?.message ||
            "Failed to load project"
        );
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    [projectId]
  );

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchProject(true);
  }, [fetchProject]);

  /* =========================================================
     LIVE PROJECT POLLING
  ========================================================= */

  useEffect(() => {
    if (!projectId) return;

    const interval = setInterval(async () => {
      try {
        const response = await API.get(
          `/projects/${projectId}`
        );

        const latestProject = response.data;

        setProject(latestProject);

        setSelectedFile((currentFile) => {
          if (!currentFile) {
            if (latestProject.files?.length) {
              const firstFile = latestProject.files[0];

              setEditedCode(firstFile.content || "");

              return firstFile;
            }

            return null;
          }

          const latestFile = latestProject.files?.find(
            (file) => file.path === currentFile.path
          );

          if (latestFile) {
            /*
             * Only update editor automatically when
             * user is not currently editing a different value.
             */
            setEditedCode((currentCode) => {
              if (currentCode === currentFile.content) {
                return latestFile.content || "";
              }

              return currentCode;
            });

            return latestFile;
          }

          return currentFile;
        });
      } catch (err) {
        console.error(
          "❌ Project polling error:",
          err
        );
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [projectId]);

  /* =========================================================
     SELECT FILE
  ========================================================= */

  const handleFileSelect = (file) => {
    if (!file) return;

    setSelectedFile(file);
    setEditedCode(file.content || "");
    setActiveTab("code");
  };

  /* =========================================================
     SAVE SELECTED FILE
  ========================================================= */

  const handleSave = async () => {
    if (!projectId || !selectedFile) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      /*
       * IMPORTANT:
       * Only send the selected file.
       *
       * Backend now MERGES this file into the existing
       * project.files array instead of replacing all files.
       */

      const response = await API.put(
        `/projects/${projectId}/files`,
        {
          files: [
            {
              path: selectedFile.path,
              content: editedCode,
            },
          ],
        }
      );

      const updatedProject = response.data;

      setProject(updatedProject);

      const updatedFile = updatedProject.files?.find(
        (file) => file.path === selectedFile.path
      );

      if (updatedFile) {
        setSelectedFile(updatedFile);
        setEditedCode(updatedFile.content || "");
      }

      console.log(
        `✅ Saved ${selectedFile.path}`
      );
    } catch (err) {
      console.error(
        "❌ Failed to save file:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to save file"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     PREVIEW
  ========================================================= */

  const handlePreview = () => {
    if (!projectId) return;

    navigate(`/preview/${projectId}`);
  };

  /* =========================================================
     PUBLISH
  ========================================================= */

  const handlePublish = () => {
    if (!projectId) return;

    navigate(`/publish/${projectId}`);
  };

  /* =========================================================
     FILE ICON
  ========================================================= */

  const getFileIcon = (path = "") => {
    const lowerPath = path.toLowerCase();

    if (lowerPath.endsWith(".jsx")) return "⚛";
    if (lowerPath.endsWith(".js")) return "JS";
    if (lowerPath.endsWith(".css")) return "#";
    if (lowerPath.endsWith(".json")) return "{}";
    if (lowerPath.endsWith(".html")) return "◇";
    if (lowerPath.endsWith(".md")) return "M";

    return "•";
  };

  /* =========================================================
     GROUP FILES
  ========================================================= */

  const groupedFiles = useMemo(() => {
    if (!project?.files?.length) {
      return {};
    }

    const groups = {};

    project.files.forEach((file) => {
      const parts = file.path.split("/");

      if (parts.length === 1) {
        if (!groups["root"]) {
          groups["root"] = [];
        }

        groups["root"].push(file);
        return;
      }

      const folder = parts[1] || "root";

      if (!groups[folder]) {
        groups[folder] = [];
      }

      groups[folder].push(file);
    });

    return groups;
  }, [project]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-white/50">
            Loading builder...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR / NO PROJECT
  ========================================================= */

  if (!project) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">
            ⚠️
          </div>

          <h1 className="text-xl font-semibold mb-2">
            Unable to load project
          </h1>

          <p className="text-sm text-white/50 mb-6">
            {error || "Project not found"}
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col">

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <header className="h-16 border-b border-white/10 flex items-center justify-between px-5 shrink-0">

        <div className="flex items-center gap-4">

          <button
            onClick={() => navigate("/dashboard")}
            className="text-white/50 hover:text-white transition"
            title="Back to dashboard"
          >
            ←
          </button>

          <div>
            <h1 className="text-sm font-semibold">
              {project.name || "Untitled Project"}
            </h1>

            <p className="text-[11px] text-white/40">
              {project.status === "generating"
                ? "Generating..."
                : project.status === "ready"
                ? `${project.files?.length || 0} files`
                : project.status}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={handlePreview}
            className="px-4 py-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-sm transition"
          >
            Preview
          </button>

          <button
            onClick={handlePublish}
            className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 text-sm font-medium transition"
          >
            Publish
          </button>

        </div>
      </header>


      {/* =====================================================
          ERROR BAR
      ===================================================== */}

      {error && (
        <div className="px-5 py-2 border-b border-red-500/20 bg-red-500/5 text-red-300 text-xs">
          {error}
        </div>
      )}


      {/* =====================================================
          BUILDER
      ===================================================== */}

      <div className="flex-1 flex min-h-0">

        {/* ===================================================
            FILE SIDEBAR
        =================================================== */}

        <aside className="w-64 border-r border-white/10 bg-[#0c0c0f] flex flex-col shrink-0">

          <div className="h-12 px-4 flex items-center justify-between border-b border-white/10">

            <span className="text-xs font-medium text-white/70">
              Files
            </span>

            <span className="text-[10px] text-white/30">
              {project.files?.length || 0}
            </span>

          </div>

          <div className="flex-1 overflow-y-auto p-2">

            {Object.entries(groupedFiles).map(
              ([folder, files]) => (
                <div key={folder} className="mb-3">

                  {folder !== "root" && (
                    <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-white/30">
                      {folder}
                    </div>
                  )}

                  {files.map((file) => {

                    const isSelected =
                      selectedFile?.path === file.path;

                    return (
                      <button
                        key={file.path}
                        onClick={() =>
                          handleFileSelect(file)
                        }
                        className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-left text-xs transition ${
                          isSelected
                            ? "bg-white/10 text-white"
                            : "text-white/50 hover:bg-white/[0.05] hover:text-white/80"
                        }`}
                      >

                        <span className="w-5 text-[10px] text-white/40">
                          {getFileIcon(file.path)}
                        </span>

                        <span className="truncate">
                          {file.path.split("/").pop()}
                        </span>

                      </button>
                    );
                  })}

                </div>
              )
            )}

            {!project.files?.length && (
              <div className="p-4 text-xs text-white/30">
                {project.status === "generating"
                  ? "AI is generating files..."
                  : "No files available"}
              </div>
            )}

          </div>
        </aside>


        {/* ===================================================
            CODE EDITOR
        =================================================== */}

        <main className="flex-1 flex flex-col min-w-0">

          <div className="h-12 border-b border-white/10 flex items-center justify-between px-4">

            <div className="flex items-center gap-1">

              <button
                onClick={() => setActiveTab("code")}
                className={`px-3 py-1.5 rounded-md text-xs transition ${
                  activeTab === "code"
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                Code
              </button>

            </div>

            <div className="flex items-center gap-2">

              {selectedFile && (
                <span className="text-[11px] text-white/30 mr-2">
                  {selectedFile.path}
                </span>
              )}

              <button
                onClick={handleSave}
                disabled={!selectedFile || saving}
                className="px-3.5 py-1.5 rounded-md bg-white text-black text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/90 transition"
              >
                {saving ? "Saving..." : "Save"}
              </button>

            </div>

          </div>


          <div className="flex-1 min-h-0 bg-[#08080a]">

            {selectedFile ? (
              <textarea
                value={editedCode}
                onChange={(e) =>
                  setEditedCode(e.target.value)
                }
                spellCheck={false}
                className="w-full h-full resize-none outline-none border-0 bg-transparent text-white/80 font-mono text-[13px] leading-6 p-5"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-white/30 text-sm">
                Select a file to start editing
              </div>
            )}

          </div>

        </main>


        {/* ===================================================
            RIGHT PREVIEW PANEL
        =================================================== */}

        <aside className="w-[38%] min-w-[360px] border-l border-white/10 bg-[#0c0c0f] flex flex-col shrink-0">

          <div className="h-12 border-b border-white/10 flex items-center justify-between px-4">

            <span className="text-xs font-medium text-white/70">
              Preview
            </span>

            <button
              onClick={handlePreview}
              className="text-[11px] text-white/40 hover:text-white transition"
            >
              Open full preview ↗
            </button>

          </div>

          <div className="flex-1 p-4">

            <div className="h-full rounded-xl border border-white/10 bg-white overflow-hidden">

              <div className="h-7 bg-[#f4f4f5] border-b border-black/10 flex items-center gap-1.5 px-3">

                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="w-2 h-2 rounded-full bg-green-400" />

              </div>

              <div className="h-[calc(100%-28px)] flex items-center justify-center text-gray-400 text-sm">

                {project.status === "generating" ? (
                  <div className="text-center">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin mx-auto mb-3" />

                    <p>
                      Generating your website...
                    </p>

                    <p className="text-xs mt-1 text-gray-400">
                      {project.files?.length || 0} files generated
                    </p>
                  </div>
                ) : project.files?.length ? (
                  <div className="text-center px-6">
                    <p className="text-gray-500 font-medium mb-1">
                      Website ready
                    </p>

                    <p className="text-xs text-gray-400 mb-4">
                      Open Preview to see the generated website.
                    </p>

                    <button
                      onClick={handlePreview}
                      className="px-4 py-2 rounded-lg bg-black text-white text-xs font-medium hover:bg-black/80 transition"
                    >
                      Open Preview
                    </button>
                  </div>
                ) : (
                  <p>
                    Preview will appear here
                  </p>
                )}

              </div>

            </div>

          </div>

        </aside>

      </div>

    </div>
  );
};

export default BuilderPage;