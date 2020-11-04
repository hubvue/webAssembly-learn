const {parentPort} = require('worker_threads')
const {readFile} = require('fs').promises
let wasmExports;

const loadWasm = async (wasmFile, importObject) => {
  const wasmResouce = await readFile(wasmFile)
  const wasmModule = await WebAssembly.compile(wasmResouce)
  const {exports} = await WebAssembly.instantiate(wasmModule, importObject)
  return exports
}


parentPort.on('message', async ({command, payload}) => {
  let resultData = {
    code: 0,
    command: command,
    message: '',
    data: null
  }
  if(command === 'load') {
    wasmExports = await loadWasm(payload.filename, JSON.parse(payload.importObject))
    Object.assign(resultData, {
      code: 1,
      message: 'wasm load success'
    })
  }
  if(command === 'call') {
    if(!wasmExports) {
      Object.assign(resultData, {message: 'wasm load error' })
      parentPort.postMessage(Object.assign(resultData), {
        message: 'wasm load error'
      })
    }
    const result = wasmExports[payload.interface](...payload.params)
    Object.assign(resultData, {
      code: 1,
      message: 'call success',
      data: result
    })
  }
  parentPort.postMessage(resultData)
})