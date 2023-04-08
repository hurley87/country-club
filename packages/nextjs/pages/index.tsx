import Head from "next/head";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Nav } from "~~/components/Nav";
import { Onboarding } from "~~/components/Onboarding";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address } = useAccount();
  return (
    <>
      <Head>
        <title>Royal Country Club</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
      </Head>
      <Nav />

      <div className="flex items-center flex-col flex-grow pt-10">
        {address ? <Onboarding address={address} /> : <RainbowKitCustomConnectButton />}
      </div>
    </>
  );
};

export default Home;
