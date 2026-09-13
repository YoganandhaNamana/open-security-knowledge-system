import { SecurityModule, InteractiveLab, CVEItem, MitreTechnique, KnowledgeArticle, UserStats, ModuleStageData } from '../types';

export const INITIAL_USER_STATS: UserStats = {
  username: 'root_access',
  title: 'Infiltrator Level II',
  level: 12,
  xp: 1240,
  xpToNextLevel: 2000,
  threatScore: 842,
  labsPwned: 24,
  rank: 1204,
  streakDays: 7,
  recentActivity: [
    { id: 'act-1', action: 'Completed Stage 6 (Quiz): Network Reconnaissance', timestamp: '2 hours ago', xpEarned: 150 },
    { id: 'act-2', action: 'Passed Stage 6 Quiz: OWASP Top 10 - SQL Injection', timestamp: '1 day ago', xpEarned: 80 },
    { id: 'act-3', action: 'Captured Flag: Web App Sandbox /flag.txt', timestamp: '2 days ago', xpEarned: 250 },
    { id: 'act-4', action: 'Read Article: Modern Memory Protection (ASLR & DEP)', timestamp: '3 days ago', xpEarned: 30 }
  ],
  skills: [
    { name: 'Network Recon', score: 88 },
    { name: 'Web Security', score: 72 },
    { name: 'Malware Analysis', score: 45 },
    { name: 'Cloud Pentesting', score: 60 },
    { name: 'SOC & Forensics', score: 82 },
    { name: 'Cryptography', score: 68 }
  ]
};

const STAGE_DATA_RECON: ModuleStageData = {
  introduction: {
    overview: 'Network reconnaissance is the essential foundation of cyber security operations. Before launching attacks or hardening defenses, security professionals must map the attack surface, identify listening services, and fingerprint network infrastructure.',
    learningObjectives: [
      'Understand active vs passive network discovery techniques',
      'Master Nmap SYN stealth scans, version fingerprinting, and NSE scripts',
      'Analyze TCP/IP 3-way handshake manipulation during port scans',
      'Correlate open ports with potential vulnerability vectors'
    ],
    prerequisites: ['TCP/IP Fundamentals', 'Basic Command-Line Navigation'],
    certifications: [
      { certName: 'CompTIA Security+ SY0-701', code: 'Domain 2.1', relevance: 'Reconnaissance & Vulnerability Discovery' },
      { certName: 'OffSec OSCP (PEN-200)', code: 'PEN-200 Mod 5', relevance: 'Active Information Gathering' },
      { certName: 'EC-Council CEH v12', code: 'Module 3', relevance: 'Scanning Networks & Footprinting' }
    ],
    difficulty: 'Beginner',
    estimatedTotalTime: '1 hour 30 mins'
  },
  whyItMatters: {
    realWorldImpact: 'Over 82% of external network breaches stem from unmapped, unpatched perimeter assets discovered through routine automated scanning by threat actors.',
    famousBreaches: [
      { title: 'Target HV-AC Perimeter Breach', year: '2013', company: 'Target Corp', summary: 'Attackers used network discovery tools to scan third-party vendor connections.', impact: '$18.5M settlement, 40M payment cards compromised' },
      { title: 'Colonial Pipeline Initial Probe', year: '2021', company: 'Colonial Pipeline', summary: 'Adversaries located exposed legacy VPN endpoint via active port enumeration.', impact: 'Critical infrastructure shutdown across US East Coast' }
    ],
    threatMetrics: [
      { label: 'Exposed Internet Services', value: '3.8 Billion', source: 'Shodan Global Index 2026' },
      { label: 'Avg Time to Scan Discovery', value: '< 12 Mins', source: 'SANS Internet Storm Center' }
    ],
    businessRisk: 'Unmapped endpoints create Shadow IT risks, leaving exposed database ports (3306, 5432, 27017) susceptible to unauthenticated remote access.'
  },
  concept: {
    corePrinciples: [
      { title: 'TCP 3-Way Handshake Mechanics', explanation: 'Normal connection requires SYN -> SYN-ACK -> ACK. A SYN scan sends a RST immediately after receiving SYN-ACK, leaving the session half-open.' },
      { title: 'Active vs Passive Scanning', explanation: 'Passive scanning queries public datasets (Shodan, Censys, DNS records). Active scanning sends probe packets directly to target IPs.' }
    ],
    detailedTheory: 'Network scanning relies on interpreting raw socket responses. When sending a SYN packet to a port: an open port returns [SYN, ACK]; a closed port returns [RST, ACK]; a filtered port drops the packet or returns ICMP Unreachable.',
    keyTerminology: [
      { term: 'SYN Stealth Scan (-sS)', definition: 'Half-open scan mode requiring root privileges that avoids completing full TCP connections.' },
      { term: 'Banner Grabbing', definition: 'Connecting to open sockets to capture initial service greeting strings (e.g., Apache/2.4.50).' }
    ],
    defenseMechanisms: [
      'Ingress Firewall Rules blocking unused external ports',
      'Port scan detection rules in Snort / Suricata IDS',
      'Rate limiting TCP probe connections at edge routers'
    ]
  },
  interactiveDiagram: {
    title: 'TCP SYN Stealth Scan Packet Flow',
    description: 'Interactive sequence showing how Nmap probes Port 80 without completing the TCP handshake.',
    nodes: [
      { id: 'attacker', label: 'Attacker Machine (10.10.0.5)', type: 'attacker', ip: '10.10.0.5' },
      { id: 'gateway', label: 'Border Firewall / IDS', type: 'gateway', ip: '10.10.14.1' },
      { id: 'server', label: 'Target Web Server (10.10.14.88)', type: 'server', ip: '10.10.14.88' }
    ],
    steps: [
      { stepNumber: 1, title: '1. Probe Dispatch (TCP SYN)', sender: 'Attacker (10.10.0.5)', receiver: 'Target Server', action: 'TCP SYN -> Port 80', payload: 'Flags: [SYN], Seq=1000', explanation: 'Attacker initiates scan by sending a TCP SYN packet to target port 80.', highlightNodes: ['attacker', 'gateway'] },
      { stepNumber: 2, title: '2. Listener Response (SYN-ACK)', sender: 'Target Server', receiver: 'Attacker', action: 'TCP SYN-ACK -> Port 80', payload: 'Flags: [SYN, ACK], Seq=5000, Ack=1001', explanation: 'Target server confirms Port 80 is listening and open.', highlightNodes: ['server', 'gateway'] },
      { stepNumber: 3, title: '3. Connection Reset (TCP RST)', sender: 'Attacker', receiver: 'Target Server', action: 'TCP RST -> Port 80', payload: 'Flags: [RST]', explanation: 'Attacker sends RST to terminate before session establishes, avoiding log creation in web apps.', highlightNodes: ['attacker', 'server'] }
    ]
  },
  example: {
    scenario: 'Auditing a corporate target network to discover open ports and exact web server version.',
    commandOrCode: 'nmap -sS -sV -sC -p 80,443,8080 -T4 10.10.14.88',
    language: 'bash',
    stepByStepBreakdown: [
      { lineOrCommand: '-sS', explanation: 'Performs TCP SYN Stealth scan (requires root privilege).' },
      { lineOrCommand: '-sV', explanation: 'Probes open ports to determine service and version details.' },
      { lineOrCommand: '-sC', explanation: 'Runs standard default Nmap Scripting Engine (NSE) security checks.' },
      { lineOrCommand: '-p 80,443,8080', explanation: 'Limits scan to specific high-priority web server ports.' },
      { lineOrCommand: '-T4', explanation: 'Sets timing template to Aggressive for faster network response.' }
    ],
    expectedOutput: `PORT     STATE SERVICE VERSION
80/tcp   open  http    Apache httpd 2.4.50
8080/tcp open  http    Werkzeug httpd 3.0.1`
  },
  quiz: {
    title: 'Network Discovery Verification Quiz',
    description: 'Verify your understanding of Nmap flags, TCP handshake mechanics, and service scanning.',
    passingScore: 75,
    questions: [
      {
        id: 'q1',
        question: 'Why is a TCP SYN scan (-sS) considered stealthier than a standard TCP Connect scan (-sT)?',
        options: [
          'It encrypts scan traffic using AES-256.',
          'It never completes the 3-way TCP handshake, preventing application-layer logs.',
          'It automatically spoofing your source IP address.',
          'It uses UDP packets instead of TCP.'
        ],
        correctIndex: 1,
        explanation: 'Because a SYN scan terminates the connection with a RST packet right after receiving SYN-ACK, no application-level session is established or logged.'
      },
      {
        id: 'q2',
        question: 'What response does a closed TCP port return when probed with a SYN packet?',
        options: ['No response (Timeout)', 'SYN-ACK', 'RST-ACK', 'ICMP Type 8'],
        correctIndex: 2,
        explanation: 'A closed TCP port responds immediately with a RST-ACK packet indicating no socket listener is active.'
      }
    ]
  },
  handsOnLabId: 'lab-net-recon',
  review: {
    summaryTakeaways: [
      'Reconnaissance forms the initial phase of security assessments.',
      'SYN scans detect open ports without completing TCP sessions.',
      'Service version checks identify vulnerable unpatched server software.'
    ],
    cheatSheet: [
      { command: 'nmap -sS <target>', description: 'TCP SYN Stealth Scan', example: 'nmap -sS 10.10.14.88' },
      { command: 'nmap -sV -sC <target>', description: 'Service Version & Default Scripts', example: 'nmap -sV -sC 10.10.14.88' },
      { command: 'nmap -p- <target>', description: 'Scan all 65,535 TCP ports', example: 'nmap -p- 10.10.14.88' }
    ],
    mitreTechniques: [
      { id: 'T1595', name: 'Active Scanning', tactic: 'Reconnaissance' },
      { id: 'T1592', name: 'Gather Victim Host Information', tactic: 'Reconnaissance' }
    ],
    interviewQuestionsPlaceholder: [
      { question: 'What is the difference between an open, closed, and filtered port in Nmap?', answerHint: 'Open returns SYN-ACK, Closed returns RST-ACK, Filtered returns no response due to firewall drop.' }
    ]
  }
};

const STAGE_DATA_WEBAPP: ModuleStageData = {
  introduction: {
    overview: 'Web applications process sensitive user data and form the primary digital storefront for modern organizations. SQL Injection (SQLi) remains one of the most destructive web vulnerabilities, allowing attackers to bypass authentication and dump underlying databases.',
    learningObjectives: [
      'Analyze how unsanitized web user input corrupts database SQL queries',
      'Execute Auth Bypass, Union-Based, and Error-Based SQL Injection attacks',
      'Master automated vulnerability exploitation using sqlmap',
      'Implement robust defense-in-depth using parameterized prepared statements'
    ],
    prerequisites: ['HTTP Protocol Basics', 'Basic SQL Syntax (SELECT, WHERE, UNION)'],
    certifications: [
      { certName: 'OffSec Web Assessor (OSWA)', code: 'OSWA Section 4', relevance: 'SQL Injection & Authentication Bypasses' },
      { certName: 'OffSec OSCP (PEN-200)', code: 'PEN-200 Mod 14', relevance: 'Web Application Attacks' },
      { certName: 'GIAC Web App Penetration Tester (GWAPT)', code: 'GWAPT Domain 3', relevance: 'SQL Injection Exploitation' }
    ],
    difficulty: 'Intermediate',
    estimatedTotalTime: '2 hours 15 mins'
  },
  whyItMatters: {
    realWorldImpact: 'SQL Injection vulnerabilities have led to the exfiltration of billions of credentials, financial records, and medical data items globally.',
    famousBreaches: [
      { title: 'Equifax Data Breach', year: '2017', company: 'Equifax', summary: 'Unpatched web application vulnerability led to total database compromise.', impact: '147 Million customer records stolen, $1.4B remediation' },
      { title: 'Sony Pictures Web Penetration', year: '2011', company: 'Sony', summary: 'Simple UNION-based SQL injection exposed over 1 million user passwords stored in plaintext.', impact: 'Severe brand damage and legal penalties' }
    ],
    threatMetrics: [
      { label: 'Web Attacks Involving Injection', value: '33%', source: 'OWASP Risk Index 2026' },
      { label: 'Avg Records Compromised per SQLi', value: '250,000+', source: 'Verizon DBIR' }
    ],
    businessRisk: 'Complete breach of Confidentiality, Integrity, and Availability of customer PII and database infrastructure.'
  },
  concept: {
    corePrinciples: [
      { title: 'Command-and-Data Mixing', explanation: 'SQLi occurs when user input is concatenated directly into SQL code strings, allowing input characters like single quotes (\') to alter query execution logic.' },
      { title: 'Union-Based Extraction', explanation: 'The UNION operator allows attackers to append their own custom SELECT query results to the application legitimate database query output.' }
    ],
    detailedTheory: 'Consider a web login query: `SELECT * FROM users WHERE user=\'$USER\' AND pass=\'$PASS\'`. If `$USER` is supplied as `admin\' --`, the query becomes `SELECT * FROM users WHERE user=\'admin\' -- AND pass=...`. The `--` comment character discards password verification entirely.',
    keyTerminology: [
      { term: 'In-Band SQLi (UNION-Based)', definition: 'Exploitation technique where attacker extracts data through the same channel used to deliver the payload.' },
      { term: 'Blind SQLi (Boolean/Time)', definition: 'Exploitation technique where application returns no data output, requiring true/false checks or time delays.' }
    ],
    defenseMechanisms: [
      'Parameterized Prepared Statements (Mandatory)',
      'Input Sanitization & Strict Type Validation',
      'Least Privilege Database Account Permissions'
    ]
  },
  interactiveDiagram: {
    title: 'SQL Injection Execution Sequence',
    description: 'Visual flow showing how malicious payload alters database parser logic.',
    nodes: [
      { id: 'attacker', label: 'Attacker Browser', type: 'attacker', ip: '10.10.0.5' },
      { id: 'gateway', label: 'Web Server (Node/Express)', type: 'server', ip: '192.168.1.105' },
      { id: 'database', label: 'PostgreSQL Database', type: 'database', ip: '192.168.1.200' }
    ],
    steps: [
      { stepNumber: 1, title: '1. Payload Transmission', sender: 'Attacker', receiver: 'Web Server', action: 'POST /login', payload: 'username=admin\' --&password=x', explanation: 'Attacker submits single quote and comment characters in login form field.', highlightNodes: ['attacker', 'gateway'] },
      { stepNumber: 2, title: '2. Corrupted Query Execution', sender: 'Web Server', receiver: 'PostgreSQL Database', action: 'SQL Execute', payload: "SELECT * FROM users WHERE user='admin' -- ...", explanation: 'Web server concatenates string directly; database treats comment as syntax, bypassing password validation.', highlightNodes: ['gateway', 'database'] },
      { stepNumber: 3, title: '3. Admin Authentication Granted', sender: 'PostgreSQL Database', receiver: 'Attacker', action: 'HTTP 200 OK', payload: 'Set-Cookie: session=ADMIN_JWT_TOKEN', explanation: 'Database returns admin user record; web server issues administrator session token to attacker.', highlightNodes: ['gateway', 'attacker'] }
    ]
  },
  example: {
    scenario: 'Extracting database table names via UNION SELECT payload in web browser parameter.',
    commandOrCode: "curl -g 'http://192.168.1.105/product?id=-1+UNION+SELECT+1,table_name,3+FROM+information_schema.tables--'",
    language: 'bash',
    stepByStepBreakdown: [
      { lineOrCommand: "id=-1", explanation: "Forces original query product ID to return empty set so UNION results show up." },
      { lineOrCommand: "UNION SELECT 1,2,3", explanation: "Appends secondary query matching the column count of original SELECT." },
      { lineOrCommand: "table_name", explanation: "Replaces second column with metadata query pulling table names." },
      { lineOrCommand: "information_schema.tables", explanation: "Standard database dictionary table storing database structure." }
    ],
    expectedOutput: `HTTP/1.1 200 OK
Content-Type: text/html

<div>Product Name: users</div>
<div>Product Name: credit_cards</div>
<div>Product Name: admin_credentials</div>`
  },
  quiz: {
    title: 'SQL Injection Knowledge Verification',
    description: 'Test your understanding of SQL syntax manipulation, UNION attacks, and remediation.',
    passingScore: 80,
    questions: [
      {
        id: 'qw1',
        question: 'What is the primary root cause of SQL Injection vulnerabilities?',
        options: [
          'Using HTTP instead of HTTPS encryption.',
          'Concatenating unsanitized user input directly into executable SQL query strings.',
          'Running database servers on non-standard ports.',
          'Storing user passwords as MD5 hashes.'
        ],
        correctIndex: 1,
        explanation: 'SQLi occurs when user input is treated as executable SQL command code rather than safe parameter data values.'
      },
      {
        id: 'qw2',
        question: 'Which software development pattern completely prevents SQL Injection?',
        options: [
          'Base64 encoding all input parameters.',
          'Parameterized prepared statements (Prepared Statements / ORM queries).',
          'Web Application Firewall (WAF) regex filters only.',
          'Replacing double quotes with single quotes.'
        ],
        correctIndex: 1,
        explanation: 'Parameterized queries separate SQL code structure from user parameter data at the database driver level.'
      }
    ]
  },
  handsOnLabId: 'lab-sql-inject',
  review: {
    summaryTakeaways: [
      'SQL Injection alters query logic by breaking parameter boundaries.',
      'UNION-based payloads extract sensitive database contents.',
      'Prepared statements guarantee parameter isolation.'
    ],
    cheatSheet: [
      { command: "' OR '1'='1' --", description: "Classic Auth Bypass", example: "username: admin' --" },
      { command: "' UNION SELECT 1,version(),3 --", description: "Database Version Fingerprint", example: "curl http://target/item?id=1' UNION..." },
      { command: "sqlmap -u <url> --dbs", description: "Automated SQLi Enumeration", example: "sqlmap -u http://192.168.1.105/login --dbs" }
    ],
    mitreTechniques: [
      { id: 'T1190', name: 'Exploit Public-Facing Application', tactic: 'Initial Access' },
      { id: 'T1059', name: 'Command and Scripting Interpreter', tactic: 'Execution' }
    ],
    interviewQuestionsPlaceholder: [
      { question: 'Explain the difference between In-Band, Blind, and Out-of-Band SQL Injection.', answerHint: 'In-Band returns results directly in HTTP response; Blind infers data via true/false or time delays; Out-of-Band exfiltrates data via DNS/SMB channels.' }
    ]
  }
};

export const SECURITY_MODULES: SecurityModule[] = [
  {
    id: 'mod-recon',
    title: 'Network Reconnaissance & Discovery',
    category: 'Offensive Security',
    description: 'Master Nmap, Shodan, Masscan, and passive OSINT techniques to map target attack surfaces.',
    longDescription: 'In this foundational module, you will learn how to perform non-intrusive and active reconnaissance across target IP ranges, domain infrastructure, and perimeter network devices. Gain practical skills in port scanning, protocol fingerprinting, and service detection.',
    icon: '📡',
    difficulty: 'Beginner',
    lessonsCount: 12,
    labsCount: 3,
    progressPercent: 100,
    status: 'COMPLETED',
    xpReward: 350,
    mitreMapping: ['T1595 - Active Scanning', 'T1592 - Gather Victim Host Information'],
    lessons: [
      { id: 'les-1', title: 'Fundamentals of Network Protocols & TCP Handshakes', duration: '15 mins', type: 'reading', completed: true },
      { id: 'les-2', title: 'Passive OSINT with Shodan, Censys & SecurityTrails', duration: '20 mins', type: 'reading', completed: true },
      { id: 'les-3', title: 'Active Port Scanning with Nmap Timing & Scripts', duration: '25 mins', type: 'lab', completed: true },
      { id: 'les-4', title: 'Service Fingerprinting & Banner Grabbing', duration: '20 mins', type: 'lab', completed: true },
      { id: 'les-5', title: 'Knowledge Verification: Network Discovery Quiz', duration: '10 mins', type: 'quiz', completed: true }
    ],
    stageData: STAGE_DATA_RECON,
    completedStages: ['introduction', 'why-it-matters', 'concept', 'interactive-diagram', 'example', 'quiz', 'hands-on-lab', 'review']
  },
  {
    id: 'mod-webapp',
    title: 'Web Application Pentesting & OWASP Top 10',
    category: 'Web Exploitation',
    description: 'Exploit SQL Injection, Cross-Site Scripting (XSS), CSRF, and IDOR vulnerabilities in realistic sandboxes.',
    longDescription: 'Deep dive into modern HTTP traffic inspection using Burp Suite and OWASP ZAP. Learn how web applications parse parameter inputs, process session cookies, execute server-side database queries, and where sanitization fails.',
    icon: '🌐',
    difficulty: 'Intermediate',
    lessonsCount: 16,
    labsCount: 5,
    progressPercent: 45,
    status: 'IN_PROGRESS',
    xpReward: 500,
    prerequisite: 'Network Reconnaissance & Discovery',
    mitreMapping: ['T1190 - Exploit Public-Facing Application', 'T1059.006 - Python/Web Shell Execution'],
    lessons: [
      { id: 'les-w1', title: 'HTTP Request Analysis & Cookie Mechanics', duration: '15 mins', type: 'reading', completed: true },
      { id: 'les-w2', title: 'SQL Injection: Union-Based & Error-Based Payloads', duration: '30 mins', type: 'lab', completed: true },
      { id: 'les-w3', title: 'Reflected and Stored XSS Attacks', duration: '25 mins', type: 'lab', completed: false },
      { id: 'les-w4', title: 'Broken Access Controls & IDOR Exploitation', duration: '20 mins', type: 'lab', completed: false },
      { id: 'les-w5', title: 'Server-Side Request Forgery (SSRF) to Cloud Metadata', duration: '30 mins', type: 'lab', completed: false }
    ],
    stageData: STAGE_DATA_WEBAPP,
    completedStages: ['introduction', 'why-it-matters', 'concept']
  },
  {
    id: 'mod-malware',
    title: 'Reverse Engineering & Malware Analysis',
    category: 'Reverse Engineering',
    description: 'Decompile x86/x64 binaries, inspect PE headers with Ghidra, and analyze obfuscated dynamic behavior.',
    longDescription: 'Learn static and dynamic reverse engineering methodology using Ghidra, x64dbg, and Cuckoo Sandbox. Understand shellcode construction, API hashing, anti-debugging tricks, and ransomware encryption key extractions.',
    icon: '🔐',
    difficulty: 'Advanced',
    lessonsCount: 18,
    labsCount: 4,
    progressPercent: 0,
    status: 'LOCKED',
    xpReward: 750,
    prerequisite: 'Windows Internals & C Assembly',
    mitreMapping: ['T1027 - Obfuscated Files or Information', 'T1140 - Deobfuscate/Decode Files or Information'],
    lessons: [
      { id: 'les-m1', title: 'x86_64 Architecture, Registers and Stack Frames', duration: '30 mins', type: 'reading', completed: false },
      { id: 'les-m2', title: 'PE Header Anatomy & DLL Import Analysis', duration: '25 mins', type: 'reading', completed: false },
      { id: 'les-m3', title: 'Ghidra Decompiler Basics & Control Flow Graphs', duration: '40 mins', type: 'lab', completed: false },
      { id: 'les-m4', title: 'Dynamic Debugging with x64dbg Breakpoints', duration: '35 mins', type: 'lab', completed: false }
    ],
    completedStages: []
  },
  {
    id: 'mod-cloud',
    title: 'Cloud Security & AWS IAM Exploitation',
    category: 'Cloud & DevSecOps',
    description: 'Audit AWS S3 buckets, abuse misconfigured IAM policies, and simulate cloud lateral movement.',
    longDescription: 'Explore cloud infrastructure threat models in AWS and Azure. Learn how attackers compromise cloud credentials via instance metadata endpoints (IMDSv1), leverage over-permissioned IAM roles, and maintain persistence.',
    icon: '☁️',
    difficulty: 'Intermediate',
    lessonsCount: 14,
    labsCount: 4,
    progressPercent: 15,
    status: 'IN_PROGRESS',
    xpReward: 550,
    mitreMapping: ['T1528 - Steal Application Access Token', 'T1078.004 - Cloud Accounts'],
    lessons: [
      { id: 'les-c1', title: 'AWS Cloud Architecture & IAM Policy Mechanics', duration: '20 mins', type: 'reading', completed: true },
      { id: 'les-c2', title: 'Exposing S3 Buckets & Bucket Takeovers', duration: '20 mins', type: 'lab', completed: false },
      { id: 'les-c3', title: 'Metadata Endpoint Abuses (IMDSv1 vs IMDSv2)', duration: '25 mins', type: 'lab', completed: false }
    ],
    completedStages: ['introduction']
  },
  {
    id: 'mod-soc',
    title: 'SOC Analyst & Incident Response',
    category: 'Defensive & SOC',
    description: 'Analyze PCAP files in Wireshark, query Splunk SIEM logs, and track threat actors with Sigma rules.',
    longDescription: 'Step into the shoes of a Tier 1/2 Security Operations Center (SOC) analyst. Investigate intrusion alerts, rebuild compromise timelines using Windows Event Logs (Sysmon), and construct YARA detection rules.',
    icon: '🛡️',
    difficulty: 'Beginner',
    lessonsCount: 15,
    labsCount: 4,
    progressPercent: 70,
    status: 'IN_PROGRESS',
    xpReward: 450,
    mitreMapping: ['T1053 - Scheduled Task/Job', 'T1036 - Masquerading'],
    lessons: [
      { id: 'les-s1', title: 'SIEM Core Concepts & Splunk Search Language (SPL)', duration: '25 mins', type: 'reading', completed: true },
      { id: 'les-s2', title: 'Wireshark Packet Capture Analysis & Stream Following', duration: '30 mins', type: 'lab', completed: true },
      { id: 'les-s3', title: 'Sysmon Event Logs & Malware Execution Traces', duration: '35 mins', type: 'lab', completed: true },
      { id: 'les-s4', title: 'Writing Custom YARA Rules for File Detection', duration: '20 mins', type: 'lab', completed: false }
    ],
    completedStages: ['introduction', 'why-it-matters', 'concept', 'interactive-diagram']
  }
];

export const INTERACTIVE_LABS: InteractiveLab[] = [
  {
    id: 'lab-net-recon',
    title: 'Target Reconnaissance: CyberCorp Perimeter',
    targetIp: '10.10.14.88',
    scenario: 'You have been tasked with auditing the outer perimeter of CyberCorp Inc. Find open TCP ports, detect running service versions, locate an accessible web endpoint, and retrieve the system access flag.',
    difficulty: 'Beginner',
    estimatedTime: '20 mins',
    category: 'Network Recon',
    status: 'available',
    flag: 'OSKS{nmap_stealth_syn_scan_complete_2026}',
    hints: [
      'Try running `nmap -sV -sC 10.10.14.88` to perform service detection.',
      'Check if port 8080 or port 80 is running an HTTP server.',
      'Inspect the web root using `curl http://10.10.14.88:8080/flag.txt` or `gobuster`.'
    ],
    tasks: [
      { id: 't1', description: 'Run a SYN port scan against target host 10.10.14.88', commandHint: 'nmap -sS -p 1-1000 10.10.14.88', completed: false },
      { id: 't2', description: 'Discover hidden HTTP service running on non-standard port 8080', commandHint: 'nmap -sV 10.10.14.88 -p 8080', completed: false },
      { id: 't3', description: 'Fetch the flag endpoint using curl or terminal browser', commandHint: 'curl http://10.10.14.88:8080/flag.txt', completed: false }
    ],
    initialTerminalLogs: [
      'OSKS Virtual Terminal Sandbox v3.4 [Connected]',
      'Target Environment: CyberCorp DMZ Subnet (10.10.14.88)',
      'Type "help" for a list of available cybersecurity tools or start typing commands below.',
      '----------------------------------------------------------------------------------'
    ]
  },
  {
    id: 'lab-sql-inject',
    title: 'SQL Injection: Bypassing Auth & Dumping Tables',
    targetIp: '192.168.1.105',
    scenario: 'An internal web portal at http://192.168.1.105/login is susceptible to SQL injection. Extract administrator credentials and read `/flag.txt` from the underlying server.',
    difficulty: 'Intermediate',
    estimatedTime: '35 mins',
    category: 'Web Exploitation',
    status: 'in_progress',
    flag: 'OSKS{union_select_admin_pwned_8921}',
    hints: [
      "Test user input with a single quote `'` or `' OR '1'='1`.",
      "Use `sqlmap -u http://192.168.1.105/login --data='username=admin&password=1' --dbs` to automate DB enumeration."
    ],
    tasks: [
      { id: 't1', description: 'Test SQL injection parameter vulnerability', commandHint: "curl -d 'user=admin%27+OR+1%3D1--' http://192.168.1.105/login", completed: false },
      { id: 't2', description: 'Automate database dump with sqlmap', commandHint: 'sqlmap -u http://192.168.1.105/api -p user --dump', completed: false }
    ],
    initialTerminalLogs: [
      'OSKS Web Pentest Terminal Sandbox v3.4',
      'Target IP: 192.168.1.105 (Vulnerable Web Portal)',
      'Type "sqlmap --help" or test manually with curl.',
      '----------------------------------------------------------------------------------'
    ]
  }
];

export const LIVE_CVES: CVEItem[] = [
  {
    id: 'cve-1',
    cveId: 'CVE-2026-21849',
    title: 'Linux Kernel Remote Privilege Escalation in eBPF Subsystem',
    severity: 'CRITICAL',
    cvssScore: 9.8,
    summary: 'An integer overflow in the eBPF verifier allows unprivileged local users to perform out-of-bounds kernel memory writes and achieve full root privileges.',
    affectedSystem: 'Linux Kernels 6.1 through 6.12',
    mitigation: 'Set sysctl kernel.unprivileged_bpf_disabled=1 or upgrade to kernel 6.12.4+.',
    publishedDate: '2026-08-01'
  },
  {
    id: 'cve-2',
    cveId: 'CVE-2026-19302',
    title: 'OpenSSL TLS 1.3 Handshake Memory Corruption',
    severity: 'HIGH',
    cvssScore: 8.5,
    summary: 'A flaw in session resumption ticket parsing leads to heap corruption during rapid TLS handshake processing under high load conditions.',
    affectedSystem: 'OpenSSL 3.3.0 - 3.3.2',
    mitigation: 'Update OpenSSL package to version 3.3.3 or apply vendor patch.',
    publishedDate: '2026-07-28'
  },
  {
    id: 'cve-3',
    cveId: 'CVE-2026-04421',
    title: 'Apache HTTP Server Path Traversal & Arbitrary File Read',
    severity: 'HIGH',
    cvssScore: 8.1,
    summary: 'Unnormalized URI paths in reverse proxy configurations enable attackers to bypass authentication filters and read system files.',
    affectedSystem: 'Apache HTTP Server 2.4.50 - 2.4.61',
    mitigation: 'Configure AllowOverride None and restrict proxy path mappings.',
    publishedDate: '2026-07-15'
  }
];

export const MITRE_TECHNIQUES: MitreTechnique[] = [
  {
    id: 'T1595',
    tactics: 'Reconnaissance',
    name: 'Active Scanning',
    description: 'Adversaries scan target infrastructure (IP blocks, vulnerability scanners, port scanners) to gather information for targeting.',
    detection: 'Monitor network traffic for sudden spikes in port probe attempts across sequential port numbers or subnet IP sweeps.',
    mitigation: 'Implement network firewalls, rate limiting, and intruding detection/prevention systems (IDS/IPS).'
  },
  {
    id: 'T1190',
    tactics: 'Initial Access',
    name: 'Exploit Public-Facing Application',
    description: 'Adversaries take advantage of weakness in software, websites, or web services exposed to internet access to gain initial access.',
    detection: 'Analyze web server access logs for anomalous payload syntax (e.g. SQL statements, path traversals, command injection characters).',
    mitigation: 'Apply Web Application Firewalls (WAF), perform regular vulnerability scans, and maintain strict patch management.'
  },
  {
    id: 'T1059.006',
    tactics: 'Execution',
    name: 'Command and Scripting Interpreter: Python',
    description: 'Adversaries abuse Python scripts to execute commands, download secondary payloads, or establish reverse sockets.',
    detection: 'Monitor process creation events for python/python3 binaries executing encoded scripts or network sockets.',
    mitigation: 'Restrict execution permissions on script interpreters and mandate signed binaries via AppLocker/WDAC.'
  },
  {
    id: 'T1055',
    tactics: 'Defense Evasion, Privilege Escalation',
    name: 'Process Injection',
    description: 'Adversaries inject malicious code into processes (DLL Injection, Process Hollowing) to evade process-based defenses.',
    detection: 'Monitor API calls like VirtualAllocEx, WriteProcessMemory, and CreateRemoteThread across process boundaries.',
    mitigation: 'Utilize endpoint detection and response (EDR) solutions with memory scanning capability.'
  }
];

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'kb-1',
    title: 'OWASP Top 10 (2026 Edition) Breakdown & Mitigation Guide',
    category: 'Web Security',
    tags: ['OWASP', 'Web Pentest', 'SQLi', 'XSS', 'SSRF'],
    readTime: '8 min read',
    summary: 'An operational field guide detailing the top 10 web application security risks, real-world attack payloads, and defense-in-depth remediation.',
    content: `## Introduction to OWASP Top 10

The Open Web Application Security Project (OWASP) Top 10 represents the broad consensus on the most critical security risks facing web applications today.

### Key Risk Categories:
1. **A01: Broken Access Control**: Unauthorized access to administrative endpoints or other users' resources via parameter tampering.
2. **A02: Cryptographic Failures**: Weak algorithms (e.g. MD5/SHA1 for passwords), exposed TLS private keys, or plain-text transmission.
3. **A03: Injection (SQLi, Command Injection, LDAP)**: Untrusted input directly concatenated into executable interpreters.
4. **A04: Insecure Design**: Flaws in software architectural logic that cannot be fixed by simple code patches.
5. **A05: Security Misconfiguration**: Default credentials, unneeded ports enabled, missing security headers (CSP, HSTS).

### Defensive Code Example (Parameterized Queries):
Always use parameterized prepared statements rather than string concatenation when querying SQL databases.`,
    codeSnippet: `// ❌ VULNERABLE (SQL Injection Risk)
const query = "SELECT * FROM users WHERE username = '" + req.body.username + "'";

// ✅ SECURE (Parameterized Query)
const query = "SELECT * FROM users WHERE username = $1";
await db.query(query, [req.body.username]);`
  },
  {
    id: 'kb-2',
    title: 'Nmap Cheat Sheet & Advanced Scripting Engine (NSE) Mastery',
    category: 'Network Security',
    tags: ['Nmap', 'Recon', 'Networking', 'Port Scanning'],
    readTime: '6 min read',
    summary: 'Quick reference guide for stealth SYN scans, UDP discovery, service fingerprinting, and writing custom NSE Lua scripts.',
    content: `## Nmap Command Reference Guide

Nmap (Network Mapper) is an open-source utility for network discovery and security auditing.

### Essential Flags:
* \`-sS\`: TCP SYN Stealth Scan (default for root users)
* \`-sV\`: Probe open ports to determine service/version info
* \`-sC\`: Run default set of Nmap Scripting Engine (NSE) scripts
* \`-p-\`: Scan all 65,535 TCP ports
* \`-T4\`: Aggressive timing template for fast network links

### Running NSE Scripts for Vulnerability Scanning:
\`\`\`bash
# Scan for known vulnerabilities using vulners script
nmap -sV --script vulners 10.10.14.88

# Check for HTTP SMB shares
nmap -p 445 --script smb-enum-shares 10.10.14.88
\`\`\``,
    codeSnippet: `# Stealth SYN scan with version detection & output saving
nmap -sS -sV -sC -oA target_recon_results 10.10.14.88`
  },
  {
    id: 'kb-3',
    title: 'Wireshark Packet Analysis & PCAP Forensics Checklist',
    category: 'SOC & Forensics',
    tags: ['Wireshark', 'PCAP', 'SOC', 'Incident Response'],
    readTime: '10 min read',
    summary: 'How to dissect PCAP network traffic, isolate malicious HTTP streams, filter TCP handshakes, and reconstruct exfiltrated data.',
    content: `## Wireshark Filter Cheat Sheet

When responding to a network breach alert, Wireshark display filters allow analysts to cut through gigabytes of background traffic noise.

### Useful Wireshark Display Filters:
* \`http.request.method == "POST"\`: Locate HTTP data transmissions
* \`ip.src == 10.10.14.88 && tcp.flags.syn == 1\`: Find connection attempts originating from target IP
* \`dns.flags.response == 0\`: Inspect outbound DNS queries for domain generation algorithm (DGA) signatures
* \`frame contains "password"\`: Search raw packet bytes for sensitive text strings`,
    codeSnippet: `// Wireshark Filter for HTTP traffic with suspicious response codes
http.response.code >= 400 || http.request.uri contains "admin"`
  }
];
