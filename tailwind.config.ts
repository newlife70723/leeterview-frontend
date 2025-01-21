// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      textShadow: {
        custom: '4px 4px 8px rgba(0, 0, 0, 0.5)',  // 自定義的文字陰影
      },
    },
  },
  plugins: [],
} satisfies Config;
