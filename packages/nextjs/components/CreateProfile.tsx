import { useState } from "react";
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
    <div className="flex flex-col mt-6 px-10 py-8 bg-base-100 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
      <span className="text-lg text-white">Choose your username</span>

      <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5">
        <input
          type="text"
          placeholder="bond007"
          className="bg-white p-4 rounded-md text-black w-56"
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
              {!isLoading && <>Create</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
