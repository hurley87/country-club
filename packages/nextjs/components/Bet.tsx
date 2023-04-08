import { useEffect, useState } from "react";
import { BetCreator } from "./BetCreator";
import { BetTeam } from "./BetTeam";
import { BigNumber } from "ethers";
import { useAccount } from "wagmi";
import { useScaffoldContractRead, useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import { makeNum } from "~~/utils/helpers/number";

const BET_STATE = ["Created", "Accepted", "Finished", "Cancelled"];

export const Bet = ({ betId }: { betId: BigNumber }) => {
  const { address } = useAccount();
  const { data: bet, isLoading: isBetLoading } = useScaffoldContractRead({
    contractName: "CountryClub",
    functionName: "getBet",
    args: [betId],
  });
  const [betState, setBetState] = useState(BET_STATE[0]);
  const myBet = address === bet?.creator;
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [betValue, setBetValue] = useState("1.0");
  const { writeAsync: cancelBet } = useScaffoldContractWrite({
    contractName: "CountryClub",
    functionName: "cancelBet",
    args: [betId],
    value: "0.0",
  });
  const { writeAsync: acceptBet } = useScaffoldContractWrite({
    contractName: "CountryClub",
    functionName: "acceptBet",
    args: [betId],
    value: betValue,
  });

  useScaffoldEventSubscriber({
    contractName: "CountryClub",
    eventName: "BetCancelled",
    listener: id => {
      console.log(id.toNumber());
      setBetState("Cancelled");
    },
  });
  //   _id, bet.creator, bet.acceptor
  useScaffoldEventSubscriber({
    contractName: "CountryClub",
    eventName: "BetAccepted",
    listener: (id, creator, acceptor) => {
      console.log(id, creator, acceptor);
      setBetState("Accepted");
    },
  });

  useEffect(() => {
    if (bet?.state) setBetState(BET_STATE[bet?.state]);
    if (bet?.odds) setBetValue((Number(bet?.amount.mul(100).div(bet?.odds)) / 100).toString());
  }, [bet?.state, bet?.odds, bet?.amount]);

  async function handleCancelBet() {
    try {
      setIsCancelLoading(true);
      await cancelBet();
    } catch (e) {
      console.log(e);
      setIsCancelLoading(false);
    }
  }

  async function handleAcceptBet() {
    try {
      setIsAcceptLoading(true);
      await acceptBet();
    } catch (e) {
      console.log(e);
      setIsCancelLoading(false);
    }
  }

  bet?.amount && console.log(makeNum(bet?.amount));
  bet?.odds && console.log(makeNum(bet?.odds));
  bet?.amount && console.log(Number(bet?.amount.mul(100).div(bet?.odds)) / 100);
  bet?.amount && console.log((Number(bet?.amount.mul(100).div(bet?.odds)) / 100).toString());
  console.log(betValue);

  return (
    <div className={`flex space-x-2 text-sm`}>
      {isBetLoading && <div>Loading...</div>}
      {!isBetLoading && bet && (
        <div className={`flex space-x-2 text-sm`}>
          <p>
            <BetCreator address={bet?.creator} /> bet {makeNum(bet?.amount)} ETH with {makeNum(bet?.odds)} to 1 odds on{" "}
            {bet?.teamId && <BetTeam teamId={bet.teamId} />}
          </p>
          {myBet && betState === "Created" && (
            <button
              onClick={handleCancelBet}
              className={`${
                isCancelLoading ? "loading before:!w-4 before:!h-4 before:!mx-0" : ""
              } btn btn-primary btn-sm px-2 rounded-full font-normal space-x-2 normal-case`}
            >
              {!isCancelLoading && "Cancel"}
            </button>
          )}
          {betState === "Cancelled" && (
            <button
              disabled={true}
              className={`btn btn-primary btn-sm px-2 rounded-full font-normal space-x-2 normal-case`}
            >
              Cancelled
            </button>
          )}
          {!myBet && betState === "Created" && (
            <button
              onClick={handleAcceptBet}
              className={`btn btn-primary btn-sm px-2 rounded-full font-normal space-x-2 normal-case ${
                isAcceptLoading ? "loading before:!w-4 before:!h-4 before:!mx-0" : ""
              }`}
            >
              Accept for {betValue} ETH
            </button>
          )}
          {betState === "Accepted" && (
            <button
              disabled={true}
              className={`btn btn-primary btn-sm px-2 rounded-full font-normal space-x-2 normal-case`}
            >
              Accepted by <BetCreator address={bet?.acceptor} />
            </button>
          )}
          {betState === "Finished" && (
            <button
              disabled={true}
              className={`btn btn-primary btn-sm px-2 rounded-full font-normal space-x-2 normal-case`}
            >
              Bet won by <BetCreator address={bet?.winner} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
