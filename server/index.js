require('dotenv').config();
const express = require('express');
const { postgraphile } = require('postgraphile');

const app = express();

app.use(
  postgraphile(
    process.env.DATABASE_URL,
    'public',
    {
      enableCors: true,
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
    },
  )
);

app.listen(process.env.PORT || 4000);
