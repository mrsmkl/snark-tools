
import { utils } from '@nevermined-io/nevermined-sdk-js'

const { makeKey, secretToPublic, makePublic, encryptKey, ecdh, prove, hashKey } = utils

async function main() {
    let providerK = makeKey(process.argv[2])
    let providerPub = secretToPublic(providerK)
    let data = Buffer.from(process.argv[3].substr(2), 'hex')
    let buyerPub = makePublic(process.argv[4], process.argv[5])
    const cipher = encryptKey(data, ecdh(providerK, buyerPub))
    const proof = await prove(buyerPub, providerPub, providerK, data)
    const hash = hashKey(data)
    console.log("HASH", hash)
    console.log("CIPHER", cipher.x, cipher.y)
    console.log("PROOF", proof)
    process.exit(0)
}

main()
