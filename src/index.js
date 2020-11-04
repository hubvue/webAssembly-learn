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
    filename: resolve(__dirname, '../wasm/program.wasm'),
    importObject: JSON.stringify(importObject)
  }
})
worker.on('message', ({code, command, message, data}) => {
  if(!code) {
    failHander(command, message, data)
  }
  successHandler(command, message, data, null)
})


const server = http.createServer((request, response) => {
  const args = url.parse(request.url).query
  const query = querystring.parse(args)
  worker.postMessage({
    command: 'call',
    payload: {
      interface: query.interface,
      params: JSON.parse(query.params)
    }
  })
  worker.on('message', ({code, command, message, data}) => {
    if(!code) {
      failHander(command, message, data)
    }
    successHandler(command, message, data, response )
  })
})


server.listen(8000, () => {
  console.log('server is running')
})