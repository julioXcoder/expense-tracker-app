import z from "zod";

const categories = ["Groceries", "Utilities", "Entertainment"] as const;

const schema = z.object({
  description: z
    .string()
    .min(3, { message: "Description should be at least 3 characters." })
    .refine((value) => value.trim().length > 0, {
      message: "Description should not be empty or only whitespace.",
    }),

  amount: z.number().multipleOf(0.01),

  category: z.enum(categories).refine((value) => categories.includes(value), {
    message:
      "Category should be one of 'Groceries', 'Utilities', or 'Entertainment'.",
  }),
});

export default schema;
