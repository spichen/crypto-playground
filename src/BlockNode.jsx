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

const BlockNode = () => {
    const nodeId = useNodeId();
    const nodes = useNodes();
    const { setNodes } = useReactFlow();

    const [hash, setHash] = useState("");
    const [text, setText] = useState("");
    const [mineHash, setMineHash] = useState("");
    const [preHash, setPreHash] = useState(0);

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

    const onChange = useCallback((evt) => {
        setText(evt.target.value);
    }, []);

    useEffect(() => {
        setHash(MD5.hex(text + previousNodeHash));
    }, [text]);

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

    useEffect(() => {
        if (previousNodeHash) {
            setPreHash(previousNodeHash);
            setHash(MD5.hex(text + previousNodeHash));
        } else {
            setHash(MD5.hex(text));
        }
    }, [previousNodeHash]);

    function mineData() {
        setMineHash(hash);
    }

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
                            <FormLabel>Data</FormLabel>
                            <Input
                                id="data"
                                name="data"
                                onChange={onChange}
                                className="nodrag"
                            />
                        </FormControl>
                    </VStack>
                </CardBody>

                <CardFooter>
                    {!mineHash && (
                        <Button colorScheme="teal" onClick={mineData}>
                            Mine
                        </Button>
                    )}
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
