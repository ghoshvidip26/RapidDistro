import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import { Zap } from "lucide-react";
import SendTransactionCard from "../components/SendTransactionCard";
import TransferAmount from "../components/TransferAmount";

async function verifyToken() {
  const url = "/api/verify";
  const accessToken = await getAccessToken();
  const result = await fetch(url, {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined),
    },
  });

  return await result.json();
}

export default function DashboardPage() {
  const [verifyResult, setVerifyResult] = useState();
  const router = useRouter();
  const {
    ready,
    authenticated,
    user,
    logout,
    linkEmail,
    linkWallet,
    unlinkEmail,
    linkPhone,
    unlinkPhone,
    unlinkWallet,
    linkGoogle,
    unlinkGoogle,
    linkTwitter,
    unlinkTwitter,
    linkDiscord,
    unlinkDiscord,
  } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  const numAccounts = user?.linkedAccounts?.length || 0;
  const canRemoveAccount = numAccounts > 1;

  return (
    <>
      <Head>
        <title>Dashboard · RapidDistro</title>
      </Head>

      <main className="relative flex flex-col min-h-screen bg-black text-white">
        {/* Top Navbar */}
        <header className="w-full flex items-center justify-between p-5 backdrop-blur-md bg-black/50 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyan-400" />
            <span className="text-lg font-semibold">RapidDistro</span>
          </div>
          <button
            onClick={logout}
            className="text-sm bg-cyan-600 hover:bg-cyan-500 text-black py-2 px-4 rounded-lg transition"
          >
            Logout
          </button>
        </header>
        <SendTransactionCard/>
        <TransferAmount/>
      </main>
    </>
  );
}