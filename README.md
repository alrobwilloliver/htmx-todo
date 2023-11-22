# TODO APP

# Getting Started
To run this locally following these instructions you will need node.js and docker installed (for mongodb - local installation could also work).

```
npm i
docker run --name mongo-todo -p 27017:27017 -d mongo:latest
node index.js
```

Go to localhost:9001 in the browser