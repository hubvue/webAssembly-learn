const {Worker, isMainThread, parentPort, workerData} = require('worker_threads')
const {resolve} = require('path')
const url = require('url')
const http = require('http')
const querystring = require('querystring')

const createWorker = (filepath) => {
  const filename =  filepath || __filename
  return new Worker(filename)
}

const worker = createWorker(resolve(__dirname, './work.js'))


const failHander = (command, message, data) => {
  console.log('fail', message)
}
const successHandler = (command, message, data, res) => {
  if(command === 'load') {
    console.log('loaded')
    worker.postMessage({
      command: 'call',
      payload: {
        interface: 'add',
        params: [1,2]
      }
    })
  }
  if(command === 'call') {
    if(res) {
      res.send = data
    }
  }
}


const importObject = { imports: { imported_func: arg => console.log('Hello world',arg) } };

worker.postMessage({
  command: 'load',
  payload: {
    filename: resolve(__dirname, '../wasm/fibonacci.wasm'),
    importObject: JSON.stringify({})
  }
})
worker.on('message', ({code, command, message, data}) => {
  if(!code) {
    failHander(command, message, data)
  }
  successHandler(command, message, data, null)
})
