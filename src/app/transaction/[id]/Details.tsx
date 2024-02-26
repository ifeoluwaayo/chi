"use client";
import { chi } from "@/lib/chimoney";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Details({ transaction }: { transaction: any }) {
  const [det, setDet] = useState({
    sender: "",
    receiver: "",
  });

  useEffect(() => {
    async function details() {
      const sender = await chi(
        `/sub-account/get?id=${transaction?.issuer}`,
        {}
      );
      const receiver = await chi(
        `/sub-account/get?id=${transaction?.receiver}`,
        {}
      );
      setDet({ sender: sender?.data?.name, receiver: receiver?.data?.name });
    }

    details();
  }, [transaction]);

  return (
    <div className="w-full right-0 -z-10 left-0 absolute top-0 bottom-0 h-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col px-7 py-6 shadow-lg border rounded-2xl bg-white w-fit md:min-w-[390px]">
        <h3 className="text-lg font-semibold text-gray-600">
          Transaction Details
        </h3>
        <p className="text-3xl mt-2 flex items-center font-medium">
          <span className="text-xl">$</span> {transaction.valueInUSD}
        </p>
        <p className="text-sm font-semibold border-b py-2">
          Transaction ID: <span className="font-normal">{transaction.id}</span>
        </p>
        <p className="text-sm font-semibold border-b py-2">
          Type:{" "}
          <span
            className={`${
              transaction.paymentType === "credit"
                ? "bg-green-300"
                : "bg-red-500"
            } px-2 py-1 rounded-2xl font-normal text-xs text-white`}>
            {transaction?.paymentType}
          </span>
        </p>
        <p className="text-sm border-b font-semibold py-2">
          Date:{" "}
          <span className="font-normal">
            {new Date(transaction?.paymentDate).toDateString()}
          </span>
        </p>
        <p className="text-sm border-b font-semibold py-2">
          Description:{" "}
          <span className="font-normal">
            {transaction?.description || "Transfer"}
          </span>
        </p>
        <p className="text-sm border-b font-semibold py-2">
          Sender: <span className="font-normal">{det?.sender}</span>
        </p>
        <p className="text-sm border-b font-semibold py-2">
          Receiver: <span className="font-normal">{det?.receiver}</span>
        </p>
        <p className="text-sm py-2 font-semibold">
          Status:{" "}
          <span className="font-normal capitalize">{transaction?.status}</span>
        </p>
      </motion.div>
    </div>
  );
}
