import { wagmiConfig } from "@/pages";
import { readContract } from "@wagmi/core";

export async function Main() {
  async function getBalanceA() {
    const balanceTokenA = await readContract(wagmiConfig, {
      abi,
      address: "0xBfd122b468A36D9E9575C9b2A02cd0d2BCcBf50c",
      functionName: "viewTokenA",
    });
  }

  //   return <div>{/* <div>Balance: {balanceTokenA?.toString()}</div> */}</div>;
}
