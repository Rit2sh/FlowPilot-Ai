import { describe, it, expect } from "vitest";
import { aiProvider } from "@/server/ai/provider";
import { ALL_TOOLS } from "@/server/ai/tools";

describe("AI Agent Engine & Tool Calling Module", () => {
  it("should correctly classify natural language invoice creation instruction", async () => {
    const prompt = "Create a $500 invoice for John for website development";
    const plan = await aiProvider.planExecution(prompt);

    expect(plan.intent).toBe("CREATE_INVOICE_WITH_PAYPAL");
    expect(plan.toolName).toBe("create_invoice");
    expect(plan.parameters.amount).toBe(500);
    expect(plan.parameters.customerName).toBe("John");
    expect(plan.requiresApproval).toBe(false);
  });

  it("should classify overdue inquiry and query overdue records without hallucination", async () => {
    const prompt = "Show all customers who haven't paid";
    const plan = await aiProvider.planExecution(prompt);

    expect(plan.intent).toBe("GET_OVERDUE_INVOICES");
    expect(plan.toolName).toBe("get_overdue_invoices");
  });

  it("should classify high-risk refund operations and mandate owner authorization", async () => {
    const prompt = "Please execute a refund $350 for BluePeak";
    const plan = await aiProvider.planExecution(prompt);

    expect(plan.toolName).toBe("request_refund");
    expect(plan.requiresApproval).toBe(true);

    const toolDef = ALL_TOOLS["request_refund"];
    expect(toolDef.riskLevel).toBe("HIGH");
  });

  it("should validate tool argument schemas with Zod strictly", () => {
    const createInvoiceSchema = ALL_TOOLS["create_invoice"].schema;

    // Valid
    const valid = createInvoiceSchema.safeParse({
      amount: 1200,
      description: "Cloud Architecture Design",
      dueDateDays: 14,
    });
    expect(valid.success).toBe(true);

    // Invalid (negative amount)
    const invalid = createInvoiceSchema.safeParse({
      amount: -50,
      description: "Invalid",
    });
    expect(invalid.success).toBe(false);
  });
});

