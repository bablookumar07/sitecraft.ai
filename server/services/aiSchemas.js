import { z } from "zod";

// AI generated project result
export const generationResultSchema = z.object({
  files: z.record(z.string(), z.string()),
  description: z.string().default("Generated project"),
});

// File operation schema
export const fileOperationSchema = z.object({
  operation: z.enum(["create", "update", "delete"]),
  path: z.string(),
  content: z.string().nullable().optional(),
  search: z.string().nullable().optional(),
  replace: z.string().nullable().optional(),
});

// AI revision result
export const revisionResultSchema = z.object({
  operations: z.array(fileOperationSchema),
  description: z.string().default("Applied revisions"),
});

// File planning schema
export const filePlanSchema = z.object({
  files: z.array(
    z.object({
      path: z.string(),
      description: z.string(),
      exports: z.string().optional().default(""),
      imports: z.array(z.string()).optional().default([]),
    })
  ),
  projectName: z.string().default("Generated Project"),
  projectDescription: z.string().default("A React project"),
});

// Single file code schema
export const fileCodeSchema = z.object({
  code: z.string(),
});