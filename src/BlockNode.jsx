import { useState } from "react";
import { Handle, Position, useNodes, useNodeId, useReactFlow } from "reactflow";
import Hashes from "jshashes";
import { useEffect } from "react";
import {
    Card,
    Text,
    CardBody,
    Tag,
    OrderedList,
    ListItem,
    Tooltip,
    TagLabel,
    Flex,
    Stack,
    CardHeader,
    Heading,
    Box,
} from "@chakra-ui/react";

var MD5 = new Hashes.MD5();

const BlockNode = ({ data }) => {
    const nodeId = useNodeId();
    const nodes = useNodes();
    const { setNodes } = useReactFlow();

    const [hash, setHash] = useState("");
    const [preHash, setPreHash] = useState(0);
    const [nonce, setNonce] = useState(0);
    const [transactions, setTransactions] = useState([]);
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
            setTransactions(data.memPool);
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
                    <Stack spacing="16px">
                        <Box>
                            <Text fontSize="xs">Hash</Text>
                            <Tag size="md" variant="solid" colorScheme="green">
                                <TagLabel>{hash}</TagLabel>
                            </Tag>
                        </Box>
                        <Flex justifyContent="center">
                            <Tag size="md" variant="outline" colorScheme="blue">
                                <TagLabel>=</TagLabel>
                            </Tag>
                        </Flex>
                        <Box>
                            <Text fontSize="xs">Previous Node Hash</Text>
                            <Tag size="md" variant="subtle" colorScheme="cyan">
                                <TagLabel>{preHash}</TagLabel>
                            </Tag>
                        </Box>
                        <Flex justifyContent="center">
                            <Tag size="md" variant="outline" colorScheme="blue">
                                <TagLabel>+</TagLabel>
                            </Tag>
                        </Flex>
                        <Box>
                            <Text fontSize="xs">Nonce</Text>
                            <Tag size="md" variant="subtle" colorScheme="cyan">
                                <TagLabel>{nonce}</TagLabel>
                            </Tag>
                        </Box>
                        <Flex justifyContent="center">
                            <Tag size="md" variant="outline" colorScheme="blue">
                                <TagLabel>+</TagLabel>
                            </Tag>
                        </Flex>
                        <Box>
                            <Text fontSize="xs">Transactions</Text>
                            <Stack>
                                {transactions.map((tx) => (
                                    <Tooltip
                                        key={MD5.hex(JSON.stringify(tx))}
                                        label={JSON.stringify(tx)}
                                    >
                                        <Tag
                                            size="md"
                                            variant="subtle"
                                            colorScheme="cyan"
                                        >
                                            <TagLabel>
                                                {MD5.hex(JSON.stringify(tx))}
                                            </TagLabel>
                                        </Tag>
                                    </Tooltip>
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                </CardBody>
            </Card>

            <Handle type="source" position={Position.Right} />
            <Handle type="target" position={Position.Left} />
        </>
    );
};
export default BlockNode;
