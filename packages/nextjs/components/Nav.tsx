import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

export const Nav = () => {
  return (
    <div className="sticky lg:static top-0 navbar bg-gray-900 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary">
      <div className="navbar-start w-auto">
        <div className="flex items-center gap-2 ml-4 mr-6">
          <Link href="/" passHref className="flex relative w-10 h-10">
            <Image alt="SE2 logo" className="cursor-pointer rounded-md" fill src="/logo.png" />
          </Link>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">Country Club</span>
            <span className="text-xs">P2P Sports Betting</span>
          </div>
        </div>
      </div>
      <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
      </div>
    </div>
  );
};
