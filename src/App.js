import { useCallback, useEffect, useState } from "react";

const App = () => {
  const [trxBalance, setTrxBalance] = useState(0);
  console.log("🚀 ~ App ~ trxBalance", trxBalance);
  const [isConnected, setIsConnected] = useState(false);
  console.log("🚀 ~ App ~ isConnected", isConnected);
  const [address, setAddress] = useState("");
  console.log("🚀 ~ App ~ address", address);
  const [walletName, setWalletName] = useState("");
  console.log("🚀 ~ App ~ walletName", walletName);

  const connectToWallet = async () => {
    if (window.tronLink) {
      await window.tronLink.request({ method: "tron_requestAccounts" });
    }

    if (!window.tronWeb) return false;

    const { name, base58 } = window.tronWeb.defaultAddress;

    if (base58) {
      setAddress(base58);
      setWalletName(name || "");
      setIsConnected(true);

      const trxAmount = await window.tronWeb.trx.getBalance(base58);

      setTrxBalance(trxAmount);

      tronLinkEventListener();
      return true;
    }

    setIsConnected(false);
    return false;
  };

  const cleanData = useCallback(() => {
    setTrxBalance(0);
    setIsConnected(false);
    setAddress("");
    setWalletName("");
  }, []);

  const tronLinkEventListener = useCallback(() => {
    window.addEventListener("load", connectToWallet);

    window.addEventListener("message", async (msg) => {
      const { message } = msg.data;

      if (!message) return;

      if (
        message.action === "setAccount" ||
        message.action === "setNode" ||
        message.action === "tabReply" ||
        message.action === "accountsChanged"
      ) {
        if (message.data.address) {
          connectToWallet();
        }

        if (message.action !== "tabReply" && !message.data.address) {
          cleanData();
        }
      }
    });
  }, []);

  // useEffect(() => {
  //   connectToWallet();
  // }, []);

  return (
    <div>
      <button onClick={connectToWallet}>Connect Wallet</button>
    </div>
  );
};
export default App;
