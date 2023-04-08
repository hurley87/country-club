import { useState } from "react";
import { EtherInput } from "./scaffold-eth";
import { BanknotesIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractRead, useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import { makeBig } from "~~/utils/helpers/number";

export const CreateBet = ({ game }: { game?: any }) => {
  const homeTeamId = game.homeTeamId.toNumber();
  const awayTeamId = game.awayTeamId.toNumber();
  const gameId = game.gameId.toNumber();
  const [teamId, setTeamId] = useState(homeTeamId);
  const [odds, setOdds] = useState<number>(1);
  const [betValue, setBetValue] = useState("1.0");
  const [betId, setBetId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "CountryClub",
    functionName: "createBet",
    args: [gameId, makeBig(odds), teamId],
    value: betValue,
  });

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

  useScaffoldEventSubscriber({
    contractName: "CountryClub",
    eventName: "BetCreated",
    listener: (id, amount, odds, teamId, creator) => {
      console.log("ok");
      console.log(id.toNumber());
      console.log(id, amount, odds, teamId, creator);
      setBetId(id.toNumber());
      setIsLoading(false);
    },
  });

  console.log(betId);

  async function handleCreateBet() {
    setIsLoading(true);
    await writeAsync();
  }

  return (
    <div>
      <label
        htmlFor="create-bet-modal"
        className="btn btn-primary btn-sm px-2 rounded-full font-normal space-x-2 normal-case"
      >
        <RocketLaunchIcon className="h-4 w-4" />
        <span>Place Bet</span>
      </label>
      <input type="checkbox" id="create-bet-modal" className="modal-toggle" />
      <label htmlFor="create-bet-modal" className="modal cursor-pointer">
        <label className="modal-box relative">
          {/* dummy input to capture event onclick on modal box */}
          <input className="h-0 w-0 absolute top-0 left-0" />
          <h3 className="text-xl font-bold mb-3">Place Bet</h3>
          <label htmlFor="create-bet-modal" className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3">
            ✕
          </label>
          <div className="space-y-3">
            <div className="flex flex-col space-y-3">
              {!(isHomeTeamLoading || isAwayTeamLoading) && (
                <div className="flex flex-row gap-2 w-full max-w-7xl pb-1 flex-wrap">
                  <button
                    className={`btn btn-secondary btn-sm normal-case font-thin ${
                      teamId === homeTeamId ? "bg-base-300" : "bg-base-100"
                    }`}
                    onClick={() => setTeamId(homeTeamId)}
                  >
                    {homeTeam?.name}
                  </button>
                  <button
                    className={`btn btn-secondary btn-sm normal-case font-thin ${
                      teamId === awayTeamId ? "bg-base-300" : "bg-base-100"
                    }`}
                    onClick={() => setTeamId(awayTeamId)}
                  >
                    {awayTeam?.name}
                  </button>
                </div>
              )}
              <EtherInput placeholder="Amount to bet" value={betValue} onChange={value => setBetValue(value)} />
              <div className="flex flex-row gap-2 w-full max-w-7xl pb-1 flex-wrap">
                <button
                  className={`btn btn-secondary btn-sm normal-case font-thin ${
                    odds === 1 ? "bg-base-300" : "bg-base-100"
                  }`}
                  onClick={() => setOdds(1)}
                >
                  1 to 1
                </button>
                <button
                  className={`btn btn-secondary btn-sm normal-case font-thin ${
                    odds === 2 ? "bg-base-300" : "bg-base-100"
                  }`}
                  onClick={() => setOdds(2)}
                >
                  2 to 1
                </button>
                <button
                  className={`btn btn-secondary btn-sm normal-case font-thin ${
                    odds === 3 ? "bg-base-300" : "bg-base-100"
                  }`}
                  onClick={() => setOdds(3)}
                >
                  3 to 1
                </button>
              </div>
              <button
                className={`h-10 btn btn-primary btn-sm px-2 rounded-full space-x-3 ${
                  isLoading ? "loading before:!w-4 before:!h-4 before:!mx-0" : ""
                }`}
                onClick={handleCreateBet}
                disabled={isLoading}
              >
                {!isLoading && <BanknotesIcon className="h-6 w-6" />}
                {!isLoading && <span>Bet</span>}
              </button>
            </div>
          </div>
        </label>
      </label>
    </div>
  );
};
