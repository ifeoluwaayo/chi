import { chi } from "@/lib/chimoney";
import Details from "./Details";
import { authenticate } from "@/app/actions";

const Page = async ({ params: { id } }: { params: { id: string } }) => {
  const user = await authenticate();
  const transaction = await chi(
    `/accounts/issue-id-transactions?issueID=${id}`,
    {
      body: {
        subAccount: user?.id,
      },
    }
  );

  return (
    <Details
      transaction={{
        ...transaction?.data[0],
        paymentType:
          transaction?.data[0]?.receiver === user?.id ? "credit" : "debit",
      }}
    />
  );
};

export default Page;
