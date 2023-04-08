import { CreateBet } from "./CreateBet";
import { ViewBets } from "./ViewBets";
import moment from "moment";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const Game = ({ game }: { game?: any }) => {
  const { data: awayTeam, isLoading: isAwayTeamLoading } = useScaffoldContractRead({
    contractName: "CountryClub",
    functionName: "getTeam",
    args: [game.awayTeamId.toNumber()],
  });
  const { data: homeTeam, isLoading: isHomeTeamLoading } = useScaffoldContractRead({
    contractName: "CountryClub",
    functionName: "getTeam",
    args: [game.homeTeamId.toNumber()],
  });
  const timeFromNow = moment.unix(game.startTime.toNumber()).format("MMMM Do [at] h:mm a");

  return (
    <div className={`flex text-md px-10`}>
      {(isAwayTeamLoading || isHomeTeamLoading) && <div>Loading...</div>}
      {!(isAwayTeamLoading || isHomeTeamLoading) && (
        <div className="w-full max-w-6xl border-2 border-white rounded-md shadow-sm p-4">
          <p className="text-xl my-0">
            {awayTeam?.name} vs {homeTeam?.name.toString()}
          </p>
          <p className="mt-1">{timeFromNow}</p>
          <div className="flex gap-2">
            {" "}
            <CreateBet game={game} />
            <ViewBets game={game} />
          </div>
        </div>
      )}
    </div>
  );
};
