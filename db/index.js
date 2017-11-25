/** jb/index.js
    Defines database connection params
*/

/* ================================= SETUP ================================= */

const dotenv  = require('dotenv').config();
const dbUname = process.env.DB_UNAME;
const dbPwd   = process.env.DB_PWD;


/* ================================ EXPORTS ================================ */

module.exports = {

    getDbConnectionString: function() {

        // live database
        //creturn `mongodb://${dbUname}:${dbPwd}@ds127983.mlab.com:27983/co-ment`;

        // test database
        return `mongodb://${dbUname}:${dbPwd}@ds161503.mlab.com:61503/co-ment-test`;
    }

};
