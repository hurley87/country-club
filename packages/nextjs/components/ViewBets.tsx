import { Bet } from "./Bet";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const ViewBets = ({ game }: { game?: any }) => {
  const homeTeamId = game.homeTeamId.toNumber();
  const awayTeamId = game.awayTeamId.toNumber();
  const gameId = game.gameId.toNumber();
  const { data: awayTeam, isLoading: isAwayTeamLoading } = useScaffoldContractRead({
    contractName: "CountryClub",
    functionName: "getTeam",
    args: [awayTeamId],
  });
  const { data: homeTeam, isLoading: isHomeTeamLoading } = useScaffoldContractRead({
    contractName: "CountryClub",
    functionName: "getTeam",
    args: [homeTeamId],
  });
  const { data: bets, isLoading: isBetsLoading } = useScaffoldContractRead({
    contractName: "CountryClub",
    functionName: "getGameBets",
    args: [gameId],
  });

  console.log(bets);

  return (
    <div>
      <label
        htmlFor="view-bets-modal"
        className="btn btn-primary btn-sm px-2 rounded-full font-normal space-x-2 normal-case"
      >
        <BanknotesIcon className="h-4 w-4" />
        <span>View Bets</span>
      </label>
      <input type="checkbox" id="view-bets-modal" className="modal-toggle" />
      <label htmlFor="view-bets-modal" className="modal cursor-pointer">
        <label className="modal-box relative">
          {/* dummy input to capture event onclick on modal box */}
          <input className="h-0 w-0 absolute top-0 left-0" />
          {(isAwayTeamLoading || isHomeTeamLoading) && <h3 className="text-xl font-bold mb-3">...</h3>}
          {!(isAwayTeamLoading || isHomeTeamLoading) && (
            <h3 className="text-xl font-bold mb-3">
              {homeTeam?.name} vs {awayTeam?.name}
            </h3>
          )}

          <label htmlFor="view-bets-modal" className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3">
            ✕
          </label>
          <div className="space-y-1">
            {isBetsLoading && <div className="flex flex-col space-y-3">loading</div>}
            {!isBetsLoading && bets?.length === 0 && <div className="flex flex-col space-y-3">no bets yet</div>}
            {!isBetsLoading && bets && bets.length > 0 && (
              <div className="flex flex-col space-y-0">
                {bets?.map((betId: any, index: number) => (
                  <Bet key={index} betId={betId} />
                ))}
              </div>
            )}
          </div>
        </label>
      </label>
    </div>
  );
};
