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
    <div className={`flex space-x-2 text-sm`}>
      {(isAwayTeamLoading || isHomeTeamLoading) && <div>Loading...</div>}
      {!(isAwayTeamLoading || isHomeTeamLoading) && (
        <div>
          <p>
            {awayTeam?.name} plays {homeTeam?.name.toString()} {timeFromNow}
          </p>
          <CreateBet game={game} />
          <ViewBets game={game} />
        </div>
      )}
    </div>
  );
};
