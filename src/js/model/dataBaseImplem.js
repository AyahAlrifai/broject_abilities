import Mysql from 'mysql';
import util from 'util'
export default class dataBaseImplem {

  constructor(user,password,host,database) {
    this.con = Mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database,
      multipleStatements:true
    });
    this.query = util.promisify(this.con.query).bind(this.con);
  }

  async getUserProfile(user_id) {
    try {
        var sql=`select UserProfile.user,UserProfile.display_name,UserProfile.email,User.type `+
          `from UserProfile inner join User ON User.id = UserProfile.user `+
          `where UserProfile.user=${user_id}`;
        var user=await this.query(sql);
          if(user.length==1) {
            return user;
          } else {
            return {"status":"400","message":"user with this id does not exists in database"};
          }
    } catch (err) {
      console.log(err);
    }
}

  async createUser(info) {
    try {
      var sql=`INSERT INTO User VALUES (${info.id},'${info.type}');`;
      var result=await this.query(sql);
      if(result.affectedRows>0) {
        sql=`INSERT INTO UserProfile VALUES ('${info.display_name}','${info.email}',${info.id});`;
        var res=await this.query(sql);
        if(res.affectedRows>0) {
          return {"status":"200OK","message":"user added to database"};
        }
      } else {
        return {"status":"400","message":`user with id ${info.id},already exists`};
      }
    } catch (err) {
      console.log(err);
    }
  }

  async deleteUser(user_id) {
    try {
      var sql=`delete from UserProfile where UserProfile.user=${user_id} and UserProfile.email is null;`;
      var result=await this.query(sql);
      if(result.affectedRows>0) {
        sql=`delete from User where User.id=${user_id}`;
        result=await this.query(sql);
        return {"status":"200OK","message":"user deleted from database"};
      } else {
        return {"status":"400","message":"user id not found or email is not null"};
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getUsersByType(type) {
    try {
      var sql=`select UserProfile.user,UserProfile.display_name,UserProfile.email `+
        `from UserProfile inner join User ON User.id = UserProfile.user `+
        `where User.type="${type}"`;
      var result=await this.query(sql);
      if(result.length>0) {
        return result;
      } else {
        return {"status":"200","message":"no users with this type in database"};
      }
    } catch (err) {
      console.log(err);
    }
  }

  async updateListOfUsers(users) {
    var sql="";
    for(var i=0;i<users.length;i++) {
      sql+=`update UserProfile set display_name="${users[i].display_name}",email="${users[i].email}" where user=${users[i].id};`
    }
    try {
      var result=await this.query(sql);
      return {"status":"200OK","message":"Update all users "};
    } catch (err) {
      console.log(err);
    }
  }

}
