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


/* Generate connection email boilerplate
 *
 * @params    [string]   type        [type of action initiated by sender]
 * @params    [object]   sender      [sender's user object from db]
 * @params    [object]   recipient   [recipient's user object from db]
 * @returns   [string]               [boilerplate connection status message]
*/
function makeBoilerplate(type, sender, recipient) {
    switch(type) {
        case 'request':
            return `<div style="padding: 30px 13%;">Great news! <strong>${sender.username}</strong> (<a class="link" href="mailto:${sender.email}" style="color: #4981C2; text-decoration: none; border-bottom: 1px transparent;">${sender.email}</a>)<br />has responded to your ad on co/ment!</div>`;
        case 'accept':
            return `<div style="padding: 30px 13%;">Great news! <strong>${sender.username}</strong> has accepted <strong>${recipient.username}</strong>'s connection request on co/ment! <br />You have each other's email addresses now:<br/><a class="link" href="mailto:${sender.email}" style="color: #4981C2; text-decoration: none; border-bottom: 1px transparent;">${sender.email}</a><br/><a class="link" href="mailto:${recipient.email}" style="color: #4981C2; text-decoration: none; border-bottom: 1px transparent;">${recipient.email}</a><br/>so you're on your own from here. Good luck!</div>`;
        case 'decline':
            return `<div style="padding: 30px 13%;">Connection Update: <strong>${sender.username}</strong> has declined your Connection request on co/ment</div>`;
        case 'deactivate':
            return `<div style="padding: 30px 13%;">Connection Update: The mentorship between <strong>${sender.username}</strong> and <strong>${recipient.username}</strong> has ended</div>`;
        default:
            return `<div style="padding: 30px 13%;">Great news! <strong>${sender.username}</strong> (<a class="link" href="mailto:${sender.email}" style="color: #4981C2; text-decoration: none; border-bottom: 1px transparent;">${sender.username}</a>)<br />has responded to your ad on co/ment!</div>`;
        }
}


/* ============================== EXPORT API =============================== */

module.exports = { makeSignupKey, makeValidationUrl, makeBoilerplate };
