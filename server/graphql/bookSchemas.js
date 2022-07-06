var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var BookModel = require('../models/Book');
const _ = require('lodash');

var userData = [{"id":1,"firstName":"Mikel","lastName":"Gregoli","email":"mgregoli1@amazon.de","password":"G0VfMCL"},
{"id":2,"firstName":"Moira","lastName":"Mazzilli","email":"mmazzilli2@163.com","password":"3GgdWoOfT"},
{"id":3,"firstName":"Kaja","lastName":"True","email":"ktrue3@washington.edu","password":"N6032b"},
{"id":4,"firstName":"Robbie","lastName":"Mc Harg","email":"rmcharg4@scientificamerican.com","password":"9aYRY2B5Jgj"},
{"id":5,"firstName":"Niki","lastName":"Daber","email":"ndaber5@army.mil","password":"ccKCMM"},
{"id":6,"firstName":"Rana","lastName":"Gyrgorwicx","email":"rgyrgorwicx6@booking.com","password":"1R3G2WJ"},
{"id":7,"firstName":"Johnette","lastName":"Torricella","email":"jtorricella7@discuz.net","password":"l6Fip9FINxzR"},
{"id":8,"firstName":"Kristoforo","lastName":"Slinn","email":"kslinn8@scribd.com","password":"pT35uEWU5y"},
{"id":9,"firstName":"Wye","lastName":"Bushrod","email":"wbushrod9@infoseek.co.jp","password":"ElyzUYgyyWC"}];

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
      id: { type: GraphQLString },
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
    }),
});


var bookType = new GraphQLObjectType({
    name: 'book',
    fields: function () {
      return {
        _id: {
          type: GraphQLString
        },
        title: {
          type: GraphQLString
        },
        author: {
          type: GraphQLString
        },
        genre: {
          type: GraphQLString
        },
        description: {
          type: GraphQLString
        },
        published_year: {
          type: GraphQLInt
        },
        publisher: {
          type: GraphQLString
        },
        updated_date: {
          type: GraphQLDate
        }
      }
    }
  });

  var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
      return {
        books: {
          type: new GraphQLList(bookType),
          resolve: function () {
            const books = BookModel.find().exec()
            if (!books) {
              throw new Error('Error')
            }
            return books
          }
        },
        book: {
          type: bookType,
          args: {
            id: {
              name: '_id',
              type: GraphQLString
            }
          },
          resolve: function (root, params) {
            const bookDetails = BookModel.findById(params.id).exec()
            if (!bookDetails) {
              throw new Error('Error')
            }
            return bookDetails
          }
        },
        getAllUsers: {
          type: new GraphQLList(UserType),
          args: { id: { type: GraphQLString } },
          resolve(parent, args){
            return userData;
          }
        },
      }
    }
  });

  var mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
      return {
        addBook: {
          type: bookType,
          args: {
            title: {
              type: new GraphQLNonNull(GraphQLString)
            },
            author: {
              type: new GraphQLNonNull(GraphQLString)
            },
            genre: {
              type:  new GraphQLNonNull(GraphQLString)
            },
            description: {
              type: new GraphQLNonNull(GraphQLString)
            },
            published_year: {
              type: new GraphQLNonNull(GraphQLInt)
            },
            publisher: {
              type: new GraphQLNonNull(GraphQLString)
            }
          },
          resolve: function (root, params) {
            const bookModel = new BookModel(params);
            const newBook = bookModel.save();
            if (!newBook) {
              throw new Error('Error');
            }
            return newBook
          }
        },
        updateBook: {
          type: bookType,
          args: {
            id: {
              name: 'id',
              type: new GraphQLNonNull(GraphQLString)
            },
            title: {
              type: new GraphQLNonNull(GraphQLString)
            },
            author: {
              type: new GraphQLNonNull(GraphQLString)
            },
            genre: {
              type:  new GraphQLNonNull(GraphQLString)
            },
            description: {
              type: new GraphQLNonNull(GraphQLString)
            },
            published_year: {
              type: new GraphQLNonNull(GraphQLInt)
            },
            publisher: {
              type: new GraphQLNonNull(GraphQLString)
            }
          },
          resolve(root, params) {
            return BookModel.findByIdAndUpdate(params.id, { title: params.title, author: params.author, genre: params.genre, description: params.description, published_year: params.published_year, publisher: params.publisher, updated_date: new Date() }, function (err) {
              if (err) return next(err);
            });
          }
        },
        removeBook: {
          type: bookType,
          args: {
            id: {
              type: new GraphQLNonNull(GraphQLString)
            }
          },
          resolve(root, params) {
            const remBook = BookModel.findByIdAndRemove(params.id).exec();
            if (!remBook) {
              throw new Error('Error')
            }
            return remBook;
          }
        },
        createUser: {
          type: UserType,
          args: {
            firstName: { type: new GraphQLNonNull(GraphQLString) },
            lastName: { type: new GraphQLNonNull(GraphQLString) },
            email: { type: new GraphQLNonNull(GraphQLString) },
            password: { type: new GraphQLNonNull(GraphQLString) },
          },
          resolve(parent, args){
            let id = userData.length + 1;
            console.log(userData.length);
            let user = {
              id : id,
              firstName : args.firstName,
              lastName : args.lastName,
              email : args.email,
              password : args.password
            }
            userData.push(user);
            return user;
          },
        },
        updateUser: {
          type: UserType,
          args: {
            id: {
              name: 'id',
              type: new GraphQLNonNull(GraphQLString)
            },
            firstName: {
              type: new GraphQLNonNull(GraphQLString)
            },
            lastName: {
              type: new GraphQLNonNull(GraphQLString)
            },
            email: {
              type: new GraphQLNonNull(GraphQLString)
            },
            password: {
              type: new GraphQLNonNull(GraphQLString)
            },
          },
          resolve(root, params) {
            let newUser = userData.find(user => parseInt(user.id) == params.id);
            newUser.firstName = params.firstName;
            newUser.lastName = params.lastName;
            newUser.email = params.email;
            newUser.password = params.password;
            return newUser;
          }
        },
        removeUser: {
          type: UserType,
          args: {
            id: {
              type: new GraphQLNonNull(GraphQLString)
            }
          },
          resolve(root, params) {
            let userIndex = userData.findIndex(user => user.id == params.id);
            console.log(userIndex);
            if (userIndex === -1) throw new Error("Order not found." + value);
            const deletedUser = userData.splice(userIndex, 1);
            return deletedUser[0];
          }
        },
      }
    }
  });

  module.exports = new GraphQLSchema({query: queryType, mutation: mutation});