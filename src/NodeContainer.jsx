import React, { useCallback, useEffect, useRef } from "react";
import ReactFlow, {
    ReactFlowProvider,
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

const NodeContainer = (props) => {
    const elements = [
        {
            id: props.id.toString().concat("1"),
            data: { label: "Input Node".concat(props.id.toString()) },
            position: { x: 250, y: 25 },
        },
    ];
    return (
        <ChakraProvider>
            <ReactFlowProvider>
                <ReactFlow elements={elements}>
                    <Panel position="bottom-center">
                        <Button colorScheme="teal" size="lg" onClick={addBlock}>
                            Add Block
                        </Button>
                    </Panel>
                    <Controls />
                    <MiniMap />
                    <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
            </ReactFlowProvider>
        </ChakraProvider>
    );
};

export default NodeContainer;
