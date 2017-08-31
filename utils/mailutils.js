/*

   Email utilities common to auth and contact controllers

*/

/* ================================= SETUP ================================= */

const crypto = require('crypto');


/* =============================== UTILITIES =============================== */

/* Generate random signup key
 *
 * @params    [none]
 * @returns   [object]    [signup key]
*/
function makeSignupKey() {
    const buf     = crypto.randomBytes(24);
    const created = Date.now();

    return {
        key : buf.toString('hex'),
        ts  : created,            // created time (in millisecond)
        exp : created + 86400000  // expires in 1 day (86400000 ms)
    };
}


/* Generate registration email validation url w/custom key
 * Makes sure key is unique & saves to DB
 *
 * @params    [string]   user_id   [id of user to validate]
 * @params    [string]   key       [custom validation key]
 * @returns   [object]             [custom validation URL]
*/
function makeValidationUrl(user_id, key) {
    const baseUrl = 'https://co-ment.glitch.me/api/validate';

    return `${baseUrl}?uid=${user_id}&key=${key}`;

}


/* ============================== EXPORT API =============================== */

module.exports = { makeSignupKey, makeValidationUrl };
