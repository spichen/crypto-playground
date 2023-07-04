import React, { useCallback, useEffect, useRef } from "react";
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
import { ChakraProvider, Button } from "@chakra-ui/react";
import WalletNode from "./WalletNode.jsx";
const initialNodes = [
    {
        id: "block-1",
        data: { label: "Block 1" },
        position: { x: 100, y: 400 },
        type: "blockNode",
    },
    {
        id: "block-2",
        data: { label: "Block 2" },
        position: { x: 400, y: 400 },
        type: "blockNode",
    },
    {
        id: "block-3",
        data: { label: "Block 3" },
        position: { x: 700, y: 400 },
        type: "blockNode",
    },
];

const initialEdges = [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e2-3", source: "2", target: "3" },
];

const initialWalletNode = [
    {
        id: "wallet-1",
        data: { label: "Wallet" },
        position: { x: 100, y: 100 },
        type: "walletNode",
    },
];

const nodeTypes = { blockNode: BlockNode, walletNode: WalletNode };

export default function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState([
        ...initialNodes,
        ...initialWalletNode,
    ]);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [walletNode, setWalletNode, onWalletChange] =
        useNodesState(initialWalletNode);

    const generateNewNodeId = (itemType) => {
        const filteredNode = nodes.filter((item) => item.type === itemType);
        return (filteredNode.length + 1).toString();
    };

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );
    const addBlockNode = () => {
        const id = generateNewNodeId("blockNode");
        const filteredNode = nodes.filter((item) => item.type === "blockNode");

        const lastNode = filteredNode[filteredNode.length - 1];
        const newNode = {
            id: `block-${id}`,
            position: { x: lastNode.position.x + 300, y: 400 },
            data: { label: `Block ${id}` },
            type: "blockNode",
            height: 400,
            width: 100,
        };
        setNodes((nds) => nds.concat(newNode));
    };

    const addWalletNode = () => {
        const id = generateNewNodeId("walletNode");
        const filteredNode = nodes.filter((item) => item.type === "walletNode");

        const lastNode = filteredNode[filteredNode.length - 1];
        const newNode = {
            id: `wallet-${id}`,
            position: { x: lastNode.position.x + 300, y: 100 },
            data: { label: `Wallet ${id}` },
            type: "walletNode",
            height: 400,
            width: 100,
        };
        setNodes((nds) => nds.concat(newNode));
    };

    useEffect(() => {
        const filteredNode = nodes.filter((item) => item.type === "blockNode");
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
                    >
                        <Panel position="bottom-center">
                            <Button
                                colorScheme="teal"
                                size="lg"
                                onClick={addBlockNode}
                            >
                                Add Block
                            </Button>
                            <Button
                                colorScheme="teal"
                                size="lg"
                                onClick={addWalletNode}
                            >
                                Add Wallet
                            </Button>
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
