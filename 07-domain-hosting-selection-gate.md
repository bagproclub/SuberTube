# Domain / Hosting Selection Gate

**Status:** DISCOVERY COMPLETE / NETLIFY GATEWAY TARGET RECORDED / CUSTOM DOMAIN NOT SELECTED
**Standard:** MASTER GUIDE FINAL-5.12

## Persistent Gateway Reference

`https://incredible-mooncake-21b036.netlify.app/`

This URL is a standing **entry/gateway reference** for the SuberTube project chain.

It is **not** treated as:

- the final product name;
- proof of custom-domain ownership;
- a requirement that the final release artifact must be hosted here;
- permission to mutate DNS or redirects now.

The current delivery/gateway target is Netlify because the user explicitly designated the supplied `*.netlify.app` URL for this project path. The gateway URL and the final release approval remain separate roles. A future custom domain remains a separate decision.

## Project requirements carried from the bounded plan

### Domain / registrar

- account isolation
- 2FA support
- transfer lock
- DNSSEC support when appropriate
- privacy/registrant protection where appropriate
- clear ownership/recovery process
- no credential reuse from retired projects

### Hosting / edge

- custom domain support
- HTTPS/TLS
- static asset delivery
- deployment from verified source
- version/deployment history
- rollback/recovery path
- response-header support
- routing/redirect capability
- protected runtime configuration/secret boundary when backend features are added later
- source → deployment lineage

## Candidate evidence — 2026-09-23

| Candidate | Relevant current capability | Project implication |
|---|---|---|
| **Netlify** | Custom domains are supported; Netlify supports static `_redirects` / `netlify.toml` routing and rewrites, including external rewrites/proxies, and supports custom response headers via `_headers` / configuration. | Strong continuity with the already-live gateway URL and the current static Web Core model. Current gateway can remain a reference while a later approved deployment target is introduced. citeturn929326search7turn929326search2turn929326search1turn929326search5 |
| **Cloudflare Pages** | Custom domains are supported; Direct Upload supports prebuilt assets from a local computer and drag-and-drop/Wrangler. Cloudflare Pages also supports `_redirects`; advanced external proxying is limited. | Viable for a static Web Core. If Direct Upload is chosen, Cloudflare states that the project cannot later be switched to Git integration; a new project would be needed for Git integration. citeturn929326search8turn929326search4turn929326search0 |
| **Vercel** | Custom domains are supported; deployments can be inspected/redeployed/promoted; Vercel documents production rollback and CLI deployment flows. | Viable for a static/web deployment and strong deployment-history controls. It has its own project/domain workflow, so it should be treated as a separate deployment target rather than assumed compatible with the current Netlify gateway without an explicit routing design. citeturn158227search1turn158227search6turn158227search0turn158227search8 |

## Current Netlify gateway evidence

The connected Netlify account reports an existing project named `incredible-mooncake-21b036` with a current deployment in `ready` state. The site is claimed and currently has team SSO access control enabled at the project/account level. The current deploy has no redirect rules processed. These are observations of the existing gateway project only; they do not select Netlify as the final host for the new project.

## Engineering interpretation

For the current **Web-first + static assets + later Android wrapper** direction, all three candidates can satisfy the basic hosting shape. The key decision is therefore not “can it host HTML/CSS/JS?” but which platform gives the project the desired operational boundary with the least unnecessary complexity.

For this project specifically:

1. **Continuity path:** Netlify has the lowest architectural discontinuity because the current gateway already exists on Netlify and its routing/header model maps directly to the documented gateway concept. This is a fit assessment, not a final provider decision.
2. **Edge/security-oriented alternative:** Cloudflare Pages is viable, especially when static delivery and Cloudflare-controlled DNS/edge become central. Direct Upload has a documented integration choice that should be made deliberately because it cannot later be switched to Git integration within the same Pages project. citeturn929326search4turn929326search8
3. **Deployment/recovery alternative:** Vercel has mature deployment promotion and rollback workflows, but would be a separate target with its own domain/project management model. citeturn158227search0turn158227search10

## Decision gate

**Current delivery/gateway target:** NETLIFY — RECORDED BY EXPLICIT USER AUTHORITY
**Final custom domain:** OPEN / NOT SELECTED
**Production deployment of `/mnt/data/SuberTube-new/`:** NOT PERFORMED

No provider account was changed, no DNS was changed, no domain was purchased/transferred, and no new-project deployment was performed by this task.

## Evidence refs

- `EV-HOSTING-DISCOVERY-001` — candidate capability research and current gateway observation
- `EV-GATEWAY-001` — persistent gateway reference and source/deployment separation
