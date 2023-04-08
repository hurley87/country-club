import { Game } from "./Game";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const Games = () => {
  const { data: games, isLoading: isGamesLoading } = useScaffoldContractRead({
    contractName: "CountryClub",
    functionName: "getGames",
  });

  return (
    <div className={`flex flex-col`}>
      {isGamesLoading && <div>Loading...</div>}
      {!isGamesLoading && games?.map((game: any) => <Game key={game.gameId.toNumber()} game={game} />)}
    </div>
  );
};
