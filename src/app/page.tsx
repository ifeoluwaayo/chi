import { chi } from "@/lib/chimoney";
import Balance from "@/components/home/balance";
import Transactions from "@/components/home/transactions";
import Image from "next/image";
import { authenticate } from "./actions";

export default async function Home() {
  await authenticate();

  return (
    <div>
      <div className="flex gap-6">
        <Balance />
        <Rates />
      </div>
      <Transactions />
    </div>
  );
}

async function Rates() {
  const rates = await chi("/info/exchange-rates", {}).then((res) => {
    let data = {
      usd: res.data.USDNGN,
      cad: res.data.CADNGN,
      btc: res.data.USDBTC,
      xau: res.data.USDXAU,
    };

    return data;
  });

  function Rate({
    rate,
    image,
    title,
  }: {
    rate: number;
    image: string;
    title: string;
  }) {
    return (
      <div className="items-center hidden md:flex justify-start gap-2">
        <Image
          src={image}
          width={25}
          height={25}
          alt="USD"
          className="h-[20px] w-[20px] rounded-full object-cover"
        />
        <h3 className="text-center w-fit text-gray-600 text-xs max-w-[270px]">
          <span className="font-semibold mr-2">{title}</span>
          {rate}
        </h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      <h3 className="whitespace-nowrap text-lg font-medium">
        Today&apos;s Rates 🔥
      </h3>

      <div className="flex flex-col gap-2">
        <Rate rate={rates.usd} image="/usd.jpeg" title="USD/NGN" />
        <Rate rate={rates.cad} image="/cad.jpeg" title="USD/CAD" />
        <Rate rate={rates.btc} image="/btc.jpeg" title="USD/BTC" />
        <Rate rate={rates.xau} image="/xau.jpeg" title="USD/XAU" />
      </div>
    </div>
  );
}
