# 🛡️ Secrets & API Keys Guard

This repository has an automated security guard that scans all staged code for hardcoded secrets, API keys, credentials, and private keys **before every Git commit**. If a secret is detected, the commit will be blocked to prevent accidental leaks to remote repositories.

---

## 🔍 What is Scanned?

The scanner executes on `git commit` and checks:
1. **Google Gemini/Maps API Keys** (`AIzaSy...`)
2. **OpenAI API Keys** (`sk-...` and project-based `sk-proj-...`)
3. **Anthropic Claude API Keys** (`sk-ant-...`)
4. **Stripe API Keys** (`sk_live_...` or `rk_live_...`)
5. **GitHub Personal Access Tokens** (`ghp_...` or `github_pat_...`)
6. **AWS Access Key IDs** (`AKIA...`)
7. **Private Keys** (e.g. `-----BEGIN [TYPE] PRIVATE KEY-----`)
8. **Generic High-Entropy Credentials**: Variables containing words like `password`, `secret`, `token`, `key`, `credential`, or `auth` that are assigned to hardcoded strings of length 10+ with high entropy (i.e., looking like random keys or real passwords).

---

## 🛠️ Safe Coding Practices

Always use environment variables for sensitive credentials:
- **Local Development**: Save keys in `.env.local` (which is already configured in `.gitignore`).
- **Accessing Keys**: Use `process.env.YOUR_SECRET_KEY` in your code.
- **Production**: Configure keys in your deployment platform's dashboard (Vercel, AWS, etc.).

---

## 🔓 How to Bypass the Scanner

If a line is flagged as a false positive, or you have a legitimate reason to commit a secret, you have two options to bypass the check:

### 1. Inline Bypass (Recommended)
Add `// git-secret:allow`, `// secret-allow`, or `// nocommit:allow` at the end of the line containing the flagged value:

```typescript
// This will be allowed because of the bypass comment at the end
const myMockKey = "sk-proj-A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6"; // git-secret:allow
```

### 2. Full Commit Bypass
If you need to bypass the entire check for a single commit, run your commit with the `--no-verify` flag:

```bash
git commit -m "your message" --no-verify
```

---

## ⚙️ Technical Details

- **Hook Location**: `.git/hooks/pre-commit`
- **Validation Engine**: Node.js script located at `scripts/check-secrets.js`
- **Dependency-free**: Runs entirely on native Node.js libraries, keeping the project lightweight and compatible across Windows, macOS, and Linux.
