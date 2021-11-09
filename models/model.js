const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize('nosh', 'postgres', 'aaaaa', {
  host: 'localhost',
  dialect: 'postgres'
});

const User = sequelize.define("user", {
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  password: DataTypes.TEXT,
});

const Note = sequelize.define("note", {
  content: DataTypes.TEXT,
});

const Comment = sequelize.define("comment", {
  content: DataTypes.TEXT,
});

User.hasMany(Note);
Note.belongsTo(User);

User.hasMany(Comment);
Note.hasMany(Comment);
Comment.belongsTo(User);
Comment.belongsTo(Note);

module.exports = { User, Note, Comment };

/*
(async () => {
  await sequelize.sync({ alter: true });
  const jane = await User.create({ email: "Jane", password: "lmao" });
  const user = await User.findOne({ where: { email: 'Jane' } });
	if (user === null) {
	  console.log('Not found!');
	} else {
	  console.log(user instanceof User); // true
	  console.log(user.password); // 'My Title'
	}
})();*/