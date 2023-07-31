import {
    Card,
    CardBody,
    CardFooter,
    FormControl,
    FormLabel,
    Input,
    VStack,
    CardHeader,
    Heading,
    Button,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { useCallback, useState } from "react";

import elliptic from "elliptic";
let ec = new elliptic.ec("secp256k1");

const WalletNode = ({ id, data }) => {
    const [transactionAmount, setTransactionAmount] = useState("");
    const [toAddress, setToAddress] = useState("");
    const keyPair = ec.genKeyPair();
    const [publicAddress, setPublicAddress] = useState(
        keyPair.getPublic().encodeCompressed("hex")
    );
    const onChange = useCallback((evt) => {
        setTransactionAmount(evt.target.value);
    }, []);

    const { onTransact } = data;

    const proceedTransact = () => {
        onTransact(publicAddress, toAddress, transactionAmount);
    };

    return (
        <>
            <Card variant="outline">
                <CardHeader>
                    <Heading size="md"> {id}</Heading>
                </CardHeader>
                <CardBody>
                    <VStack spacing="24px">
                        <FormControl>
                            <FormLabel>
                                Address
                                <CopyIcon
                                    onClick={() => {
                                        console.log("something ");
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

                            <FormLabel>Amount</FormLabel>
                            <Input
                                id="transactionAmount"
                                name="transactionAmount"
                                className="nodrag"
                                value={transactionAmount}
                                placeholder="transaction amount"
                                onChange={onChange}
                            />
                            <FormLabel>To</FormLabel>
                            <Input
                                id="toAddress"
                                name="toAddress"
                                className="nodrag"
                                placeholder="to address"
                                onChange={(evt) => {
                                    setToAddress(evt.target.value);
                                }}
                            />
                        </FormControl>
                    </VStack>
                </CardBody>

                <CardFooter>
                    <Button
                        colorScheme="teal"
                        size="lg"
                        onClick={proceedTransact}
                    >
                        Proceed Transact
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
};
export default WalletNode;
