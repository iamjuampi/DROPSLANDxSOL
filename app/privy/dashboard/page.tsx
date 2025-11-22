import { usePrivy, useWallets, useSendTransaction } from "@privy-io/react-auth";
import { ethers } from "ethers";

export default function Dashboard() {
  const { ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const { sendTransaction } = useSendTransaction();

  if (!ready) return <div>Loading…</div>;
  if (!authenticated) return <div>Please login</div>;

  const address = wallets[0]?.address;

  const onSend = async () => {
    if (!wallets[0]) return;
    await sendTransaction({
      to: "0xReceiverAddressHere",
      value: ethers.parseEther("0.01"),
      from: address,
    });
  };

  return (
    <div>
      <p>User: {user?.id}</p>
      <p>Address: {address}</p>
      <button onClick={onSend}>Send 0.01 ETH</button>
    </div>
  );
}
