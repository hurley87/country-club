import { useState } from "react";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";

export const CreateProfile = ({ address }: { address?: string }) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { writeAsync } = useScaffoldContractWrite({
    contractName: "CountryClub",
    functionName: "createProfile",
    args: [username, address],
    value: "0.0",
  });
  useScaffoldEventSubscriber({
    contractName: "CountryClub",
    eventName: "ProfileCreated",
    listener: (profileCounter, _username, _walletAddress) => {
      console.log(profileCounter, _username, _walletAddress);
      setIsLoading(false);
    },
  });

  const handleCreateProfile = async () => {
    setIsLoading(true);
    await writeAsync();
  };

  return (
    <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
      <span className="text-lg text-black">What is your username?</span>

      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5">
        <input
          type="text"
          placeholder="Write your greeting here"
          className="bg-white p-6 rounded-md text-black"
          onChange={e => setUsername(e.target.value)}
        />
        <div className="flex rounded-full border border-primary p-1 flex-shrink-0">
          <div className="flex rounded-full border-2 border-primary p-1">
            <button
              className={`btn btn-primary rounded-full capitalize font-normal font-white w-24 flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${
                isLoading ? "loading" : ""
              }`}
              disabled={username === ""}
              onClick={handleCreateProfile}
            >
              {!isLoading && (
                <>
                  Send <ArrowSmallRightIcon className="w-3 h-3 mt-0.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
