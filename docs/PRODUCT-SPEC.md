# Storylab — Product Specification

## Why

The way stories are published and sold online is broken for authors.

Platforms like Amazon KDP, Wattpad, Substack, or Patreon offer distribution in exchange for control. Authors are subject to changing fee structures, content policies, algorithmic visibility, and the ever-present risk of account termination. If a platform shuts down or changes its terms, authors lose their audience — and sometimes their revenue — overnight.

At the same time, existing decentralized alternatives are either too technical, require blockchain infrastructure, or sacrifice usability for ideology.

Storylab is built on a simple premise: **an author should be able to publish a story anywhere and have readers access it with a key they actually own** — without depending on any single company to keep the lights on.

---

## Value

### For Authors
- Full ownership of content and access keys — no platform can revoke or restrict them
- Publish once, distribute everywhere: personal servers, IPFS, the Marketplace, or all three
- Monetize directly through key distribution without surrendering a cut to an intermediary
- Rotate or update keys to release new versions without losing prior distribution

### For Readers
- Keys are portable — access is not tied to a platform account
- A valid key works in any Reader implementation, now or in the future
- No risk of losing access because a platform shut down or banned an account
- Content can be verified via CID — readers know what they're opening is what they bought

### For the Ecosystem
- Open source Editor and Reader mean anyone can build on top of Storylab
- The Marketplace is one node in the network, not the center of it
- No blockchain overhead — the system is simple enough to be implemented by a single developer

---

## Target Groups

### Primary

**Independent Authors**
Writers who self-publish fiction, non-fiction, serialized stories, or interactive narratives. They want direct relationships with their readers and fair economics — without being beholden to a platform's rules or revenue share.

**Small Publishers & Collectives**
Small editorial teams or writing collectives who want to distribute curated content to a subscribed audience without building custom infrastructure.

### Secondary

**Readers of Independent Content**
People who actively seek out content outside mainstream publishing. They value supporting authors directly and want assurance that their purchased access is durable.

**Developers & Tool Builders**
Developers who want to build custom Editors, Readers, or Marketplace integrations on top of the open Storylab format.

### Tertiary

**Journalists & Researchers**
Individuals who want to publish long-form content with controlled access — paywalled reports, investigative pieces, or research — without relying on a media platform.

**Educators**
Teachers or course creators distributing gated written content to students or cohorts.

---

## Vision

A world where stories belong to those who write them — and access belongs to those who earn it — with no platform in between that can take either away.

---

## Mission

To build the simplest possible open infrastructure for publishing, distributing, and accessing stories — one that gives authors full ownership, gives readers durable access, and gives no single platform the power to extract rent from either.

---

## Strategy

### Phase 1 — Foundation
- Define and stabilize the Storylab story format (folder structure, manifest schema, key specification)
- Build and open source the **Reader** — the minimum viable piece that validates keys and renders stories
- Build and open source the **Editor** — focused on writing experience and key management
- Publish reference documentation for the format so third parties can build compatible tools

### Phase 2 — Distribution
- Launch the **Marketplace** as the first major distribution surface
- Enable authors to list stories, set prices, and distribute keys through the Marketplace
- Integrate IPFS as a first-class publishing and fallback retrieval option
- Build bridges to existing platforms (e.g. export to EPUB, import from Markdown/Substack)

### Phase 3 — Ecosystem
- Grow the developer ecosystem around the open format — alternative Editors, Reader apps, discovery tools
- Enable the Marketplace to federate with other Marketplaces or distribution nodes
- Introduce author and reader reputation layers (reviews, collections, curation) without making them access-critical
- Explore sustainable business models for the Marketplace that do not compromise the open core (e.g. optional hosting, featured listings, analytics)

### Guiding Constraints
- The open source core (Editor, Reader, format) must always remain functional without the Marketplace
- No feature may be introduced that makes the Marketplace a required dependency for access
- Complexity is a cost — every addition to the format or protocol must justify itself against the principle of simplicity
