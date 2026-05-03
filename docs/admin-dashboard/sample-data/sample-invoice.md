# Sample Invoice — X9Elysium Template

This is the standardized invoice format for X9Elysium. Generated from the **Create Invoice** Tally form (see `tableau-integration-plan.md` § 2.5). One row per invoice → `invoices.csv` → Tableau Tab 5 (Finance).

The PDF version of this template lives at `docs/admin-dashboard/sample-data/sample-invoice.pdf` (TODO — generate with Pandoc, Typst, or Google Docs export). The markdown below is the source of truth for fields; the PDF just renders them.

---

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│    X9ELYSIUM                                          INVOICE        │
│    Shopify Plus Consulting                                          │
│    Mississauga, ON · Canada                          INV-2026-0017   │
│    fd3687@yahoo.ca                                                  │
│    x9elysium.com                                                    │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│    BILL TO                                  INVOICE DATE             │
│    Northwind Apparel                        2026-03-15               │
│    Sarah Chen, Director of Ecommerce                                │
│    ap@northwind-apparel.com                 DUE DATE                 │
│    1428 Queen St W, Toronto, ON M6K 1L9     2026-04-14 (Net 30)      │
│                                                                     │
│                                             CURRENCY                 │
│                                             USD                      │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│    PROJECT: Shopify Plus Migration — Phase 2 (Catalog + Checkout)   │
│                                                                     │
│    DESCRIPTION                                  HOURS    AMOUNT      │
│    ──────────────────────────────────────────  ──────  ─────────    │
│    Catalog migration (Magento 2 → Plus)          42     $ 12,600    │
│    URL redirect map + 301s (4,820 URLs)          18     $  5,400    │
│    Checkout extensions — multi-currency           24     $  7,200    │
│    QA + UAT support                              16     $  4,800    │
│                                                                     │
│                                            SUBTOTAL    $ 30,000    │
│                                            TAX (HST 0%) $      0    │
│                                            ─────────────────────    │
│                                            TOTAL       $ 30,000    │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│    PAYMENT INSTRUCTIONS                                             │
│    Preferred: Wise (USD) — request invoice link via email           │
│    Alt: Direct bank transfer — wire details on request               │
│                                                                     │
│    Payments are due within terms above. Late balances accrue         │
│    1.5%/month. Questions: fd3687@yahoo.ca                           │
│                                                                     │
│    Thank you for your partnership.                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Field mapping

This sample renders one row of `invoices.csv`. Field-by-field:

| Invoice field | CSV column |
|---|---|
| `INV-2026-0017` | `invoice_id` |
| `Northwind Apparel` | `client_name` |
| `ap@northwind-apparel.com` | `client_email` |
| `Shopify Plus Migration — Phase 2…` | `project` |
| `2026-03-15` | `issue_date` |
| `2026-04-14` | `due_date` |
| `Net 30` | `payment_terms` |
| `USD` | `currency` |
| `$30,000` | `subtotal` |
| `0%` HST | `tax_rate` |
| `$0` | `tax_amount` |
| `$30,000` | `total` |
| (status set after issue) | `status` |
| (filled when paid) | `paid_date`, `paid_amount`, `payment_method` |

Line items (the description / hours / amount table) aren't stored as separate rows in `invoices.csv` — they exist only on the rendered PDF. If you ever need line-item-level reporting, split into two sheets: `invoices` (header) + `invoice_lines` (one row per line, joined on `invoice_id`).

## Status values (drives the Finance dashboard)

| Status | Meaning | Triggered by |
|---|---|---|
| **Draft** | Created but not sent | Create Invoice form, "Send later" |
| **Sent** | Emailed to client | Create Invoice form, "Send now" or status update form |
| **Viewed** | Client opened the PDF | (Optional — needs Stripe / Wise tracking) |
| **Partial** | Client paid some of the total | Update Invoice Status form |
| **Paid** | Fully paid | Update Invoice Status form |
| **Overdue** | Past due date, unpaid | Auto-set by Apps Script if `due_date < today AND status NOT IN (Paid, Void)` |
| **Void** | Cancelled / refunded | Update Invoice Status form |

## How invoices flow into the dashboard

1. Win a deal → Tally **Create Invoice** form → row added to `invoices` Sheet tab → status `Draft` or `Sent`.
2. Generate PDF (Google Docs template + Apps Script merge, or [PandaDoc](https://pandadoc.com), or manual export of this template).
3. Email PDF to client with payment link.
4. When paid: Tally **Update Invoice Status** form → status flips to `Paid` + records `paid_date`, `paid_amount`, `payment_method`.
5. Tableau pulls the Sheet at next refresh → Tab 5 KPIs update.
