"use client";
import { wagmiConfig } from "@/pages";
import { useReadContract } from "wagmi";
import { useWriteContract } from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenA",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_tokenB",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenAAdded",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenBAdded",
        type: "uint256",
      },
    ],
    name: "addLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "ratio",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isTokenA",
        type: "bool",
      },
    ],
    name: "swapTokens",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenA",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenB",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "viewTokenA",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "viewTokenB",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export default function Main() {
  const { data: hash, writeContract } = useWriteContract();

  const formSchemaAdd = z.object({
    tokenA: z.coerce.number().gt(0),
    tokenB: z.coerce.number().gt(0),
  });

  const formAdd = useForm<z.infer<typeof formSchemaAdd>>({
    resolver: zodResolver(formSchemaAdd),
    defaultValues: {
      tokenA: 0,
      tokenB: 0,
    },
  });

  function onSubmitAdd(values: z.infer<typeof formSchemaAdd>) {
    addingTokens(values.tokenA, values.tokenB);
  }

  function addingTokens(tokenA: number, tokenB: number) {
    writeContract({
      address: "0xBfd122b468A36D9E9575C9b2A02cd0d2BCcBf50c",
      abi,
      functionName: "addLiquidity",
      args: [BigInt(tokenA), BigInt(tokenB)],
    });
  }

  const formSchemaSwap = z.object({
    amount: z.coerce.number().gt(0),
    isTokenA: z.string(),
  });

  const formSwap = useForm<z.infer<typeof formSchemaSwap>>({
    resolver: zodResolver(formSchemaSwap),
    defaultValues: {
      amount: 0,
      isTokenA: "true",
    },
  });

  function onSubmitSwap(values: z.infer<typeof formSchemaSwap>) {
    swappingTokens(values.amount, values.isTokenA);
  }

  function swappingTokens(amount: number, isTokenAString: string) {
    const isTokenA = isTokenAString === "true";
    writeContract({
      address: "0xBfd122b468A36D9E9575C9b2A02cd0d2BCcBf50c",
      abi,
      functionName: "swapTokens",
      args: [BigInt(amount), isTokenA],
    });
  }

  function getBalanceA() {
    const { data: balanceTokenA } = useReadContract({
      abi,
      address: "0xBfd122b468A36D9E9575C9b2A02cd0d2BCcBf50c",
      functionName: "viewTokenA",
    });
    return balanceTokenA;
  }

  function getBalanceB() {
    const { data: balanceTokenB } = useReadContract({
      abi,
      address: "0xBfd122b468A36D9E9575C9b2A02cd0d2BCcBf50c",
      functionName: "viewTokenB",
    });
    return balanceTokenB;
  }

  return (
    <div className="flex justify-center items-center">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Not Uniswap</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Balance of Token A: {getBalanceA()?.toString()}</p>
          <p>Balance of Token B: {getBalanceB()?.toString()}</p>
        </CardContent>
        <CardContent>
          <CardTitle>Add Liquidity</CardTitle>
          <Form {...formAdd}>
            <form
              onSubmit={formAdd.handleSubmit(onSubmitAdd)}
              className="space-y-2"
            >
              <FormField
                control={formAdd.control}
                name="tokenA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token A:</FormLabel>
                    <FormControl>
                      <Input placeholder="Amount of Token A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formAdd.control}
                name="tokenB"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token B:</FormLabel>
                    <FormControl>
                      <Input placeholder="Amount of Token B" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
        <CardContent>
          <CardTitle>Swap Tokens</CardTitle>
          <Form {...formSwap}>
            <form
              onSubmit={formSwap.handleSubmit(onSubmitSwap)}
              className="space-y-2"
            >
              <FormField
                control={formSwap.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount of Tokens:</FormLabel>
                    <FormControl>
                      <Input placeholder="Amount of Tokens" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formSwap.control}
                name="isTokenA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token:</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue="true">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Token A</SelectItem>
                        <SelectItem value="false">Token B</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
