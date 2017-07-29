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
        return `mongodb://${dbUname}:${dbPwd}@ds127963.mlab.com:27963/co-ment`;
    }
    
};
