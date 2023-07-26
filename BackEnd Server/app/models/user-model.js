// const sql = require("./db-model.js")

// 생성자
const User = function(user){
    this.id = user.id;
    this.pw = user.pw;
    this.name = user.name;
    this.email = user.email;
    this.emailDomain = user.emailDomain;
    this.salt = user.salt;
    this.token = null;
}

module.exports = User;

// // member 튜플 추가 
// Member.join = (newMember, result)=>{
//     newMember.salt = "1111"
//     sql.query("INSERT INTO member SET ?", newCustomer, (err, res)=>{
//         if(err){
//             console.log("error: ", err);
//             result(err, null);
//             return;
//         }

//         console.log("회원가입 성공: ",{id:res.inseertId, ...newCustomer });
//         result(null, {id: res.inseertId, ...newCustomer});
//     });
// };

// // customer id로 조회
// Member.findByID = (memberId, result)=>{
//     sql.query('SELECT * FROM member WHERE id = ?',memberId, (err, res)=>{
//         if(err){
//             console.log("error: ", err);
//             result(err, null);
//             return;
//         }

//         if(res.length){
//             console.log("found customer: ", res[0]);
//             result(null, res[0]);
//             return;
//         }

//         // 결과가 없을 시 
//         result({kind: "로그인 실패"}, null);
//     });
// };