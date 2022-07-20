console.log("testing")

import express from 'express'
import cors from 'cors'
import {GITHUB_TOKEN} from "./config"

const app = express()
const port = 3000

app.use(cors())

app.get('/',(req,res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(GITHUB_TOKEN)
})