# StoryLab — Open Questions & TODOs

Decisions and tasks that need to be resolved before or during implementation. Ordered by dependency — later items build on earlier ones.

---

## 1. Story Format

- [ ] **Define encryption scheme** — Symmetric (AES + shared key) vs asymmetric (author keypair + reader key derivation). Determines key size, performance, and sharing mechanics.
- [ ] **Define supported content types** — What can a page contain? Markdown, rich text, HTML, images, embedded media? Pin down the minimum for v1.
- [ ] **Define manifest schema** — Required and optional fields: title, author, description, cover, chapter titles, language, content warnings, pricing hints, publication date, free-preview flags.
- [ ] **Write format spec** — RFC-style doc defining the `.storylab` folder structure, manifest schema, and key format. This is the foundation for third-party tooling.

## 2. Key Management

- [ ] **Key generation** — How are keys created? Random tokens, derived keys, or something else? Local-only or server-assisted?
- [ ] **Key storage** — Where do readers keep keys? Browser storage, keychain file, Marketplace account, all of the above?
- [ ] **Key portability format** — Define a standard: `.storylab-key` file, URI scheme (`storylab://key/...`), QR code, or combination.
- [ ] **Key revocation** — Is revoking a key for the current version possible, or is rotation (new CID) the only mechanism? Decide if this is a non-goal.
- [ ] **Key bundles** — One token unlocking multiple stories or future stories from an author. Enables series passes, subscriptions, patron tiers without Marketplace dependency.

## 3. Content Features

- [ ] **Free preview pages** — Allow authors to mark pages as free in the manifest (no key required). Critical for discoverability and conversion.
- [ ] **Serialized content model** — Is a "series" a first-class concept (one key, many chapters) or separate stories with separate keys? Define the relationship model.
- [ ] **Offline reading** — Reader caches/downloads stories locally. Essential for mobile.

## 4. Discovery & Distribution

- [ ] **Story resolution** — CIDs aren't human-friendly. Is there a naming/resolution layer, or is discovery always via Marketplace, links, social sharing?
- [ ] **Update notifications** — When an author publishes a new version (new CID), how do readers find out? Feed, notification, manual check?
- [ ] **Import/export bridges** — `epub-to-storylab`, `markdown-to-storylab` converters. Lower the barrier for authors bringing existing work.

## 5. Architecture Decisions

- [ ] **Web Reader as PWA** — Ship a Progressive Web App first for cross-platform reach (iOS/Android/desktop from one codebase). Defer native iOS to Phase 2.
- [ ] **Shared core package** — Define what lives in `packages/core` vs platform-specific code. Format parsing, key validation, crypto should be shared.

## 6. Business & Sustainability

- [ ] **Revenue model** — The Marketplace is optional, so what sustains the project? Candidates: optional hosting, featured listings, analytics dashboard, premium author tools.
- [ ] **Portable reading history** — Readers sign their reading history (CIDs unlocked) as a shareable "shelf." Social proof without platform lock-in.
