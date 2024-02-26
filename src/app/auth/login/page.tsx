import { getCurrentUser } from "@/lib/firebase";
import Form from "./Form";
import { redirect } from "next/navigation";

const page = async () => {
  const isAuthenticated = await getCurrentUser().then((user) => {
    if (user?.email) return true;
  });

  // if (isAuthenticated) redirect("/");
  return <Form />;
};

export default page;
