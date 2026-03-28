# Storylab — Product Specification

## Overview

Storylab is a decentralized, platform-agnostic storytelling system that allows authors to publish content-based stories without being locked into any single platform. It is composed of three pieces: an **Editor**, a **Reader**, and a **Marketplace**.

---

## Core Concepts

### Story

A story is a **folder** containing:

- One or more **pages** (the content)
- A **manifest file** that holds the story's metadata and its associated **keys**

Stories are self-contained units that can be published anywhere — on any web platform, a personal server, or the **IPFS network**.

### Keys

- A story has one or more **keys**
- A key grants its holder read access to the story
- Keys are distributed (e.g. sold, gifted) through the Marketplace or directly by the author
- The author always retains **full access** to their story regardless of key state

### Content-Addressing (CID)

- Stories are identified by their **Content ID (CID)**, derived from the story's content
- The CID is a **version indicator** — if the content changes (including keys in the manifest), the CID changes
- A mismatched or unexpected CID signals that the content has been altered; the new version could be a legitimate update, a fake, or a secondary distribution
- It is up to the reader (or tooling) to verify they are opening the intended CID — the system does not enforce which CID is canonical

---

## Access Control

| Role       | Access Level                              |
|------------|-------------------------------------------|
| Author     | Full access — read, write, publish, rotate keys |
| Key Holder | Read access to the story                  |
| Public     | No access without a valid key             |

Access is enforced locally by the Reader: if the user does not possess a valid key for a given CID, the story cannot be opened.

---

## Architecture

### 1. Editor *(Open Source)*

- Used by authors to write and structure stories
- Organizes content into pages within a story folder
- Manages key generation and story manifest
- Can have a **server attached** (local, remote, or IPFS) for publishing and storage
- Falls back to **IPFS or the Marketplace** as a distribution layer if no server is configured

### 2. Reader *(Open Source)*

- Used by readers to open and navigate stories
- Validates whether the user holds a valid key for the requested story
- Can have a **server attached** for fetching story content
- Falls back to **IPFS or the Marketplace** as a content source if no server is configured
- Renders pages in order

### 3. Marketplace

- The hub for authors to list stories and distribute keys
- Readers can browse and acquire keys for stories
- Acts as an **optional fallback content source** for both the Editor and Reader
- The Marketplace does **not** control access — it only facilitates key distribution
- Authors are free to distribute keys outside the Marketplace (direct sale, gifting, other platforms)

## Design Principles

- **No blockchain required** — access control is enforced through key validation; CIDs serve as version identifiers, not gatekeepers
- **No mandatory node** — Editor and Reader can each have a server attached; IPFS or the Marketplace serve as fallbacks
- **Platform-agnostic** — stories can be hosted anywhere that supports file storage or IPFS
- **Author sovereignty** — authors own their content and keys; no platform can revoke access or lock them in
- **Open source core** — Editor and Reader are open source, ensuring transparency and portability
- **Marketplace is optional** — it is a convenience layer for discovery and key distribution, not a dependency

---

## Key Flows

### Publishing a Story

1. Author writes the story in the **Editor**
2. Editor generates keys and writes them to the manifest file
3. Story folder (pages + manifest) is published — to an attached server, IPFS, or the Marketplace
4. A CID is produced representing the current version of the story
5. Author shares the CID and distributes keys via the **Marketplace** or directly

### Accessing a Story

1. Reader opens the **Reader** app and provides a story CID
2. Reader fetches the story from an attached server, IPFS, or the Marketplace
3. Reader app checks whether the user holds a valid key for that story
4. If valid: content is decrypted and rendered
5. If invalid: access is denied

### Key Rotation

1. Author updates one or more keys in the manifest
2. Story content changes → a new CID is produced, marking a new version
3. Previous key holders retain access to the old CID/version; the new version requires the new key
4. Author distributes new keys via Marketplace or directly
