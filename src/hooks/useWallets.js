import { useState } from "react";
import elliptic from "elliptic";
import Hashes from "jshashes";
var MD5 = new Hashes.MD5();
let ec = new elliptic.ec("secp256k1");

const useWallets = (addTransactionToMemPool) => {
    const [wallets, setWallets] = useState([]);

    const generateWallet = () => {
        const keyPair = ec.genKeyPair();
        const publicAddress = keyPair.getPublic().encodeCompressed("hex");
        const wallet = {
            publicAddress,
            transfer: (to, amount) => {
                addTransactionToMemPool({
                    txid: MD5.hex(
                        JSON.stringify({ publicAddress, to, amount })
                    ),
                    from: publicAddress,
                    to,
                    amount,
                });
            },
        };
        setWallets((_wallets) => [..._wallets, wallet]);
    };
    return {
        generateWallet,
        wallets,
    };
};

export default useWallets;
