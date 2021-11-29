const { Sequelize, Model, DataTypes } = require("sequelize");
const moment = require('moment');

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
  username: {
    type: DataTypes.STRING,
    defaultValue: ""
  },
});

const Note = sequelize.define("note", {
  content: {
    type: DataTypes.TEXT,
    defaultValue: ""
  },
  title: {
    type: DataTypes.TEXT,
    defaultValue: "Untitled"
  }
});

const Comment = sequelize.define("comment", {
  content: DataTypes.TEXT,
  createdAt: {
                    type: DataTypes.DATE,             
                  get() {
                        return moment(this.getDataValue('createdAt')).format('DD/MM/YYYY HH:mm');
                    }
                },
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

