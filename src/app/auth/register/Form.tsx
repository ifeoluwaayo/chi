"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef } from "react";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { motion } from "framer-motion";
import { createAccount, createWithGoogle } from "../auth";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const Form = () => {
  const form = useRef(null);
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function action(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      return toast({ description: "Please fill in all fields" });
    }

    const res = await createAccount(name, email, password);

    if (res) {
      (form as any)?.current.reset();
      setTimeout(() => router.replace("/"), 1000);
    }
  }

  async function googleAuth() {
    setLoading(true);
    const res = await createWithGoogle();

    if (res) {
      setLoading(false);
      (form as any)?.current.reset();
      router.replace("/");
    }
  }

  return (
    <div className="w-full right-0 -z-10 left-0 absolute top-0 bottom-0 h-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col px-7 py-6 shadow-lg border rounded-2xl bg-white w-fit">
        <h1 className="text-2xl font-semibold">Create Account</h1>
        <p className="text-sm mt-1">
          Kindly enter your email below to continue.
        </p>

        <div className="flex items-center my-4 justify-center">
          <Button
            onClick={googleAuth}
            className="bg-white w-fit transition-all duration-200 hover:scale-95 ease-in-out text-gray-600 hover:text-white hover:bg-black hover:border-black border">
            Continue with Google
          </Button>
        </div>

        <div className="flex items-center gap-2 justify-center">
          <hr className="w-full" />
          <span className="whitespace-nowrap">Or Continue With</span>
          <hr className="w-full" />
        </div>

        <form ref={form} action={action} className="flex flex-col gap-3 mt-4">
          <div>
            <Label htmlFor="email">Name</Label>
            <Input
              name="name"
              className="mt-1"
              placeholder="Enter Name..."
              type="text"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              className="mt-1"
              placeholder="Enter Email..."
              type="email"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <PasswordInput name="password" placeholder="Enter Password..." />
          </div>

          <SubmitBtn loading={loading} />
        </form>

        <p className="mt-4 text-xs text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-black text-sm font-medium">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Form;

function SubmitBtn({ loading }: { loading: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      className="w-full mt-1 bg-black text-white"
      type="submit"
      disabled={pending || loading}>
      {pending ? "Submitting..." : "Submit"}
    </Button>
  );
}

function PasswordInput({
  name,
  placeholder,
}: {
  name: string;
  placeholder: string;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        name={name}
        placeholder={placeholder}
        className="mt-1"
        type={showPassword ? "text" : "password"}
      />
      <button
        type="button"
        className="absolute right-3 bottom-[10px] text-gray-500"
        onClick={() => setShowPassword(!showPassword)}>
        {!showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
      </button>
    </div>
  );
}
