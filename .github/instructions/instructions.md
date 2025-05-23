---
applyTo: '**'
---

# Coding Standards & Preferences

- **Language:** Use JavaScript as appropriate for the codebase.
- **Formatting:** Follow Prettier or project-specific formatting rules. Use 2 spaces for indentation.
- **Naming:** Use descriptive, camelCase names for variables and functions. Use PascalCase for classes and components.
- **Functions:** Prefer pure functions and small, single-responsibility methods.
- **Comments:** Use comments to explain complex logic, but avoid redundant comments.
- **Testing:** Write or update unit tests for new features or bug fixes.
- **Imports:** Use ES6 import/export syntax. Group imports by library, then relative paths.
- **Error Handling:** Handle errors gracefully and provide meaningful error messages.
- **Domain Knowledge:** This project is related to metrics and Peloton. Use domain-appropriate terminology and abstractions.
- **Pull Requests:** Keep changes minimal and focused. Include a summary of changes and reasoning.

# Preferences

- Avoid unnecessary dependencies.
- Use async/await for asynchronous code.
- Prefer functional components and hooks in React.
- Keep configuration and secrets out of source code.
- Write concise and maintainable code.

# AI Guidance

- Suggest only the minimal code required for the requested change.
- Use comments to indicate unchanged code regions.
- Do not repeat existing code unnecessarily.
- Group code changes by file and provide concise explanations.