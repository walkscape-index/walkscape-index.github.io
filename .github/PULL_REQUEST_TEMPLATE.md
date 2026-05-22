## Description

Please include a summary of the changes, the reasoning behind them, and which issue is resolved (if applicable).

Fixes # (issue)

## Checklist

Please check all the options that apply to your Pull Request. If an item is not checked, please explain why in your description.

### Quality Assurance

- [ ] I ran `pnpm exec prettier --write .` to format the files.
- [ ] I ran `pnpm run astro check` and checked for TypeScript/frontmatter errors.
- [ ] I built the site locally with `pnpm run build` and made sure it succeeds.
- [ ] I verified all tests pass using `pnpm run test:run`.

### For New Tools / Databases / Sites

- [ ] I added the new entry into `src/data/tools.json`.
- [ ] I filled out all required fields (`title`, `body` description, `tags`, `url`, `date-added`).
- [ ] I verified the URL is correct and active.
- [ ] I added a unique, URL-friendly, kebab-case `slug` for the new entry.
- [ ] (If applicable) I provided the GitHub URL, marked `open_source: true`, and added appropriate social links and author name.

## Screenshots / Visuals (if applicable)

If you made any user interface or layout changes, please attach screenshots or recordings showing the changes on both desktop and mobile layouts.
