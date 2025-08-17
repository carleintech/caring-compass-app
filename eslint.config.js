import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default [
  // Base configuration for all files
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/coverage/**",
      "**/.turbo/**",
      "**/pnpm-lock.yaml",
    ],
  },

  // JavaScript/TypeScript base configuration
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
    },
    plugins: {
      import: importPlugin,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,

      // Import rules
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/no-unresolved": "off", // Turn off for now due to module resolution issues
      "import/no-unused-modules": "warn",

      // General rules
      "no-console": "warn",
      "no-debugger": "error",
      "no-unused-vars": "warn",
      "prefer-const": "error",
      "no-var": "error",

      // Prettier integration
      "prettier/prettier": "error",
    },
  },

  // TypeScript configuration
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
    },
    rules: {
      ...typescript.configs.recommended.rules,

      // Override base rules for TypeScript
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // TypeScript specific rules
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
    },
  },

  // React configuration
  {
    files: ["apps/web/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      // React specific rules
      "react/react-in-jsx-scope": "off", // Not needed in React 17+
      "react/prop-types": "off", // Using TypeScript for prop validation
      "react/jsx-uses-react": "off", // Not needed in React 17+
      "react/jsx-uses-vars": "error",
      "react/jsx-key": "error",
      "react/no-array-index-key": "warn",
      "react/no-unused-prop-types": "warn",
      "react/self-closing-comp": "error",

      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React Refresh (for Vite/development)
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // Accessibility rules
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-has-content": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
    },
  },

  // Node.js/API configuration
  {
    files: ["apps/api/**/*.{js,ts}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Node.js specific rules
      "no-console": "off", // Console is acceptable in Node.js
      "import/no-nodejs-modules": "off",
    },
  },

  // Configuration files
  {
    files: [
      "*.config.{js,ts,mjs,cjs}",
      "**/*.config.{js,ts,mjs,cjs}",
      ".lintstagedrc.js",
      "commitlint.config.js",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },

  // Test files configuration
  {
    files: [
      "**/*.{test,spec}.{js,ts,tsx,jsx}",
      "**/__tests__/**/*.{js,ts,tsx,jsx}",
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
];
