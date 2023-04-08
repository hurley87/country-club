import { BigNumber } from "ethers";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const BetTeam = ({ teamId }: { teamId: BigNumber }) => {
  const { data: team, isLoading: isTeamLoading } = useScaffoldContractRead({
    contractName: "CountryClub",
    functionName: "getTeam",
    args: [teamId],
  });

  return (
    <>
      {isTeamLoading && <span>...</span>}
      {!isTeamLoading && <span>{team?.name}</span>}
    </>
  );
};
