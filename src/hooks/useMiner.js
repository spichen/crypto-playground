import { useState, useEffect } from "react";
import Hashes from "jshashes";
var MD5 = new Hashes.MD5();

const useMiner = (lastBlockHash, addBlock) => {
    const [nonce, setNonce] = useState(0);
    const [memPool, setMemPool] = useState([]);
    const [hash, setHash] = useState();

    const addTransactionToMemPool = (transaction) => {
        setMemPool((_memPool) => {
            return [..._memPool, transaction];
        });
    };

    useEffect(() => {
        let intervalID;
        intervalID = setInterval(() => {
            setNonce((nonce) => nonce + 1);
        }, 300);
        return () => clearInterval(intervalID);
    }, []);

    useEffect(() => {
        const hash = MD5.hex(memPool + lastBlockHash + nonce);
        setHash(hash);
        if (hash.charAt(0) === "0") {
            addBlock({
                hash,
                preHash: lastBlockHash,
                nonce,
                transactions: memPool,
            });

            setMemPool([]);
            setNonce(0);
        }
    }, [memPool, nonce]);

    return {
        addTransactionToMemPool,
        miningData: {
            hash,
            lastBlockHash,
            nonce,
            memPool,
        },
    };
};

export default useMiner;
