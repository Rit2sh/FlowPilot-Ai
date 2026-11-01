const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting FlowPilot AI database seed...");

  // 1. Create or update Demo User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("Demo1234!", salt);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@flowpilot.ai" },
    update: {
      passwordHash,
      name: "Alex Vance (Founder)",
      role: "OWNER",
    },
    create: {
      email: "demo@flowpilot.ai",
      passwordHash,
      name: "Alex Vance (Founder)",
      role: "OWNER",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log(`✅ Demo User: ${demoUser.email} (Password: Demo1234!)`);

  // 2. Create or update Demo Business
  const demoBusiness = await prisma.business.upsert({
    where: { slug: "apex-digital" },
    update: {
      name: "Apex Digital Dynamics",
      businessType: "AGENCY",
      country: "US",
      defaultCurrency: "USD",
      timezone: "America/New_York",
      email: "billing@apexdigital.io",
      description: "Full-service digital engineering, cloud architecture, and UX consultancy.",
    },
    create: {
      name: "Apex Digital Dynamics",
      slug: "apex-digital",
      businessType: "AGENCY",
      country: "US",
      defaultCurrency: "USD",
      timezone: "America/New_York",
      email: "billing@apexdigital.io",
      description: "Full-service digital engineering, cloud architecture, and UX consultancy.",
    },
  });

  // Link Membership
  await prisma.businessMember.upsert({
    where: {
      businessId_userId: {
        businessId: demoBusiness.id,
        userId: demoUser.id,
      },
    },
    update: { role: "OWNER" },
    create: {
      businessId: demoBusiness.id,
      userId: demoUser.id,
      role: "OWNER",
    },
  });

  // 3. Connect PayPal Sandbox Account
  await prisma.connectedAccount.upsert({
    where: {
      businessId_provider_environment: {
        businessId: demoBusiness.id,
        provider: "PAYPAL",
        environment: "SANDBOX",
      },
    },
    update: {
      status: "CONNECTED",
      accountEmail: "sb-biz47@business.example.com",
      accountId: "PAYPAL_SB_APEX_8891",
      metadata: {
        tier: "verified_sandbox_merchant",
        capabilities: ["PAYMENT_CAPTURE", "REFUNDS", "WEBHOOKS", "INVOICING"],
      },
    },
    create: {
      businessId: demoBusiness.id,
      provider: "PAYPAL",
      accountEmail: "sb-biz47@business.example.com",
      accountId: "PAYPAL_SB_APEX_8891",
      status: "CONNECTED",
      environment: "SANDBOX",
      metadata: {
        tier: "verified_sandbox_merchant",
        capabilities: ["PAYMENT_CAPTURE", "REFUNDS", "WEBHOOKS", "INVOICING"],
      },
    },
  });

  // 4. Seed 8 Realistic Customers
  const customerData = [
    { name: "Acme Cloud Corp", email: "procurement@acmecloud.com", company: "Acme Cloud Corp", phone: "+1 (415) 890-1122", address: "100 Market St, San Francisco, CA" },
    { name: "Stellar UX Studio", email: "finance@stellarux.design", company: "Stellar UX Studio", phone: "+1 (212) 555-0199", address: "450 Lexington Ave, New York, NY" },
    { name: "BluePeak Software", email: "ap@bluepeak.tech", company: "BluePeak Software Inc", phone: "+1 (512) 443-8821", address: "701 Brazos St, Austin, TX" },
    { name: "Nova Retailers", email: "payments@novaretail.com", company: "Nova Retail Global", phone: "+1 (312) 678-9011", address: "233 S Wacker Dr, Chicago, IL" },
    { name: "Horizon Labs", email: "accounts@horizonlabs.bio", company: "Horizon Biotech Labs", phone: "+1 (617) 223-9944", address: "500 Kendall St, Cambridge, MA" },
    { name: "Pulse Marketing", email: "invoicing@pulsemktg.agency", company: "Pulse Marketing Group", phone: "+1 (305) 887-2311", address: "1111 Brickell Ave, Miami, FL" },
    { name: "Summit Financial", email: "billing@summitfin.co", company: "Summit Financial Partners", phone: "+1 (704) 991-3422", address: "201 S Tryon St, Charlotte, NC" },
    { name: "Quantum Media", email: "accounts@quantummedia.tv", company: "Quantum Media Works", phone: "+1 (310) 778-9900", address: "9000 Sunset Blvd, West Hollywood, CA" },
  ];

  const createdCustomers = [];
  for (const c of customerData) {
    const cust = await prisma.customer.upsert({
      where: { id: `cust-${c.email}` },
      update: { ...c, businessId: demoBusiness.id, isDemo: true },
      create: {
        id: `cust-${c.email}`,
        businessId: demoBusiness.id,
        ...c,
        isDemo: true,
        notes: "Verified B2B Enterprise Client [DEMO DATA]",
      },
    });
    createdCustomers.push(cust);
  }
  console.log(`✅ Seeded ${createdCustomers.length} Customers`);

  // 5. Seed 20 Invoices with Items
  const invoiceConfigs = [
    { num: "INV-2026-001", cust: 0, status: "PAID", amount: 4500, daysAgo: 45, dueDaysAgo: 15, desc: "Cloud Architecture Audit & AWS Migration" },
    { num: "INV-2026-002", cust: 1, status: "PAID", amount: 2800, daysAgo: 40, dueDaysAgo: 10, desc: "Mobile Design System & Figma Tokens" },
    { num: "INV-2026-003", cust: 2, status: "PAID", amount: 6200, daysAgo: 35, dueDaysAgo: 5, desc: "SaaS API Microservices Development" },
    { num: "INV-2026-004", cust: 3, status: "PAID", amount: 1500, daysAgo: 30, dueDaysAgo: 2, desc: "E-Commerce Checkout Performance Tuning" },
    { num: "INV-2026-005", cust: 4, status: "PAID", amount: 8900, daysAgo: 28, dueDaysAgo: -2, desc: "Bioinformatics Pipeline UI Overhaul" },
    { num: "INV-2026-006", cust: 0, status: "PAID", amount: 5000, daysAgo: 25, dueDaysAgo: -5, desc: "Kubernetes Cluster Optimization" },
    { num: "INV-2026-007", cust: 5, status: "PAID", amount: 3400, daysAgo: 22, dueDaysAgo: -8, desc: "Marketing Analytics Dashboard V2" },
    { num: "INV-2026-008", cust: 6, status: "PAID", amount: 7500, daysAgo: 20, dueDaysAgo: -10, desc: "Security Penetration & SOC2 Advisory" },
    { num: "INV-2026-009", cust: 7, status: "PAID", amount: 4100, daysAgo: 18, dueDaysAgo: -12, desc: "Video Streaming CDN Integration" },
    { num: "INV-2026-010", cust: 1, status: "PAID", amount: 1950, daysAgo: 15, dueDaysAgo: -15, desc: "Design Sprint Facilitation & Testing" },

    // Pending / Upcoming
    { num: "INV-2026-011", cust: 2, status: "PENDING", amount: 3500, daysAgo: 10, dueDaysAgo: -5, desc: "Backend OAuth2 & Security Implementation" },
    { num: "INV-2026-012", cust: 3, status: "PENDING", amount: 2200, daysAgo: 8, dueDaysAgo: -7, desc: "Shopify Storefront Performance Audit" },
    { num: "INV-2026-013", cust: 4, status: "PENDING", amount: 9500, daysAgo: 5, dueDaysAgo: -10, desc: "Genomics Data Visualization Suite" },
    { num: "INV-2026-014", cust: 5, status: "PENDING", amount: 4800, daysAgo: 3, dueDaysAgo: -12, desc: "Automated Campaign Workflow Tool" },

    // Overdue
    { num: "INV-2026-015", cust: 6, status: "OVERDUE", amount: 3200, daysAgo: 30, dueDaysAgo: 12, desc: "Fintech Compliance Reporting Automation" },
    { num: "INV-2026-016", cust: 7, status: "OVERDUE", amount: 5600, daysAgo: 35, dueDaysAgo: 14, desc: "Video Transcoding Infrastructure Upgrade" },
    { num: "INV-2026-017", cust: 3, status: "OVERDUE", amount: 1800, daysAgo: 25, dueDaysAgo: 8, desc: "Payment Gateway Integration Testing" },

    // Drafts
    { num: "INV-2026-018", cust: 0, status: "DRAFT", amount: 12000, daysAgo: 2, dueDaysAgo: -28, desc: "Q1 Enterprise Cloud Migration Retainer" },
    { num: "INV-2026-019", cust: 1, status: "DRAFT", amount: 4400, daysAgo: 1, dueDaysAgo: -29, desc: "Complete Brand Redesign Package" },

    // Cancelled
    { num: "INV-2026-020", cust: 2, status: "CANCELLED", amount: 2500, daysAgo: 40, dueDaysAgo: 20, desc: "Deprecated Legacy API Maintenance" },
  ];

  const createdInvoices = [];
  const now = new Date();

  for (const inv of invoiceConfigs) {
    const customer = createdCustomers[inv.cust];
    const issueDate = new Date(now.getTime() - inv.daysAgo * 86400000);
    const dueDate = new Date(now.getTime() - inv.dueDaysAgo * 86400000);

    const invoice = await prisma.invoice.upsert({
      where: {
        businessId_invoiceNumber: {
          businessId: demoBusiness.id,
          invoiceNumber: inv.num,
        },
      },
      update: {
        status: inv.status,
        totalAmount: inv.amount,
        paidAmount: inv.status === "PAID" ? inv.amount : 0,
        subtotal: inv.amount,
        issueDate,
        dueDate,
      },
      create: {
        businessId: demoBusiness.id,
        customerId: customer.id,
        invoiceNumber: inv.num,
        status: inv.status,
        issueDate,
        dueDate,
        currency: "USD",
        subtotal: inv.amount,
        taxRate: 0,
        taxAmount: 0,
        totalAmount: inv.amount,
        paidAmount: inv.status === "PAID" ? inv.amount : 0,
        notes: `Project Deliverable: ${inv.desc} [DEMO DATA]`,
        terms: "Net 30 days upon invoice receipt.",
        paypalOrderId: `PAYPAL-ORD-${inv.num}`,
        checkoutUrl: `https://sandbox.paypal.com/checkoutnow?token=EC-DEMO-${inv.num}`,
        isDemo: true,
      },
    });

    // Create Invoice Item
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: invoice.id } });
    await prisma.invoiceItem.create({
      data: {
        invoiceId: invoice.id,
        description: inv.desc,
        quantity: 1,
        unitPrice: inv.amount,
        amount: inv.amount,
      },
    });

    createdInvoices.push(invoice);
  }
  console.log(`✅ Seeded ${createdInvoices.length} Invoices with line items`);

  // 6. Seed 30 Realistic Transactions, Payments & PayPal Captures
  console.log("⚡ Seeding 30 transactions, payments & PayPal capture logs...");
  await prisma.transaction.deleteMany({ where: { businessId: demoBusiness.id } });
  await prisma.payment.deleteMany({ where: { businessId: demoBusiness.id } });
  await prisma.reconciliationRecord.deleteMany({ where: { businessId: demoBusiness.id } });

  let txCount = 0;
  for (let i = 0; i < 30; i++) {
    const inv = createdInvoices[i % createdInvoices.length];
    const txDate = new Date(now.getTime() - (30 - i) * 86400000);
    const orderId = `PAYPAL-ORD-TX-${1000 + i}`;
    const captureId = `CAPTURE-${8000 + i}`;
    const amount = (1500 + (i * 350) % 5000);

    let status = "SETTLED";
    let matchType = "EXACT";
    let reconStatus = "MATCHED";

    // Inject 3 intentional reconciliation discrepancies for demonstration
    if (i === 12) {
      status = "UNMATCHED";
      matchType = "UNMATCHED";
      reconStatus = "UNMATCHED";
    } else if (i === 22) {
      status = "PENDING";
      matchType = "SUGGESTED";
      reconStatus = "DISCREPANCY";
    }

    // Payment record
    const payment = await prisma.payment.create({
      data: {
        businessId: demoBusiness.id,
        customerId: inv.customerId,
        invoiceId: inv.id,
        amount,
        currency: "USD",
        status: status === "SETTLED" ? "COMPLETED" : "PENDING",
        provider: "PAYPAL",
        providerTransactionId: captureId,
        providerOrderId: orderId,
        paymentMethod: "paypal_wallet",
        isDemo: true,
        createdAt: txDate,
      },
    });

    // PayPal Order & Capture
    const ppOrder = await prisma.payPalOrder.create({
      data: {
        businessId: demoBusiness.id,
        invoiceId: inv.id,
        paypalOrderId: orderId,
        status: status === "SETTLED" ? "COMPLETED" : "CREATED",
        amount,
        currency: "USD",
        approvalUrl: `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`,
        payerEmail: inv.customerId ? "payer@sandbox.paypal.com" : null,
        isDemo: true,
        createdAt: txDate,
      },
    });

    if (status === "SETTLED") {
      await prisma.payPalCapture.create({
        data: {
          paypalOrderId: ppOrder.id,
          captureId,
          status: "COMPLETED",
          amount,
          currency: "USD",
          transactionFee: (amount * 0.029 + 0.30).toFixed(2),
          netAmount: (amount - (amount * 0.029 + 0.30)).toFixed(2),
          sellerProtection: "ELIGIBLE",
          createdAt: txDate,
        },
      });
    }

    // Transaction Ledger Record
    const tx = await prisma.transaction.create({
      data: {
        businessId: demoBusiness.id,
        customerId: inv.customerId,
        invoiceId: inv.id,
        paymentId: payment.id,
        type: "INCOMING_PAYMENT",
        amount,
        currency: "USD",
        description: `PayPal Capture ${captureId} for ${inv.invoiceNumber} [DEMO DATA]`,
        externalReference: captureId,
        status,
        transactionDate: txDate,
        isDemo: true,
        createdAt: txDate,
      },
    });

    // Reconciliation Record
    await prisma.reconciliationRecord.create({
      data: {
        businessId: demoBusiness.id,
        transactionId: tx.id,
        paymentId: payment.id,
        invoiceId: inv.id,
        paypalOrderId: orderId,
        matchType,
        confidenceScore: reconStatus === "MATCHED" ? 1.00 : 0.75,
        status: reconStatus,
        discrepancyReason: reconStatus === "DISCREPANCY" ? "PayPal order amount differs by $15.00 from local invoice total" : null,
        notes: reconStatus === "UNMATCHED" ? "External deposit received without matching invoice reference" : "Autonomous 1-to-1 ledger verification completed",
        createdAt: txDate,
      },
    });

    txCount++;
  }
  console.log(`✅ Seeded ${txCount} Transactions, PayPal Orders & Reconciliation entries`);

  // 7. Seed Automation Rules & Follow-up Reminders
  await prisma.automationRule.deleteMany({ where: { businessId: demoBusiness.id } });
  const autoRule1 = await prisma.automationRule.create({
    data: {
      businessId: demoBusiness.id,
      name: "Auto Overdue Reminder (3-Day Grace)",
      description: "When an invoice is 3 days overdue, prepare a polite payment follow-up email and seek owner approval.",
      triggerEvent: "INVOICE_OVERDUE",
      conditionConfig: { daysOverdue: 3, minAmount: 100 },
      actionType: "PREPARE_DRAFT_REMINDER",
      actionConfig: { template: "overdue_standard_v1", channel: "EMAIL", requireApproval: true },
      isEnabled: true,
    },
  });

  const autoRule2 = await prisma.automationRule.create({
    data: {
      businessId: demoBusiness.id,
      name: "Instant Settlement Auto-Reconciliation",
      description: "Automatically reconcile captured PayPal webhook payments against open pending invoices in real time.",
      triggerEvent: "PAYMENT_RECEIVED",
      conditionConfig: { matchExactAmount: true, provider: "PAYPAL" },
      actionType: "RECONCILE",
      actionConfig: { autoResolveConfidenceThreshold: 0.95 },
      isEnabled: true,
    },
  });

  // Create active Reminders
  const overdueInvoices = createdInvoices.filter((i) => i.status === "OVERDUE");
  for (const inv of overdueInvoices) {
    const cust = createdCustomers.find((c) => c.id === inv.customerId);
    if (cust) {
      await prisma.reminder.create({
        data: {
          businessId: demoBusiness.id,
          customerId: cust.id,
          invoiceId: inv.id,
          triggerType: "AUTOMATED",
          status: "SCHEDULED",
          channel: "EMAIL",
          recipientEmail: cust.email,
          subject: `Friendly Payment Reminder: ${inv.invoiceNumber} for ${demoBusiness.name}`,
          bodyContent: `Hi ${cust.name},\n\nWe wanted to follow up on invoice ${inv.invoiceNumber} ($${inv.totalAmount}), which was due on ${inv.dueDate.toLocaleDateString()}.\n\nYou can pay securely via PayPal here: ${inv.checkoutUrl}\n\nThank you!\n${demoBusiness.name}`,
          scheduledFor: new Date(Date.now() + 86400000),
          isDemo: true,
        },
      });
    }
  }
  console.log(`✅ Seeded Automation rules & ${overdueInvoices.length} Reminders`);

  // 8. Seed AI Conversation & Tool Execution History
  const conversation = await prisma.aIConversation.create({
    data: {
      businessId: demoBusiness.id,
      userId: demoUser.id,
      title: "Q1 Financial Operations & Invoice Status",
      status: "ACTIVE",
    },
  });

  const msg1 = await prisma.aIMessage.create({
    data: {
      conversationId: conversation.id,
      sender: "USER",
      content: "FlowPilot, show all customers who haven't paid and calculate the overdue balance.",
    },
  });

  const toolExec1 = await prisma.aIToolExecution.create({
    data: {
      conversationId: conversation.id,
      messageId: msg1.id,
      toolName: "get_overdue_invoices",
      inputParameters: { businessId: demoBusiness.id },
      outputResult: {
        count: 3,
        totalOverdue: 10600.00,
        invoices: [
          { invoiceNumber: "INV-2026-015", customer: "Summit Financial", amount: 3200, daysOverdue: 12 },
          { invoiceNumber: "INV-2026-016", customer: "Quantum Media", amount: 5600, daysOverdue: 14 },
          { invoiceNumber: "INV-2026-017", customer: "Nova Retailers", amount: 1800, daysOverdue: 8 },
        ],
      },
      status: "EXECUTED",
      executionDurationMs: 42,
    },
  });

  await prisma.aIMessage.create({
    data: {
      conversationId: conversation.id,
      sender: "ASSISTANT",
      content: "I analyzed your ledger records. You currently have **3 overdue invoices** totaling **$10,600.00 USD**:\n\n1. **INV-2026-016** — Quantum Media: **$5,600.00** (14 days overdue)\n2. **INV-2026-015** — Summit Financial: **$3,200.00** (12 days overdue)\n3. **INV-2026-017** — Nova Retailers: **$1,800.00** (8 days overdue)\n\nWould you like me to prepare automated follow-up payment reminders for your approval?",
      metadata: { toolExecutionId: toolExec1.id },
    },
  });

  // 9. Seed Approval Requests (Low, Medium, High Risk)
  await prisma.approvalRequest.deleteMany({ where: { businessId: demoBusiness.id } });
  await prisma.approvalRequest.create({
    data: {
      businessId: demoBusiness.id,
      requestedByUserId: demoUser.id,
      actionType: "SEND_COMMUNICATION",
      targetEntity: "Reminder",
      targetId: "REM-001",
      summary: "Send Overdue Reminder to Quantum Media ($5,600.00)",
      details: {
        recipient: "accounts@quantummedia.tv",
        invoiceNumber: "INV-2026-016",
        amount: 5600.00,
        channel: "EMAIL",
      },
      riskLevel: "MEDIUM",
      status: "PENDING",
      expiresAt: new Date(Date.now() + 86400000 * 3),
    },
  });

  await prisma.approvalRequest.create({
    data: {
      businessId: demoBusiness.id,
      requestedByUserId: demoUser.id,
      actionType: "ISSUE_REFUND",
      targetEntity: "Payment",
      targetId: "PAY-REFUND-002",
      summary: "Execute PayPal Partial Refund of $350.00 to BluePeak Software",
      details: {
        customer: "BluePeak Software",
        captureId: "CAPTURE-8015",
        refundAmount: 350.00,
        reason: "Customer service discount adjustment",
      },
      riskLevel: "HIGH",
      status: "PENDING",
      expiresAt: new Date(Date.now() + 86400000 * 2),
    },
  });

  // 10. Seed Audit Logs & System Notifications
  await prisma.auditLog.create({
    data: {
      businessId: demoBusiness.id,
      userId: demoUser.id,
      actorType: "AI_AGENT",
      action: "INVOICE_QUERY_ANALYSIS",
      entityType: "Invoice",
      entityId: "AGGREGATE",
      newState: { query: "overdue_invoices", resultCount: 3, totalAmount: 10600 },
    },
  });

  await prisma.notification.create({
    data: {
      businessId: demoBusiness.id,
      userId: demoUser.id,
      title: "PayPal Sandbox Connected",
      message: "PayPal sandbox account sb-biz47@business.example.com is active and ready for orders & checkout.",
      type: "SUCCESS",
      link: "/dashboard/settings",
    },
  });

  await prisma.notification.create({
    data: {
      businessId: demoBusiness.id,
      userId: demoUser.id,
      title: "Pending High-Risk Approval",
      message: "AI agent proposed a $350.00 partial refund for BluePeak Software requiring your explicit authorization.",
      type: "WARNING",
      link: "/dashboard/approvals",
    },
  });

  console.log("🎉 FlowPilot AI Database Seed Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

