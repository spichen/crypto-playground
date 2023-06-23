import React, { useCallback, useEffect, useRef } from "react";
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Panel,
} from "reactflow";
import BlockNode from "./BlockNode.jsx";
import "reactflow/dist/style.css";
import { ChakraProvider, Button } from "@chakra-ui/react";

const initialNodes = [
    {
        id: "1",
        data: { label: "Block 1" },
        position: { x: 100, y: 400 },
        type: "blockNode",
    },
    {
        id: "2",
        data: { label: "Block 2" },
        position: { x: 400, y: 400 },
        type: "blockNode",
    },
    {
        id: "3",
        data: { label: "Block 3" },
        position: { x: 700, y: 400 },
        type: "blockNode",
    },
];

const initialEdges = [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e2-3", source: "2", target: "3" },
];

const nodeTypes = { blockNode: BlockNode };

export default function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const getId = () => {
        return (nodes.length + 1).toString();
    };

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );
    const addBlock = () => {
        const id = getId();
        const newNode = {
            id,
            position: { x: id * 300 - 200, y: 400 },
            data: { label: `Block ${id}` },
            type: "blockNode",
            height: 400,
            width: 100,
        };
        setNodes((nds) => nds.concat(newNode));
    };

    useEffect(() => {
        const edges = nodes.slice(1).map((item) => {
            const index = nodes.findIndex((n) => n.id === item.id);
            return {
                id: `e${nodes[index - 1].id}-${item.id}`,
                source: nodes[index - 1].id,
                target: item.id,
            };
        });
        setEdges(edges);
    }, [nodes]);
    return (
        <ChakraProvider>
            <div style={{ width: "100vw", height: "100vh" }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                >
                    <Panel position="bottom-center">
                        <Button colorScheme="teal" size="lg" onClick={addBlock}>
                            Add Block
                        </Button>
                    </Panel>
                    <Controls />
                    <MiniMap />
                    <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
            </div>
        </ChakraProvider>
    );
}
