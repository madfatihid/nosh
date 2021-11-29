const { User, Note, Comment } = require('./models/model');
const express = require('express');
const app = express();
const path = require('path');
const sessions = require('express-session');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const { 
  v1: uuidv1,
  v4: uuidv4,
} = require('uuid');

// Setting EJS as templating engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use('/n', express.static('public')); 
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

app.get('/', async (req, res) => {
	if(req.session.userId){
		const notes = await Note.findAll({where: {userId: req.session.userId}, raw: true, order: [['updatedAt', 'DESC']]});
		console.log(notes);
		res.render('dashboard', {notes: notes})
	} else {
		res.render('homepage', { name: 'Monroe' })
	}
})


app.get('/login', async (req, res) => {
    res.render('login')
})


app.get('/create', async (req, res) => {
	if(!req.session.userId){
		res.redirect('/');
	}
	const note = await Note.create({ userId: req.session.userId });
    res.redirect("/n/"+note.id);
})




app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/profile', (req, res) => {
    res.render('profile')
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
	const { email, password, username } = req.body;
  const exist = await User.findOne({ where: { email: email } });
  if(exist != null) {
		res.render('register', {error: "Email already registered"});
		return;
  }
   
  const user = await User.create({ email: email, password: password, username: username });
  req.session.userId = user.id;
   console.log(user);
   res.redirect('/');
})

app.get('/n/:id', async (req, res) => {
  const note = await Note.findOne({ where: { id: req.params.id } });
  const comments = await Comment.findAll({
	  where: { noteId: note.id },
	  include: {
        model: User,
      }
  });
  res.render('note', {note: note, id: req.params.id, comments: comments});
});


app.post('/n/:id', async (req, res) => {
  const note = await Note.findOne({ where: { id: req.params.id } });
	await note.update({ content: req.body.content, title: req.body.title });
  res.sendStatus(200);
});

app.get('/n/:id/delete', async (req, res) => {
  await Note.destroy({
    where: { id: req.params.id }
	})
   res.redirect('/');
});


app.post('/comments', async (req, res) => {
	const { noteId, content } = req.body;
  const comment = await Comment.create({ userId: req.session.userId, noteId: noteId, content: content });
  res.sendStatus(200);
});
