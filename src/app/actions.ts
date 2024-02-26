"use server";
import { chi } from "@/lib/chimoney";
import { getCurrentUser } from "@/lib/firebase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function send({
  receiver,
  amount,
}: {
  receiver: string;
  amount: number;
}) {
  try {
    const user = await getCurrentUser();
    const res = await chi(`/wallets/transfer`, {
      body: {
        subAccount: user?.id,
        receiver: receiver,
        wallet: "chi",
        valueInUSD: amount,
      },
    });

    revalidatePath("/");
    return res;
  } catch (e) {
    return null;
  }
}

export async function authenticate() {
  const user = await getCurrentUser();
  const isAuthenticated = !!user?.email;
  if (!isAuthenticated) {
    redirect("/auth/login");
  } else return user;
}