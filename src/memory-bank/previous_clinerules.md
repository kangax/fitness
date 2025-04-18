# Project Guidelines

IMPORTANT: Do not add comments of your changes in jsx/tsx

## General

- Use `;` to string commands in terminal since `&&` have escaping issues
- Do not create backup files since we use versioning system
- Use meaningful commit messages at the end of every task (don't ask me if I'm ok with them since I can see them when approving command)
- Read as many files as you need as long as they're not very large (do not ask me if you can read and which file)
- Never read large json files directly; always use `jq` so as not to load them in memory
- Try to avoid making lots of small requests to the server; attempt to reasonably batch them
- Do not EVER guess info about WODs, always ask for real data if unsure

## Code Style & Patterns

- Prefer composition over inheritance
- Use repository pattern for data access
- Don't forget error handling
- Check if data/logic already exists in an app and don't repeat yourself

## Testing Standards

- Unit tests required for business logic
  - Using Vitest + React Testing Library
- Integration tests for API endpoints
- E2E tests for critical user flows
- Always ensure tests exist for additions/changes

## Misc

- Allowed tags for WODS are 'Chipper', 'Couplet', 'Triplet', 'EMOM', 'AMRAP', 'For Time', 'Ladder'

## UI

- Our UI is minimal, so instead of "Show Cagegories" and "Show Tags" toggle/links we would say "Cagegories" | "Tags", etc.
- Both dark and light mode should work
