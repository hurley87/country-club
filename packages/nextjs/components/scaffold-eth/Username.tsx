import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const Username = ({ address, displayName }: { address?: string; displayName?: string }) => {
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
    <div className={`flex space-x-2 text-sm`}>
      {isProfileCheckLoading && <div>...</div>}
      {!isProfileLoading && hasProfile && <div className={`flex space-x-2 text-sm mx-2`}>{profile?.username}</div>}
      {!isProfileLoading && !hasProfile && <div className={`flex space-x-2 text-sm mx-2`}>{displayName}</div>}
    </div>
  );
};
