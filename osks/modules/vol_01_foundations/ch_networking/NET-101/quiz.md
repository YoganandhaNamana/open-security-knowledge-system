# NET-101 - Quiz

1. What are the three segments exchanged during TCP connection establishment?
2. Why are Initial Sequence Numbers (ISNs) randomized rather than starting at zero?
3. What server-side state does a spoofed SYN flood exhaust, and why?
4. Name one defensive control against SYN flooding and briefly explain how it works.
5. What is the purpose of the TIME-WAIT state, and what operational problem can excessive TIME-WAIT connections cause?

### Answer Key
1. SYN, SYN-ACK, ACK.
2. To prevent off-path attackers from predicting sequence numbers and blindly injecting/hijacking a session (RFC 6528).
3. The backlog queue of half-open connections in SYN-RECEIVED state; each spoofed SYN consumes an entry that never completes.
4. SYN cookies — the server encodes handshake state cryptographically in the SYN-ACK, avoiding backlog allocation until the ACK proves the client is legitimate.
5. TIME-WAIT prevents delayed duplicate segments from an old connection being mistaken for a new one; under very high connection churn it can exhaust ephemeral ports.
