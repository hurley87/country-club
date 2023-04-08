import { CreateProfile } from "./CreateProfile";
import { Games } from "./Games";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const Onboarding = ({ address }: { address?: string }) => {
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
      {isProfileCheckLoading && <div>Loading...</div>}
      {!isProfileCheckLoading && hasProfile !== undefined && !hasProfile && <CreateProfile address={address} />}
      {!isProfileLoading && profile && hasProfile && <Games />}
    </div>
  );
};
