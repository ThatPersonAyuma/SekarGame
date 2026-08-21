# Sub-Problem 1: "The Discrepancy Trap"

## The situation

A.I.R.I.S. is supposed to be your security AI, but right now it is feeding your team conflicting information. The Log Analyst and the Database Admin disagree about who accessed a sensitive table, and the Server Admin sees two connections at the same time, which makes the picture even messier. Your job is to work out who actually did it, and how.

Two ground rules before you start:

- A.I.R.I.S. hallucinates when you ask vague questions. It only gives you real data when you include the parameters from your own dashboard.
- Each role sees only part of the story. The answer only becomes clear when all three roles compare notes.

## Your roles

You play one of three roles. Each role has its own dashboard, running under session `Incident-Alpha`, and each dashboard shows data that only that role can see.

### Role 1 — Log Analyst (Access Pattern Analyst)

**What you see.** Your dashboard shows the system access log for March 12, 2026, with every login, query, and logout that happened that day.

| # | Timestamp | Event | User | IP address | Status | Action |
|---|-----------|-------|------|------------|--------|--------|
| 1 | 02:12:33 | EV-0098 | ID-034 | 10.0.4.12 | Success | Login |
| 2 | 02:13:45 | EV-0099 | ID-034 | 10.0.4.12 | Success | Query |
| 3 | 02:14:00 | EV-0100 | ID-409 | 10.0.4.15 | Success | Login |
| 4 | 02:15:30 | EV-0101 | ID-409 | 10.0.4.15 | Success | SELECT |
| 5 | 02:16:45 | EV-0102 | ID-409 | 10.0.4.15 | Success | Query |
| 6 | 02:17:00 | EV-0103 | ID-204 | 192.168.1.88 | Success | Login |
| 7 | 02:17:30 | EV-0104 | ID-204 | 192.168.1.88 | Failed | Access |
| 8 | 02:18:00 | EV-0105 | ID-409 | 10.0.4.15 | Warning | Logout |

Rows 3 and 4 trigger alerts: ID-409 logs in and runs a SELECT at 02:15:30 from IP 10.0.4.15.

**What you can extract:**

- Incident window: 02:14:00 – 02:18:00
- Suspicious IP: 10.0.4.15
- Primary user: ID-409

**Your working theory.** The user who got in was ID-409 (success). The user who failed was ID-204, who could not access the sensitive table at 02:17:30. So far, ID-409 looks like the culprit.

### Role 2 — Database Admin (Query & Token Analyst)

**What you see.** Your dashboard shows the database audit log (`sys_audit`), including the session token attached to each query.

| # | Timestamp | Query ID | Table | User | Session token |
|---|-----------|----------|-------|------|---------------|
| 1 | 02:13:00 | Q-1001 | products | 034 | TKN_LEGACY_01 |
| 2 | 02:14:00 | Q-1002 | user_profiles | 409 | TKN_SALT04 |
| 3 | 02:15:30 | Q-1003 | users_sensitive | 204 | TKN_SALT04 |
| 4 | 02:16:00 | Q-1004 | transactions | 409 | TKN_SALT04 |
| 5 | 02:17:00 | Q-1005 | products | 204 | TKN_LEGACY_02 |

Row 3 is flagged: the query against `users_sensitive` is logged under user 204 but carries token TKN_SALT04.

**What you can extract:**

- Salt value: 04
- Session token: TKN_SALT04
- Token owner: ID-204 (Budi Santoso)
- Token user: ID-409 (from the access logs)

**Your working theory.** Here is the contradiction: the token belongs to ID-204, but ID-409 is the one using it. The key question is who actually performed the illegal access.

### Role 3 — Server Admin (Network & Infrastructure Analyst)

**What you see.** Your dashboard shows network traffic for March 12, 2026: port status on the left, connection log on the right.

Port status:

| Port | Service | Status | Traffic |
|------|---------|--------|---------|
| 22 | SSH | Up | 1.2 MB/s |
| 443 | HTTPS | Up | 3.4 MB/s |
| 8080 | HTTP | Up | 0.8 MB/s |
| 5432 | POSTGRES | Alert | 847 MB/s |

Connection log:

| Time | Source IP |
|------|-----------|
| 02:15:30 | 10.0.4.15 |
| 02:15:30 | 192.168.1.88 |
| 02:16:00 | 10.0.4.15 |
| 02:17:00 | 192.168.1.88 |
| 02:18:00 | 10.0.4.15 |

The second row is flagged as a duplicate: two different IPs connected at the exact same second, 02:15:30.

**What you can extract:**

- Encryption protocol: SHA-256
- Suspicious port: 5432
- Anomaly: two different IPs connected at the same time

**Your working theory.** Port 5432 is the problem, and the real anomaly is that two users used the same token at the same time. That points to session hijacking.

## Triangulation — comparing the three roles

| | Log Analyst | Database Admin | Server Admin |
|---|---|---|---|
| User in the logs | ID-409 (success) | ID-204 (?) | ID-409 & ID-204 |
| Token used | TKN_SALT04 | TKN_SALT04 | TKN_SALT04 |
| Access time | 02:15:30 | 02:15:30 | 02:15:30 |
| IP address | 10.0.4.15 | — | 10.0.4.15 & 192.168.1.88 |
| Status | Success | Success | Conflict |
| Contradiction | ID-409 accessed the sensitive table | Token belongs to ID-204 | Two users used the same token |

All three roles agree on one point: at 02:15:30, token TKN_SALT04 was used against `users_sensitive`. Everything else disagrees — and that disagreement is the clue.

## Building the investigation prompts

Walk through these four prompts in order. Each one only works if you give A.I.R.I.S. the parameters from your own dashboard.

**Step 1 — Server Admin starts (initiation)**

> User: "A.I.R.I.S., analyze the connections on port 5432 between 02:14 and 02:18."
> A.I.R.I.S.: "Anomaly found: ID-409 and ID-204 are using the same token (TKN_SALT04)."

Conclusion: possible session hijacking.

**Step 2 — Database Admin validates the token**

> User: "A.I.R.I.S., verify who owns TKN_SALT04."
> A.I.R.I.S.: "TKN_SALT04 is registered to ID-204 (Budi Santoso)."

Conclusion: the token belongs to ID-204, but ID-409 is the one using it.

**Step 3 — Log Analyst cross-checks the logs**

> User: "A.I.R.I.S., compare the access logs for ID-204 and ID-409 at 02:15:30."
> A.I.R.I.S.: "ID-204: logged in from 192.168.1.88, failed to access the sensitive table. ID-409: logged in from 10.0.4.15, succeeded. In other words, ID-409 used ID-204's stolen token."

**Step 4 — Combined final verification**

> User: "A.I.R.I.S., run the final verification: who is the real culprit?"
>
> A.I.R.I.S.:
> Facts:
> 1. Token TKN_SALT04 belongs to ID-204.
> 2. ID-409 used that token from IP 10.0.4.15.
> 3. ID-204 logged in from IP 192.168.1.88 at the same time.
> 4. ID-204 failed to access the sensitive table.
> 5. ID-409 succeeded in accessing the sensitive table.
>
> Conclusion: session hijacking confirmed. Culprit: ID-409 (stole ID-204's token). Victim: ID-204 (token stolen). Method: token theft / session hijacking.

## Final summary

| Aspect | Detail |
|--------|--------|
| Main culprit | ID-409 |
| Victim | ID-204 (token stolen) |
| Token used | TKN_SALT04 |
| Attack method | Session hijacking / token theft |
| Infected port | 5432 |
| Incident time | 02:15:30 |
| Attacker IP | 10.0.4.15 |
| Victim IP | 192.168.1.88 |

## What to submit

Open the master validation panel and fill in these five answers:

1. Valid culprit ID: **409**
2. Attack method: **Session Hijacking / Token Theft**
3. Stolen token: **TKN_SALT04**
4. Infected port: **5432**
5. Victim: **ID-204 (Budi Santoso)**

A note for the panel: ID-409 used ID-204's stolen token to get illegal access to the `users_sensitive` table.

Passcode: **409 + 5432 + 04 = 5845**

## Scoring

| Activity | Points | Who |
|----------|--------|-----|
| **Local data analysis** | | |
| Log Analyst finds the time window | +50 | Individual |
| DB Admin extracts the salt value | +50 | Individual |
| Server Admin finds port 5432 | +50 | Individual |
| **Contradiction detection** | | |
| Spot the ID inconsistency | +100 | Team |
| **Prompt engineering** | | |
| Server Admin port analysis prompt | +50 | Individual |
| DB Admin token verification prompt | +50 | Individual |
| Log Analyst cross-check prompt | +50 | Individual |
| Combined final verification prompt | +100 | Team |
| **Final conclusion** | | |
| Identify the culprit (ID-409) | +100 | Team |
| Identify the method (session hijacking) | +100 | Team |
| **Maximum total** | **700** | |
