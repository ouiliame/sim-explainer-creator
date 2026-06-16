# Knowledge Base · Demo Corpus

Fake company knowledge for use in the Sim Knowledge Base explainer video.

Loosely modeled on a small SaaS company's internal docs: customer onboarding, billing, refund policy, support escalation, integrations, etc. Mix of customer-facing and internal docs, FAQs, playbooks, and policy.

## Files

| File | Kind | One-liner |
|------|------|-----------|
| [feature-overview.md](feature-overview.md) | Product | The high-level "what does this product do" doc. |
| [pricing-faq.md](pricing-faq.md) | Customer-facing | Plan tiers + common billing questions. |
| [billing-faq.md](billing-faq.md) | Customer-facing | Payment failures, taxes, invoice handling. |
| [refund-policy.md](refund-policy.md) | Customer-facing + internal | Refund windows by plan, internal notes for support. |
| [service-level-agreement.md](service-level-agreement.md) | Customer-facing | Uptime targets and support response times per plan. |
| [data-retention-policy.md](data-retention-policy.md) | Compliance | What gets retained, for how long, deletion paths. |
| [security-faq.md](security-faq.md) | Customer-facing | Encryption, RBAC, deletion, compliance routing. |
| [onboarding-guide.md](onboarding-guide.md) | Internal | How CS onboards each plan tier. |
| [customer-success-playbook.md](customer-success-playbook.md) | Internal | CS team's day-by-day playbook + health signals. |
| [account-management-guide.md](account-management-guide.md) | Internal | Workspace roles, member changes, owner transfer. |
| [support-escalation-rules.md](support-escalation-rules.md) | Internal | When to escalate where (Billing, Eng, CS, Security). |
| [troubleshooting-common-errors.md](troubleshooting-common-errors.md) | Internal | Recipes for the most common workflow errors. |
| [workflow-best-practices.md](workflow-best-practices.md) | Internal | Field guide for building good workflows. |
| [integration-notion.md](integration-notion.md) | Integration | Notion connector setup, behavior, gotchas. |
| [integration-google-drive.md](integration-google-drive.md) | Integration | Google Drive connector setup, behavior, gotchas. |
| [integration-airtable.md](integration-airtable.md) | Integration | Airtable connector — Table vs KB targeting. |
| [release-notes-q3-2025.md](release-notes-q3-2025.md) | Changelog | Q3 product changes (workflows, KB, connectors). |

**17 documents total.** Enough variety that retrieval over the corpus produces meaningful subsets for the demo flows below.

## Demo flows the corpus supports

These are designed so the same query needs different documents → makes the retrieval step visible.

### Q&A
> *"What's our refund policy for annual plans?"*
- Should pull: `refund-policy.md` (top match), `billing-faq.md` (supporting).

### Multi-step judgment
> *"A customer wants a refund after 45 days on an annual plan. Should we approve it?"*
- Should pull: `refund-policy.md` (refund windows), `support-escalation-rules.md` (when to escalate to Billing Ops), `customer-success-playbook.md` (when to involve CS).

### Routing
> *"A customer lost data after enabling a beta feature. Where should this go?"*
- Should pull: `support-escalation-rules.md` (data loss → Support Engineering), `data-retention-policy.md` (soft-delete window), `troubleshooting-common-errors.md` (workflow stuck patterns).

### Integration question
> *"Can we sync our Notion workspace into the KB? What about Airtable?"*
- Should pull: `integration-notion.md`, `integration-airtable.md`. The retriever needs to grab two separate docs that both belong here.

### Cross-doc reasoning
> *"What's the SLA difference between Pro and Team, and when do we have to honor it?"*
- Should pull: `service-level-agreement.md`, `pricing-faq.md`.

## Not a real company

Everything here is invented. Plan tiers, retention windows, response times, integration scopes — all fabricated. If anything reads like a real Sim policy, that's coincidence and the policy linked from your account is authoritative.
