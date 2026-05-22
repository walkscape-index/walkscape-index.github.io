# GitHub Repository Administrative Settings Checklist

To fully enforce the CI/CD pipelines, security scanning, and Conventional Commits requirements, please manually configure the following settings in your GitHub Repository settings page:

---

## 1. Branch Ruleset for `main`

Enforce the CI Gatekeeper and CodeQL analysis for all contributions.

1. Navigate to **Settings** -> **Rules** -> **Rulesets**.
2. Click **New ruleset** -> **Import ruleset** or **New branch ruleset**.
3. Name the ruleset: `Enforce CI Gatekeeper & CodeQL`.
4. Under **Target branches**, select **Add target** -> **Include default branch** (which targets `main`).
5. Under **Rules**, enable the following:
   - [x] **Require a pull request before merging**
     - Enable _Require approvals_ (usually `1` approval is standard).
     - Enable _Dismiss stale pull request approvals when new commits are pushed_.
   - [x] **Require status checks to pass before merging**
     - Click **Add checks** and search for:
       - `Lint, Type Check & Build` (configured in `ci.yml`).
       - `Analyze (javascript-typescript)` (configured in `codeql.yml`).
       - `Validate PR Title` (configured in `pr-title.yml`).
     - Enable _Require branches to be up to date before merging_ (enforces linear history checks).
   - [x] **Block force pushes** (prevents rewriting history on `main`).
   - [x] **Block deletions** (prevents deleting the `main` branch).

---

## 2. Pull Request Merge Options

Enforce a clean Git history and use squash merging.

1. Navigate to **Settings** -> **General**.
2. Scroll down to the **Pull Requests** section:
   - [ ] Disable **Allow merge commits** (uncheck).
   - [x] Enable **Allow squash merging** (check).
     - Set the default commit message to **Pull request title and description** (this ensures the conventional commit PR title becomes the squash commit message).
   - [ ] Disable **Allow rebase merging** (uncheck).
3. Enable **Automatically delete head branches** (check) - this cleans up branch rot after merging PRs.

---

## 3. Commit Signoff & Linear History

1. Navigate to **Settings** -> **General**.
2. Scroll to the **Pull Requests** section:
   - [x] Enable **Require linear history** (check).
