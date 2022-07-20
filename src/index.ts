console.log("testing")

import express from 'express'
import cors from 'cors'
import {GITHUB_TOKEN} from "./config"
import fetch from 'cross-fetch'

const app = express()
const port = 3000

app.use(cors())

app.get('/',(req,res) => {
    console.log(req.query)
    res.send('Hello World!')
})

app.get('/githubContirbutions/',async (req,res) => {
    console.log()
    const responseQuery = req.query.startingDate as string
    const startDate = new Date(responseQuery)
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
                "toDate":new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate()).toISOString(),
                "fromDate":new Date(startDate.getFullYear(),startDate.getMonth() - 1,startDate.getDate()).toISOString()}
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
            console.log(commitDatas)
    res.send(commitDatas)
})

app.listen(port, () => {
    console.log(GITHUB_TOKEN)
})