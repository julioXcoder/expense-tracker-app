import { NextResponse, NextRequest } from "next/server";
import prisma from "@/prisma/client";

interface Props {
  params: {
    id: string;
  };
}

export async function DELETE(request: NextRequest, { params: { id } }: Props) {
  const expense = await prisma.expenses.findUnique({
    where: { id: parseInt(id) },
  });

  if (!expense) {
    return NextResponse.json(
      { error: "Expense was not found" },
      { status: 404 }
    );
  }

  const deletedExpense = await prisma.expenses.delete({
    where: { id: expense.id },
  });
  return NextResponse.json({ data: deletedExpense }, { status: 200 });
}
