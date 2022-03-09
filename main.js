#! /usr/bin/env node

const snarkjs = require('snarkjs')
const ffjavascript = require('ffjavascript')
const fs = require('fs')

async function main() {
    let file = process.argv[2]
    const p = ffjavascript.utils.unstringifyBigInts(JSON.parse(fs.readFileSync(file)))

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
