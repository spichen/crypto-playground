import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Panel,
    ReactFlowProvider,
} from "reactflow";
import BlockNode from "./BlockNode.jsx";
import "reactflow/dist/style.css";
import {
    ChakraProvider,
    Button,
    Icon,
    Link,
    Flex,
    Box,
} from "@chakra-ui/react";
import { BsGithub } from "react-icons/bs";
import WalletNode from "./WalletNode.jsx";

const initialEdges = [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e2-3", source: "2", target: "3" },
];

const nodeTypes = { blockNode: BlockNode, walletNode: WalletNode };

export default function App() {
    const [memPool, setMemPool] = useState([]);
    const onTransact = (from, to, amount) => {
        setMemPool((currentMemPool) => {
            const transaction = { from, to, amount };
            return [...currentMemPool, transaction];
        });
    };

    const addBlockNode = (sets) => {
        const id = generateNewNodeId("blockNode");
        const filteredNode = nodes.filter((item) => item.type === "blockNode");

        const lastNode = filteredNode[filteredNode.length - 1];
        const newNode = {
            id: `block-${id}`,
            position: { x: lastNode.position.x + 300, y: 500 },
            data: { label: `Block ${id}`, memPool, addBlockNode },
            type: "blockNode",
            height: 400,
            width: 100,
        };
        setNodes((nds) => nds.concat(newNode));
    };

    const initialNodes = [
        {
            id: "block-1",
            data: { label: "Block 1", memPool, addBlockNode },
            position: { x: 100, y: 500 },
            type: "blockNode",
        },
    ];

    const initialWalletNode = [
        {
            id: "wallet-1",
            data: { label: "Wallet", onTransact },
            position: { x: 100, y: 50 },
            type: "walletNode",
        },
    ];
    const [nodes, setNodes, onNodesChange] = useNodesState([
        ...initialNodes,
        ...initialWalletNode,
    ]);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const generateNewNodeId = (itemType) => {
        const filteredNode = nodes.filter((item) => item.type === itemType);
        return (filteredNode.length + 1).toString();
    };

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const addWalletNode = () => {
        const id = generateNewNodeId("walletNode");
        const filteredNode = nodes.filter((item) => item.type === "walletNode");

        const lastNode = filteredNode[filteredNode.length - 1];
        const newNode = {
            id: `wallet-${id}`,
            position: { x: lastNode.position.x + 300, y: 50 },
            data: { label: `Wallet ${id}`, onTransact },
            type: "walletNode",
            height: 400,
            width: 100,
        };
        setNodes((nds) => nds.concat(newNode));
    };

    useEffect(() => {
        setNodes((nds) => {
            if (nds) {
                const blockNodes = nds.filter(
                    (node) => node.type === "blockNode"
                );
                const lastBlockNode = blockNodes[blockNodes.length - 1];
                return nds.map((node) => {
                    if (node.id === lastBlockNode.id) {
                        node.data = {
                            ...node.data,
                            memPool,
                        };
                    }
                    return node;
                });
            }
        });
    }, [memPool]);

    useEffect(() => {
        const filteredNode = nodes.filter((item) => item.type === "blockNode");
        const lastBlockNode = filteredNode[filteredNode.length - 1];

        if (lastBlockNode.hash && lastBlockNode.hash.charAt(0) === "0") {
            addBlockNode();
            setMemPool([]);
        }
        const edges = filteredNode.slice(1).map((item) => {
            const index = filteredNode.findIndex((n) => n.id === item.id);
            return {
                id: `e${filteredNode[index - 1].id}-${item.id}`,
                source: filteredNode[index - 1].id,
                target: item.id,
            };
        });
        setEdges(edges);
    }, [nodes]);
    return (
        <ChakraProvider>
            <div style={{ width: "100vw", height: "100vh" }}>
                <ReactFlowProvider>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        fitView
                    >
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
                        <Panel position="bottom-center">
                            <Flex gap={2}>
                                <Button
                                    colorScheme="teal"
                                    size="lg"
                                    onClick={addWalletNode}
                                >
                                    Add Wallet
                                </Button>
                            </Flex>
                        </Panel>
                        <Controls />
                        <MiniMap />
                        <Background variant="dots" gap={12} size={1} />
                        <Box w="30%" p={4}>
                            {memPool.map((item, index) => {
                                return <div key={index}> {item.from}</div>;
                            })}
                        </Box>
                    </ReactFlow>
                </ReactFlowProvider>
            </div>
        </ChakraProvider>
    );
}
