import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: "@/types", replacement: path.join(root, "shared/types/index.ts") },
      {
        find: "@/lib/audit-engine",
        replacement: path.join(root, "backend/lib/audit-engine/index.ts"),
      },
      {
        find: "@/lib/validators",
        replacement: path.join(root, "backend/lib/validators.ts"),
      },
      {
        find: "@/lib/supabase",
        replacement: path.join(root, "backend/lib/supabase.ts"),
      },
      { find: "@/lib/utils", replacement: path.join(root, "frontend/lib/utils.ts") },
      { find: "@", replacement: root },
    ],
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
