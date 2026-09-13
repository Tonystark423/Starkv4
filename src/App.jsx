import { useState } from "react";
import TreeView from "./TreeView.jsx";
import { packetTree, manifestJson } from "./data.js";

export default function App() {
  const [selectedPath, setSelectedPath] = useState("/packet_2026-09-07_T0_001//manifest.json");
  const [selected, setSelected] = useState(packetTree.children[0]);
  const [copied, setCopied] = useState(null);

  const onSelect = (path, node) => {
    setSelectedPath(path);
    setSelected(node);
  };

  const copyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopied(hash);
    setTimeout(() => setCopied(null), 1500);
  };

  const specMeta = [
    ["Doc ID", "PPS-2026-T0-001"],
    ["Classification", "GOVERNED / CPA-READY"],
    ["Anchoring", "AuditAnchor.sol @ 0xA0...19f2"],
    ["Chain", "Ethereum Mainnet (L1)"],
    ["Replay Engine", "v2.4.1 · Node 20.11.0 / Py 3.11.6"],
    ["Hash Function", "SHA-256 · Keccak-256 (on-chain)"],
    ["Storage", "IPFS CIDv1 · Dag-PB"],
  ];

  const anchorFlow = [
    { label: "PACKET BUNDLE", sub: "All files + Evidence_Register", hash: "Merkle Root: 0xf1a2..." },
    { label: "SHA-256", sub: "Appendix_A_Digests.json", hash: "digests_root" },
    { label: "IPFS CID", sub: "CIDv1 Dag-PB · Content-addressed", hash: "bafybei...9a0b" },
    { label: "AuditAnchor.sol", sub: "anchor(bytes32 digestsRoot, string cid)", hash: "tx: 0x8f...c9e2", final: true },
  ];

  const properties = [
    { n: "01", title: "Determinism", desc: "Every artifact regenerates from SOURCES via REPLAY", detail: "Given same SOURCES/ + Replay_Environment_Spec.yaml, replay engine must produce byte-identical EXTRACTS/ and EVIDENCE/. No non-determinism allowed. Pinned deps, no network calls during replay.", status: "OBSERVED" },
    { n: "02", title: "Completeness", desc: "Every input accounted for in Evidence Register", detail: "Evidence_Register.csv lists every file, hash, origin, custodian, timestamp. No orphan files. No missing inputs. Variance flags explicitly cover gaps.", status: "VERIFIED" },
    { n: "03", title: "Integrity", desc: "Every file matches digest + Merkle commitment anchored on-chain", detail: "SHA-256 of each file → Appendix_A. Merkle root → IPFS CID → AuditAnchor.sol. On-chain anchor is immutable truth. Any tampering breaks digest chain.", status: "ANCHORED" },
  ];

  const custodyFlow = [
    { k: "SOURCES", d: "hashed" },
    { k: "EXTRACTS", d: "hashed" },
    { k: "EVIDENCE", d: "hashed" },
    { k: "DIGESTS", d: "Merkle Root" },
    { k: "IPFS CID", d: "content-address" },
    { k: "AuditAnchor.sol", d: "anchor tx", last: true },
  ];

  const replaySteps = [
    { step: "01", title: "Fetch packet from IPFS via CID", cmd: "ipfs get bafybei...9a0b --output=./packet", detail: "Content-addressed retrieval. CID from AuditAnchor.sol event. Any gateway or local node." },
    { step: "02", title: "Verify SHA256 matches on-chain anchor", cmd: "jq -r .digests_root manifest.json → cast call AuditAnchor.sol::isAnchored(root)", detail: "Query L1. Confirm PacketAnchored event exists with matching digests_root + prev_hash linkage. 12-block finality required." },
    { step: "03", title: "Run replay engine with Replay_Environment_Spec", cmd: "docker build -f REPLAY/Replay_Engine_Packet/Dockerfile . && docker run --read-only packet-replay", detail: "Node 20.11.0, Python 3.11.6, solc 0.8.24. No network. Deterministic. Reads only SOURCES/ + REPLAY/." },
    { step: "04", title: "Regenerate digests and compare to Appendix A", cmd: "python REPLAY/scripts/hash_all.py → diff APPENDICES/Appendix_A_Digests.json", detail: "Regenerated SHA-256 for every file must equal canonical digests. Any delta = tamper or non-determinism." },
    { step: "05", title: "If match, evidence proven authentic", cmd: "✓ VERIFIED — digest chain intact", detail: "CPA can sign reviewer memo. Packet is regulator-ready. Legal truth bound to cryptographic truth." },
  ];

  const verifierChecklist = [
    "IPFS CID resolves",
    "On-chain anchor exists",
    "prev_packet_hash linkage valid",
    "Replay env matches spec",
    "Digests byte-identical",
    "Variance flags reviewed",
    "Custodian attestations sig-valid",
  ];

  const varianceRows = [
    ["VF-001", "SOURCE_MISSING", "HIGH", "Bank statement missing for period", "Custodian Request Letter → Appendix C"],
    ["VF-002", "BALANCE_MISMATCH", "CRITICAL", "On-chain vs extract mismatch > $0.01", "Halt packet, re-run extract, flag in RECON"],
    ["VF-003", "TITLE_UNRESOLVED", "HIGH", "SFH deed not yet county recorded", "Await county recorder receipt → SOURCES/deed_pdfs/"],
    ["VF-004", "ATTESTATION_PENDING", "MEDIUM", "Safe signer attestation not yet signed", "Request EIP-712 sig → ATTESTATIONS/"],
    ["VF-005", "COST_BASIS_AMBIGUOUS", "MEDIUM", "LIFO/FIFO choice impacts > 1% P&L", "Document in reviewer_memo.md + variance flag"],
    ["VF-006", "LINEAGE_BREAK", "CRITICAL", "Wallet lineage gap — untraced funding", "Investigate, add to EXTRACTS/wallet_lineage_graph"],
    ["VF-007", "REPLAY_NONDETERMINISTIC", "CRITICAL", "Replay produced different digest", "Invalidate packet, fix Replay_Environment_Spec"],
    ["VF-008", "DUPLICATE_SOURCE", "LOW", "Duplicate bank export detected", "Dedupe in EXTRACTS/, log in Register"],
  ];

  const severityClass = (sev) => {
    if (sev === "CRITICAL") return "border-[#6b2f2f] text-[#e05c5c] bg-[#211010]";
    if (sev === "HIGH") return "border-[#6b5b2f] text-[#c9a84a] bg-[#211d10]";
    return "border-[#2a2a2a] text-[#8a8a8a] bg-[#141414]";
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#d4d4d4] font-mono antialiased selection:bg-[#2f6b2f] selection:text-white">
      <div className="sticky top-0 z-20 bg-[#080808]/90 backdrop-blur border-b border-[#1e1e1e]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-[48px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-[#e8e8e8] text-black flex items-center justify-center text-[11px] font-bold">P</div>
            <span className="text-[11px] tracking-[0.2em] font-semibold sans uppercase">Provenance Packet Specification</span>
            <span className="hidden md:inline-flex ml-3 text-[10px] border border-[#2a2a2a] px-2 py-0.5 text-[#8a8a8a]">v1.0 · FINAL · 2026-09-07</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#5cb85c] border border-[#2f6b2f] bg-[#102110] px-2 py-0.5">● AUDIT-CHAIN LIVE</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Hero */}
        <div className="border border-[#1e1e1e] bg-[#0e0e0e]">
          <div className="grid md:grid-cols-[1.1fr_0.9fr]">
            <div className="p-6 md:p-10 border-b md:border-b-0 md:border-r border-[#1e1e1e]">
              <div className="inline-flex items-center gap-2 text-[10px] tracking-widest text-[#8a8a8a] uppercase mb-6">
                <span className="w-2 h-2 bg-[#5cb85c]"></span> Institutional Specification · ISO-Style · Deterministic
              </div>
              <h1 className="sans text-[28px] md:text-[42px] leading-[0.95] font-semibold tracking-[-0.02em] text-white">
                Provenance Packet Spec<br />
                <span className="text-[#8a8a8a] font-normal">Audit-Truth Layer</span>
              </h1>
              <p className="mt-6 text-[13px] leading-[1.6] text-[#9a9a9a] max-w-[48ch]">
                Deterministic, Replayable, Cryptographically-Anchored Evidence Bundle
              </p>
              <div className="mt-8 grid grid-cols-3 border border-[#1e1e1e] text-[10px]">
                <div className="p-3 border-r border-[#1e1e1e]">
                  <div className="text-[#5a5a5a] uppercase tracking-widest">Legal Truth</div>
                  <div className="mt-1 text-white font-medium">Fedwire / ACH / POS</div>
                  <div className="mt-1 text-[#6a6a6a]">Statutory finality</div>
                </div>
                <div className="p-3 border-r border-[#1e1e1e]">
                  <div className="text-[#5a5a5a] uppercase tracking-widest">Cryptographic Truth</div>
                  <div className="mt-1 text-white font-medium">Audit Chain + Public Commit</div>
                  <div className="mt-1 text-[#6a6a6a]">Immutable provenance</div>
                </div>
                <div className="p-3 bg-[#111d11]">
                  <div className="text-[#5cb85c] uppercase tracking-widest">Audit Truth</div>
                  <div className="mt-1 text-white font-medium">Provenance Packet</div>
                  <div className="mt-1 text-[#8fbf8f]">Evidentiary binding</div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-[#0a0a0a]">
              <div className="text-[10px] uppercase tracking-widest text-[#6a6a6a] mb-4">Spec Meta</div>
              <div className="space-y-3 text-[11px]">
                {specMeta.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-[#151515] pb-2">
                    <span className="text-[#5a5a5a]">{k}</span>
                    <span className="text-[#d4d4d4] text-right">{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-3 bg-[#141414] border border-[#222] text-[10px] leading-[1.5] text-[#8a8a8a]">
                <span className="text-[#c9a84a]">NOTICE:</span> This packet is the audit-truth layer. It does not create legal settlement. Legal settlement is provided by Fedwire/fiat rails. This packet proves what happened, how it happened, and that every artifact can be deterministically regenerated.
              </div>
            </div>
          </div>
        </div>

        {/* §1 Definition */}
        <section className="mt-10 border border-[#1e1e1e] bg-[#0e0e0e]">
          <div className="grid md:grid-cols-[220px_1fr] divide-y md:divide-y-0 md:divide-x divide-[#1e1e1e]">
            <div className="p-6">
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#6a6a6a]">§ 1 — Definition</div>
              <div className="mt-3 text-[12px] text-[#9a9a9a] leading-[1.6]">What a provenance packet actually is. Not a report. Chain-of-custody system.</div>
            </div>
            <div className="p-6 md:p-8">
              <div className="border-l-2 border-[#2f6b2f] pl-5 py-1 bg-[#0f1a0f]/50">
                <p className="sans text-[15px] leading-[1.6] text-white font-medium">
                  "A provenance packet is a governed, deterministic evidence bundle containing: the inputs{" "}
                  <span className="text-[#5cb85c]">(SOURCES/)</span>, the machine-generated extracts{" "}
                  <span className="text-[#5cb85c]">(EXTRACTS/)</span>, the human-interpretable evidence{" "}
                  <span className="text-[#5cb85c]">(EVIDENCE/)</span>, the replay instructions, the digests, the variance flags, the custodian attestations, and the Merkle commitments to your audit chain."
                </p>
              </div>
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-[11px] font-semibold tracking-widest uppercase text-white mb-3">It proves that:</div>
                  <ul className="space-y-2 text-[12px] text-[#9a9a9a] leading-[1.5]">
                    {[
                      "Every settlement event is backed by real fiat movement.",
                      "Every artifact can be replayed deterministically.",
                      "No evidence has been altered (integrity via digest).",
                      "No settlement record can be forged (Merkle commitment).",
                      "Every reconciliation step is reproducible by a CPA firm.",
                    ].map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-[#5cb85c]">0{i + 1}.</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border border-[#1e1e1e] p-4 bg-[#0a0a0a]">
                  <div className="text-[10px] uppercase tracking-widest text-[#6a6a6a] mb-3">Why not a report?</div>
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="p-2 border border-[#2a2a2a] bg-[#141414] text-[#6a6a6a]">
                      <span className="text-[#8a8a8a] block">Report</span> Human-written, mutable, interpretive
                    </div>
                    <div className="p-2 border border-[#2f6b2f] bg-[#102110] text-[#8fbf8f]">
                      <span className="text-[#5cb85c] block">Packet</span> Governed, deterministic, cryptographically-anchored
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* §2 Structure */}
        <section className="mt-8 border border-[#1e1e1e] bg-[#0e0e0e]">
          <div className="p-6 md:p-8 border-b border-[#1e1e1e] flex flex-wrap items-center justify-between gap-3">
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#6a6a6a]">§ 2 — Structure · File Tree Visualization</div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="px-2 py-0.5 border border-[#2f6b2f] text-[#5cb85c] bg-[#102110]">IMMUTABLE</span>
              <span className="px-2 py-0.5 border border-[#222] text-[#8a8a8a]">Click node → inspect</span>
            </div>
          </div>
          <div className="grid lg:grid-cols-[420px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-[#1e1e1e]">
            <div className="bg-[#090909] max-h-[560px] overflow-auto">
              <div className="p-3 text-[10px] text-[#5a5a5a] uppercase tracking-widest border-b border-[#1a1a1a]">Packet Explorer</div>
              <div className="py-2">
                <TreeView node={packetTree} selectedPath={selectedPath} onSelect={onSelect} path="" />
              </div>
            </div>
            <div className="p-6 bg-[#0a0a0a]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] text-[#6a6a6a] uppercase tracking-widest">Selected</div>
                  <div className="mt-1 text-[13px] text-white font-medium break-all">{selected.name}</div>
                </div>
                {selected.hash && (
                  <button onClick={() => copyHash(selected.hash)} className="shrink-0 text-[10px] border border-[#2a2a2a] px-2 py-1 hover:border-[#3a3a3a] hover:bg-[#141414] transition-colors">
                    {copied === selected.hash ? "COPIED ✓" : "COPY HASH"}
                  </button>
                )}
              </div>
              <div className="mt-4 p-4 border border-[#1e1e1e] bg-[#0e0e0e] text-[12px] leading-[1.6] text-[#9a9a9a]">{selected.desc}</div>
              {selected.hash && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="text-[10px] text-[#5a5a5a]">SHA256:</div>
                  <code className="text-[11px] text-[#c9a84a] bg-[#1a1810] border border-[#2a2415] px-2 py-0.5">{selected.hash}</code>
                  <span className="text-[9px] text-[#5cb85c] border border-[#2f6b2f] bg-[#102110] px-1.5 py-0.5 ml-auto">VERIFIED</span>
                </div>
              )}
              <div className="mt-6 grid grid-cols-3 gap-2 text-[10px]">
                {[["Governed", "All writes logged"], ["Replayable", "Deterministic engine"], ["Anchored", "On-chain commitment"]].map(([k, v]) => (
                  <div key={k} className="border border-[#1a1a1a] p-2 bg-[#0e0e0e]">
                    <div className="text-white font-medium">{k}</div>
                    <div className="text-[#6a6a6a] mt-1">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* §3 Manifest + Anchor */}
        <section className="mt-8 grid lg:grid-cols-[1.15fr_0.85fr] gap-8">
          <div className="border border-[#1e1e1e] bg-[#0e0e0e]">
            <div className="p-6 border-b border-[#1e1e1e] flex items-center justify-between">
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#6a6a6a]">§ 3 — Manifest Schema · manifest.json</div>
              <span className="text-[10px] border border-[#2a2a2a] px-2 py-0.5">canonical record definition</span>
            </div>
            <div className="p-0 overflow-auto max-h-[560px] bg-[#080808]">
              <pre className="p-6 text-[11px] leading-[1.7] text-[#9a9a9a]">{manifestJson}</pre>
            </div>
            <div className="p-4 border-t border-[#1e1e1e] bg-[#0a0a0a] text-[10px] text-[#6a6a6a] leading-[1.6]">
              Manifest is the <span className="text-[#d4d4d4]">only</span> file whose hash is anchored directly on-chain. All other files are committed via{" "}
              <span className="text-[#d4d4d4]">digests_root</span> Merkle tree. prev_packet_hash creates hash-chain across T+0 events.
            </div>
          </div>

          <div className="border border-[#1e1e1e] bg-[#0e0e0e] flex flex-col">
            <div className="p-6 border-b border-[#1e1e1e] text-[10px] tracking-[0.2em] uppercase text-[#6a6a6a]">SHA256 → IPFS CID → AuditAnchor.sol</div>
            <div className="p-6 flex-1">
              <div className="space-y-0">
                {anchorFlow.map((item, i) => (
                  <div key={item.label} className="relative">
                    <div className={`border p-3 ${item.final ? "border-[#2f6b2f] bg-[#102110]" : "border-[#1e1e1e] bg-[#0a0a0a]"} flex items-center justify-between`}>
                      <div>
                        <div className="text-[11px] font-semibold text-white tracking-wide">{item.label}</div>
                        <div className="text-[10px] text-[#6a6a6a] mt-0.5">{item.sub}</div>
                      </div>
                      <code className="text-[10px] px-2 py-0.5 bg-[#141414] border border-[#222] text-[#9a9a9a]">{item.hash}</code>
                    </div>
                    {i < 3 && (
                      <div className="flex justify-center py-1">
                        <div className="w-px h-6 bg-[#222]"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 p-3 border border-[#2f6b2f] bg-[#0f1a0f] text-[11px] leading-[1.5]">
                <div className="text-[#5cb85c] font-medium">EVM Anchor Event</div>
                <code className="block mt-2 text-[10px] text-[#8fbf8f] leading-[1.6]">
                  event PacketAnchored(bytes32 indexed digestsRoot, string ipfsCid, bytes32 indexed prevHash, uint256 timestamp);
                </code>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-2 text-[10px]">
                <div className="border border-[#1e1e1e] p-2">
                  <div className="text-[#6a6a6a]">Gas Cost</div>
                  <div className="text-white mt-1">~42k gas / packet</div>
                </div>
                <div className="border border-[#1e1e1e] p-2">
                  <div className="text-[#6a6a6a]">Finality</div>
                  <div className="text-white mt-1">12 blocks · L1</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* §4 Three Properties */}
        <section className="mt-8 border border-[#1e1e1e] bg-[#0e0e0e]">
          <div className="p-6 md:p-8 border-b border-[#1e1e1e] grid md:grid-cols-[220px_1fr] gap-6">
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#6a6a6a]">§ 4 — The Three Properties of Audit Truth</div>
            <div className="text-[12px] text-[#9a9a9a] leading-[1.6]">Audit truth is defined by three properties. Provenance packets satisfy all three. If any fails, packet is invalid.</div>
          </div>
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#1e1e1e]">
            {properties.map((p) => (
              <div key={p.n} className="p-6 bg-[#0a0a0a]">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] text-[#5a5a5a]">PROP-{p.n}</div>
                  <span className="text-[9px] px-1.5 py-0.5 border border-[#2f6b2f] bg-[#102110] text-[#5cb85c]">{p.status}</span>
                </div>
                <div className="mt-3 sans text-[15px] font-semibold text-white">{p.title}</div>
                <div className="mt-2 text-[12px] text-[#8fbf8f] leading-[1.5]">{p.desc}</div>
                <div className="mt-4 text-[11px] text-[#6a6a6a] leading-[1.6] border-t border-[#1a1a1a] pt-3">{p.detail}</div>
                <div className="mt-4 flex items-center gap-2 text-[11px] text-[#5cb85c]">
                  <span className="w-4 h-4 border border-[#2f6b2f] flex items-center justify-center bg-[#102110]">✓</span> Criterion satisfied
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* §5 Chain-of-Custody */}
        <section className="mt-8 border border-[#1e1e1e] bg-[#0e0e0e]">
          <div className="p-6 border-b border-[#1e1e1e] text-[10px] tracking-[0.2em] uppercase text-[#6a6a6a]">§ 5 — Chain-of-Custody Integrity Flow</div>
          <div className="p-6 md:p-8 overflow-x-auto">
            <div className="min-w-[760px] flex items-center gap-0">
              {custodyFlow.map((item, i) => (
                <div key={item.k} className="flex items-center">
                  <div className={`border px-4 py-3 min-w-[120px] ${item.last ? "bg-[#102110] border-[#2f6b2f]" : "bg-[#0a0a0a] border-[#222]"} text-center`}>
                    <div className="text-[11px] font-semibold text-white tracking-wide">{item.k}</div>
                    <div className="text-[9px] text-[#6a6a6a] uppercase mt-1">{item.d}</div>
                    <div className="mt-2 text-[9px] font-mono text-[#5a5a5a]">SHA256</div>
                  </div>
                  {i < 5 && (
                    <div className="w-8 h-px bg-[#2a2a2a] relative">
                      <div className="absolute right-0 -top-[3px] w-0 h-0 border-l-[6px] border-l-[#2a2a2a] border-y-[4px] border-y-transparent"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 grid md:grid-cols-3 gap-3 text-[10px]">
              <div className="border border-[#1e1e1e] p-3 bg-[#0a0a0a]">
                <span className="text-white">Evidence Register</span>
                <span className="text-[#6a6a6a]"> — maps every file to hash + Merkle proof path</span>
              </div>
              <div className="border border-[#1e1e1e] p-3 bg-[#0a0a0a]">
                <span className="text-white">No human edits in EXTRACTS/</span>
                <span className="text-[#6a6a6a]"> — only deterministic transforms</span>
              </div>
              <div className="border border-[#2f6b2f] p-3 bg-[#102110]">
                <span className="text-[#5cb85c]">Tamper-evident</span>
                <span className="text-[#8fbf8f]"> — any byte change breaks anchor verification</span>
              </div>
            </div>
          </div>
        </section>

        {/* §6 Replay */}
        <section className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="border border-[#1e1e1e] bg-[#0e0e0e]">
            <div className="p-6 border-b border-[#1e1e1e] text-[10px] tracking-[0.2em] uppercase text-[#6a6a6a]">§ 6 — Replay Verification Protocol · For CPA / Regulator</div>
            <div className="p-6 space-y-0">
              {replaySteps.map((s) => (
                <div key={s.step} className="grid md:grid-cols-[56px_1fr] gap-4 py-5 border-b border-[#151515] last:border-0">
                  <div className="text-[11px] text-[#5a5a5a]">STEP {s.step}</div>
                  <div>
                    <div className="sans text-[13px] font-medium text-white">{s.title}</div>
                    <code className="mt-2 block text-[10px] bg-[#080808] border border-[#1a1a1a] px-2 py-1.5 text-[#8a8a8a] overflow-x-auto">{s.cmd}</code>
                    <div className="mt-2 text-[11px] text-[#6a6a6a] leading-[1.5]">{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="border border-[#1e1e1e] bg-[#0e0e0e] p-6">
              <div className="text-[10px] tracking-widest uppercase text-[#6a6a6a] mb-4">Verifier Checklist</div>
              <div className="space-y-2 text-[11px]">
                {verifierChecklist.map((item) => (
                  <div key={item} className="flex items-center gap-2 py-1 border-b border-[#141414]">
                    <div className="w-3 h-3 border border-[#2f6b2f] bg-[#102110] flex items-center justify-center text-[8px] text-[#5cb85c]">✓</div>
                    <span className="text-[#9a9a9a]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-[#6b5b2f]/40 bg-[#1a1810] p-6">
              <div className="text-[10px] uppercase tracking-widest text-[#c9a84a]">Institutional Note</div>
              <p className="mt-3 text-[11px] leading-[1.6] text-[#9a8a6a]">
                Replay does not require trust in operator. Any CPA firm with Docker can reproduce. This is the core of audit-truth: deterministic replay replaces attestation by authority.
              </p>
            </div>
          </div>
        </section>

        {/* §7 Variance */}
        <section className="mt-8 border border-[#1e1e1e] bg-[#0e0e0e] overflow-hidden">
          <div className="p-6 border-b border-[#1e1e1e] flex flex-wrap gap-3 justify-between items-center">
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#6a6a6a]">§ 7 — Variance Flag Taxonomy · Governed</div>
            <div className="flex gap-2 text-[9px]">
              <span className="px-2 py-0.5 border border-[#6b2f2f] text-[#e05c5c] bg-[#211010]">CRITICAL</span>
              <span className="px-2 py-0.5 border border-[#6b5b2f] text-[#c9a84a] bg-[#211d10]">HIGH</span>
              <span className="px-2 py-0.5 border border-[#2a2a2a] text-[#8a8a8a] bg-[#141414]">MEDIUM / LOW</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="bg-[#0a0a0a] border-b border-[#1e1e1e] text-[10px] uppercase tracking-widest text-[#5a5a5a] text-left">
                  <th className="p-3 font-medium">Flag Code</th>
                  <th className="p-3 font-medium">Category</th>
                  <th className="p-3 font-medium">Severity</th>
                  <th className="p-3 font-medium">Description</th>
                  <th className="p-3 font-medium">Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141414]">
                {varianceRows.map((row) => (
                  <tr key={row[0]} className="hover:bg-[#111] transition-colors">
                    <td className="p-3 font-semibold text-[#c9a84a]">{row[0]}</td>
                    <td className="p-3 text-[#8a8a8a]">{row[1]}</td>
                    <td className="p-3">
                      <span className={`px-1.5 py-0.5 border text-[9px] ${severityClass(row[2])}`}>{row[2]}</span>
                    </td>
                    <td className="p-3 text-[#9a9a9a] max-w-[28ch] leading-[1.4]">{row[3]}</td>
                    <td className="p-3 text-[#6a6a6a] max-w-[28ch] leading-[1.4]">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-[#0a0a0a] border-t border-[#1e1e1e] text-[10px] text-[#5a5a5a] flex flex-wrap gap-4">
            <span>Governed by: VARIANCE/Variance_Flag_Taxonomy.csv</span>
            <span className="ml-auto">Open flags tracked in VARIANCE/open_flags_T0_001.json</span>
          </div>
        </section>

        {/* Bottom line */}
        <div className="mt-12 border border-[#1e1e1e] bg-[#0a0a0a] p-6 md:p-8">
          <div className="flex flex-wrap gap-6 text-[10px] uppercase tracking-widest text-[#5a5a5a]">
            <span>Bottom Line</span>
            <span className="text-[#2a2a2a]">—</span>
            <span className="text-[#9a9a9a] normal-case tracking-normal sans text-[12px] leading-[1.6] max-w-[80ch]">
              Provenance packets are the mechanism that turns blockchain evidence into institutional-grade audit truth. They bind fiat settlement, custodial attestations, machine-generated extracts, and blockchain commitments into a single deterministic, replayable, regulator-ready evidence bundle. Tri-layer model:{" "}
              <span className="text-white">Legal Truth</span> (Fedwire) + <span className="text-white">Cryptographic Truth</span> (audit chain) →{" "}
              <span className="text-[#5cb85c]">Audit Truth</span> (packet).
            </span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-[10px]">
            <span className="border border-[#1e1e1e] px-3 py-1.5 text-[#6a6a6a]">SPEC STATUS: FINAL</span>
            <span className="border border-[#2f6b2f] bg-[#102110] text-[#5cb85c] px-3 py-1.5">CHAIN: VERIFIED · 0xA0...19f2</span>
            <span className="border border-[#1e1e1e] px-3 py-1.5 text-[#6a6a6a]">SHA256: packet_root_f1a2...b3c4</span>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] text-[#3a3a3a] tracking-widest uppercase pb-8">
          Provenance Packet Specification v1.0 · Institutional Settlement Architecture · 2026
        </div>
      </div>
    </div>
  );
}
