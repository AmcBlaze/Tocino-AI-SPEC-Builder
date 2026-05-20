const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI Color helper
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  bgRed: '\x1b[41m',
  white: '\x1b[37m'
};

// Patterns of known API keys / secrets
const SECRET_RULES = [
  {
    name: 'Google API Key (Gemini, Maps, etc.)',
    regex: /AIzaSy[a-zA-Z0-9_-]{33}/g
  },
  {
    name: 'OpenAI API Key',
    regex: /sk-[a-zA-Z0-9]{48}|sk-proj-[a-zA-Z0-9_-]{100,}/g
  },
  {
    name: 'Anthropic API Key',
    regex: /sk-ant-sid01-[a-zA-Z0-9_-]{93,}|sk-ant-[a-zA-Z0-9_-]{80,}/g
  },
  {
    name: 'Stripe API Key',
    regex: /sk_live_[a-zA-Z0-9]{24}|rk_live_[a-zA-Z0-9]{24}/g
  },
  {
    name: 'GitHub Personal Access Token',
    regex: /ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_-]{82}/g
  },
  {
    name: 'AWS Access Key ID',
    regex: /\bAKIA[0-9A-Z]{16}\b/g
  },
  {
    name: 'Private Key',
    regex: /-----BEGIN ((RSA |EC |PGP |OPENSSH )?PRIVATE KEY)-----/g
  }
];

// Generic potential secret assignments
// This matches: key/secret/token/password/passwd/auth = "something" (or : "something")
const GENERIC_SECRET_REGEX = /(?:key|secret|token|password|passwd|auth|credential)\b.*?[=:]\s*(['"`])([a-zA-Z0-9_.-]{10,})\1/i;

// Words that indicate a placeholder or non-secret value
const PLACEHOLDER_KEYWORDS = [
  'placeholder', 'your-', 'your_', '<your', '[your', 'insert-', 'insert_',
  'template', 'todo', 'test', 'demo', 'dummy', 'mock', 'example', 'sample',
  'config', 'process.env', 'process.argv', 'process.exit', 'env.', 'null', 'undefined'
];

function isPlaceholder(value) {
  const valLower = value.toLowerCase();
  // If it's a known placeholder word
  if (PLACEHOLDER_KEYWORDS.some(keyword => valLower.includes(keyword))) {
    return true;
  }
  // If it's just all uppercase with underscores (e.g. GEMINI_API_KEY)
  if (/^[A-Z0-9_]+$/.test(value) && value.length > 5) {
    return true;
  }
  return false;
}

// Check if string has high entropy (not just simple characters or repeating patterns)
function hasHighEntropy(str) {
  // If it's too short, it's not a secret
  if (str.length < 10) return false;
  
  // Calculate character frequencies
  const frequencies = {};
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  
  // Calculate Shannon entropy
  let entropy = 0;
  for (const char in frequencies) {
    const p = frequencies[char] / str.length;
    entropy -= p * Math.log2(p);
  }
  
  // A random-looking string of mixed letters/numbers usually has entropy > 2.8
  return entropy > 2.8;
}

// Files to skip scanning entirely
const SKIPPED_FILES = [
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'scripts/check-secrets.js', // Skip this script
  '.git',
  'node_modules'
];

const SKIPPED_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.webp', '.mp4', '.mp3',
  '.woff', '.woff2', '.ttf', '.eot', '.pdf', '.zip', '.tar', '.gz'
];

function maskSecret(secret) {
  if (secret.length <= 8) return '********';
  return secret.substring(0, 4) + '...' + secret.substring(secret.length - 4);
}

function scanFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (SKIPPED_EXTENSIONS.includes(ext) || SKIPPED_FILES.some(f => filePath.includes(f))) {
    return [];
  }

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const findings = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    // Support inline exclusion
    if (line.includes('git-secret:allow') || line.includes('secret-allow') || line.includes('nocommit:allow')) {
      continue;
    }

    // 1. Check for specific secret rules
    for (const rule of SECRET_RULES) {
      rule.regex.lastIndex = 0;
      const match = rule.regex.exec(line);
      if (match) {
        const value = match[0];
        if (!isPlaceholder(value)) {
          findings.push({
            line: lineNumber,
            ruleName: rule.name,
            matchedText: value,
            lineContent: line.trim()
          });
        }
      }
    }

    // 2. Check for generic secret assignments (if not already matched by specific rule)
    const genericMatch = GENERIC_SECRET_REGEX.exec(line);
    if (genericMatch && !findings.some(f => f.line === lineNumber)) {
      const quoteChar = genericMatch[1];
      const secretValue = genericMatch[2];

      if (!isPlaceholder(secretValue) && hasHighEntropy(secretValue)) {
        const hasLetters = /[a-zA-Z]/.test(secretValue);
        const hasDigitsOrSymbols = /[0-9_.-]/.test(secretValue);
        const isLong = secretValue.length > 20;

        if (isLong || (hasLetters && hasDigitsOrSymbols)) {
          findings.push({
            line: lineNumber,
            ruleName: 'Potential Hardcoded Secret/Credential',
            matchedText: secretValue,
            lineContent: line.trim()
          });
        }
      }
    }
  }

  return findings;
}

function main() {
  console.log(`${colors.cyan}Running pre-commit secrets guard...${colors.reset}`);

  let stagedFiles = [];
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' });
    stagedFiles = output.split('\n').map(line => line.trim()).filter(Boolean);
  } catch (error) {
    console.error(`${colors.red}Error running git diff: ${error.message}${colors.reset}`);
    process.exit(1);
  }

  if (stagedFiles.length === 0) {
    console.log(`${colors.green}No staged changes to scan.${colors.reset}`);
    process.exit(0);
  }

  let totalFindings = 0;
  const allFindings = {};

  for (const file of stagedFiles) {
    try {
      const findings = scanFile(file);
      if (findings.length > 0) {
        allFindings[file] = findings;
        totalFindings += findings.length;
      }
    } catch (err) {
      console.error(`${colors.yellow}Warning: Could not scan ${file}: ${err.message}${colors.reset}`);
    }
  }

  if (totalFindings > 0) {
    console.error('\n' + colors.bgRed + colors.white + '  COMMIT BLOCKED: Secrets Detected!  ' + colors.reset + '\n');
    console.error(`${colors.yellow}The security guard detected potential credentials or API keys staged for commit:${colors.reset}\n`);

    for (const [file, findings] of Object.entries(allFindings)) {
      console.error(`${colors.bold}${colors.red}📄 ${file}${colors.reset}`);
      for (const finding of findings) {
        const masked = maskSecret(finding.matchedText);
        const lineDisplay = finding.lineContent.replace(finding.matchedText, `${colors.bgRed}${colors.white}${masked}${colors.reset}`);
        
        console.error(`  ${colors.cyan}Line ${finding.line}:${colors.reset} [${finding.ruleName}]`);
        console.error(`  ${colors.yellow}↳${colors.reset} ${lineDisplay}\n`);
      }
    }

    console.error(colors.bold + '🛡️ How to resolve this:' + colors.reset);
    console.error(`  1. Remove the hardcoded secrets from your code.`);
    console.error(`  2. Store them securely in environment variables (e.g., in ${colors.green}.env.local${colors.reset}).`);
    console.error(`  3. If this is a false positive and you MUST commit this line as is, append:`);
    console.error(`     ${colors.green}// git-secret:allow${colors.reset} at the end of the line to bypass the check.`);
    console.error(`  4. Alternatively, to bypass this check once, run: ${colors.cyan}git commit --no-verify${colors.reset}`);
    console.error();
    
    process.exit(1);
  }

  console.log(`${colors.green}✓ Secrets check passed! No credentials detected in staged changes.${colors.reset}`);
  process.exit(0);
}

main();
