# Technical Research Dossier: NET-101 (TCP/IP Protocol Mechanics & Session Handshakes)

## 1. Verified Primary Source Facts
* **Primary Authority**: RFC 793 (Transmission Control Protocol), updated by RFC 9293 (2022).
* **Secondary Authority**: NIST SP 800-53 Rev. 5, control SC-8 (Transmission Confidentiality and Integrity).
* **Extraction Date**: 2026-07-29.
* TCP is a connection-oriented, byte-stream transport protocol operating at Layer 4 of the OSI model.
* Connection establishment requires a three-segment exchange commonly called the "three-way handshake": SYN, SYN-ACK, ACK.
* Connection termination normally uses a four-segment exchange (FIN, ACK, FIN, ACK), distinct from the abrupt RST teardown.

## 2. Low-Level Protocol / System Mechanics
* **Handshake Flags**: SYN -> SYN+ACK -> ACK. Each side announces an Initial Sequence Number (ISN); the peer acknowledges with ISN+1.
* **Sequence Numbers**: ISNs are generated using a pseudorandom algorithm (RFC 6528) specifically to resist TCP sequence-prediction/session-hijacking attacks.
* **State Machine Transitions** (server side): CLOSED -> LISTEN -> SYN-RECEIVED -> ESTABLISHED. Client side: CLOSED -> SYN-SENT -> ESTABLISHED.
* **Window Size & Flow Control**: Each segment advertises a receive window controlling how much unacknowledged data the sender may transmit, preventing receiver buffer overrun.
* **MSS (Maximum Segment Size)**: Negotiated during the handshake via TCP options, bounding payload size per segment to avoid fragmentation.
* **Termination State Machine**: ESTABLISHED -> FIN-WAIT-1 -> FIN-WAIT-2 -> TIME-WAIT on the active closer; ESTABLISHED -> CLOSE-WAIT -> LAST-ACK -> CLOSED on the passive closer.

## 3. Threat Vector & Misuse Cases
* **SYN Flood Attack (MITRE ATT&CK T1499 - Endpoint Denial of Service)**: An attacker sends a high volume of spoofed SYN segments, causing the server to allocate half-open connection state (SYN-RECEIVED) for each, exhausting the backlog queue and denying legitimate connections.
* **Mitigations**: TCP SYN Cookies (stateless handshake verification, RFC 4987), reduced SYN-ACK retransmission timeouts, connection rate limiting, and firewall-level SYN proxying.
* **Sequence Prediction / Session Hijacking**: Historically, predictable ISN generation allowed attackers to blindly inject spoofed segments into an established session; modern OSes mitigate this via cryptographically randomized ISNs (RFC 6528).
* **TIME-WAIT Exploitation**: Excessive short-lived connections can exhaust ephemeral port ranges or socket tables, a resource-exhaustion vector relevant to load balancers and high-throughput services.

## 4. Citation Mappings
* RFC 793 / RFC 9293, Section 3.4 - Sequence numbers and connection state control.
* RFC 6528 - Defending against sequence number attacks (ISN randomization).
* RFC 4987 - TCP SYN flooding attacks and common mitigations.
* NIST SP 800-53 Rev. 5, SC-8 - Transmission confidentiality and integrity controls.
