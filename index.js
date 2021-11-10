const { User, Note, Comment } = require('./models/model');
const express = require('express');
const app = express();
const path = require('path');
const sessions = require('express-session');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Setting EJS as templating engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(urlencodedParser);

app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    //cookie: { maxAge: oneDay },
    resave: false
}));

app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})

app.get('/', (req, res) => {
	if(req.session.userId){
		res.render('dashboard')
	} else {
		res.render('homepage', { name: 'Monroe' })
	}
})


app.get('/login', async (req, res) => {
    res.render('login')
})


app.get('/register', (req, res) => {
    res.render('register')
})


app.get('/logout', (req, res) => {
	req.session.destroy();
    res.redirect('/');
})


app.post('/login', async (req, res) => {
	const { email, password } = req.body;
	
  const user = await User.findOne({ where: { email: email, password: password } });
  if(user == null) {
		res.render('login', {error: "Wrong credentials"});
		return;
  }
   
  req.session.userId = user.id;
   console.log(user);
   res.redirect('/');
})


app.post('/register', async (req, res) => {
	const { email, password } = req.body;
  const exist = await User.findOne({ where: { email: email } });
  if(exist != null) {
		res.render('register', {error: "Email already registered"});
		return;
  }
   
  const user = await User.create({ email: email, password: password });
  req.session.userId = user.id;
   console.log(user);
   res.redirect('/');
})