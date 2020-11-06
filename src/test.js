const fs = require('fs')
const { resolve } = require('path')
const { WASI } = require('wasi')

const wasi = new WASI({
  args: process.argv,
  env: process.env
})
const importObject = {
  wasi_snapshot_preview1: wasi.wasiImport
}

const run = async () => {
  const wasm = await WebAssembly.compile(fs.readFileSync(resolve(__dirname, '../fibonacci.wasm')))
  const instance = await WebAssembly.instantiate(wasm, importObject)
  wasi.start(instance)
}
run()