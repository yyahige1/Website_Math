# 📚 Git Commands Cheat Sheet - MathsFacile Project

## 🚀 Initial Setup (First Time Only)

### 1. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `mathsfacile` (or your chosen name)
3. Description: Use the short description from GITHUB_SETUP.md
4. Choose Public
5. **DON'T** initialize with README (we'll add ours)
6. Click "Create repository"

### 2. Configure Git Locally (if not done already)
```bash
# Set your name and email (only needed once per computer)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Optional: Set default branch name to 'main'
git config --global init.defaultBranch main
```

### 3. Initialize Local Repository
```bash
# Navigate to your project folder
cd /path/to/your/project

# Initialize Git
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial commit: MathsFacile v1.0 - 1st degree equations"

# Rename branch to main (if needed)
git branch -M main

# Connect to GitHub (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/mathsfacile.git

# Push to GitHub
git push -u origin main
```

---

## 📝 Daily Git Workflow

### Basic Workflow (Add → Commit → Push)

```bash
# 1. CHECK STATUS - See what changed
git status

# 2. ADD FILES - Stage changes for commit
git add .                          # Add all changed files
git add filename.html              # Add specific file
git add *.js                       # Add all .js files

# 3. COMMIT - Save changes with a message
git commit -m "Your message here"

# 4. PUSH - Upload to GitHub
git push
```

### Example Workflow Session
```bash
# You made changes to mathsfacile-v1.html
git status                                    # See the changes
git add mathsfacile-v1.html                   # Stage the file
git commit -m "Fix: Corrected division by zero handling"
git push                                      # Upload to GitHub
```

---

## ✍️ Writing Good Commit Messages

### Format
```
Type: Short description (max 50 chars)

Optional longer explanation if needed
```

### Types
- **feat**: New feature (`feat: Add expression development module`)
- **fix**: Bug fix (`fix: Resolve random generation errors`)
- **docs**: Documentation (`docs: Update README with new examples`)
- **style**: Formatting, CSS (`style: Improve mobile responsiveness`)
- **refactor**: Code restructuring (`refactor: Simplify equation solver`)
- **test**: Adding tests (`test: Add verification tests`)
- **chore**: Maintenance (`chore: Update dependencies`)

### Examples of Good Commit Messages
```bash
git commit -m "feat: Add type 2 equations (ax+b=cx+d)"
git commit -m "fix: Handle special case when a=0"
git commit -m "style: Improve equation display on mobile"
git commit -m "docs: Add roadmap for future features"
git commit -m "refactor: Extract solution display into function"
```

### Examples of Bad Commit Messages
```bash
git commit -m "update"              # ❌ Too vague
git commit -m "fixed stuff"         # ❌ Not descriptive
git commit -m "asdf"                # ❌ Meaningless
git commit -m "WIP"                 # ❌ Don't commit incomplete work
```

---

## 🌿 Branching (For Features)

### Why Use Branches?
- Work on features without breaking main code
- Test changes before merging
- Collaborate without conflicts

### Basic Branch Workflow
```bash
# Create and switch to new branch
git checkout -b feature/factorization

# Work on your feature, make commits
git add .
git commit -m "feat: Add basic factorization"

# Push branch to GitHub
git push -u origin feature/factorization

# Switch back to main branch
git checkout main

# Merge feature into main (when done)
git merge feature/factorization

# Delete branch (after merging)
git branch -d feature/factorization
git push origin --delete feature/factorization
```

### Common Branch Names
```
feature/new-feature-name    # New features
fix/bug-description         # Bug fixes
docs/documentation-update   # Documentation
style/ui-improvements       # UI/Design changes
```

---

## 🔍 Checking Your Work

### See What Changed
```bash
# Show modified files
git status

# Show detailed changes in files
git diff

# Show changes for specific file
git diff filename.html

# Show commit history
git log
git log --oneline              # Compact view
git log --graph --oneline      # Visual tree
```

### Compare Versions
```bash
# Compare current code to last commit
git diff HEAD

# Compare two commits
git diff abc123 def456

# Compare current branch to main
git diff main
```

---

## ⏮️ Undoing Changes

### Before Committing
```bash
# Discard changes in specific file
git checkout -- filename.html

# Unstage file (keep changes)
git reset filename.html

# Discard ALL local changes (CAREFUL!)
git reset --hard HEAD
```

### After Committing (Local Only)
```bash
# Undo last commit, keep changes
git reset --soft HEAD~1

# Undo last commit, discard changes
git reset --hard HEAD~1
```

### After Pushing (Public)
```bash
# Create new commit that undoes previous commit
git revert HEAD
git push
```

---

## 🔄 Updating Your Local Code

### Pull Latest Changes from GitHub
```bash
# Get latest changes from GitHub
git pull

# If there are conflicts, Git will tell you
# Edit conflicted files, then:
git add .
git commit -m "Resolve merge conflicts"
```

---

## 📦 Common Scenarios

### Scenario 1: New Feature
```bash
# Create feature branch
git checkout -b feature/percentages

# Make changes, commit regularly
git add .
git commit -m "feat: Add percentage calculator"

# Push to GitHub
git push -u origin feature/percentages

# When ready, merge to main
git checkout main
git merge feature/percentages
git push
```

### Scenario 2: Quick Fix
```bash
# Make changes directly on main
git add filename.html
git commit -m "fix: Typo in equation display"
git push
```

### Scenario 3: Forgot to Add File
```bash
# After committing, you realize you forgot a file
git add forgotten-file.html
git commit --amend --no-edit    # Add to previous commit
git push --force                # Update GitHub (only if you haven't shared the commit)
```

### Scenario 4: Working on Multiple Computers
```bash
# On Computer A
git add .
git commit -m "feat: Add new feature"
git push

# On Computer B (later)
git pull                        # Get latest changes
# Continue working...
```

---

## 🆘 Emergency Commands

### I Committed to Wrong Branch!
```bash
# On wrong branch
git log                         # Copy the commit hash (abc123)
git reset --hard HEAD~1         # Remove commit from wrong branch

# Switch to correct branch
git checkout correct-branch
git cherry-pick abc123          # Apply commit here
git push
```

### I Pushed Sensitive Data!
```bash
# Remove file from Git history (CAREFUL!)
git rm --cached sensitive-file.txt
git commit -m "Remove sensitive file"
git push

# Note: File still exists in Git history
# For complete removal, use git-filter-branch or BFG Repo-Cleaner
```

### My Local Repo is Broken!
```bash
# Nuclear option: Start fresh
cd ..
rm -rf old-project-folder
git clone https://github.com/USERNAME/mathsfacile.git
cd mathsfacile
```

---

## 🎯 Best Practices for MathsFacile Project

### Commit Frequency
- ✅ Commit after each logical feature
- ✅ Commit before trying something experimental
- ✅ Commit at end of work session
- ❌ Don't commit broken code
- ❌ Don't wait days to commit

### Suggested Workflow for This Project
```bash
# Morning: Start working
git pull                        # Get latest code

# Work on feature
# ... edit files ...
git add .
git commit -m "feat: Add step 1 of factorization"

# ... continue working ...
git add .
git commit -m "feat: Complete factorization logic"

# ... test and fix ...
git add .
git commit -m "fix: Handle edge case in factorization"

# End of day
git push                        # Backup to GitHub
```

### Organizing Commits by Phase
```bash
# Phase 1 - Equations
git commit -m "feat: Type 1 equations complete"
git commit -m "feat: Type 2 equations complete"
git commit -m "feat: Add special cases handling"

# Phase 2 - New Module
git commit -m "feat: Initialize development module"
git commit -m "feat: Add distributive property"
git commit -m "feat: Add remarkable identities"
```

---

## 🔗 Quick Reference

### Most Used Commands
```bash
git status                      # What changed?
git add .                       # Stage all changes
git commit -m "message"         # Save changes
git push                        # Upload to GitHub
git pull                        # Download from GitHub
git log --oneline               # See history
```

### Setup Reminder
```bash
git init                        # Start Git in folder
git remote add origin URL       # Connect to GitHub
git push -u origin main         # First push
```

### Branch Basics
```bash
git checkout -b branch-name     # Create and switch to branch
git checkout main               # Switch to main
git merge branch-name           # Merge branch into current
git branch -d branch-name       # Delete branch
```

---

## 📖 Learning Resources

- **GitHub Desktop**: GUI alternative to command line (https://desktop.github.com)
- **VS Code Git Integration**: Built-in Git tools
- **Git Documentation**: https://git-scm.com/doc
- **Interactive Tutorial**: https://learngitbranching.js.org

---

## 💡 Tips for Beginners

1. **Commit often** - Small, frequent commits are better than huge ones
2. **Write clear messages** - Your future self will thank you
3. **Pull before push** - Always get latest changes first
4. **Don't panic** - Almost everything in Git can be undone
5. **Use branches** - Experiment safely
6. **Backup important work** - Git is not a backup (push to GitHub regularly)

---

## 🎓 Your First Steps

```bash
# 1. Create repo on GitHub (see Initial Setup section)

# 2. In your project folder
git init
git add .
git commit -m "Initial commit: MathsFacile v1.0"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/mathsfacile.git
git push -u origin main

# 3. Daily workflow
# Make changes → git add . → git commit -m "message" → git push

# That's it! 🎉
```

---

**Remember**: Git seems complex at first, but 90% of the time you'll only use 5-6 commands. The rest are for special situations. Don't try to memorize everything - bookmark this guide and refer to it when needed!
