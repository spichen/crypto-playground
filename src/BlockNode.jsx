import { useCallback, useState } from "react";
import { Handle, Position, useNodes, useNodeId, useReactFlow } from "reactflow";
import Hashes from "jshashes";
import { useEffect } from "react";
import {
    Card,
    CardBody,
    CardFooter,
    FormControl,
    FormLabel,
    Badge,
    Input,
    VStack,
    Button,
    CardHeader,
    Heading,
} from "@chakra-ui/react";

var MD5 = new Hashes.MD5();

const BlockNode = ({ data }) => {
    const nodeId = useNodeId();
    const nodes = useNodes();
    const { setNodes } = useReactFlow();

    const [hash, setHash] = useState("");
    const [mineHash, setMineHash] = useState("");
    const [preHash, setPreHash] = useState(0);
    const [nonce, setNonce] = useState(0);
    const thisNodeIndex = nodes.findIndex((node) => node.id === nodeId);

    const findPreviousBlockNode = (currentNodeIndex) => {
        if (currentNodeIndex > -1)
            if (
                nodes[currentNodeIndex - 1] &&
                nodes[currentNodeIndex - 1].type === "blockNode"
            ) {
                return nodes[currentNodeIndex - 1];
            } else {
                return findPreviousBlockNode(currentNodeIndex - 1);
            }
        else return null;
    };

    const previousNode = findPreviousBlockNode(thisNodeIndex);
    const previousNodeHash = previousNode && previousNode.hash;

    useEffect(() => {
        if (!data.isMined) {
            setHash(MD5.hex(data.memPool + previousNodeHash + nonce));
        }
    }, [data.memPool, nonce]);

    useEffect(() => {
        let intervalID;
        if (!data.isMined) {
            intervalID = setInterval(() => {
                setNonce((nonce) => nonce + 1);
            }, 1000);
        }
        return () => clearInterval(intervalID);
    }, [data.isMined]);

    useEffect(() => {
        if (previousNodeHash) setPreHash(previousNodeHash);
    }, [previousNodeHash]);

    useEffect(() => {
        const updatedNodes = nodes.map((node) => {
            if (node.id !== nodeId) {
                return node;
            }
            return {
                ...node,
                hash,
            };
        });

        setNodes(updatedNodes);
    }, [hash]);

    return (
        <>
            <Card variant="outline">
                <CardHeader>
                    <Heading size="md"> {nodeId}</Heading>
                </CardHeader>
                <CardBody>
                    <VStack spacing="24px">
                        <FormControl>
                            <FormLabel>Hash</FormLabel>
                            <Input
                                id="hash"
                                name="hash"
                                className="nodrag"
                                value={hash}
                                disabled
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Previous Block Hash</FormLabel>
                            <Input
                                id="pre-hash"
                                name="pre-hash"
                                value={preHash}
                                className="nodrag"
                                disabled
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Nonce</FormLabel>
                            <Input
                                id="nonce"
                                name="nonce"
                                value={nonce}
                                className="nodrag"
                                disabled
                            />
                        </FormControl>
                    </VStack>
                </CardBody>

                <CardFooter>
                    {mineHash && (
                        <div>
                            {hash === mineHash ? (
                                <Badge colorScheme="green">Valid</Badge>
                            ) : (
                                <Badge colorScheme="red">Invalid</Badge>
                            )}
                        </div>
                    )}
                </CardFooter>
            </Card>

            <Handle type="source" position={Position.Right} />
            <Handle type="target" position={Position.Left} />
        </>
    );
};
export default BlockNode;
