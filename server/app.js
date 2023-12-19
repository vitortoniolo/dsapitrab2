const express = require('express');
const app = express();
const cors = require('cors')
const session = require('express-session');
const passport = require('./auth');

const db = require('./db');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.use(session({ 
    secret: "cats", 
    resave: false, 
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

function isLoggedIn(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect('/auth/google');
    }
}


app.post('/insert', (request, response) =>{
    const { titulo, autor } = request.body;
    const dbInstance = db.getDbServiceInstance();

    const result = dbInstance.insertNewLivro(titulo, autor)
    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err))
})

app.get('/getAll', (request, response) =>{
    const dbInstance = db.getDbServiceInstance();
    const result = dbInstance.getAllData();

    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err))
})

app.patch('/update', (request, response)=> {
    const {id, titulo} = request.body;
    const dbInstance = db.getDbServiceInstance();

    const result = dbInstance.updateTituloByID(id, titulo);

    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
})

app.delete('/delete/:id', (request, response) =>{
    const {id} = request.params;
    const dbInstance = db.getDbServiceInstance();

    const result = dbInstance.deleteRowByID(id);

    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
})

app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Autenticar com google</a>');
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get('/google/callback',
    passport.authenticate('google', { 
        successRedirect: 'http://127.0.0.1:5000/biblioteca2/client/index.html',
        failureRedirect: '/auth/failure' ,
    }),
    function(req, res) {
        req.session.user = req.user;
        res.redirect('/');
    }
);

app.get('/auth/failure', (req, res) => {
    res.send('Erro no login');
});

//app.get('/protected', isLoggedIn, (req, res) => {
  //  const redirectUrl = 'http://127.0.0.1:5500/biblioteca2/client/index.html';
    //res.redirect(redirectUrl);
//});

app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});
const PORT = 5000;
app.listen(PORT, () => console.log(`rodando em: ${PORT}`));