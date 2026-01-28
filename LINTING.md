# ESLint & Prettier Configuration Guide

## Overview
This project uses ESLint for code quality and Prettier for code formatting across both API (NestJS) and Web (Next.js) applications.

## Configuration Files

### API (NestJS)
- `apps/api/.prettierrc` - Prettier configuration
- `apps/api/.prettierignore` - Files to ignore for formatting
- `apps/api/eslint.config.mjs` - ESLint configuration

### Web (Next.js)
- `apps/web/.prettierrc` - Prettier configuration
- `apps/web/.prettierignore` - Files to ignore for formatting
- `apps/web/eslint.config.mjs` - ESLint configuration

### VS Code
- `.vscode/settings.json` - Editor settings for auto-format on save
- `.vscode/extensions.json` - Recommended extensions

## Available Scripts

### API (NestJS)
```bash
cd apps/api

# Check code quality
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting (without modifying)
npm run format:check
```

### Web (Next.js)
```bash
cd apps/web

# Check code quality
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting (without modifying)
pnpm format:check
```

## Prettier Configuration

### API (NestJS)
```json
{
  "singleQuote": true,      // Use single quotes
  "trailingComma": "all",   // Add trailing commas
  "semi": true,             // Add semicolons
  "tabWidth": 2,            // 2 spaces for indentation
  "printWidth": 80,         // Line length limit
  "arrowParens": "always",  // Always add parens to arrow functions
  "endOfLine": "auto"       // Auto detect line endings
}
```

### Web (Next.js)
```json
{
  "singleQuote": false,     // Use double quotes (React convention)
  "trailingComma": "es5",   // Add trailing commas (ES5)
  "semi": true,             // Add semicolons
  "tabWidth": 2,            // 2 spaces for indentation
  "printWidth": 80,         // Line length limit
  "arrowParens": "always",  // Always add parens to arrow functions
  "endOfLine": "auto",      // Auto detect line endings
  "jsxSingleQuote": false,  // Use double quotes in JSX
  "bracketSpacing": true    // Add spaces in object literals
}
```

## ESLint Rules

### Common Rules (Both Apps)
- **No console logs**: Warn on `console.log`, allow `console.warn` and `console.error`
- **Unused variables**: Warn on unused variables (except those prefixed with `_`)
- **Prefer const**: Error if `let` is used when `const` is possible
- **No explicit any**: Warn on explicit `any` types

### API Specific Rules
- TypeScript strict checks with warnings (not errors) for flexibility
- Floating promises: Warn
- Unsafe operations: Warn (assignment, member access, call, argument)

### Web Specific Rules
- React hooks rules enforced
- No React in JSX scope (not needed in Next.js)
- React prop-types disabled (using TypeScript instead)

## VS Code Integration

### Auto-format on Save
The `.vscode/settings.json` is configured to:
- ✅ Format files on save
- ✅ Fix ESLint issues on save
- ✅ Organize imports on save
- ✅ Use Prettier as default formatter

### Recommended Extensions
1. **Prettier - Code formatter** (`esbenp.prettier-vscode`)
2. **ESLint** (`dbaeumer.vscode-eslint`)
3. **Docker** (`ms-azuretools.vscode-docker`)
4. **MongoDB** (`mongodb.mongodb-vscode`)

Install these by opening the Extensions panel and clicking "Install" on the recommendations.

## Pre-commit Hooks (Optional)

To enforce linting and formatting before commits, you can add husky and lint-staged:

```bash
# In the root of your project
npm install --save-dev husky lint-staged

# Initialize husky
npx husky init

# Add pre-commit hook
echo "npx lint-staged" > .husky/pre-commit
```

Then add to root `package.json`:
```json
{
  "lint-staged": {
    "apps/api/src/**/*.ts": [
      "cd apps/api && npm run lint:fix",
      "cd apps/api && npm run format"
    ],
    "apps/web/**/*.{ts,tsx}": [
      "cd apps/web && pnpm lint:fix",
      "cd apps/web && pnpm format"
    ]
  }
}
```

## Common Issues & Solutions

### Issue: "Prettier not formatting on save"
**Solution**: 
1. Make sure Prettier extension is installed
2. Check that `.prettierrc` file exists
3. Reload VS Code window

### Issue: "ESLint errors not showing"
**Solution**:
1. Make sure ESLint extension is installed
2. Run `npm install` or `pnpm install` in the respective app
3. Reload VS Code window

### Issue: "Conflicts between ESLint and Prettier"
**Solution**: 
Already configured with `eslint-config-prettier` which disables conflicting ESLint rules.

### Issue: "Different formatting between developers"
**Solution**: 
Make sure everyone has:
1. The same VS Code settings (committed in `.vscode/settings.json`)
2. The same Prettier version
3. Format on save enabled

## Quick Format All Files

### Format API
```bash
cd apps/api && npm run format
```

### Format Web
```bash
cd apps/web && pnpm format
```

## CI/CD Integration

Add to your CI pipeline:

```yaml
# For API
- name: Lint API
  run: cd apps/api && npm run lint
  
- name: Check API formatting
  run: cd apps/api && npm run format:check

# For Web
- name: Lint Web
  run: cd apps/web && pnpm lint

- name: Check Web formatting
  run: cd apps/web && pnpm format:check
```

## Tips

1. **Format on save** is enabled by default in VS Code settings
2. Use `// eslint-disable-next-line` sparingly for specific exceptions
3. Run `npm run lint:fix` or `pnpm lint:fix` before committing
4. Prettier will automatically format on save if properly configured
5. Both apps use different quote styles (single for API, double for Web) following their respective conventions
