# NET-101 - Commands

## Capture a handshake
```bash
sudo tcpdump -i eth0 -c 50 -w handshake.pcap tcp
```

## Filter handshake segments in Wireshark
```
tcp.flags.syn == 1
```

## Inspect TCP state table (Linux)
```bash
ss -tan state syn-recv
ss -tan state time-wait
```

## Check SYN cookie status (Linux kernel)
```bash
cat /proc/sys/net/ipv4/tcp_syncookies
```
