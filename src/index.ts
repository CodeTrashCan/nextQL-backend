console.log("testing")

import express from 'express'
import cors from 'cors'
import {GITHUB_TOKEN} from "./config"
import fetch from 'cross-fetch'
import * as github from './core/github'

const app = express()
const port = 3000

app.use(cors())

app.get('/',(req,res) => {
    res.send('Hello World!')
})

app.get('/githubContirbutions/',async (req,res) => {
    const responseQueryStart = req.query.startingDate as string
    const responseQueryEnd = req.query.endingDate as string
    const startDate = new Date(responseQueryStart)
    const endDate = new Date(responseQueryEnd)
    const QUERY = `
                query testing($userName:String!, $toDate:DateTime, $fromDate: DateTime) { 
                    user(login: $userName) {
                        contributionsCollection(from: $fromDate, to: $toDate) {
                            contributionCalendar {
                                totalContributions
                                weeks {
                                    contributionDays {
                                    weekday
                                    date 
                                    contributionCount 
                                    color
                                    contributionLevel
                                    }
                                }
                                months  {
                                    name
                                    year
                                    firstDay
                                    totalWeeks  
                                }
                            }
                        }
                    }
                }`;
    const queryValue = {
        "userName":"dennis0324",
        "toDate": startDate,
        "fromDate":endDate
    }
    const endpoint = "https://api.github.com/graphql"
    let commitDatas = await fetch(endpoint,
    {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization':`bearer ${GITHUB_TOKEN}`
        },
        body:JSON.stringify({
        query:QUERY,
        variables: queryValue
        })
    })
    commitDatas = await commitDatas.json()
    res.send(commitDatas)
})

app.get('/getPostTitles/',async(req,res) => {
    const result = await github.getPostTitles({
        owner:req.query.owner as string,
        repo:req.query.repo as string,
        path:req.query.path as string
    })
    res.send(result)
})

app.listen(port, () => {
    console.log(GITHUB_TOKEN)
})

app.get('/getContent/',async(req,res) => {
    //owner:'dennis0324',repo:'blogPost',path:`${content.path}/${i.name}.md`
    const temp = await github.getContent({
        owner:req.query.owner as string,
        repo:req.query.repo as string,
        path:`${req.query.path}/${req.query.name}.md` as string
    })
    const contentStr =  github.decodeBase64UTF8(temp.content)
    res.send(contentStr)
})

app.get('/searchPost/',async(req,res) => {
    //owner:'dennis0324',repo:'blogPost',path:`${content.path}/${i.name}.md`
    const temp = await github.searchPost({
        owner:req.query.owner as string,
        repo:req.query.repo as string,
        path:req.query.path as string
    },req.query.title as string)
    // const contentStr =  github.decodeBase64UTF8(temp.content)
    res.send(temp)
})