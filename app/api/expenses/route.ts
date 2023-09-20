import { NextResponse, NextRequest } from "next/server";
import prisma from "@/prisma/client";
import schema from "./schema";

export async function GET(request: NextRequest) {
  const expenses = await prisma.expenses.findMany();

  return NextResponse.json({ data: expenses }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = schema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.errors },
      { status: 400 }
    );
  }

  try {
    const newExpense = await prisma.expenses.create({
      data: {
        description: body.description,
        amount: body.amount,
        category: body.category,
      },
    });

    return NextResponse.json({ data: newExpense }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
