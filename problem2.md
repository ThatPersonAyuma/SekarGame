# Sub-Problem 2: "The Ghost Query"

## The situation

It is 00:30 on March 15, 2026, and your team is on the night shift. A.I.R.I.S. is behaving again — this time it is pointing fingers in two directions at once. Someone ran a query against the payroll table at 23:52, but the three dashboards disagree about who. The Log Analyst sees an office user, the Database Admin sees a token that belongs to an ex-employee whose account was deactivated weeks ago, and the Server Admin sees data streaming out of the network on a port nobody uses. Your job: find out whose ghost query it was, and how the data got out.

Ground rules are the same as before:

- A.I.R.I.S. only gives real answers when you feed it the parameters from your own dashboard.
- Each role holds one piece of the puzzle. The answer only locks in when the three roles compare what they see.

## Your roles

You play one of three roles. Each role has its own dashboard, running under session `Incident-Beta`, with data only that role can see.

### Role 1 — Log Analyst (Access Pattern Analyst)

**What you see.** Your dashboard shows the system access log for March 15, 2026, with every login, query, and logout during the night window.

| # | Timestamp | Event | User | IP address | Status | Action |
|---|-----------|-------|------|------------|--------|--------|
| 1 | 23:40:12 | EV-0201 | ID-512 | 10.10.2.7 | Success | Login |
| 2 | 23:45:00 | EV-0202 | ID-512 | 10.10.2.7 | Success | Query |
| 3 | 23:52:30 | EV-0203 | ID-512 | 10.10.2.7 | Success | SELECT |
| 4 | 23:58:15 | EV-0204 | ID-512 | 10.10.2.7 | Success | Query |
| 5 | 00:02:40 | EV-0205 | ID-177 | 203.0.113.77 | Failed | Login |
| 6 | 00:05:00 | EV-0206 | ID-512 | 10.10.2.7 | Warning | Logout |

Row 3 triggers an alert: ID-512 runs a SELECT at 23:52:30 — off-hours access to the payroll table. Row 5 is also interesting: ID-177 tried to log in at 00:02:40 and failed, which is expected, because ID-177's account was deactivated on March 2.

**What you can extract:**

- Incident window: 23:40 – 00:05
- Suspicious IP: 10.10.2.7
- Primary user: ID-512

**Your working theory.** ID-512, a senior admin, was the only one active in the office that night, and ID-512 is the one who touched payroll. The failed login from ID-177 just confirms that account is dead. So far, ID-512 looks suspicious.

### Role 2 — Database Admin (Query & Token Analyst)

**What you see.** Your dashboard shows the database audit log (`sys_audit`), including the session token attached to each query.

| # | Timestamp | Query ID | Table | User | Session token |
|---|-----------|----------|-------|------|---------------|
| 1 | 23:41:10 | Q-2001 | orders | 512 | TKN_LEGACY_07 |
| 2 | 23:45:00 | Q-2002 | inventory | 512 | TKN_VAULT_09 |
| 3 | 23:52:30 | Q-2003 | payroll | 512 | TKN_VAULT_09 |
| 4 | 23:58:15 | Q-2004 | orders | 512 | TKN_VAULT_09 |
| 5 | 00:02:40 | Q-2005 | products | 512 | TKN_LEGACY_07 |

Row 3 is flagged: the query against `payroll` ran inside ID-512's session but carried token TKN_VAULT_09.

**What you can extract:**

- Salt value: 09
- Session token: TKN_VAULT_09
- Token owner: ID-177 (Rina Wijaya) — account deactivated March 2
- Session user: ID-512

**Your working theory.** Here is the contradiction: the token belongs to ID-177, an ex-employee whose account is deactivated, yet it is still working inside ID-512's session. Either an insider is using a dead colleague's token, or the ex-employee revived it from somewhere. The key question is who actually ran the payroll query.

### Role 3 — Server Admin (Network & Infrastructure Analyst)

**What you see.** Your dashboard shows network traffic for March 15, 2026: port status on the left, connection log on the right.

Port status:

| Port | Service | Status | Traffic |
|------|---------|--------|---------|
| 22 | SSH | Up | 0.4 MB/s |
| 443 | HTTPS | Up | 8.1 MB/s |
| 8443 | HTTPS-alt | Alert | 612 MB/s |
| 5432 | POSTGRES | Up | 2.3 MB/s |

Connection log:

| Time | Source IP |
|------|-----------|
| 23:40:12 | 10.10.2.7 |
| 23:52:30 | 10.10.2.7 |
| 23:52:30 | 203.0.113.77 |
| 23:58:15 | 10.10.2.7 |
| 00:05:00 | 10.10.2.7 |

The third row is flagged as a duplicate: at the exact same second, 23:52:30, an office connection from 10.10.2.7 and an external connection from 203.0.113.77 were both active. Right then, port 8443 jumped to 612 MB/s of outbound traffic.

**What you can extract:**

- Tunneling protocol: SSH (port 8443)
- Suspicious port: 8443
- Anomaly: an internal office connection and an external IP connected at the same time

**Your working theory.** Port 8443 is the problem — nothing in the office uses it, and 612 MB/s of outbound traffic is a data firehose. Combined with the simultaneous external connection, this looks like an exfiltration tunnel.

## Triangulation — comparing the three roles

| | Log Analyst | Database Admin | Server Admin |
|---|---|---|---|
| User in the logs | ID-512 (success) | ID-512 (session) | ID-512 & ID-177 (failed) |
| Token used | TKN_VAULT_09 | TKN_VAULT_09 | — |
| Access time | 23:52:30 | 23:52:30 | 23:52:30 |
| IP address | 10.10.2.7 | — | 10.10.2.7 & 203.0.113.77 |
| Status | Success | Success | Conflict |
| Contradiction | ID-512 accessed payroll | Token belongs to ID-177 (deactivated) | Two connections at the same time |

All three roles line up on one point: at 23:52:30, token TKN_VAULT_09 was used against `payroll`. Everything else disagrees — and that disagreement is the clue.

## Building the investigation prompts

Walk through these four prompts in order. Each one only works if you give A.I.R.I.S. the parameters from your own dashboard.

**Step 1 — Server Admin starts (initiation)**

> User: "A.I.R.I.S., analyze the outbound traffic on port 8443 around 23:52."
> A.I.R.I.S.: "Two connections at 23:52:30: office IP 10.10.2.7 and external IP 203.0.113.77. Outbound traffic on port 8443 reached 612 MB/s."

Conclusion: possible data exfiltration tunnel.

**Step 2 — Database Admin validates the token**

> User: "A.I.R.I.S., verify who owns TKN_VAULT_09."
> A.I.R.I.S.: "TKN_VAULT_09 is registered to ID-177 (Rina Wijaya). Account deactivated on March 2."

Conclusion: a deactivated ex-employee's token is still being accepted.

**Step 3 — Log Analyst cross-checks the logs**

> User: "A.I.R.I.S., compare the payroll access and the login attempts between 23:52 and 00:05."
> A.I.R.I.S.: "ID-512 accessed payroll from 10.10.2.7 at 23:52:30 (success). ID-177 tried to log in from 203.0.113.77 at 00:02:40 (failed, account deactivated). In other words, the account is dead, but the token is not."

**Step 4 — Combined final verification**

> User: "A.I.R.I.S., run the final verification: whose ghost query was it?"
>
> A.I.R.I.S.:
> Facts:
> 1. Token TKN_VAULT_09 belongs to ID-177 (Rina Wijaya), deactivated on March 2.
> 2. The payroll query at 23:52:30 used that token.
> 3. The Log Analyst recorded the access under ID-512's office session (10.10.2.7).
> 4. The Server Admin saw an external connection from 203.0.113.77 at the same second, tunneling data out on port 8443.
> 5. ID-177's direct login failed at 00:02:40 — the account is dead, but the token was never revoked.
>
> Conclusion: stale-token reuse by a deactivated ex-employee, with data exfiltration. Culprit: ID-177 (Rina Wijaya). Victim: the organization (payroll data). Method: token reuse / data exfiltration.

## Final summary

| Aspect | Detail |
|--------|--------|
| Main culprit | ID-177 (Rina Wijaya) |
| Victim | Organization (payroll data) |
| Token used | TKN_VAULT_09 |
| Attack method | Token reuse / data exfiltration |
| Infected port | 8443 |
| Incident time | 23:52:30 |
| Attacker IP | 203.0.113.77 |
| Victim IP | 10.10.2.7 |

## What to submit

Open the master validation panel and fill in these eight answers:

1. Main culprit: **ID-177 (Rina Wijaya)**
2. Victim: **Organization (payroll data)**
3. Token used: **TKN_VAULT_09**
4. Attack method: **Token reuse / data exfiltration**
5. Infected port: **8443**
6. Incident time: **23:52:30**
7. Attacker IP: **203.0.113.77**
8. Victim IP: **10.10.2.7**

A note for the panel: ID-177 used her never-revoked token to reach the payroll table and tunneled the data out through port 8443.

Passcode: **177 + 8443 + 09 = 8629**

## Scoring

| Activity | Points | Who |
|----------|--------|-----|
| **Local data analysis** | | |
| Log Analyst finds the off-hours window | +50 | Individual |
| DB Admin extracts the salt value (09) | +50 | Individual |
| Server Admin finds port 8443 | +50 | Individual |
| **Contradiction detection** | | |
| Spot the stale-token inconsistency | +100 | Team |
| **Prompt engineering** | | |
| Server Admin outbound analysis prompt | +50 | Individual |
| DB Admin token verification prompt | +50 | Individual |
| Log Analyst cross-check prompt | +50 | Individual |
| Combined final verification prompt | +100 | Team |
| **Final conclusion** | | |
| Identify the culprit (ID-177) | +100 | Team |
| Identify the method (token reuse / exfiltration) | +100 | Team |
| **Maximum total** | **700** | |
