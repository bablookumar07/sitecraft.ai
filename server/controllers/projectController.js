import Project from "../models/projectModel.js";

import {
  generateProject,
  reviseProject,
} from "../services/AI.js";

// ============================================================
// CREATE PROJECT
// ============================================================

export const createProject = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (
      typeof prompt !== "string" ||
      !prompt.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Project prompt is required",
      });
    }

    const cleanPrompt = prompt.trim();

    // ----------------------------------------------------------
    // Create initial project
    // ----------------------------------------------------------

    const project = await Project.create({
      userId: req.userId,

      name:
        cleanPrompt.slice(0, 60),

      description: "",

      prompt: cleanPrompt,

      status: "generating",

      version: 1,

      messages: [
        {
          role: "user",
          content: cleanPrompt,
        },
      ],

      files: [],
    });

    console.log(
      `🚀 Project created: ${project._id}`
    );

    /*
     * IMPORTANT:
     *
     * Respond immediately to frontend.
     * AI generation continues in background.
     */

    res.status(201).json(project);

    // ----------------------------------------------------------
    // BACKGROUND AI GENERATION
    // ----------------------------------------------------------

    generateProject(
      cleanPrompt,
      {
        // ------------------------------------------------------
        // PLAN READY
        // ------------------------------------------------------

        onPlan: async (plan) => {
          try {
            await Project.findByIdAndUpdate(
              project._id,
              {
                name:
                  plan?.projectName ||
                  project.name,

                description:
                  plan?.projectDescription ||
                  "",
              }
            );

            console.log(
              `📋 Plan ready for ${project._id}`
            );
          } catch (error) {
            console.error(
              "❌ Error saving project plan:",
              error.message
            );
          }
        },

        // ------------------------------------------------------
        // FILE START
        // ------------------------------------------------------

        onFileStart: async (
          filePath
        ) => {
          console.log(
            `⏳ Generating ${filePath}`
          );
        },

        // ------------------------------------------------------
        // FILE COMPLETE
        // ------------------------------------------------------

        onFileComplete: async (
          filePath,
          code
        ) => {
          try {
            /*
             * IMPORTANT:
             *
             * Use atomic MongoDB operations.
             * Do NOT load/save the whole project here because
             * multiple files can finish concurrently.
             */

            const updatedProject =
              await Project.findById(
                project._id
              );

            if (!updatedProject) {
              return;
            }

            const existingFile =
              updatedProject.files.find(
                (file) =>
                  file.path === filePath
              );

            if (existingFile) {
              await Project.updateOne(
                {
                  _id: project._id,
                  "files.path": filePath,
                },
                {
                  $set: {
                    "files.$.content":
                      code || "",
                  },
                }
              );
            } else {
              await Project.updateOne(
                {
                  _id: project._id,
                },
                {
                  $push: {
                    files: {
                      path: filePath,
                      content: code || "",
                    },
                  },
                }
              );
            }

            console.log(
              `📄 Saved generated file: ${filePath}`
            );
          } catch (error) {
            console.error(
              `❌ Error saving ${filePath}:`,
              error.message
            );
          }
        },

        // ------------------------------------------------------
        // FILE ERROR
        // ------------------------------------------------------

        onFileError: async (
          filePath,
          error
        ) => {
          console.error(
            `❌ Generation error for ${filePath}:`,
            error?.message || error
          );
        },
      }
    )
      .then(async (result) => {
        try {
          /*
           * Convert:
           *
           * {
           *   "/App.jsx": "...",
           *   "/main.jsx": "..."
           * }
           *
           * into:
           *
           * [
           *   { path: "/App.jsx", content: "..." },
           *   ...
           * ]
           */

          const finalFiles =
            Object.entries(
              result.files || {}
            ).map(
              ([path, content]) => ({
                path,
                content:
                  typeof content === "string"
                    ? content
                    : "",
              })
            );

          await Project.findByIdAndUpdate(
            project._id,
            {
              status: "ready",

              name:
                result.projectName ||
                project.name,

              description:
                result.projectDescription ||
                project.description,

              files: finalFiles,
            }
          );

          console.log(
            `🎉 Project ${project._id} generation completed with ${finalFiles.length} files`
          );
        } catch (error) {
          console.error(
            "❌ Error finalizing project:",
            error.message
          );

          await Project.findByIdAndUpdate(
            project._id,
            {
              status: "failed",

              $push: {
                messages: {
                  role: "system",
                  content:
                    error?.message ||
                    "Project finalization failed",
                },
              },
            }
          );
        }
      })
      .catch(async (error) => {
        console.error(
          `❌ Project generation failed for ${project._id}:`,
          error
        );

        try {
          await Project.findByIdAndUpdate(
            project._id,
            {
              status: "failed",

              $push: {
                messages: {
                  role: "system",
                  content:
                    error?.message ||
                    "Project generation failed",
                },
              },
            }
          );
        } catch (updateError) {
          console.error(
            "❌ Error updating failed project:",
            updateError.message
          );
        }
      });
  } catch (error) {
    console.error(
      "❌ Create project error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to create project",
    });
  }
};

// ============================================================
// LIST PROJECTS
// ============================================================

export const listProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      userId: req.userId,
    }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("❌ List projects error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      projects: [],
    });
  }
};

// ============================================================
// GET PROJECT
// ============================================================

export const getProject = async (
  req,
  res
) => {
  try {
    const project =
      await Project.findOne({
        _id: req.params.id,
        userId: req.userId,
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.json(project);
  } catch (error) {
    console.error(
      "❌ Get project error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch project",
    });
  }
};

// ============================================================
// DELETE PROJECT
// ============================================================

export const deleteProject = async (
  req,
  res
) => {
  try {
    const project =
      await Project.findOneAndDelete({
        _id: req.params.id,
        userId: req.userId,
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.json({
      success: true,
      message:
        "Project deleted successfully",
    });
  } catch (error) {
    console.error(
      "❌ Delete project error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete project",
    });
  }
};

// ============================================================
// UPDATE PROJECT FILES
// ============================================================

export const updateProjectFiles = async (
  req,
  res
) => {
  try {
    const { files } = req.body;

    if (
      !Array.isArray(files) ||
      files.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Files array is required",
      });
    }

    const project =
      await Project.findOne({
        _id: req.params.id,
        userId: req.userId,
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // ----------------------------------------------------------
    // MERGE FILES
    // ----------------------------------------------------------

    for (const incomingFile of files) {
      if (!incomingFile?.path) {
        continue;
      }

      const existingFile =
        project.files.find(
          (file) =>
            file.path === incomingFile.path
        );

      if (existingFile) {
        existingFile.content =
          incomingFile.content || "";
      } else {
        project.files.push({
          path: incomingFile.path,
          content:
            incomingFile.content || "",
        });
      }
    }

    project.version += 1;

    await project.save();

    console.log(
      `💾 Saved ${files.length} file(s). Project now contains ${project.files.length} files.`
    );

    return res.json(project);
  } catch (error) {
    console.error(
      "❌ Update project files error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update project files",
    });
  }
};

// ============================================================
// PUBLISH PROJECT
// ============================================================

export const publishProject = async (
  req,
  res
) => {
  try {
    const project =
      await Project.findOne({
        _id: req.params.id,
        userId: req.userId,
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.published = true;
    project.publishedAt = new Date();

    await project.save();

    return res.json({
      success: true,
      message:
        "Project published successfully",
      project,
    });
  } catch (error) {
    console.error(
      "❌ Publish project error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to publish project",
    });
  }
};

// ============================================================
// GET PUBLIC PROJECT
// ============================================================

export const getPublicProject = async (
  req,
  res
) => {
  try {
    const project =
      await Project.findOne({
        _id: req.params.id,
        published: true,
      }).select(
        "name description files publishedAt version"
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Published project not found",
      });
    }

    return res.json(project);
  } catch (error) {
    console.error(
      "❌ Get public project error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch public project",
    });
  }
};

// ============================================================
// REVISE PROJECT
// ============================================================

export const reviseProjectController =
  async (req, res) => {
    try {
      const { instruction } =
        req.body;

      if (
        typeof instruction !==
          "string" ||
        !instruction.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Revision instruction is required",
        });
      }

      const project =
        await Project.findOne({
          _id: req.params.id,
          userId: req.userId,
        });

      if (!project) {
        return res.status(404).json({
          success: false,
          message:
            "Project not found",
        });
      }

      // --------------------------------------------------------
      // Convert DB files to object
      // --------------------------------------------------------

      const filesObject = {};

      for (const file of project.files) {
        filesObject[file.path] =
          file.content || "";
      }

      // --------------------------------------------------------
      // AI revision
      // --------------------------------------------------------

      const result =
        await reviseProject(
          instruction.trim(),

          filesObject,

          filesObject,

          project.messages || []
        );

      // --------------------------------------------------------
      // Apply revision operations
      // --------------------------------------------------------

      if (
        result?.operations &&
        Array.isArray(
          result.operations
        )
      ) {
        for (const operation of result.operations) {
          const path =
            operation.path;

          if (!path) continue;

          const existingFile =
            project.files.find(
              (file) =>
                file.path === path
            );

          /*
           * Depending on the revision schema,
           * support common operation names.
           */

          if (
            operation.content !==
            undefined
          ) {
            if (existingFile) {
              existingFile.content =
                operation.content;
            } else {
              project.files.push({
                path,
                content:
                  operation.content ||
                  "",
              });
            }
          }
        }
      }

      // --------------------------------------------------------
      // Messages
      // --------------------------------------------------------

      project.messages.push({
        role: "user",
        content:
          instruction.trim(),
      });

      if (result?.message) {
        project.messages.push({
          role: "assistant",
          content: result.message,
        });
      }

      project.version += 1;

      await project.save();

      return res.json(project);
    } catch (error) {
      console.error(
        "❌ Revise project error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error?.message ||
          "Failed to revise project",
      });
    }
  };