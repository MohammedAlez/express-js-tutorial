
const http = require('http')
const fs = require('fs')
const fsPromise = require('fs').promises
const path = require('path')

const logEvent = require('./logEvents')
const EventEmitter = require('events')
class Emitter extends EventEmitter {}

// initialize object
const myEmitter = new Emitter
// add event listener for the log event
myEmitter.on('log',(msg, fileName)=>logEvent(msg, fileName))

const PORT = process.env.PORT || 3500


// serve file function 
const serveFile = async(filePath, contentType, response)=>{
    try{
        const rawData = await fsPromise.readFile(filePath, 
            !contentType.includes('image') ? 'utf8' : ''
        )
        const data = contentType === 'application/json' ? JSON.parse(rawData) : rawData 
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200
            , {'Content-Type':contentType})
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        )
    }catch(err){
        console.log(err)
        myEmitter.emit('log', `${err.name}\t${err.message}`, 'errorLog.txt')
        response.statusCode = 500
        response.end()
    }
}
// creating the server
const server = http.createServer((req, res)=>{
    console.log(req.url, req.method)
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt')
    const extension = path.extname(req.url)

    let contentType

    switch (extension){
        case '.css':
            contentType = 'text/css'
            break
        case '.js':
            contentType = 'text/javascript'
            break;
        case '.json':
            contentType = 'application/json'
            break;
        case '.jpg':
            contentType = 'image/jpeg'
            break;
        case '.png':
            contentType = 'image/png'
            break;
        case 'txt':
            contentType = 'text/plain'
            break;
        default:
            contentType = 'text/html'
    }

    let filePath = 
        contentType === 'text/html' && req.url === '/' 
        ? path.join(__dirname, 'views', 'index.html')
        : contentType === 'text/html' && req.url.slice(-1) === '/'
            ? path.join(__dirname, 'views', req.url, 'index.html') 
            : contentType === 'text/html' 
                ? path.join(__dirname, 'views', req.url)
                : path.join(__dirname, req.url)

    if (!extension && req.url.slice(-1) !== '/') filePath += '.html'

    const fileExist = fs.existsSync(filePath)

    if(fileExist){
        serveFile(filePath, contentType, res)
    }else{
        console.log(path.parse(filePath))
        // we can either server 404 page or redirect 
        switch(path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301, {'location':'/new-page.html'})
                res.end()
                break
            case 'www-page.html':
                res.writeHead(301, {'location':'/'})
                res.end()
                break
            default:
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res)
        }
    }
})

server.listen(PORT, ()=>{
    console.log("server is running at the port: "  + PORT)

})






    