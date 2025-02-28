import { useLogin } from "@privy-io/react-auth";
import { PrivyClient } from "@privy-io/server-auth";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Zap, Wallet, Globe, Coins, Bitcoin } from "lucide-react";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookieAuthToken = req.cookies["privy-token"];
  if (!cookieAuthToken) return { props: {} };

  const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;
  const client = new PrivyClient(PRIVY_APP_ID!, PRIVY_APP_SECRET!);

  try {
    const claims = await client.verifyAuthToken(cookieAuthToken);
    return {
      props: {},
      redirect: { destination: "/dashboard", permanent: false },
    };
  } catch (error) {
    return { props: {} };
  }
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useLogin({
    onComplete: () => router.push("/dashboard"),
  });

  const floatingIcons = [Wallet, Globe, Coins, Bitcoin];

  return (
    <>
      <Head>
        <title>Login · RapidDistro</title>
      </Head>

      <main className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden">
        <header className="absolute top-0 left-0 w-full flex items-center justify-between p-5 backdrop-blur-md bg-black/50 border-b border-neutral-800 z-20">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyan-400" />
            <span className="text-white text-lg font-semibold">RapidDistro</span>
          </div>
          <button className="text-neutral-400 text-sm hover:text-white transition">
            About
          </button>
        </header>

        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {Array.from({ length: 8 }).map((_, idx) => {
            const Icon = floatingIcons[idx % floatingIcons.length];
            return (
              <div
                key={idx}
                className="absolute text-cyan-500 opacity-60"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  transform: `scale(${0.6 + Math.random() * 0.6})`,
                  filter: "blur(5px)",
                }}
              >
                <Icon className="w-20 h-20" />
              </div>
            );
          })}
        </div>

        <div className="relative z-10 bg-neutral-900 text-white p-8 rounded-2xl shadow-xl w-[90%] max-w-md border border-neutral-800">

          <div className="flex items-center gap-3 justify-center">
            <Zap className="w-8 h-8 text-cyan-400" />
            <h1 className="text-xl font-semibold tracking-wide">RapidDistro</h1>
          </div>

          <p className="mt-4 text-center text-neutral-400">
            Welcome back! Please log in to continue.
          </p>

          <button
            className="w-full mt-6 py-3 bg-cyan-500 text-black font-medium rounded-lg hover:bg-cyan-400 transition-all"
            onClick={login}
          >
            Log in with Privy
          </button>

          <p className="mt-4 text-center text-xs text-neutral-600">
            By logging in, you agree to our{" "}
            <a href="#" className="underline hover:text-cyan-400">
              Terms of Service
            </a>
            .
          </p>
        </div>
      </main>
    </>
  );
}