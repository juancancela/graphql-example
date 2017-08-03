const express = require('express')
const request = require('request')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const app = express()
const PORT = 4488

const schema = buildSchema(`
  type Post {
      userId: Int,
      title: String
  },
  type Query {
    posts: [Post]
  }
`)

async function getPosts(){
    return new Promise((resolve, reject) => {
        request('https://jsonplaceholder.typicode.com/posts', (err, rsp, body) => {
            if (err) {
                reject(err)
            } else {
                resolve(JSON.parse(body))
            }
        });
    })
}


const root = {
    posts: async () => {
        return await getPosts()
    },
}

app.use('/', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}))

app.listen(PORT)
console.log(`Running a GraphQL API server at localhost:${PORT}`)