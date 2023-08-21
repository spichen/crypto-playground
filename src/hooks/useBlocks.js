import { useState } from "react";

/*
    hash,
    preHash,
    nonce,
    transactions
*/

const useBlocks = () => {
    const [blocks, setBlocks] = useState([]);

    const addBlock = (blockData) => {
        setBlocks((currentBlock) => [...currentBlock, blockData]);
    };

    return {
        addBlock,
        blocks,
    };
};

export default useBlocks;
