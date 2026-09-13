export const packetTree = {
  name: "/packet_2026-09-07_T0_001/",
  type: "dir",
  desc: "Root provenance packet. Governed, deterministic, replayable evidence bundle binding legal truth to cryptographic truth.",
  children: [
    {
      name: "manifest.json",
      type: "file",
      desc: "Canonical record definition. The genesis of truth for this settlement event. Contains packet_id, safe, signers, Merkle roots, prev_hash linkage. Anchored on-chain.",
      hash: "0x8f4a...c9e2",
      badge: "ANCHOR",
    },
    {
      name: "Evidence_Register.csv",
      type: "file",
      desc: "Complete chain-of-custody ledger. Every file in SOURCES/ EXTRACTS/ EVIDENCE/ is hashed, logged, registered, and committed. The completeness proof.",
      hash: "b3e1...7a4f",
    },
    {
      name: "SOURCES/",
      type: "dir",
      desc: "Immutable custodian inputs. Raw, unmodified, legally-sourced artifacts. Never regenerated, only attested.",
      children: [
        {
          name: "bank_statements/",
          type: "dir",
          desc: "Fedwire confirmations, ACH logs, POS settlement files. Legal Truth layer source.",
          children: [
            { name: "chase_2026-09-07.pdf", type: "file", desc: "Bank statement - SHA256 committed", hash: "sha256:a7f2..." },
            { name: "fedwire_T0_001.json", type: "file", desc: "Fedwire statutory finality record", hash: "sha256:91bc..." },
          ],
        },
        {
          name: "exchange_exports/",
          type: "dir",
          desc: "Custodial exchange CSVs, trade history, balance snapshots.",
          children: [
            { name: "coinbase_prime_export.csv", type: "file", desc: "Exchange export", hash: "sha256:44de..." },
          ],
        },
        { name: "wallet_exports/", type: "dir", desc: "Safe transaction history, on-chain lineage exports.", children: [] },
        { name: "deed_pdfs/", type: "dir", desc: "SFH deed, title commitment, county recorder receipts.", children: [] },
      ],
    },
    {
      name: "EXTRACTS/",
      type: "dir",
      desc: "Machine-generated normalized artifacts. Deterministic transforms of SOURCES/. No human edits permitted.",
      children: [
        { name: "normalized_transactions.parquet", type: "file", desc: "Canonical normalized transaction log - deterministic transform", hash: "sha256:c2a1..." },
        { name: "cost_basis_schedule.json", type: "file", desc: "Cost basis LIFO/FIFO calculation - reproducible", hash: "sha256:ff09..." },
        { name: "wallet_lineage_graph.json", type: "file", desc: "Wallet lineage DAG - proves fund provenance", hash: "sha256:11bc..." },
      ],
    },
    {
      name: "EVIDENCE/",
      type: "dir",
      desc: "Human-interpretable reconciliation artifacts. Generated from EXTRACTS/, reviewed by CPA.",
      children: [
        { name: "ledger_T0_001.xlsx", type: "file", desc: "Reconciled settlement ledger", hash: "sha256:90aa..." },
        { name: "reviewer_memo.md", type: "file", desc: "CPA reviewer memo - human attestation", hash: "sha256:02bf..." },
      ],
    },
    {
      name: "REPLAY/",
      type: "dir",
      desc: "Deterministic replay capability. Allows any third party to regenerate all artifacts from SOURCES/.",
      children: [
        {
          name: "Replay_Engine_Packet/",
          type: "dir",
          desc: "Dockerized replay engine - pinned versions, reproducible environment.",
          children: [
            { name: "Dockerfile", type: "file", desc: "Node 20.11.0, Python 3.11.6, solc 0.8.24", hash: "sha256:de21..." },
          ],
        },
        { name: "Replay_Script_Catalog.json", type: "file", desc: "Ordered execution graph for replay. Topologically sorted.", hash: "sha256:ab12..." },
        { name: "Replay_Metadata_Registry.json", type: "file", desc: "Input/output mapping for each replay step", hash: "sha256:cd34..." },
        {
          name: "Replay_Environment_Spec.yaml",
          type: "file",
          desc: "node_version, python_version, dependencies, OS hash. Required for deterministic replay.",
          hash: "sha256:ef56...",
          badge: "CRITICAL",
        },
      ],
    },
    {
      name: "ATTESTATIONS/",
      type: "dir",
      desc: "Custodian and Safe signer attestations. Cryptographically signed.",
      children: [
        { name: "custodian_attestation_001.sig", type: "file", desc: "EIP-712 signed attestation from custodian", hash: "sig:0x4a..." },
        { name: "safe_signers.json", type: "file", desc: "Safe signer ownership % and name_hash", hash: "sha256:98fe..." },
      ],
    },
    {
      name: "VARIANCE/",
      type: "dir",
      desc: "Governed variance flag taxonomy. Every deviation explicitly flagged, categorized, severity-rated.",
      children: [
        { name: "Variance_Flag_Taxonomy.csv", type: "file", desc: "Full taxonomy - machine-readable", hash: "sha256:55aa..." },
        { name: "open_flags_T0_001.json", type: "file", desc: "Active variance flags for this packet", hash: "sha256:33cc..." },
      ],
    },
    {
      name: "RECONCILIATION/",
      type: "dir",
      desc: "Reconciliation workbooks binding fiat to on-chain evidence.",
      children: [
        { name: "fiat_to_chain_recon.xlsx", type: "file", desc: "Fiat vs on-chain balance reconciliation", hash: "sha256:77dd..." },
      ],
    },
    {
      name: "APPENDICES/",
      type: "dir",
      desc: "Immutable appendices - digests, logs, request letters.",
      children: [
        {
          name: "Appendix_A_Digests.json",
          type: "file",
          desc: "SHA256 for every file in packet. Root of Merkle tree.",
          hash: "sha256:root:f1a2...",
          badge: "ROOT",
        },
        { name: "Appendix_B_Replay_Logs/", type: "dir", desc: "Deterministic replay execution logs - timestamped, hash-linked", children: [] },
        { name: "Appendix_C_Custodian_Request_Letters/", type: "dir", desc: "Governed intake protocol - request letters to custodians", children: [] },
      ],
    },
  ],
};

export const manifestJson = `{
  "packet_id": "T0_2026-09-07_001",
  "type": "SETTLEMENT_T0",
  "version": "1.0.0",
  "safe": "0xSafe...a9f2",
  "signers": [
    {
      "address": "0x1a2...b3c4",
      "name_hash": "sha256:8f4a...c9e2",
      "ownership_pct": 60.00
    },
    {
      "address": "0x4d5...e6f7",
      "name_hash": "sha256:b3e1...7a4f",
      "ownership_pct": 40.00
    }
  ],
  "liabilities_merkle_root": "0x7f8...9a0b",
  "assets_snapshot": {
    "safe_balances": {
      "USDC": "2500000.00",
      "WETH": "12.5"
    },
    "sfh_deed_hash": "sha256:deed:c3d4...e5f6",
    "bank_statement_hash": "sha256:bank:a7f2...91bc"
  },
  "timestamp": "2026-09-07T14:32:00Z",
  "prev_packet_hash": "0x000...prev_packet_sha256",
  "digests_root": "0xf1a2...b3c4",
  "replay_hash": "sha256:replay:de21...ab12"
}`;
