"use client";

import { useState, useEffect } from "react";

import { FieldValues, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const categories = [
  "All Categories",
  "Groceries",
  "Utilities",
  "Entertainment",
] as const;

const schema = z.object({
  description: z
    .string()
    .min(3, { message: "Description should be at least 3 characters." }),

  amount: z.number({ invalid_type_error: "Amount is required" }),
  category: z.enum(categories),
});

type formData = z.infer<typeof schema>;

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
}

export default function Home() {
  const [category, setCategory] = useState("All Categories");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<formData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    async function fetchExpenses() {
      const response = await fetch("http://localhost:3000/api/expenses");
      const data = await response.json();
      setExpenses(data.data);
    }

    fetchExpenses();
  }, []);

  // const onSubmit = async (data: FieldValues) => {
  //   const response = await fetch("http://localhost:3000/api/expenses", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(data),
  //   });

  //   // Parse the JSON response
  //   const responseData = await response.json();

  //   // The responseData is now available to use
  //   setExpenses([...expenses!, responseData.data]);
  // };

  const onSubmit = async (data: FieldValues) => {
    // Optimistically update the state
    const newExpense = { id: Date.now(), ...data } as Expense; // Temporary id
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    reset();

    try {
      const response = await fetch("http://localhost:3000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Parse the JSON response
      const responseData = await response.json();

      // Replace the temporary expense with the actual one from the server
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === newExpense.id ? responseData.data : expense
        )
      );
    } catch (error) {
      // If the request fails, revert the state
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== newExpense.id)
      );
      // Handle error...
    }
  };

  // const handleDelete = async (id: number) => {
  //   await fetch(`http://localhost:3000/api/expenses/${id}`, {
  //     method: "DELETE",
  //   });

  //   setExpenses((expenses) => expenses!.filter((expense) => expense.id !== id));
  // };

  const handleDelete = async (id: number) => {
    // Optimistically update the state
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id)
    );

    try {
      await fetch(`http://localhost:3000/api/expenses/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      // If the request fails, revert the state
      setExpenses((prevExpenses) => [...prevExpenses, expenses[id]]);
      // Handle error...
    }
  };

  return (
    <main className="flex flex-col items-center">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <input
            {...register("description")}
            type="text"
            className="input input-bordered w-full max-w-xs"
          />
          {errors.description && (
            <div className="flex mt-2 space-x-2 text-red-600 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{errors.description.message}</span>
            </div>
          )}
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Amount</span>
          </label>
          <input
            {...register("amount", { valueAsNumber: true })}
            type="number"
            className="input input-bordered w-full max-w-xs"
          />
          {errors.amount && (
            <div className="flex mt-2 space-x-2 text-red-600 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{errors.amount.message}</span>
            </div>
          )}
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Category</span>
          </label>
          <select {...register("category")} className="select select-bordered">
            {categories
              .filter((category) => category !== "All Categories")
              .map((category, index) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>
          {errors.category && (
            <div className="flex mt-2 space-x-2 text-red-600 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{errors.category.message}</span>
            </div>
          )}
        </div>

        <button type="submit" className="btn mt-4">
          Submit
        </button>
      </form>
      {/* Form */}

      {/* table */}
      <div className="overflow-x-auto mt-10">
        <div className="form-control w-full">
          <select
            className="select select-bordered"
            onChange={(e) => setCategory(e.currentTarget.value)}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Category</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {expenses &&
              expenses
                .filter((data) =>
                  category == "All Categories"
                    ? data
                    : data.category == category
                )
                .map(({ id, description, amount, category }) => (
                  <tr key={id}>
                    <td>{description}</td>
                    <td>{amount} $</td>
                    <td>{category}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(id)}
                        className="btn btn-sm btn-error"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
