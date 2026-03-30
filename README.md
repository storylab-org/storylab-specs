# Storylab — Product & Technical Specifications

Core documentation for the Storylab platform: vision, architecture, key decisions, and development roadmap.

## 📚 Documentation

- **[PRODUCT-SPEC.md](docs/PRODUCT-SPEC.md)** — Why Storylab exists, target audience, strategy, and three-phase roadmap (Foundation → Distribution → Ecosystem)
- **[TECHNICAL-SPEC.md](docs/TECHNICAL-SPEC.md)** — System architecture, core concepts (Story, Keys, CID), access control, key flows, design principles
- **[TODOS.md](docs/TODOS.md)** — Open questions and blocking tasks, ordered by dependency

## 🏗️ Architecture Overview

Storylab is a decentralised, platform-agnostic system composed of three pieces:

1. **Editor** — Authors write and manage stories ([storylab-editor-js](https://github.com/storylab-org/storylab-editor-js))
2. **Reader** — Readers validate keys and access stories
3. **Marketplace** — Optional hub for discovery and key distribution

**Core principle:** Authors own their content; access is portable; no single platform can revoke either.

## 🚀 Current Phase

**Phase 1 — Foundation**
- [x] Define product vision
- [x] Define technical architecture
- [ ] Stabilise story format (blocking all other work)
- [ ] Build Editor (in progress)
- [ ] Build Reader
- [ ] Publish format spec

See [TODOS.md](docs/TODOS.md) for detailed blockers and next steps.

## 📂 Implementation Repos

- **[storylab-editor-js](https://github.com/storylab-org/storylab-editor-js)** — Editor implementation (React + Tauri)
- **[storylab-reader-js](https://github.com/storylab-org/storylab-reader-js)** — Reader implementation (coming Phase 2)
- **[storylab-marketplace](https://github.com/storylab-org/storylab-marketplace)** — Marketplace (coming Phase 2)

## 🤝 Contributing

All repos follow the same contribution workflow. See the implementation repo's README and `CLAUDE.md` for development setup.

---

**Questions?** Open an [issue](https://github.com/storylab-org/storylab-specs/issues) or check the [discussions](https://github.com/storylab-org/storylab-specs/discussions).
