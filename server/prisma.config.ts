// server/prisma.config.ts
import { defineConfig } from "prisma/config";   // ✅ Correct import

export default defineConfig({
  schema: "./prisma/schema.prisma",            // ✅ You confirmed your schema is here

  datasource: {
    db: {
      provider: "postgresql",
      url: process.env.DATABASE_URL,          // ✅ Valid in Prisma 7 config
    },
  },

  outputFile: "./generated/client",            // optional, prevents warnings
});
