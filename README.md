# spotren-sites

Public Astro-based site funnels and customer-facing builder surfaces for Spotren.

## Purpose

This repository is not the core product app and it is not the managed template bootstrap source.

Use `spotren-sites/` for:

- public marketing-adjacent funnels that behave like product entry surfaces
- anonymous or semi-public site builder journeys
- public pages such as `new-site`, `my-site`, and `pay-ok`
- Astro UIs that consume the public `spotren-app` BFF routes under `/api/public/spotren-sites/*`

Do not treat this repository as the source of truth for:

- managed site provisioning rules
- GitHub and Vercel bootstrap logic
- internal tenant authorization
- template bootstrap contracts for provisioned customer sites

Those belong in `spotren-app/`.

## Current Structure

- `base/`
  - minimal localized Astro template scaffold
- `ndEX-builder/`
  - public ndEX funnel and checkout-oriented experience backed by Spotren public APIs

## Source Of Truth Boundaries

- `spotren-sites/`
  - public funnel UI, public page behavior, localized copy used by these pages, and client-side integration assumptions
- `spotren-app/`
  - public API behavior, prospect session rules, checkout creation semantics, managed site lifecycle, and template selection enforcement
- `spotren-templates/`
  - provisionable template repositories used during managed site bootstrap

## Current Public Flow

The main `ndEX-builder` flow is:

1. resolve a Google Maps business profile URL
2. create or reuse a Spotren prospect
3. issue a public prospect session token
4. load active site templates
5. create seller and/or customer checkouts
6. expose post-checkout status and customer access surfaces

The public backend routes that power this flow live in:

- `spotren-app/apps/web/app/api/public/spotren-sites/*`

## Entry Points

- `ndEX-builder/README.md`
  - repository-local details for the current public ndEX funnel
- `base/README.md`
  - minimal template scaffold details
- `../spotren-app/docs/architecture/public-spotren-sites-flow.md`
  - end-to-end public flow documentation
