"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { chi } from "@/lib/chimoney";
import { Banks } from "@/components/banks";
import { send } from "../actions";

const Withdraw = () => {
  const router = useRouter();
  const action = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [transaction, setTransaction] = useState({
    amount: 0 as string | number,
    bank: { id: 0, code: "", name: "" },
    accountName: "",
    accountNumber: "",
    chiId: "",
  });
  const [error, setError] = useState("");
  const [localAmount, setLocalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsOpen(action.get("withdraw") === "true");
  }, [action]);

  function goBack() {
    router.back();
    setTransaction({
      amount: 0,
      bank: { id: 0, code: "", name: "" },
      accountName: "",
      accountNumber: "",
      chiId: "",
    });
    setError("");
    setLocalAmount(0);
  }

  useEffect(() => {
    async function getLocalValue() {
      const amount = await chi(
        `/info/usd-amount-in-local?destinationCurrency=NGN&amountInUSD=${transaction.amount}`,
        {}
      ).then((res) => {
        return res?.data?.amountInDestinationCurrency;
      });

      setLocalAmount(amount);
    }

    getLocalValue();
  }, [transaction.amount]);

  async function verifyBank() {
    if (transaction.bank.id === 0) {
      const res = await chi(`/sub-account/list`, {});
      const details = res?.data?.find(
        (d: any) => d.email === transaction.accountNumber.trim()
      );

      if (details) {
        setError("");
        setTransaction({
          ...transaction,
          accountName: details.name,
          chiId: details.id,
        });
      } else {
        setError("User not found");
      }
    } else {
      const res = await chi(`/info/verify-bank-account-number`, {
        isProd: true,
        body: {
          verifyAccountNumbers: [
            {
              countryCode: "NG",
              account_bank: transaction?.bank?.code,
              account_number: transaction?.accountNumber,
            },
          ],
        },
      });

      if (res?.status === "success") {
        setError("");
        setTransaction({
          ...transaction,
          accountName: res.data[0].account_name,
        });
      } else {
        setError(res?.error);
      }
    }
  }

  useEffect(() => {
    if (transaction.bank.id !== 0 && transaction.accountNumber.length === 10) {
      verifyBank();
    } else if (
      transaction.bank.id === 0 &&
      transaction.accountNumber.length > 5
    ) {
      verifyBank();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction.accountNumber, transaction.bank]);

  async function transfer() {
    setLoading(true);

    const res = await send({
      receiver: transaction.chiId,
      amount: transaction.amount as number,
    });

    setLoading(false);

    if (res?.status === "success") {
      if (res?.data?.data[0]?.issueID) {
        router.push(`/transaction/${res?.data?.data[0]?.issueID}`);
      } else goBack();
    } else {
      setError(res?.error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={goBack}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Money</DialogTitle>
          <DialogDescription>Withdraw funds from wallet</DialogDescription>
        </DialogHeader>
        <div className="flex items-end space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="name" className="">
              Bank
            </Label>
            <Banks
              bank={transaction.bank}
              setBank={(e) => setTransaction({ ...transaction, bank: e })}
            />
          </div>
        </div>
        <div className="flex items-end space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="email" className="">
              {transaction.bank.id === 0 ? "Email" : "Account Number"}
            </Label>
            <Input
              id="email"
              onChange={(e) =>
                setTransaction({
                  ...transaction,
                  accountNumber: e.target.value,
                })
              }
              value={transaction.accountNumber}
              placeholder={
                transaction.bank.id === 0
                  ? "Enter Email..."
                  : "Enter Account Number..."
              }
              type={transaction.bank.id === 0 ? "email" : "text"}
              maxLength={transaction.bank.id === 0 ? 100 : 10}
            />
            {transaction.accountName !== "" && (
              <p className="text-sm uppercase">{transaction.accountName}</p>
            )}
            {error !== "" && transaction.accountName == "" && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </div>
        </div>
        <div className="flex items-end space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="amount" className="">
              Amount (USD)
            </Label>
            <Input
              id="amount"
              type="text"
              placeholder="Enter Amount..."
              value={transaction.amount}
              className="appearance-none"
              onChange={(e) =>
                setTransaction({
                  ...transaction,
                  amount: parseFloat(e.target.value) || 0,
                })
              }
            />
            <p className="text-xs">
              Approx ≈ ₦{localAmount?.toLocaleString() || 0}
            </p>
          </div>
        </div>
        <DialogFooter className="flex items-center justify-between">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            className=""
            disabled={!transaction.accountName || !transaction.amount}
            onClick={transfer}>
            {loading ? "Transfering..." : "Transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Withdraw;
