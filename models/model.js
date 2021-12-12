const { Sequelize, Model, DataTypes } = require("sequelize");
const moment = require('moment');

//const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname') // Example for postgres
const sequelize = new Sequelize((process.env.PORT) ? 'postgres://waszpakwlmrswp:8330db2927cbf40ff0f7dc326bc28a05dd690be2ab1ce89a5c7cd93898bedb60@ec2-176-34-105-15.eu-west-1.compute.amazonaws.com:5432/d3ffk5fanb3cll' : 'postgres://postgres:pass@127.0.0.1:5432/nosh') // Example for postgres

/*
const sequelize = new Sequelize('nosh', 'postgres', 'aaaaa', {
  host: 'localhost',
  dialect: 'postgres'
});
*/


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

