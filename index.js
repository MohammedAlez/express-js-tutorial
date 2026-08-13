const logEvent = require('./logEvents')

const EventEmitter = require('events')


class MyEmitter extends EventEmitter {}

// initialize object
const myEmitter = new MyEmitter


// add event listener for the log event
myEmitter.on('log',(msg)=>logEvent(msg))


setTimeout(()=>{
    myEmitter.emit('log', "here's a new event")
},2000)