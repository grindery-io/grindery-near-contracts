require('dotenv').config();
const { connect, keyStores, nearConnection, transactions, utils, KeyPair, KeyPairEd25519 } = require("near-api-js");
const path = require("path");
const homedir = require("os").homedir();


async function createAccount(networkId: string, subAccountName: string) {
    
    // const networkId = "testnet";
    // const subAccountName = "test10";

    const grinderyAccountId = process.env.NEAR_ACCOUNT_ID;
    const subAccountId = subAccountName + "." + grinderyAccountId;

    const keystore = new keyStores.InMemoryKeyStore();

    const grinderyKeyPair = await KeyPair.fromString(process.env.PRIVATE_KEY);
    await keystore.setKey(networkId, grinderyAccountId, grinderyKeyPair);

    const grinderyAccount = await nearGetAccount(networkId, grinderyAccountId, keystore);
    const grinderySubAccount = await nearGetAccount(networkId, subAccountId, keystore);
 
    try {
        await grinderySubAccount.state();
    } catch (error) {
        console.log("New Grindery subaccount does not exist and will be created");
        const subKeyPair = await KeyPair.fromRandom('ed25519');
        const subPublicKey = await subKeyPair.getPublicKey();
        await grinderyAccount.createAccount(subAccountId, subPublicKey, await utils.format.parseNearAmount('1'));
        await keystore.setKey(networkId, subAccountId, subKeyPair);
        await grinderySubAccount.addKey(await grinderyKeyPair.getPublicKey());
        console.log("New Grindery subaccount created with account id: " + subAccountId);
    }

}

const args = process.argv.slice(2);
createAccount(args[0], args[1]);

/**
 * It connects to the NEAR blockchain and returns the account object for the given grinderyAccountId
 * @param {string} chain - The name of the chain you want to connect to.
 * @param {string | undefined} grinderyAccountId - The account ID of the account you want to get information
 * about.
 * @returns The account object.
 */
 export async function nearGetAccount(networkId, grinderyAccountId: string | undefined, keyStore: any) {

    const config = {
        networkId,
        keyStore,
        nodeUrl: `https://rpc.${networkId}.near.org`,
        walletUrl: `https://wallet.${networkId}.near.org`,
        helperUrl: `https://helper.${networkId}.near.org`,
        explorerUrl: `https://explorer.${networkId}.near.org`,
    };
    const near = await connect({ ...config, keyStore });
    return await near.account(grinderyAccountId);
}
