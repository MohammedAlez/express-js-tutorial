const express = require("express")

const app = express()

//middleware is a function executed between the request and the final response 

const mw1 = (res, req, next)=>{

    console.log(res.url)

    //call next middleware or handler   
    next()
}


// middleware has three options 

const mw2 = (req, res, next)=>{

    // do something 

    // contineu and call next middleware or handler
    next()

    // send response immediatly 
    res.status(401).json({message:"unauthorized"})

    //pass error
    next(error)
}


// application-level middleware 

const logger=(req, res, next)=>{
   //do something 
}
app.use(logger) // all routes will use this middleware first 



// route-level middleware 

const authenticate = (res, req, next)=>{
    // do something
}
const getProfile=(req, res, next)=>{
    //do something
}
app.get('/profile',authenticate, getProfile) // middlewares applied only to this route 



// you can chain middlewares 

app.get('/admin/users',authenticate, authorizeAdmin, getUsers)


// Built-in middlewares 

app.use(express.json()) // to parse json bodies 
app.use(express.urlencoded({extended:true})) // to parse request form data
app.use(express.static('public')) // to server static files 

// third party middlewares 
// ex: cors, helmet, morgan, cookie-parser




// middleware can modify the request 
// ex: 
const authenticateUser = (req, res, next) => {

    const token = getToken(req)

    const user = verifyToken(token)

    req.user = user

    next()
} // then other controllers can use req.user



// exectution order matters 

app.use(express.json())
app.get('/users', usersHandler)

// is different from 

app.get('usres', usersHandler)
app.use(express.json())


/// Error handling middlewares 

const errorHandler=(error, req, res, next)=>{

    // do something 

    console.log(error)


    res.status(500).send({message:"internal server error"})
}


// You typically put it after your routes

app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)

app.use(errorHandler)


// to pass errors to error middleware use the next(error)
const middleware = async (req, res, next) => {
    try {
        // something
    } catch (error) {
        next(error)
    }
}


// router-leverl middleware 

const router = express.Router()

router.use(yourMiddleware)

// now all routes belongs to this route will use the above middleware 
router.get('/products', getProducts)
router.get('/products/:id', getProduct)


// Middleware
// Usually handles cross-cutting concerns : 
// Authentication
// Authorization
// Validation
// Logging
// Rate limiting
// Parsing

// Controller
// Usually handles the actual business operation:

