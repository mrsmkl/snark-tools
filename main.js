#! /usr/bin/env node

const snarkjs = require('snarkjs')
const ffjavascript = require('ffjavascript')
const fs = require('fs')

async function main() {
    console.log(process.argv)
    let file = process.argv[2]
    console.log(file)
    const p = ffjavascript.utils.unstringifyBigInts(JSON.parse(fs.readFileSync(file)))
    /*
    const snarkParams = {
        buyer_x: BigInt(buyerPub.x),
        buyer_y: BigInt(buyerPub.y),
        provider_x: BigInt(providerPub.x),
        provider_y: BigInt(providerPub.y),
        xL_in: orig1,
        xR_in: orig2,
        cipher_xL_in: cipher.xL,
        cipher_xR_in: cipher.xR,
        provider_k: providerK,
        hash_plain: origHash
    }*/

    const { proof } = await snarkjs.plonk.fullProve(
        p,
        '/usr/local/share/keytransfer/keytransfer.wasm',
        '/usr/local/share/keytransfer/keytransfer.zkey'
    )

    const signals = [
        p.buyer_x,
        p.buyer_y,
        p.provider_x,
        p.provider_y,
        p.cipher_xL_in,
        p.cipher_xR_in,
        p.hash_plain
    ]

    const proofSolidity = await snarkjs.plonk.exportSolidityCallData(
        ffjavascript.utils.unstringifyBigInts(proof),
        signals
    )

    const proofData = proofSolidity.split(',')[0]
    fs.writeFileSync("/tmp/output.json", proofData)
    process.exit(0)
}

main()
