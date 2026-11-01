import { z } from "zod";
import { prisma } from "../database/prisma";
import { paypalClient } from "../paypal/client";

// Risk Classification
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface ToolDefinition<TInput = any, TOutput = any> {
  name: string;
  description: string;
  riskLevel: RiskLevel;
  schema: z.ZodSchema<TInput>;
  execute: (input: TInput, context: { businessId: string; userId: string }) => Promise<TOutput>;
}

// -------------------------------------------------------------
// 1. CUSTOMER TOOLS
// -------------------------------------------------------------
export const searchCustomersTool: ToolDefinition = {
  name: "search_customers",
  description: "Search customers by name, company or email in your business ledger.",
  riskLevel: "LOW",
  schema: z.object({
    query: z.string().optional(),
    limit: z.number().optional().default(10),
  }),
  execute: async ({ query, limit }, { businessId }) => {
    return prisma.customer.findMany({
      where: {
        businessId,
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
                { company: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      take: limit,
      include: {
        _count: { select: { invoices: true, payments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },
};

export const getCustomerDetailsTool: ToolDefinition = {
  name: "get_customer_details",
  description: "Retrieve comprehensive customer profile including invoices and total payments.",
  riskLevel: "LOW",
  schema: z.object({
    customerId: z.string(),
  }),
  execute: async ({ customerId }, { businessId }) => {
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, businessId },
      include: {
        invoices: { take: 5, orderBy: { createdAt: "desc" } },
        payments: { take: 5, orderBy: { createdAt: "desc" } },
      },
    });
    if (!customer) throw new Error(`Customer with ID ${customerId} not found.`);
    return customer;
  },
};

export const createCustomerTool: ToolDefinition = {
  name: "create_customer",
  description: "Create a new verified customer profile for invoice generation and payments.",
  riskLevel: "MEDIUM",
  schema: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    company: z.string().optional(),
    phone: z.string().optional(),
    notes: z.string().optional(),
  }),
  execute: async (input, { businessId }) => {
    return prisma.customer.create({
      data: {
        businessId,
        name: input.name,
        email: input.email,
        company: input.company || input.name,
        phone: input.phone,
        notes: input.notes,
        isDemo: false,
      },
    });
  },
};

export const updateCustomerTool: ToolDefinition = {
  name: "update_customer",
  description: "Update existing customer details.",
  riskLevel: "MEDIUM",
  schema: z.object({
    customerId: z.string(),
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    notes: z.string().optional(),
  }),
  execute: async ({ customerId, ...data }, { businessId }) => {
    return prisma.customer.update({
      where: { id: customerId },
      data,
    });
  },
};

// -------------------------------------------------------------
// 2. INVOICE TOOLS
// -------------------------------------------------------------
export const createInvoiceTool: ToolDefinition = {
  name: "create_invoice",
  description: "Create an invoice for a customer with optional items and prepare a PayPal order link.",
  riskLevel: "MEDIUM",
  schema: z.object({
    customerId: z.string().optional(),
    customerName: z.string().optional(),
    customerEmail: z.string().email().optional(),
    amount: z.number().positive(),
    description: z.string().min(3),
    dueDateDays: z.number().default(14),
    currency: z.string().default("USD"),
    preparePayPalLink: z.boolean().default(true),
  }),
  execute: async (input, { businessId }) => {
    let customerId = input.customerId;

    // Resolve customer by name/email or create new if not found
    if (!customerId && (input.customerEmail || input.customerName)) {
      let cust = await prisma.customer.findFirst({
        where: {
          businessId,
          OR: [
            ...(input.customerEmail ? [{ email: input.customerEmail }] : []),
            ...(input.customerName ? [{ name: { contains: input.customerName, mode: "insensitive" as const } }] : []),
          ],
        },
      });

      if (!cust) {
        cust = await prisma.customer.create({
          data: {
            businessId,
            name: input.customerName || "Valued Client",
            email: input.customerEmail || `billing-${Date.now()}@client.example.com`,
            company: input.customerName || "Direct Client",
          },
        });
      }
      customerId = cust.id;
    }

    if (!customerId) {
      const defaultCust = await prisma.customer.findFirst({ where: { businessId } });
      customerId = defaultCust ? defaultCust.id : (await prisma.customer.create({
        data: { businessId, name: "Direct Client", email: "client@example.com" },
      })).id;
    }

    const count = await prisma.invoice.count({ where: { businessId } });
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;
    const dueDate = new Date(Date.now() + input.dueDateDays * 86400000);

    const invoice = await prisma.invoice.create({
      data: {
        businessId,
        customerId,
        invoiceNumber,
        status: "ISSUED",
        dueDate,
        currency: input.currency,
        subtotal: input.amount,
        totalAmount: input.amount,
        notes: input.description,
        items: {
          create: [
            {
              description: input.description,
              quantity: 1,
              unitPrice: input.amount,
              amount: input.amount,
            },
          ],
        },
      },
      include: { customer: true, items: true },
    });

    let paypalOrder = null;
    if (input.preparePayPalLink) {
      paypalOrder = await paypalClient.createOrder({
        businessId,
        invoiceId: invoice.id,
        amount: input.amount,
        currency: input.currency,
        description: `${invoiceNumber}: ${input.description}`,
      });
    }

    return {
      invoice,
      paypalOrder,
      checkoutUrl: paypalOrder?.approvalUrl,
    };
  },
};

export const getInvoiceTool: ToolDefinition = {
  name: "get_invoice",
  description: "Retrieve complete invoice details including customer, line items and payment status.",
  riskLevel: "LOW",
  schema: z.object({
    invoiceNumberOrId: z.string(),
  }),
  execute: async ({ invoiceNumberOrId }, { businessId }) => {
    const invoice = await prisma.invoice.findFirst({
      where: {
        businessId,
        OR: [{ id: invoiceNumberOrId }, { invoiceNumber: invoiceNumberOrId }],
      },
      include: {
        customer: true,
        items: true,
        payments: true,
        paypalOrders: true,
      },
    });
    if (!invoice) throw new Error(`Invoice '${invoiceNumberOrId}' not found.`);
    return invoice;
  },
};

export const searchInvoicesTool: ToolDefinition = {
  name: "search_invoices",
  description: "Search invoices with filters for status (DRAFT, ISSUED, PENDING, PAID, OVERDUE), date or customer.",
  riskLevel: "LOW",
  schema: z.object({
    status: z.enum(["DRAFT", "ISSUED", "PENDING", "PAID", "OVERDUE", "CANCELLED"]).optional(),
    query: z.string().optional(),
    limit: z.number().default(10),
  }),
  execute: async ({ status, query, limit }, { businessId }) => {
    return prisma.invoice.findMany({
      where: {
        businessId,
        ...(status ? { status } : {}),
        ...(query
          ? {
              OR: [
                { invoiceNumber: { contains: query, mode: "insensitive" } },
                { customer: { name: { contains: query, mode: "insensitive" } } },
              ],
            }
          : {}),
      },
      take: limit,
      include: { customer: true },
      orderBy: { createdAt: "desc" },
    });
  },
};

export const updateInvoiceTool: ToolDefinition = {
  name: "update_invoice",
  description: "Update an invoice's status, due date or notes.",
  riskLevel: "MEDIUM",
  schema: z.object({
    invoiceId: z.string(),
    status: z.enum(["DRAFT", "ISSUED", "PENDING", "PAID", "OVERDUE", "CANCELLED"]).optional(),
    notes: z.string().optional(),
  }),
  execute: async ({ invoiceId, ...data }, { businessId }) => {
    return prisma.invoice.update({
      where: { id: invoiceId },
      data,
      include: { customer: true },
    });
  },
};

export const cancelInvoiceTool: ToolDefinition = {
  name: "cancel_invoice",
  description: "Cancel an active invoice and mark status as CANCELLED.",
  riskLevel: "HIGH",
  schema: z.object({
    invoiceId: z.string(),
    reason: z.string().optional(),
  }),
  execute: async ({ invoiceId, reason }, { businessId }) => {
    return prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: "CANCELLED",
        notes: reason ? `Cancelled: ${reason}` : undefined,
      },
    });
  },
};

// -------------------------------------------------------------
// 3. PAYMENT TOOLS
// -------------------------------------------------------------
export const createPayPalOrderTool: ToolDefinition = {
  name: "create_paypal_order",
  description: "Generate a PayPal Sandbox order and checkout URL for an existing invoice or direct payment.",
  riskLevel: "MEDIUM",
  schema: z.object({
    invoiceId: z.string().optional(),
    amount: z.number().positive(),
    currency: z.string().default("USD"),
    description: z.string().min(3),
  }),
  execute: async (input, { businessId }) => {
    return paypalClient.createOrder({
      businessId,
      invoiceId: input.invoiceId,
      amount: input.amount,
      currency: input.currency,
      description: input.description,
    });
  },
};

export const getPaymentStatusTool: ToolDefinition = {
  name: "get_payment_status",
  description: "Verify actual payment status from ledger and PayPal records.",
  riskLevel: "LOW",
  schema: z.object({
    invoiceIdOrOrder: z.string(),
  }),
  execute: async ({ invoiceIdOrOrder }, { businessId }) => {
    // Check by invoice or customer name
    const invoice = await prisma.invoice.findFirst({
      where: {
        businessId,
        OR: [
          { id: invoiceIdOrOrder },
          { invoiceNumber: { contains: invoiceIdOrOrder, mode: "insensitive" } },
          { paypalOrderId: { contains: invoiceIdOrOrder, mode: "insensitive" } },
          { customer: { name: { contains: invoiceIdOrOrder, mode: "insensitive" } } },
        ],
      },
      include: {
        customer: true,
        payments: true,
        paypalOrders: { include: { captures: true } },
      },
    });

    if (invoice) {
      return {
        invoiceNumber: invoice.invoiceNumber,
        customer: invoice.customer.name,
        amount: invoice.totalAmount,
        status: invoice.status,
        isPaid: invoice.status === "PAID",
        paidAmount: invoice.paidAmount,
        payments: invoice.payments,
        paypalOrders: invoice.paypalOrders,
      };
    }

    // Check by payment ID
    const payment = await prisma.payment.findFirst({
      where: {
        businessId,
        OR: [{ id: invoiceIdOrOrder }, { providerTransactionId: invoiceIdOrOrder }, { providerOrderId: invoiceIdOrOrder }],
      },
      include: { invoice: true, customer: true },
    });

    if (payment) {
      return {
        paymentId: payment.id,
        customer: payment.customer.name,
        amount: payment.amount,
        status: payment.status,
        isPaid: payment.status === "COMPLETED",
        invoice: payment.invoice,
      };
    }

    throw new Error(`No payment or invoice found matching '${invoiceIdOrOrder}'.`);
  },
};

export const listPaymentsTool: ToolDefinition = {
  name: "list_payments",
  description: "List recent transaction payments with filters.",
  riskLevel: "LOW",
  schema: z.object({
    status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"]).optional(),
    limit: z.number().default(10),
  }),
  execute: async ({ status, limit }, { businessId }) => {
    return prisma.payment.findMany({
      where: {
        businessId,
        ...(status ? { status } : {}),
      },
      take: limit,
      include: { customer: true, invoice: true },
      orderBy: { createdAt: "desc" },
    });
  },
};

export const requestPaymentCaptureTool: ToolDefinition = {
  name: "request_payment_capture",
  description: "Authorize and execute capture of an approved PayPal order.",
  riskLevel: "HIGH",
  schema: z.object({
    orderId: z.string(),
  }),
  execute: async ({ orderId }, { businessId }) => {
    return paypalClient.captureOrder(orderId, businessId);
  },
};

export const requestRefundTool: ToolDefinition = {
  name: "request_refund",
  description: "Issue a PayPal refund for an existing settled capture.",
  riskLevel: "HIGH",
  schema: z.object({
    captureId: z.string(),
    amount: z.number().positive(),
    reason: z.string().optional(),
  }),
  execute: async ({ captureId, amount, reason }) => {
    return paypalClient.refundCapture(captureId, amount, reason);
  },
};

// -------------------------------------------------------------
// 4. ANALYTICS TOOLS
// -------------------------------------------------------------
export const getRevenueSummaryTool: ToolDefinition = {
  name: "get_revenue_summary",
  description: "Calculate database-grounded revenue metrics, settled amounts, pending totals and overdue sums.",
  riskLevel: "LOW",
  schema: z.object({}),
  execute: async (_, { businessId }) => {
    const paidInvoices = await prisma.invoice.findMany({
      where: { businessId, status: "PAID" },
      select: { totalAmount: true },
    });
    const pendingInvoices = await prisma.invoice.findMany({
      where: { businessId, status: "PENDING" },
      select: { totalAmount: true },
    });
    const overdueInvoices = await prisma.invoice.findMany({
      where: { businessId, status: "OVERDUE" },
      select: { totalAmount: true },
    });

    const totalRevenue = paidInvoices.reduce((acc, curr) => acc + Number(curr.totalAmount), 0);
    const totalPending = pendingInvoices.reduce((acc, curr) => acc + Number(curr.totalAmount), 0);
    const totalOverdue = overdueInvoices.reduce((acc, curr) => acc + Number(curr.totalAmount), 0);

    const totalInvoicesCount = await prisma.invoice.count({ where: { businessId } });
    const paidCount = paidInvoices.length;
    const successRate = totalInvoicesCount > 0 ? ((paidCount / totalInvoicesCount) * 100).toFixed(1) : "100.0";

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalPending: Number(totalPending.toFixed(2)),
      totalOverdue: Number(totalOverdue.toFixed(2)),
      paidCount,
      pendingCount: pendingInvoices.length,
      overdueCount: overdueInvoices.length,
      successRate: `${successRate}%`,
      currency: "USD",
    };
  },
};

export const getPendingPaymentsTool: ToolDefinition = {
  name: "get_pending_payments",
  description: "Retrieve all pending payments and invoices awaiting customer checkout.",
  riskLevel: "LOW",
  schema: z.object({}),
  execute: async (_, { businessId }) => {
    return prisma.invoice.findMany({
      where: { businessId, status: "PENDING" },
      include: { customer: true },
      orderBy: { dueDate: "asc" },
    });
  },
};

export const getOverdueInvoicesTool: ToolDefinition = {
  name: "get_overdue_invoices",
  description: "Retrieve all overdue invoices and calculate total unpaid balance and days delinquent.",
  riskLevel: "LOW",
  schema: z.object({}),
  execute: async (_, { businessId }) => {
    const invoices = await prisma.invoice.findMany({
      where: { businessId, status: "OVERDUE" },
      include: { customer: true },
      orderBy: { dueDate: "asc" },
    });

    const now = Date.now();
    const enriched = invoices.map((inv) => ({
      invoiceNumber: inv.invoiceNumber,
      customer: inv.customer.name,
      amount: Number(inv.totalAmount),
      dueDate: inv.dueDate.toISOString().split("T")[0],
      daysOverdue: Math.max(0, Math.floor((now - new Date(inv.dueDate).getTime()) / 86400000)),
      checkoutUrl: inv.checkoutUrl,
    }));

    const totalOverdue = enriched.reduce((acc, curr) => acc + curr.amount, 0);

    return {
      count: enriched.length,
      totalOverdue: Number(totalOverdue.toFixed(2)),
      invoices: enriched,
    };
  },
};

export const getPaymentSuccessRateTool: ToolDefinition = {
  name: "get_payment_success_rate",
  description: "Calculate overall payment collection and success rate metrics.",
  riskLevel: "LOW",
  schema: z.object({}),
  execute: async (_, { businessId }) => {
    const totalPayments = await prisma.payment.count({ where: { businessId } });
    const completedPayments = await prisma.payment.count({ where: { businessId, status: "COMPLETED" } });
    const rate = totalPayments > 0 ? ((completedPayments / totalPayments) * 100).toFixed(1) : "100.0";
    return {
      totalPayments,
      completedPayments,
      successRate: `${rate}%`,
    };
  },
};

export const getCustomerPaymentHistoryTool: ToolDefinition = {
  name: "get_customer_payment_history",
  description: "Analyze historical payment timeliness and punctuality for a specific customer.",
  riskLevel: "LOW",
  schema: z.object({
    customerNameOrEmail: z.string(),
  }),
  execute: async ({ customerNameOrEmail }, { businessId }) => {
    const customer = await prisma.customer.findFirst({
      where: {
        businessId,
        OR: [
          { name: { contains: customerNameOrEmail, mode: "insensitive" } },
          { email: { contains: customerNameOrEmail, mode: "insensitive" } },
        ],
      },
      include: {
        invoices: { orderBy: { createdAt: "desc" } },
        payments: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!customer) throw new Error(`Customer '${customerNameOrEmail}' not found.`);

    const totalBilled = customer.invoices.reduce((acc, i) => acc + Number(i.totalAmount), 0);
    const totalPaid = customer.invoices
      .filter((i) => i.status === "PAID")
      .reduce((acc, i) => acc + Number(i.totalAmount), 0);
    const outstanding = customer.invoices
      .filter((i) => i.status === "OVERDUE" || i.status === "PENDING")
      .reduce((acc, i) => acc + Number(i.totalAmount), 0);

    return {
      customer: customer.name,
      email: customer.email,
      totalBilled: Number(totalBilled.toFixed(2)),
      totalPaid: Number(totalPaid.toFixed(2)),
      outstanding: Number(outstanding.toFixed(2)),
      invoicesCount: customer.invoices.length,
      recentInvoices: customer.invoices.slice(0, 3),
    };
  },
};

// -------------------------------------------------------------
// 5. RECONCILIATION TOOLS
// -------------------------------------------------------------
export const findUnmatchedPaymentsTool: ToolDefinition = {
  name: "find_unmatched_payments",
  description: "Find payments or transactions that lack matching invoices or have amount discrepancies.",
  riskLevel: "LOW",
  schema: z.object({}),
  execute: async (_, { businessId }) => {
    return prisma.reconciliationRecord.findMany({
      where: {
        businessId,
        status: { in: ["UNMATCHED", "DISCREPANCY"] },
      },
      include: {
        transaction: true,
        payment: true,
        invoice: true,
      },
    });
  },
};

export const reconcilePaymentTool: ToolDefinition = {
  name: "reconcile_payment",
  description: "Manually reconcile an unmatched payment with an invoice.",
  riskLevel: "MEDIUM",
  schema: z.object({
    recordId: z.string(),
    invoiceId: z.string(),
    notes: z.string().optional(),
  }),
  execute: async ({ recordId, invoiceId, notes }, { businessId, userId }) => {
    return prisma.reconciliationRecord.update({
      where: { id: recordId },
      data: {
        invoiceId,
        status: "MATCHED",
        matchType: "MANUAL",
        confidenceScore: 1.00,
        resolvedByUserId: userId,
        resolvedAt: new Date(),
        notes: notes || "Manually reconciled by user",
      },
    });
  },
};

export const generateReconciliationReportTool: ToolDefinition = {
  name: "generate_reconciliation_report",
  description: "Generate ledger-wide reconciliation audit report.",
  riskLevel: "LOW",
  schema: z.object({}),
  execute: async (_, { businessId }) => {
    const totalRecords = await prisma.reconciliationRecord.count({ where: { businessId } });
    const matchedCount = await prisma.reconciliationRecord.count({ where: { businessId, status: "MATCHED" } });
    const discrepancyCount = await prisma.reconciliationRecord.count({ where: { businessId, status: "DISCREPANCY" } });
    const unmatchedCount = await prisma.reconciliationRecord.count({ where: { businessId, status: "UNMATCHED" } });

    return {
      totalRecords,
      matchedCount,
      discrepancyCount,
      unmatchedCount,
      healthScore: totalRecords > 0 ? `${((matchedCount / totalRecords) * 100).toFixed(1)}%` : "100%",
    };
  },
};

// -------------------------------------------------------------
// 6. AUTOMATION TOOLS
// -------------------------------------------------------------
export const createReminderTool: ToolDefinition = {
  name: "create_reminder",
  description: "Draft a payment reminder for an unpaid or overdue invoice.",
  riskLevel: "MEDIUM",
  schema: z.object({
    invoiceId: z.string(),
    subject: z.string().optional(),
    body: z.string().optional(),
  }),
  execute: async ({ invoiceId, subject, body }, { businessId }) => {
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, businessId },
      include: { customer: true },
    });
    if (!invoice) throw new Error(`Invoice '${invoiceId}' not found.`);

    return prisma.reminder.create({
      data: {
        businessId,
        customerId: invoice.customerId,
        invoiceId: invoice.id,
        triggerType: "MANUAL",
        status: "SCHEDULED",
        channel: "EMAIL",
        recipientEmail: invoice.customer.email,
        subject: subject || `Reminder: Payment for Invoice ${invoice.invoiceNumber}`,
        bodyContent: body || `Dear ${invoice.customer.name}, please settle invoice ${invoice.invoiceNumber} ($${invoice.totalAmount}).`,
        scheduledFor: new Date(Date.now() + 86400000),
      },
    });
  },
};

export const scheduleReminderTool: ToolDefinition = {
  name: "schedule_reminder",
  description: "Schedule automated recurring reminder workflows for overdue accounts.",
  riskLevel: "MEDIUM",
  schema: z.object({
    ruleName: z.string(),
    triggerDays: z.number().default(3),
  }),
  execute: async ({ ruleName, triggerDays }, { businessId }) => {
    return prisma.automationRule.create({
      data: {
        businessId,
        name: ruleName,
        triggerEvent: "INVOICE_OVERDUE",
        conditionConfig: { daysOverdue: triggerDays },
        actionType: "PREPARE_DRAFT_REMINDER",
        actionConfig: { channel: "EMAIL", autoSend: false },
        isEnabled: true,
      },
    });
  },
};

export const pauseAutomationTool: ToolDefinition = {
  name: "pause_automation",
  description: "Pause an active automation rule.",
  riskLevel: "MEDIUM",
  schema: z.object({ ruleId: z.string() }),
  execute: async ({ ruleId }) => {
    return prisma.automationRule.update({
      where: { id: ruleId },
      data: { isEnabled: false },
    });
  },
};

export const resumeAutomationTool: ToolDefinition = {
  name: "resume_automation",
  description: "Resume a paused automation rule.",
  riskLevel: "MEDIUM",
  schema: z.object({ ruleId: z.string() }),
  execute: async ({ ruleId }) => {
    return prisma.automationRule.update({
      where: { id: ruleId },
      data: { isEnabled: true },
    });
  },
};

// -------------------------------------------------------------
// COMPLETE TOOL REGISTRY
// -------------------------------------------------------------
export const ALL_TOOLS: Record<string, ToolDefinition> = {
  // Customer
  search_customers: searchCustomersTool,
  get_customer_details: getCustomerDetailsTool,
  create_customer: createCustomerTool,
  update_customer: updateCustomerTool,

  // Invoices
  create_invoice: createInvoiceTool,
  get_invoice: getInvoiceTool,
  search_invoices: searchInvoicesTool,
  update_invoice: updateInvoiceTool,
  cancel_invoice: cancelInvoiceTool,

  // Payments
  create_paypal_order: createPayPalOrderTool,
  get_payment_status: getPaymentStatusTool,
  list_payments: listPaymentsTool,
  request_payment_capture: requestPaymentCaptureTool,
  request_refund: requestRefundTool,

  // Analytics
  get_revenue_summary: getRevenueSummaryTool,
  get_pending_payments: getPendingPaymentsTool,
  get_overdue_invoices: getOverdueInvoicesTool,
  get_payment_success_rate: getPaymentSuccessRateTool,
  get_customer_payment_history: getCustomerPaymentHistoryTool,

  // Reconciliation
  find_unmatched_payments: findUnmatchedPaymentsTool,
  reconcile_payment: reconcilePaymentTool,
  generate_reconciliation_report: generateReconciliationReportTool,

  // Automation
  create_reminder: createReminderTool,
  schedule_reminder: scheduleReminderTool,
  pause_automation: pauseAutomationTool,
  resume_automation: resumeAutomationTool,
};

