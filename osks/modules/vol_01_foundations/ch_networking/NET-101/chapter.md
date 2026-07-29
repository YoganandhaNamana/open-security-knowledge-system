---
id: "NET-101"
title: "TCP/IP Protocol Mechanics & Session Handshakes"
volume: "vol_01_foundations"
chapter: "ch_networking"
version: "1.0.0"
stability: "static"
status: "Research"

taxonomy:
  domain: "defensive_security"
  discipline: "network_security"
  technology: "tcp_ip"
  skill_level: "intermediate"

learning_outcomes:
  - "Deconstruct protocol mechanisms at the bit/packet level."
  - "Analyze threat vectors and configure defensive controls."

evidence:
  sources:
    - id: "RFC-793"
      type: "RFC"
      authority: "Primary"

knowledge_graph:
  prerequisites: []
  next_topics: ["NET-102"]
  lab_references: ["LAB-001"]
  glossary_terms: ["tcp", "three_way_handshake"]
  mitre_attack: ["T1046"]
---

# NET-101: TCP/IP Protocol Mechanics & Session Handshakes

## 📌 1. Module Overview & Domain Mechanics
> Scope, threat landscape relevance, and protocol/system operational context.

---

## 🎯 2. Prerequisites & Target Learning Outcomes
### Prerequisites
* None (Foundational Module)

### Learning Objectives
- [ ] Deconstruct protocol mechanisms at the bit/packet level.
- [ ] Analyze threat vectors and configure defensive controls.

---

## 🧠 3. Technical Deep-Dive & Architecture

### 3.1 The Three-Way Handshake

TCP (RFC 793 / RFC 9293) establishes a connection using a three-segment exchange before any application data flows. Each side proposes an Initial Sequence Number (ISN), and the handshake confirms both directions of the byte stream are synchronized:

```
Client (Host A)                              Server (Host B)
      |                                              |
      |   1. SYN  (Seq = x)                          |
      | -------------------------------------------> |  [LISTEN -> SYN-RECEIVED]
      |                                              |
      |   2. SYN-ACK (Seq = y, Ack = x + 1)          |
      | <------------------------------------------- |
      |                                              |
      |   3. ACK  (Seq = x + 1, Ack = y + 1)         |
      | -------------------------------------------> |  [ESTABLISHED]
      v                                              v
```

* **Step 1 (SYN)**: Client transitions to `SYN-SENT`, proposing ISN `x`.
* **Step 2 (SYN-ACK)**: Server transitions `LISTEN -> SYN-RECEIVED`, proposing its own ISN `y` and acknowledging `x + 1`.
* **Step 3 (ACK)**: Client acknowledges `y + 1`; both sides move to `ESTABLISHED`.

### 3.2 Connection State Machine

```
        CLOSED
           |
      (server) passive OPEN
           v
        LISTEN --------------------+
           |                       |
      recv SYN, send SYN-ACK       |
           v                       |
     SYN-RECEIVED                 (client) active OPEN, send SYN
           |                       v
      recv ACK                 SYN-SENT
           v                       |
     +---------------- ESTABLISHED <---- recv SYN-ACK, send ACK
     |
     v  (active close)                     (passive close)
  FIN-WAIT-1 --send FIN-->  ...      <--recv FIN--  CLOSE-WAIT
     |                                                  |
  FIN-WAIT-2                                        LAST-ACK
     |                                                  |
  TIME-WAIT ---------------------------------------> CLOSED
```

Why `TIME-WAIT` matters: it holds the connection's 4-tuple in a wait state (typically 2×MSL) so delayed duplicate segments from the old connection can't be mistaken for a new one. Under very high connection churn (e.g., load balancers, short-lived scanners), this can exhaust ephemeral ports — an operational, not just academic, concern.

### 3.3 Flow Control & Segment Sizing

Every segment advertises a **receive window**, telling the sender how much unacknowledged data the receiver can currently buffer — this is how TCP throttles a fast sender against a slow receiver without dropping packets. The **Maximum Segment Size (MSS)** is negotiated as a TCP option during the handshake, bounding per-segment payload so segments fit within the path's MTU without fragmentation.

### 3.4 Adversarial Misuse: SYN Flooding

An attacker exploits the asymmetry of step 1 vs step 3: sending many spoofed SYNs (Step 1) forces the server into `SYN-RECEIVED` for each, consuming backlog-queue memory — but since the source IPs are spoofed, the final ACK (Step 3) never arrives, and the half-open connections pile up until the queue is full and legitimate clients are refused service. This maps to MITRE ATT&CK **T1499 (Endpoint Denial of Service)**.

**Defensive controls:**
- **SYN Cookies** (RFC 4987) — the server encodes connection state cryptographically into the SYN-ACK sequence number itself, avoiding backlog allocation until the final ACK proves the client is real.
- Reduced SYN-ACK retransmission timeouts and backlog tuning.
- Rate limiting and SYN proxying at the firewall/load-balancer layer.

### 3.5 Sequence Number Security

Early TCP stacks generated ISNs semi-predictably, allowing off-path attackers to guess the sequence number and blindly inject or hijack a session without ever seeing return traffic. RFC 6528 mandates cryptographically randomized ISN generation, which remains the standard mitigation in all modern operating systems.

---

## ⚡ 4. Operational Commands & Tooling
*(See companion document [commands.md](commands.md) for verified syntax)*

---

## 🧪 5. Hands-on Lab Mapping
* **Associated Lab Setup**: [LAB-001](../../../labs/LAB-001.md)

---

## 🛡️ 6. Enterprise Defense & Hardening
* **Offensive Mechanics**: How adversaries abuse or exploit this target.
* **Defensive Controls**: Hardening steps and detection signatures.

---

## 📚 7. Reference & Citation Matrix
* **[Primary Authority]** `RFC-793` (RFC)
