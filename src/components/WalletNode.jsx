import {
    Card,
    CardBody,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    CardHeader,
    Heading,
    Button,
    StackDivider,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { useCallback, useState } from "react";

import elliptic from "elliptic";
import useBalance from "../hooks/useBalance";
let ec = new elliptic.ec("secp256k1");

/*
 pubKey, transfer
*/
const WalletNode = ({ id, data }) => {
    const [transactionAmount, setTransactionAmount] = useState("");
    const [toAddress, setToAddress] = useState("");
    const onChange = useCallback((evt) => {
        setTransactionAmount(evt.target.value);
    }, []);
    const { transfer, publicAddress } = data;

    const { getBalance } = useBalance(publicAddress)

    const proceedTransact = () => {
        transfer(toAddress, transactionAmount);
    };

    return (
        <>
            <Card variant="outline">
                <CardHeader>
                    <Heading size="md" noOfLines={1}>
                        Wallet {getBalance()}
                    </Heading>
                </CardHeader>
                <CardBody>
                    <Stack divider={<StackDivider />} spacing="24px">
                        <FormControl>
                            <FormLabel>
                                Address{" "}
                                <CopyIcon
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            publicAddress
                                        );
                                    }}
                                />
                            </FormLabel>
                            <Input
                                id="address"
                                name="address"
                                className="nodrag"
                                value={publicAddress}
                                disabled
                            />
                        </FormControl>
                        <Box>
                            <Stack spacing="16px">
                                <Heading size="sm">Transfer</Heading>
                                <Input
                                    id="toAddress"
                                    name="toAddress"
                                    className="nodrag"
                                    placeholder="To"
                                    onChange={(evt) => {
                                        setToAddress(evt.target.value);
                                    }}
                                />
                                <Input
                                    id="transactionAmount"
                                    name="transactionAmount"
                                    className="nodrag"
                                    value={transactionAmount}
                                    placeholder="Amount"
                                    onChange={onChange}
                                />
                                <Button
                                    colorScheme="teal"
                                    size="md"
                                    onClick={proceedTransact}
                                >
                                    Transfer
                                </Button>
                            </Stack>
                        </Box>
                    </Stack>
                </CardBody>
            </Card>
        </>
    );
};
export default WalletNode;
