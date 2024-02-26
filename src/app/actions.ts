"use server";
import { chi } from "@/lib/chimoney";
import { getCurrentUser as get } from "@/lib/firebase";
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
    const user = await get();
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
    return redirect("/auth/login");
  } else return user;
}

export async function getCurrentUser() {
  const c = await get();
  return c;
}
