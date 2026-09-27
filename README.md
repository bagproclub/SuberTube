
🎯 Quick Diagnosis Tool
When you encounter a build error, use this flowchart to identify and resolve:

┌─────────────────────────────────────────────────────┐
│ Build Failed - Which error appears in logs?         │
└─────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    "Gradle version    "Dependencies    "Other error"
     9.6 does not      lock file is    └──→ See Section 3
     exist"            not found"
        │               │
        │               │
        ▼               ▼
    GO TO SECTION 1  GO TO SECTION 2
📌 SECTION 1: Gradle Version 9.6 Error
Error Message
Error: Gradle version 9.6 does not exist
  at gradleRelease (/home/runner/work/_actions/gradle/actions/v4/dist/setup-gradle/main/index.js:159154:15)
  at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
Why It Happens
Gradle 9.6 doesn't exist in official Gradle repositories
AGP (Android Gradle Plugin) 9.x has compatibility issues with recent builds
Version specification mismatch between local and CI/CD environment
Quick Fix (Copy-Paste)
Option A: Automated Fix (Recommended)
# Let GitHub Actions handle it automatically
# Just push your code and watch the bugfix PR appear

git push origin develop
# Wait for: bugfix/gradle-9.6-compatibility PR to appear
# Review → Approve → Merge
Option B: Manual Fix (Local Machine)
Identify gradle-wrapper.properties location

find . -name "gradle-wrapper.properties"
# Likely: android/gradle/wrapper/gradle-wrapper.properties
Edit the file (choose your method)

# Using sed (all platforms)
sed -i.bak 's/gradle-9.6/gradle-8.4/g' \
  android/gradle/wrapper/gradle-wrapper.properties

# OR open in text editor and manually change:
# gradle-9.6-bin.zip → gradle-8.4-bin.zip
Verify the change

cat android/gradle/wrapper/gradle-wrapper.properties | grep distributionUrl
# Expected: gradle-8.4-bin.zip (NOT 9.6)
Update Android Gradle Plugin

# Find build.gradle files
find android -name "build.gradle*"

# Edit them (typically android/build.gradle)
# Change: com.android.application version '9.6' 
# To:     com.android.application version '8.4'
Test the fix

cd android
./gradlew clean
./gradlew assembleDebug

# If successful: gradle syncs and build completes
# If fails: check the error output and see Section 4
Commit and push

git add android/gradle/wrapper/gradle-wrapper.properties
git add android/build.gradle*
git commit -m "🔧 Fix: Update Gradle from 9.6 to 8.4"
git push origin bugfix/gradle-9.6-compatibility
Gradle Version Compatibility Chart
Gradle Version	AGP Compatibility	Status	Notes
8.4	AGP 8.0-8.2	✅ RECOMMENDED	Stable, well-tested
8.5	AGP 8.0-8.3	✅ Good	Slightly newer
8.6	AGP 8.0-8.3	⚠️ Caution	May have issues
9.0	AGP 9.0+	❌ Do not use	Still in beta
9.6	N/A	❌ DOES NOT EXIST	This is the problem!
If Fix Doesn't Work
See Section 4: Advanced Troubleshooting

📌 SECTION 2: Dependencies Lock File Error
Error Message
Error: Dependencies lock file is not found in /home/runner/work/SuberTube
Supported file patterns: package-lock.json, npm-shrinkwrap.json, yarn.lock
Why It Happens
package.json exists but lock file wasn't committed to git
npm packages vary between installations without a lock file
Security and build reproducibility cannot be guaranteed
Quick Fix (Copy-Paste)
Option A: Automated Fix (Recommended)
git push origin develop
# Wait for: bugfix/missing-dependencies-lock PR to appear
# Review → Approve → Merge
Option B: Manual Fix (Local Machine)
Find package.json

find . -name "package.json" -type f
# Typical locations:
# - web/package.json
# - package.json (root)
Install Node.js (if not present)

# macOS
brew install node@20

# Ubuntu/Debian
sudo apt-get install nodejs npm

# Windows
# Download from https://nodejs.org (v20.20.2)

# Verify
node --version  # Should be v20.x
npm --version   # Should be 9.x or 10.x
Generate lock file

# Navigate to the directory with package.json
cd web

# Create lock file WITHOUT installing (safer)
npm ci --package-lock-only

# If above fails, install with legacy peer deps
npm install --legacy-peer-deps

# Verify lock file created
ls -la package-lock.json
Validate lock file

# Check if it's valid JSON
python3 -m json.tool package-lock.json > /dev/null
# If successful: "null" output
# If fails: JSON syntax error

# Check file size (should be > 1KB)
wc -l package-lock.json
Commit lock file

git add package-lock.json
git commit -m "🔒 Add package-lock.json for reproducible builds"
git push origin bugfix/missing-dependencies-lock
Create PR

Title: 🔒 Fix: Missing dependencies lock file
Body:
- Enables reproducible builds across environments
- Required for security scanning (Malwarebytes)
- Prevents dependency version floating
npm Lock File Comparison
File	Package Manager	Priority	Size	Notes
package-lock.json	npm	1st	~100KB	Standard, recommended
npm-shrinkwrap.json	npm	2nd	~100KB	For published packages
yarn.lock	Yarn	3rd	~200KB	If using Yarn
Common Lock File Issues
Issue 1: Lock file is empty or malformed

# Fix: Regenerate
rm package-lock.json
npm ci --package-lock-only
Issue 2: Dependency conflicts

# Fix: Use legacy peer deps flag
npm install --legacy-peer-deps
npm ci --package-lock-only
Issue 3: Version mismatch between package.json and lock file

# Fix: Delete and regenerate
rm package-lock.json package.json.bak 2>/dev/null
npm install --package-lock-only
📌 SECTION 3: Other Errors
Error: "Task ':app:compileDebugJava' failed"
Cause: JDK version mismatch

Fix:

# Verify JDK version
java -version

# Required: JDK 17+
# If not present, install:
# Ubuntu: sudo apt-get install openjdk-17-jdk
# macOS: brew install openjdk@17
# Windows: Download from adoptopenjdk.net
Error: "Build cache is corrupted"
Cause: Gradle cache contains corrupted files

Fix:

cd android
./gradlew clean
rm -rf ~/.gradle/caches
./gradlew build
Error: "Module X not found"
Cause: Missing dependency or incorrect import

Fix:

# Regenerate dependencies
npm install
npm ci --package-lock-only

# Or for gradle
cd android
./gradlew clean
./gradlew assembleDebug
📌 SECTION 4: Advanced Troubleshooting
Step 1: Check Environment
# Create diagnostic report
cat > build-diagnostics.sh << 'EOF'
#!/bin/bash
echo "=== BUILD DIAGNOSTICS REPORT ==="
echo ""
echo "System Information:"
uname -a
echo ""
echo "Java/JDK:"
java -version 2>&1
echo ""
echo "Gradle Version (wrapper):"
cat android/gradle/wrapper/gradle-wrapper.properties | grep distributionUrl
echo ""
echo "Node.js:"
node --version
npm --version
echo ""
echo "Git Status:"
git status
echo ""
echo "Build Files:"
find . -name "build.gradle*" -o -name "package.json" | head -20
EOF

chmod +x build-diagnostics.sh
./build-diagnostics.sh
Step 2: Clean Full Rebuild
# Remove all caches and build artifacts
rm -rf android/build
rm -rf android/.gradle
rm -rf android/app/build
rm -rf ~/.gradle/caches
rm -rf ~/.gradle/daemon

# Reinstall gradle wrapper
cd android
./gradlew wrapper

# Clean rebuild
./gradlew clean
./gradlew assembleDebug --info --stacktrace
Step 3: Check GitHub Actions Logs
If error occurs in CI/CD:

Go to: https://github.com/YOUR-REPO/actions
Click on the failed workflow
Expand the "Run gradle/gradle-build-action@v2" step
Look for the detailed error message
Cross-reference with sections 1-3 above
Step 4: Enable Debug Mode
# Get detailed build output
cd android

# Gradle debug
./gradlew assembleDebug --debug > build.log 2>&1
cat build.log | grep -i "error\|warn" | head -30

# npm debug (if applicable)
npm --verbose install 2>&1 | tail -50
Step 5: Atomic Rollback
If you introduced new errors:

# Revert to last working state
git log --oneline | head -10
git revert <commit-hash>
# OR
git reset --hard <last-working-commit>
🛠️ Checklist for Different Scenarios
Scenario A: Error on Local Machine
Before submitting PR:
═════════════════════════════════════════════════════════

[  ] Ran: git clean -fdx
[  ] Ran: ./gradlew clean
[  ] Ran: ./gradlew assembleDebug
[  ] APK generated without errors
[  ] Tested on Android device/emulator
[  ] No new warnings or deprecations
[  ] Committed all changes
[  ] Pushed to feature/bugfix branch
Scenario B: Error in CI/CD (GitHub Actions)
When GitHub Actions fails:
═════════════════════════════════════════════════════════

[  ] Checked GitHub Actions logs
[  ] Identified error type (Gradle/Dependencies/Other)
[  ] Applied corresponding fix from Section 1-3
[  ] Created new bugfix branch
[  ] Committed fixes
[  ] Pushed to origin
[  ] Let automated PR creation run
[  ] Reviewed auto-generated PR
[  ] Approved and merged
Scenario C: Fix Not Working
If fix from Section 1-3 didn't resolve error:
═════════════════════════════════════════════════════════

[  ] Run diagnostics from Section 4
[  ] Check build-diagnostics.log for clues
[  ] Try different Gradle version (if error 1)
[  ] Try npm install vs npm ci (if error 2)
[  ] Check if antivirus/firewall blocking downloads
[  ] Try on different machine to isolate issue
[  ] Escalate to @android-lead or @devops-lead
📞 Getting Help
When to Escalate
Escalate if:

Error persists after following all troubleshooting steps
Error is not in Section 1-3
Multiple team members seeing same error
Error is blocking main branch merge
Who to Contact
Error Type	Contact	Channel
Gradle/Build	@android-lead	Slack #android-dev
Dependencies/npm	@devops-lead	Slack #devops
Security/Malwarebytes	@security-team	Slack #security
CI/CD/GitHub Actions	@devops-lead	Slack #devops
Unknown	@tech-lead	Slack #general
Provide This Info
When asking for help, include:

I'm getting this error:
[PASTE FULL ERROR MESSAGE]

My environment:
- OS: macOS / Linux / Windows
- Java: [java -version output]
- Gradle: [cat gradle-wrapper.properties | grep gradle]
- Node: [node --version]
- npm: [npm --version]

Steps I've tried:
1. ...
2. ...
3. ...

Logs: [github-actions-link or build.log snippet]
📚 Reference Links
Official Documentation:

Gradle Release Notes: https://gradle.org/releases/
Android Gradle Plugin: https://developer.android.com/build/releases/gradle-plugin
npm Documentation: https://docs.npmjs.com/
GitHub Actions: https://docs.github.com/en/actions
SuberTube Docs:

Build Instructions: BUILD-APK.md
Development Workflow: DEVELOPMENT-WORKFLOW.md
Security Policy: SECURITY.md
✅ Success Indicators
You've fixed the error when:

Gradle 9.6 Error:
✓ gradle-wrapper.properties shows gradle-8.4 or newer
✓ ./gradlew clean completes
✓ ./gradlew assembleDebug produces APK
✓ No gradle-9.6 references in codebase

Dependencies Lock Error:
✓ package-lock.json exists in repository
✓ npm ci completes without errors
✓ All packages installed with locked versions
✓ npm audit shows no critical vulnerabilities

General Success:
✓ CI/CD pipeline turns green (all checks pass)
✓ APK artifact available for download
✓ No build warnings in console output
✓ Ready to merge to develop branch
Document Version: 1.0
Last Updated: 2026-09-27
Maintained By: SuberTube Development Team

For updates: See DEVELOPMENT-WORKFLOW.md