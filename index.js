const express = require('express');
const { urlencoded, json } = require('express');
const cors = require('cors');
const signosRouter = require('./routes/signos.routes.js');
const authRouter = require('./routes/auth.routes.js'); // Rutas de autenticación

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

app.use('/v1/signos', signosRouter);
app.use('/v1/auth', authRouter); // Utilizar las rutas de autenticación

app.listen(4000, () => {
    console.log('listening at port 4000');
});
