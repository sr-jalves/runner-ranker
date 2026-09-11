---
name: Backend schema reload
description: Development workflow behavior after changing shared schemas used by the Express backend.
---

When a shared schema used by the Express server changes, restart the application workflow before testing the endpoint. Client HMR can refresh frontend modules while the backend process continues using the previous schema implementation.

**Why:** An endpoint continued accepting an invalid payload until the workflow was restarted, even though the TypeScript check and client hot reload had completed.

**How to apply:** After changing validation or server-side shared contracts, restart the managed application workflow once, then repeat the API request.