# NET-101 - Interview Questions

**Q: Walk me through the TCP three-way handshake.**
A: Client sends SYN with ISN x; server responds SYN-ACK with its own ISN y and ack x+1; client responds ACK with ack y+1. Both sides then move to ESTABLISHED.

**Q: How does a SYN flood attack work, and how would you mitigate it?**
A: Attacker sends many spoofed SYNs, forcing the server to hold half-open connections in SYN-RECEIVED until backlog is exhausted. Mitigate with SYN cookies, backlog tuning, and rate limiting/SYN proxying.

**Q: What's the difference between a graceful TCP close and a reset?**
A: A graceful close uses the FIN/ACK four-way exchange (ESTABLISHED -> FIN-WAIT -> TIME-WAIT / CLOSE-WAIT -> LAST-ACK -> CLOSED). An RST aborts the connection immediately without the orderly teardown, discarding any unacknowledged data.

**Q: Why might you see many connections stuck in TIME-WAIT on a busy server?**
A: High connection churn (short-lived connections closing rapidly) can leave many sockets in TIME-WAIT for 2xMSL, potentially exhausting ephemeral ports — common on load balancers and proxies.
