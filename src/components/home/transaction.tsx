"use client";
import Image from "next/image";
import Link from "next/link";
import ReactTimeago from "react-timeago";

export const Transaction = ({ t }: { t: any }) => {
  // console.log(t);
  return (
    <Link
      href={`/transaction/${t.issueID}`}
      suppressHydrationWarning
      prefetch={false}
      className="py-1 px-3 flex items-center w-full flex-1 justify-between">
      <div className="flex items-center">
        <Image
          src={
            t.paymentType === "credit"
              ? "/transaction/sent.svg"
              : "/transaction/received.svg"
          }
          width={50}
          height={50}
          alt="Transaction"
          className={`rounded-full p-2 ${
            t?.paymentType === "credit" ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <div className="flex flex-col ml-5">
          <h3 className="text-lg font-semibold">
            You {t?.paymentType === "credit" ? "received" : "sent"} $
            {t?.valueInUSD}
          </h3>
          <p className="text-xs font-light">
            {t?.paymentType === "credit" ? "Received" : "Sent"}{" "}
            <span className="">
              <ReactTimeago date={t?.paymentDate} />
            </span>
          </p>
        </div>
      </div>
      <p
        className={`${
          t?.paymentType === "credit" ? "bg-green-500" : "bg-red-500"
        } capitalize rounded-2xl text-white text-xs px-2 py-1`}>
        {t?.paymentType}ed ${t?.valueInUSD}
      </p>
    </Link>
  );
};
