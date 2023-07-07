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
} from "@chakra-ui/react";

import elliptic from "elliptic";
let ec = new elliptic.ec("secp256k1");

const WalletNode = ({ id, data }) => {
    const keyPair = ec.genKeyPair();
    const publicAddress = keyPair.getPublic().encodeCompressed("hex");
    console.log("pub", publicAddress);

    return (
        <>
            <Card variant="outline">
                <CardHeader>
                    <Heading size="md"> {id}</Heading>
                </CardHeader>
                <CardBody>
                    <VStack spacing="24px">
                        <FormControl>
                            <FormLabel>Address</FormLabel>
                            <Input
                                id="address"
                                name="address"
                                className="nodrag"
                                value={publicAddress}
                                disabled
                            />
                        </FormControl>
                    </VStack>
                </CardBody>

                <CardFooter></CardFooter>
            </Card>
        </>
    );
};
export default WalletNode;
