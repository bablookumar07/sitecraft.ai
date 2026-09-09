import dotenv from "dotenv";
import { generateObject, generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import pMap from "p-map";

import {
  filePlanSchema,
  revisionResultSchema,
} from "./aiSchemas.js";

import {
  filePlanSystem,
  fileCodeSystem,
  revisionSystem,
} from "./prompts.js";

dotenv.config();

console.log(
  "OpenRouter key loaded:",
  Boolean(process.env.OPENROUTER_API_KEY),
  "length:",
  process.env.OPENROUTER_API_KEY?.length
);

// ============================================================
// OpenRouter model setup
// ============================================================

const modelName =
  process.env.OPENROUTER_MODEL ||
  "openrouter/free";

const maxConcurrency =
  Number.parseInt(
    process.env.MAX_CONCURRENCY || "2",
    10
  );

const openRouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const model = openRouter(modelName);

// ============================================================
// Helper — Extract JSON
// ============================================================

function extractJsonObject(text) {
  if (!text || typeof text !== "string") {
    throw new Error(
      "AI returned an empty planning response."
    );
  }

  let cleaned = text.trim();

  // Remove markdown fences
  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // Extract JSON object from extra text
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (
    firstBrace !== -1 &&
    lastBrace !== -1 &&
    lastBrace > firstBrace
  ) {
    cleaned = cleaned.slice(
      firstBrace,
      lastBrace + 1
    );
  }

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error(
      "❌ Failed to parse AI planning response."
    );

    console.error("AI raw response:");
    console.error(text);

    throw new Error(
      `AI planning response was not valid JSON: ${error.message}`
    );
  }
}

// ============================================================
// Generate Single File
// ============================================================

export async function generateSingleFile(
  file,
  allFiles,
  prompt,
  alreadyGeneratedFiles = {}
) {
  const generatedContext =
    Object.entries(alreadyGeneratedFiles)
      .map(
        ([path, content]) =>
          `\n--- ${path} ---\n${content}`
      )
      .join("\n");

  const allFilesContext = allFiles
    .map(
      (item) =>
        `- ${item.path}: ${item.description}`
    )
    .join("\n");

  const result = await generateText({
    model,

    system: `
${fileCodeSystem}

IMPORTANT OUTPUT RULES:

Return ONLY the source code for the requested file.

Do NOT return JSON.
Do NOT return Markdown.
Do NOT use code fences.
Do NOT add explanations.
Do NOT say "Here is the code".
Do NOT wrap the code inside an object.

The response must be directly usable as the contents
of the requested file.

Use JavaScript + JSX only.
Do NOT use TypeScript.
`,

    prompt: `
Generate the following React file.

USER WEBSITE REQUEST:
${prompt}

CURRENT FILE:
Path: ${file.path}

Description:
${file.description}

Exports:
${file.exports || "None"}

Imports:
${
  (file.imports || []).join("\n") ||
  "None"
}

COMPLETE PROJECT PLAN:
${allFilesContext}

ALREADY GENERATED FILES:
${generatedContext || "No files generated yet."}

IMPORTANT:

Generate ONLY this file:

${file.path}

The output must be the complete source code
of ${file.path}.

Return ONLY source code.
`,

    maxRetries: 2,
  });

  let code = result.text?.trim();

  if (!code) {
    throw new Error(
      `AI returned empty code for ${file.path}`
    );
  }

  // Remove accidental markdown fences
  code = code
    .replace(
      /^```(?:jsx|javascript|js|react)?\s*/i,
      ""
    )
    .replace(/\s*```$/i, "")
    .trim();

  if (!code) {
    throw new Error(
      `AI returned empty code after cleanup for ${file.path}`
    );
  }

  return code;
}

// ============================================================
// Generate Complete Project
// ============================================================

export async function generateProject(
  prompt,
  callbacks = {}
) {
  // ----------------------------------------------------------
  // Safety check
  // ----------------------------------------------------------

  if (typeof prompt !== "string") {
    throw new TypeError(
      "generateProject() expects prompt to be a string."
    );
  }

  const cleanPrompt = prompt.trim();

  if (!cleanPrompt) {
    throw new Error(
      "Project prompt cannot be empty."
    );
  }

  console.log(
    `🤖 AI phase 1: planning file structure for "${cleanPrompt.slice(
      0,
      80
    )}..."`
  );

  // ----------------------------------------------------------
  // PHASE 1 — PLAN
  // ----------------------------------------------------------

  const planResult = await generateText({
    model,

    temperature: 0,

    system: `
${filePlanSystem}

IMPORTANT OUTPUT RULES:

Return ONLY valid JSON.

Do NOT use Markdown.
Do NOT use code fences.
Do NOT add explanations before or after the JSON.

The JSON must follow this exact structure:

{
  "files": [
    {
      "path": "/src/components/Header.jsx",
      "description": "Description of the file",
      "exports": "default Header",
      "imports": ["..."]
    }
  ],
  "projectName": "Project Name",
  "projectDescription": "Project description"
}

Every file must have:
- path
- description
- exports
- imports

The "imports" field must always be an array of strings.
`,

    prompt: `
Plan a complete React website for:

${cleanPrompt}

Return ONLY valid JSON.
`,

    maxRetries: 0,
  });

  console.log(
    "🧠 AI planning response received."
  );

  const rawPlanText = planResult.text;

  console.log(
    "📄 Planning response length:",
    rawPlanText?.length || 0
  );

  // ----------------------------------------------------------
  // Parse plan
  // ----------------------------------------------------------

  const parsedPlan =
    extractJsonObject(rawPlanText);

  // ----------------------------------------------------------
  // Validate plan
  // ----------------------------------------------------------

  const planValidation =
    filePlanSchema.safeParse(parsedPlan);

  if (!planValidation.success) {
    console.error(
      "❌ AI plan failed schema validation."
    );

    console.error(
      JSON.stringify(
        planValidation.error.issues,
        null,
        2
      )
    );

    throw new Error(
      "AI generated an invalid project plan."
    );
  }

  const plan = planValidation.data;

  if (
    !plan ||
    !Array.isArray(plan.files)
  ) {
    throw new Error(
      "AI failed to create a valid project plan."
    );
  }

  // ----------------------------------------------------------
  // Ensure App.jsx
  // ----------------------------------------------------------

  if (
    !plan.files.find(
      (file) => file.path === "/App.jsx"
    )
  ) {
    plan.files.unshift({
      path: "/App.jsx",
      description:
        "Main application entry point",
      exports: "default App",
      imports: ["./styles.css"],
    });
  }

  // ----------------------------------------------------------
  // Ensure main.jsx
  // ----------------------------------------------------------

  if (
    !plan.files.find(
      (file) => file.path === "/main.jsx"
    )
  ) {
    plan.files.push({
      path: "/main.jsx",
      description:
        "React application bootstrap entry point",
      exports: "default",
      imports: [
        "./App.jsx",
        "./styles.css",
      ],
    });
  }

  // ----------------------------------------------------------
  // Ensure styles.css
  // ----------------------------------------------------------

  if (
    !plan.files.find(
      (file) => file.path === "/styles.css"
    )
  ) {
    plan.files.push({
      path: "/styles.css",
      description:
        "Global application styles",
      exports: "",
      imports: [],
    });
  }

  // ----------------------------------------------------------
  // Callback — plan
  // ----------------------------------------------------------

  if (callbacks.onPlan) {
    await callbacks.onPlan(plan);
  }

  console.log(
    `📋 AI plan created: ${plan.files.length} files`
  );

  // ----------------------------------------------------------
  // PHASE 2 — BUILD FILES
  // ----------------------------------------------------------

  const generatedFiles = {};

  let pendingFiles = [...plan.files];

  const maxRetryRounds = 2;

  let round = 0;

  while (
    pendingFiles.length > 0 &&
    round <= maxRetryRounds
  ) {
    if (round > 0) {
      console.log(
        `🔄 AI retry round ${round}/${maxRetryRounds} for ${pendingFiles.length} files`
      );
    }

    const failedFiles = [];

    const results = await pMap(
      pendingFiles,
      async (file) => {
        try {
          // File started
          if (callbacks.onFileStart) {
            await callbacks.onFileStart(
              file.path
            );
          }

          // Generate
          const code =
            await generateSingleFile(
              file,
              plan.files,
              cleanPrompt,
              generatedFiles
            );

          if (
            !code ||
            typeof code !== "string"
          ) {
            throw new Error(
              `AI returned invalid code for ${file.path}`
            );
          }

          // Store in memory
          generatedFiles[file.path] =
            code;

          // Callback
          if (callbacks.onFileComplete) {
            await callbacks.onFileComplete(
              file.path,
              code
            );
          }

          return {
            success: true,
            path: file.path,
            code,
          };
        } catch (error) {
          console.error(
            `❌ Failed to generate ${file.path}:`,
            error.message
          );

          failedFiles.push(file);

          if (callbacks.onFileError) {
            await callbacks.onFileError(
              file.path,
              error
            );
          }

          return {
            success: false,
            path: file.path,
            error,
          };
        }
      },
      {
        concurrency: maxConcurrency,
      }
    );

    const successfulCount =
      results.filter(
        (result) => result.success
      ).length;

    console.log(
      `✅ AI round ${round + 1} completed:`,
      successfulCount,
      "successful,",
      failedFiles.length,
      "failed"
    );

    pendingFiles = failedFiles;

    if (pendingFiles.length === 0) {
      break;
    }

    round++;
  }

  // ----------------------------------------------------------
  // Failed files
  // ----------------------------------------------------------

  if (pendingFiles.length > 0) {
    throw new Error(
      `Failed to generate files: ${pendingFiles
        .map((file) => file.path)
        .join(", ")}`
    );
  }

  // ----------------------------------------------------------
  // Final validation
  // ----------------------------------------------------------

  if (!generatedFiles["/App.jsx"]) {
    throw new Error(
      "Generated project is missing /App.jsx"
    );
  }

  if (!generatedFiles["/main.jsx"]) {
    throw new Error(
      "Generated project is missing /main.jsx"
    );
  }

  console.log(
    `🎉 AI project generation completed with ${Object.keys(
      generatedFiles
    ).length} files`
  );

  // ----------------------------------------------------------
  // Final result
  // ----------------------------------------------------------

  return {
    projectName:
      plan.projectName ||
      "Generated Project",

    projectDescription:
      plan.projectDescription ||
      "Generated React project",

    files: generatedFiles,
  };
}

// ============================================================
// Revise Existing Project
// ============================================================

export async function reviseProject(
  prompt,
  manifest,
  relevantFiles,
  recentMessages = []
) {
  if (typeof prompt !== "string") {
    throw new TypeError(
      "reviseProject() expects prompt to be a string."
    );
  }

  console.log(
    `🤖 AI revision request: "${prompt.slice(
      0,
      80
    )}..."`
  );

  const manifestContext =
    typeof manifest === "string"
      ? manifest
      : JSON.stringify(
          manifest || {},
          null,
          2
        );

  const filesContext =
    Object.entries(relevantFiles || {})
      .map(
        ([path, content]) =>
          `\n--- ${path} ---\n${content}`
      )
      .join("\n");

  const messagesContext =
    Array.isArray(recentMessages) &&
    recentMessages.length > 0
      ? recentMessages
          .map(
            (message) =>
              `${message.role}: ${message.content}`
          )
          .join("\n")
      : "No recent messages.";

  const result = await generateObject({
    model,
    schema: revisionResultSchema,
    system: revisionSystem,

    prompt: `
The user wants to modify an existing React project.

USER REQUEST:
${prompt}

PROJECT MANIFEST:
${manifestContext}

RELEVANT FILES:
${filesContext || "No relevant files provided."}

RECENT CONVERSATION:
${messagesContext}

Determine the minimum file operations required to satisfy the user's request.

Return only the structured revision operations.
`,

    maxRetries: 2,
  });

  console.log(
    `🔧 AI generated ${
      result.object.operations.length
    } revision operations`
  );

  return result.object;
}