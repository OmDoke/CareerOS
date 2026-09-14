# Prompt Guidelines

When generating code:

1. Read the relevant documentation in the docs folder first.

2. Follow the project architecture exactly.

3. Generate only the requested feature.

4. Do not modify unrelated code.

5. Explain architectural decisions briefly when needed.

6. Keep responses focused on implementation.

7. Prefer reusable components.

8. Keep business logic inside services.

9. Keep controllers thin.

10. Validate every API request.

11. Use TypeScript strict typing.

12. Use Prisma for database operations.

13. Use TanStack Query for server state.

14. Use Zustand only for global UI state.

15. Follow the existing folder structure.

16. Write clean, readable, production-quality code.

17. Avoid overengineering.

18. Do not add new features beyond the requested scope.

19. Ensure generated code builds without TypeScript errors.

20. Before completing a feature, verify:

- API implemented
- Validation complete
- Error handling complete
- Types complete
- UI connected
- Documentation updated if necessary