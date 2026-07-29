# NET-101 - Cheatsheet

| Step | Segment | Client State | Server State |
|------|---------|---------------|---------------|
| 1 | SYN (seq=x) | SYN-SENT | SYN-RECEIVED |
| 2 | SYN-ACK (seq=y, ack=x+1) | SYN-SENT | SYN-RECEIVED |
| 3 | ACK (ack=y+1) | ESTABLISHED | ESTABLISHED |

**Attack:** SYN flood -> exhausts SYN-RECEIVED backlog.
**Defense:** SYN cookies, backlog tuning, rate limiting.
**Key RFCs:** 793/9293 (TCP), 6528 (ISN randomization), 4987 (SYN flood mitigation).
