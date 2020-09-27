'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dataBaseImplem = function () {
  function dataBaseImplem(user, password, host, database) {
    _classCallCheck(this, dataBaseImplem);

    this.con = _mysql2.default.createConnection({
      host: host,
      user: user,
      password: password,
      database: database,
      multipleStatements: true
    });
    this.query = _util2.default.promisify(this.con.query).bind(this.con);
  }

  _createClass(dataBaseImplem, [{
    key: 'getUserProfile',
    value: async function getUserProfile(user_id) {
      try {
        var sql = 'select UserProfile.user,UserProfile.display_name,UserProfile.email,User.type ' + 'from UserProfile inner join User ON User.id = UserProfile.user ' + ('where UserProfile.user=' + user_id);
        var user = await this.query(sql);
        if (user.length == 1) {
          return user;
        } else {
          return { "status": "400", "message": "user with this id does not exists in database" };
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, {
    key: 'createUser',
    value: async function createUser(info) {
      try {
        var sql = 'INSERT INTO User VALUES (' + info.id + ',\'' + info.type + '\');';
        var result = await this.query(sql);
        if (result.affectedRows > 0) {
          sql = 'INSERT INTO UserProfile VALUES (\'' + info.display_name + '\',\'' + info.email + '\',' + info.id + ');';
          var res = await this.query(sql);
          if (res.affectedRows > 0) {
            return { "status": "200OK", "message": "user added to database" };
          }
        } else {
          return { "status": "400", "message": 'user with id ' + info.id + ',already exists' };
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, {
    key: 'deleteUser',
    value: async function deleteUser(user_id) {
      try {
        var sql = 'delete from UserProfile where UserProfile.user=' + user_id + ' and UserProfile.email is null;';
        var result = await this.query(sql);
        if (result.affectedRows > 0) {
          sql = 'delete from User where User.id=' + user_id;
          result = await this.query(sql);
          return { "status": "200OK", "message": "user deleted from database" };
        } else {
          return { "status": "400", "message": "user id not found or email is not null" };
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, {
    key: 'getUsersByType',
    value: async function getUsersByType(type) {
      try {
        var sql = 'select UserProfile.user,UserProfile.display_name,UserProfile.email ' + 'from UserProfile inner join User ON User.id = UserProfile.user ' + ('where User.type="' + type + '"');
        var result = await this.query(sql);
        if (result.length > 0) {
          return result;
        } else {
          return { "status": "200", "message": "no users with this type in database" };
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, {
    key: 'updateListOfUsers',
    value: async function updateListOfUsers(users) {
      var sql = "";
      for (var i = 0; i < users.length; i++) {
        sql += 'update UserProfile set display_name="' + users[i].display_name + '",email="' + users[i].email + '" where user=' + users[i].id + ';';
      }
      try {
        var result = await this.query(sql);
        return { "status": "200OK", "message": "Update all users " };
      } catch (err) {
        console.log(err);
      }
    }
  }]);

  return dataBaseImplem;
}();

exports.default = dataBaseImplem;