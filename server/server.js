const express = require('express');
const path = require('path');
// Connect Apollo Server:
const { ApolloServer } = require('@apollo/server');
// middleware to connect the Appolo server:
const { expressMiddleware } = require('@apollo/server/express4');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');


const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// starts Apollo server:
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  // use middleware to connect to graphql end point
  app.use('/graphql', expressMiddleware(server));


// if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }
  db.once('open', () => {
    app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    })
  });
};

startApolloServer();



