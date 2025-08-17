# ESLint Configuration

This project uses ESLint v9.0.0+ with the new flat configuration format (`eslint.config.js`).

## Features

- **ESLint v9.0.0+** with flat config format
- **TypeScript** support with `@typescript-eslint`
- **React** support with React-specific rules
- **Import** ordering and validation
- **Accessibility** rules with `jsx-a11y`
- **Prettier** integration for consistent formatting
- **Node.js** specific rules for API code
- **Test files** configuration

## Configuration Structure

The configuration is organized into several sections:

1. **Base Configuration** - Common rules for all JavaScript/TypeScript files
2. **TypeScript Configuration** - TypeScript-specific rules and overrides
3. **React Configuration** - React-specific rules for `apps/web`
4. **Node.js Configuration** - Node.js-specific rules for `apps/api`
5. **Configuration Files** - Rules for config files
6. **Test Files** - Relaxed rules for test files

## Scripts

- `npm run lint` - Run ESLint on all files
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check if files are formatted correctly

## File Patterns

- **React files**: `apps/web/**/*.{js,jsx,ts,tsx}`
- **API files**: `apps/api/**/*.{js,ts}`
- **Config files**: `*.config.{js,ts,mjs,cjs}`, `.lintstagedrc.js`, `commitlint.config.js`
- **Test files**: `**/*.{test,spec}.{js,ts,tsx,jsx}`, `**/__tests__/**/*.{js,ts,tsx,jsx}`

## Ignored Patterns

- `**/node_modules/**`
- `**/dist/**`
- `**/build/**`
- `**/.next/**`
- `**/coverage/**`
- `**/.turbo/**`
- `**/pnpm-lock.yaml`

## Integration

The configuration integrates with:

- **Husky** - Pre-commit hooks
- **lint-staged** - Lint only staged files
- **Prettier** - Code formatting
- **VS Code** - Editor integration

## Customization

To customize rules for specific needs:

1. Edit `eslint.config.js`
2. Add new configurations for specific file patterns
3. Override rules in existing configurations
4. Add new plugins as needed

## Troubleshooting

If you encounter issues:

1. Make sure all dependencies are installed: `pnpm install`
2. Check that your files match the configured patterns
3. Run `npm run lint:fix` to auto-fix issues
4. Check the console output for specific error messages
