import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const BetCreator = ({ address }: { address?: string }) => {
  const { data: hasProfile, isLoading: isProfileCheckLoading } = useScaffoldContractRead({
    contractName: "CountryClub",
    functionName: "checkWalletAddressExists",
    args: [address],
  });

  const { data: profile, isLoading: isProfileLoading } = useScaffoldContractRead({
    contractName: "CountryClub",
    functionName: "getProfileByWalletAddress",
    args: [address],
  });

  return (
    <>
      {isProfileCheckLoading && <div>...</div>}
      {!isProfileLoading && hasProfile && <span className="mr-1">{profile?.username + " "}</span>}
    </>
  );
};
