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


(async () => {
  await sequelize.sync({ alter: true });
})();

module.exports = { User, Note, Comment };

