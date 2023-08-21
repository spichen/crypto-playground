import React from "react";
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    Panel,
    ReactFlowProvider,
} from "reactflow";
import BlockNode from "./components/BlockNode.jsx";
import "reactflow/dist/style.css";
import {
    Heading,
    ChakraProvider,
    Button,
    Icon,
    Link,
    Flex,
    Highlight,
} from "@chakra-ui/react";
import { BsGithub } from "react-icons/bs";
import WalletNode from "./components/WalletNode.jsx";
import useBlocks from "./hooks/useBlocks.js";
import useWallets from "./hooks/useWallets.js";
import useMiner from "./hooks/useMiner.js";
import useCryptoNodes from "./hooks/useCryptoNodes.js";
import MinerNode from "./components/MinerNode.jsx";

const nodeTypes = {
    blockNode: BlockNode,
    walletNode: WalletNode,
    minerNode: MinerNode,
};

export default function App() {
    const { blocks, addBlock } = useBlocks();
    const { addTransactionToMemPool, miningData } = useMiner(
        blocks.length ? blocks[blocks.length - 1].hash : 0,
        addBlock
    );
    const { generateWallet, wallets } = useWallets(addTransactionToMemPool);

    const { nodes, onNodesChange, edges, onEdgesChange } = useCryptoNodes(
        blocks,
        wallets,
        miningData
    );

    return (
        <ChakraProvider>
            <div style={{ width: "100vw", height: "100vh" }}>
                <ReactFlowProvider>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <Panel position="top-left">
                            <Flex align="center">
                                <Heading as="h2" size="xl">
                                    Crypto{" "}
                                    <Highlight
                                        query="spotlight"
                                        styles={{
                                            px: "2",
                                            py: "1",
                                            rounded: "full",
                                            bg: "red.100",
                                        }}
                                    >
                                        Playground
                                    </Highlight>
                                </Heading>

                                <Button
                                    colorScheme="teal"
                                    size="sm"
                                    onClick={generateWallet}
                                    marginLeft="16px"
                                >
                                    Add Wallet
                                </Button>
                            </Flex>
                        </Panel>
                        <Panel position="top-right">
                            <Flex
                                justifyContent="right"
                                minWidth="max-content"
                                margin="3"
                            >
                                <Link
                                    href="https://github.com/Mubeena17/blockchain-visualized"
                                    isExternal
                                >
                                    <Icon as={BsGithub} w={8} h={8} />
                                </Link>
                            </Flex>
                        </Panel>
                        <Controls />
                        <MiniMap />
                        <Background variant="dots" gap={12} size={1} />
                    </ReactFlow>
                </ReactFlowProvider>
            </div>
        </ChakraProvider>
    );
}
