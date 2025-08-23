#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Caring Compass Frontend Validation Script');
console.log('='.repeat(50));

const webAppPath = path.join(__dirname, '..', 'apps', 'web');
const packagePath = path.join(__dirname, '..', 'packages');

// Validation checklist
const validations = [
  {
    name: 'Environment Setup',
    checks: [
      () => checkFileExists(path.join(webAppPath, 'package.json')),
      () => checkFileExists(path.join(webAppPath, 'next.config.js')),
      () => checkFileExists(path.join(webAppPath, 'tailwind.config.js')),
      () => checkFileExists(path.join(webAppPath, 'tsconfig.json')),
    ]
  },
  {
    name: 'Dependencies',
    checks: [
      () => checkNodeModules(webAppPath),
      () => checkPackageDependencies(),
    ]
  },
  {
    name: 'Source Code Structure',
    checks: [
      () => checkDirectoryExists(path.join(webAppPath, 'src', 'app')),
      () => checkDirectoryExists(path.join(webAppPath, 'src', 'components')),
      () => checkDirectoryExists(path.join(webAppPath, 'src', 'lib')),
      () => checkFileExists(path.join(webAppPath, 'src', 'app', 'layout.tsx')),
      () => checkFileExists(path.join(webAppPath, 'src', 'app', 'page.tsx')),
    ]
  },
  {
    name: 'Authentication Pages',
    checks: [
      () => checkFileExists(path.join(webAppPath, 'src', 'app', '(auth)', 'login', 'page.tsx')),
      () => checkFileExists(path.join(webAppPath, 'src', 'app', '(auth)', 'register', 'page.tsx')),
      () => checkFileExists(path.join(webAppPath, 'src', 'middleware.ts')),
    ]
  },
  {
    name: 'Dashboard Pages',
    checks: [
      () => checkFileExists(path.join(webAppPath, 'src', 'app', '(dashboard)', 'layout.tsx')),
      () => checkFileExists(path.join(webAppPath, 'src', 'app', '(dashboard)', 'client', 'dashboard', 'page.tsx')),
      () => checkFileExists(path.join(webAppPath, 'src', 'app', '(dashboard)', 'caregiver', 'dashboard', 'page.tsx')),
      () => checkFileExists(path.join(webAppPath, 'src', 'app', '(dashboard)', 'admin', 'dashboard', 'page.tsx')),
    ]
  },
  {
    name: 'Components',
    checks: [
      () => checkDirectoryExists(path.join(webAppPath, 'src', 'components', 'ui')),
      () => checkDirectoryExists(path.join(webAppPath, 'src', 'components', 'layout')),
      () => checkDirectoryExists(path.join(webAppPath, 'src', 'components', 'providers')),
      () => checkFileExists(path.join(webAppPath, 'src', 'components', 'ui', 'button.tsx')),
      () => checkFileExists(path.join(webAppPath, 'src', 'components', 'providers', 'providers.tsx')),
    ]
  },
  {
    name: 'Configuration Files',
    checks: [
      () => checkFileExists(path.join(webAppPath, 'jest.config.js')),
      () => checkFileExists(path.join(webAppPath, 'jest.setup.js')),
      () => checkFileExists(path.join(webAppPath, '.env.example')),
    ]
  },
  {
    name: 'Tests',
    checks: [
      () => checkDirectoryExists(path.join(webAppPath, 'src', 'components', '__tests__')),
      () => checkFileExists(path.join(webAppPath, 'src', 'components', '__tests__', 'ui.test.tsx')),
      () => checkFileExists(path.join(webAppPath, 'src', 'components', 'tests', 'layout.test.tsx')),
    ]
  }
];

// Validation functions
function checkFileExists(filePath) {
  const exists = fs.existsSync(filePath);
  const relativePath = path.relative(process.cwd(), filePath);
  return {
    success: exists,
    message: exists ? `✅ ${relativePath}` : `❌ Missing: ${relativePath}`
  };
}

function checkDirectoryExists(dirPath) {
  const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  const relativePath = path.relative(process.cwd(), dirPath);
  return {
    success: exists,
    message: exists ? `✅ ${relativePath}/` : `❌ Missing directory: ${relativePath}/`
  };
}

function checkNodeModules(projectPath) {
  const nodeModulesPath = path.join(projectPath, 'node_modules');
  const exists = fs.existsSync(nodeModulesPath);
  return {
    success: exists,
    message: exists ? '✅ node_modules installed' : '❌ node_modules not found - run pnpm install'
  };
}

function checkPackageDependencies() {
  try {
    const packageJsonPath = path.join(webAppPath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const requiredDeps = [
      'next',
      'react',
      'react-dom',
      '@trpc/client',
      '@trpc/server',
      'tailwindcss'
    ];
    
    const missingDeps = requiredDeps.filter(dep => 
      !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
    );
    
    return {
      success: missingDeps.length === 0,
      message: missingDeps.length === 0 
        ? '✅ All required dependencies found'
        : `❌ Missing dependencies: ${missingDeps.join(', ')}`
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ Error checking dependencies: ${error.message}`
    };
  }
}

function runCommand(command, cwd = webAppPath) {
  try {
    execSync(command, { cwd, stdio: 'pipe' });
    return { success: true, message: `✅ ${command}` };
  } catch (error) {
    return { success: false, message: `❌ ${command} failed` };
  }
}

// Run validations
let totalChecks = 0;
let passedChecks = 0;
let failedChecks = [];

console.log('\n📋 Running Frontend Validation Checks...\n');

for (const validation of validations) {
  console.log(`🔍 ${validation.name}:`);
  
  for (const check of validation.checks) {
    totalChecks++;
    const result = check();
    console.log(`  ${result.message}`);
    
    if (result.success) {
      passedChecks++;
    } else {
      failedChecks.push(`${validation.name}: ${result.message}`);
    }
  }
  console.log('');
}

// Additional command validations
console.log('🧪 Running Build & Test Validation...\n');

const commandChecks = [
  { name: 'TypeScript compilation', command: 'pnpm run type-check' },
  { name: 'ESLint validation', command: 'pnpm run lint' },
  { name: 'Jest tests', command: 'pnpm run test:ci' },
];

for (const { name, command } of commandChecks) {
  totalChecks++;
  const result = runCommand(command);
  console.log(`  ${result.message} (${name})`);
  
  if (result.success) {
    passedChecks++;
  } else {
    failedChecks.push(`Build validation: ${name} failed`);
  }
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Validation Summary:');
console.log(`✅ Passed: ${passedChecks}/${totalChecks}`);
console.log(`❌ Failed: ${totalChecks - passedChecks}/${totalChecks}`);

if (failedChecks.length > 0) {
  console.log('\n🚨 Failed Checks:');
  failedChecks.forEach(check => console.log(`  • ${check}`));
  console.log('\n💡 Please fix the failed checks before proceeding to the next phase.');
  process.exit(1);
} else {
  console.log('\n🎉 All validations passed! Frontend foundation is ready!');
  console.log('✨ Ready to proceed to Phase 6: Client Portal Development');
  process.exit(0);
}
