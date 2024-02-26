import { getCurrentUser } from "@/app/actions";
import { chi } from "@/lib/chimoney";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Transaction } from "./transaction";

const Transactions = async () => {
  const user = await getCurrentUser();
  const transactions = await chi(`/accounts/transactions`, {
    body: {
      subAccount: user?.id,
    },
  }).then((res) => {
    return res?.data.sort((a: any, b: any) => {
      return (
        new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
      );
    });
  });

  return (
    <div className="my-6 w-full md:w-[70vw]">
      <h1 className="text-xl font-medium ml-2 flex items-center justify-between">
        Recent Transactions{" "}
        <Link href="/transaction" className="text-sm text-green-500">
          View More
        </Link>
      </h1>
      <div className="flex flex-col gap-2 mt-3 pt-3 w-full">
        {transactions?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 mt-5">
            <Image
              src="/empty.svg"
              width={200}
              height={200}
              alt="Empty Transactions"
            />
            <h3 className="text-center text-gray-600 text-sm max-w-[270px]">
              No transactions yet. Start sending and receiving money.
            </h3>
          </div>
        )}
        {transactions?.slice(0, 5).map((t: any, i: number) => (
          <Transaction
            t={{
              ...t,
              paymentType: t?.receiver === user?.id ? "credit" : "debit",
            }}
            key={i}
          />
        ))}
      </div>
    </div>
  );
};

export default Transactions;
