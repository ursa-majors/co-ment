/* utils/mailtemplates.js

  Just a place to stash email markup

*/

const baseUrl = 'https://co-ment.glitch.me/'

const unreadsReminder = (url, to_name) => {
  return `Hello @${to_name}, you have new unread messages in <a href="${url}">your co/ment Inbox</a>!
    <br><br>
    ${url}`
}

const engagementTpl = (engageType) => {
  let url
  let inaction
  let blurb

  if (engageType === 'profile') {
    url = baseUrl + 'profile'
    inaction = 'updated your profile'
    blurb = 'updating your profile so others can get a better sense for your skills and compatibility'
  } else if (engageType === 'post') {
    url = baseUrl + 'editpost'
    inaction = 'created a post'
    blurb = 'creating a post to help others based on your coding knowledge/insights'
  }

  return `<p>Hi, thanks for participating in <strong>co/ment</strong>. We noticed that you haven't ${inaction} yet. Please consider ${blurb}.</p>`
}

const longEmail = (title, url, toUser, subhead, bodyText, buttonText, recUserId) => {
  return `
      <!DOCTYPE html>
        <html xmlns:v="urn:schemas-microsoft-com:vml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${title}</title>
          <style type="text/css">
          @import url(http://fonts.googleapis.com/css?family=Alegreya+Sans:400,700|Alegreya+Sans+SC:300,700);
          img {
            max-width: 600px;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
          }
          a {
            text-decoration: none;
            border-bottom: 1px solid transparent;
            outline: none;
            color: #4981C2;
          }
          a:hover {
            color: #22c1c3;
            border-bottom: 1px dotted #22c1c3;
          }
          a img {
            border: none;
          }
          td, h1, h2, h3  {
            font-family: 'Alegreya Sans', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
            font-weight: 400;
          }
          td {
            text-align: center;
          }
          body {
            -webkit-font-smoothing:antialiased;
            -webkit-text-size-adjust:none;
            width: 100%;
            height: 100%;
            background: #ffffff;
            font-size: 16px;
          }
           table {
            border-collapse: collapse !important;
          }
          .bkg-sky {
            background: #4981C2;
          }
          .bkg-header {
            background: #4981C2;
            background: url(https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-header_600x400.jpg) no-repeat top center;
          }
          .bkg-footer {
            background: #1b1b44;
            background: url(https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-footer_600x306.gif) no-repeat top center;
          }
          .headline {
            color: #ffffff;
            font-size: 36px;
            font-weight: 700;
          }
          .link {
            color: #4981C2;
            border-bottom: 1px transparent;
          }
          .link:hover, .link:focus, .link:active {
            color: #22c1c3;
            border-bottom: 1px dotted #22c1c3;
          }
         .force-full-width {
          width: 100% !important;
         }
         .button {
            color: white;
            font-family: 'Alegreya Sans SC', sans-serif;
            text-transform: lowercase;
            letter-spacing: 2px;
            font-size: 16px;
            text-decoration: none;
            font-weight: 700;
            border-radius: 50px;
            padding: 10px;
            border: 1px solid white;
            background: #4981C2;
            -webkit-text-size-adjust:none;
            margin: 0 auto;
          }
          .button:hover, .button::active, .button::focus {
                text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
                background: #1a9698;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
                transition: all 300ms ease-in-out;
              }
            </style>
            <style type="text/css" media="screen">
                @media screen {
                  td, h1, h2, h3 {
                    font-family: 'Alegreya Sans', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
                    font-weight: 400;
                  }
                }
            </style>
            <style type="text/css" media="only screen and (max-width: 480px)">
              @media only screen and (max-width: 480px) {
                table[class="w320"] {
                  width: 320px !important;
                }
                body {
                  -webkit-font-smoothing:antialiased;
                  -webkit-text-size-adjust:none;
                  width: 100%;
                  height: 100%;
                  background: #ffffff;
                  font-size: 20px;
                }
              }
            </style>
        </head>
        <body class="body" style="padding:0; margin:0; display:block; background:#ffffff; -webkit-text-size-adjust:none" bgcolor="#ffffff">
          <table align="center" cellpadding="0" cellspacing="0" style=
"height:100%; width:100%">
  <tbody>
    <tr>
      <td style="background-color: #FFFFFF" align="center" valign="top" width=
      "100%" class="">
        <!-- [if gte mso 9]>
                              <v:background fill="t">
                              <v:fill type="frame" src="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-header_600x400.jpg"></v:fill>
                              </v:background>
                            <![endif]-->
        <table
        cellpadding="0" cellspacing="0" style=
        "margin:0 auto; width:600px; background: #ffffff;" bgcolor="#ffffff">
          <tbody>
            <tr>
              <td>
                <div>
                  <table cellpadding="0" cellspacing="0" style="width:100%">
                    <tbody>
                      <tr>
                        <td class="bkg-header w320" background=
        "https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-header_600x400.jpg" height="400" width="100%" style="text-align: center;">
                          <a href="${url}" style="display: block;">
                            <img alt="co/ment" height="129" src=
                          "https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_logo_400x129.png?raw=true"
                          style="padding-top:40px" width="400" />
                          </a>
                          <div class="headline" height="80" style=
                        "color: #ffffff; font-family: &#39;Alegreya Sans&#39;, sans-serif; font-size: 36px; font-weight: 700; text-align: center; height: 80px;"
                        width="100%">Hello ${toUser}!</div>
                        <div style=
                                  "color: #545454; font-size: 1.4em; line-height: 1.5em;font-weight:700; font-family: &#39;Alegreya Sans&#39;, sans-serif;text-align:center;">
                          ${subhead}
                        </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table cellpadding="0" cellspacing="0" style="width:100%">
                    <tbody>
                      <tr>
                        <td colspan="3" width="100%" class="">
                          <table cellpadding="0" cellspacing="0" style=
                          "margin:0 auto; width:60%">
                            <tbody>
                              <tr>
                                <td style="color:#545454;" class="">
                                  <p style=
                                  "color: 545454; font-family: &#39;Alegreya Sans&#39;, sans-serif; font-size: 1.2em; line-height: 1.6em;font-weight:400; text-align: left; padding: 0 20px;">
                                  Personal message:
                                  <br>
                                  ${bodyText}</p>
                                  <br>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <br>
                        </td>
                      </tr>

                      <tr>
                        <td align="center" colspan="3" valign="top" width=
                        "100%" class="">
                          <!-- [if gte mso 9]>
                    <v:background fill="t">
                    <v:fill type="frame" src="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-footer_600x306.gif"></v:fill>
                    </v:background>
                  <![endif]-->

                          <table background=
                          "https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-footer_600x306.gif"
                          cellpadding="0" cellspacing="0" class=
                          "bkgfooter w320" style="margin:0 auto; width:600px">
                            <tbody>
                              <tr>
                                <td colspan="3" height="306" width="100%"
                                class="">
                                  <div style="text-align: center;">
                                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href=${url} style="height:76px;v-text-anchor:middle;width:300px;" arcsize="80%" stroke="f" fillcolor="#4981C2">
                         <w:anchorlock></w:anchorlock>
                            <center>
                               <![endif]--><a class="button"
                                    href="${url}" style=
                                    "color: white; font-family: &#39;Alegreya Sans SC&#39;, sans-serif; letter-spacing: 2px; text-transform: lowercase; font-size: 16px; text-decoration: none; font-weight: 700; border-radius: 50px; padding: 10px 15px 12px 15px; border: 1px solid white; background: #4981C2; -webkit-text-size-adjust:none;">${buttonText}</a>
                                    <!--[if mso]>
                                                </center>
                                              </v:roundrect>
                                          <![endif]-->
                                  </div>
                                  <div style="text-align: center; margin-top: 30px;">
                                    <a style="color:#fff; text-decoration: none; border-bottom: 1px dotted #fff;" href="${baseUrl}editprofile/${recUserId}">Edit Contact Preferences</a>
                                  </div>
                                  <br>
                                   
                                </td>
                              </tr>
                            </tbody>
                          </table><!--[if gte mso 9]>
          </v:textbox>
          </v:fill>
        </v:rect>
        </v:image>
        <![endif]-->
                          <br>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <br>
      </td>
    </tr>
  </tbody>
</table>
</body>
</html>
`
}

const shortEmail = (title, url, headline, body, buttonText, recUserId) => {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns:v="urn:schemas-microsoft-com:vml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${title}</title>
          <style type="text/css">
          @import url(http://fonts.googleapis.com/css?family=Alegreya+Sans:400,700|Alegreya+Sans+SC:300,700);
          img {
            max-width: 600px;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
          }
          a {
            text-decoration: none;
            border: 0;
            outline: none;
            color: #ffffff;
          }
          a img {
            border: none;
          }
          td, h1, h2, h3  {
            font-family: 'Alegreya Sans', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
            font-weight: 400;
          }
          td {
            text-align: center;
          }
          body {
            -webkit-font-smoothing:antialiased;
            -webkit-text-size-adjust:none;
            width: 100%;
            height: 100%;
            background: #ffffff;
            font-size: 16px;
          }
           table {
            border-collapse: collapse !important;
          }
          .grad {
            background: #383061;
            background: -webkit-linear-gradient(to top, #1D1C46, #383061);
            background: linear-gradient(to top, #1D1C46, #383061);
          }
          .bkg {
            background: #383061;
            background: -webkit-linear-gradient(to top, #1D1C46, #383061);
            background: linear-gradient(to top, #1D1C46, #383061);
            background: url(https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x633.jpg) no-repeat top center;
              -webkit-background-size: cover;
              -moz-background-size: cover;
              -o-background-size: cover;
              background-size: cover;
          }
          .headline {
            color: #ffffff;
            font-size: 36px;
            font-weight: 700;
          }
          .link {
            color: #ffffff;
            border-bottom: 1px transparent;
          }
          .link:hover, .link:focus, .link:active {
            color: #ffffff;
            border-bottom: 1px dotted #ffffff;
          }
         .force-full-width {
          width: 100% !important;
         }
         .button {
            color: white;
            font-family: 'Alegreya Sans SC', sans-serif;
            text-transform: lowercase;
            letter-spacing: 2px;
            font-size: 16px;
            text-decoration: none;
            font-weight: 700;
            border-radius: 50px;
            padding: 10px;
            border: 1px solid white;
            background: #4981C2;
            -webkit-text-size-adjust:none;
            margin: 0 auto;
          }
          .button:hover, .button::active, .button::focus {
                text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
                background: #1a9698;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
                transition: all 300ms ease-in-out;
              }
            </style>
            <style type="text/css" media="screen">
                @media screen {
                  td, h1, h2, h3 {
                    font-family: 'Alegreya Sans', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
                    font-weight: 400;
                  }
                }
            </style>
            <style type="text/css" media="only screen and (max-width: 480px)">
              @media only screen and (max-width: 480px) {
                table[class="w320"] {
                  width: 320px !important;
                }
                body {
                  -webkit-font-smoothing:antialiased;
                  -webkit-text-size-adjust:none;
                  width: 100%;
                  height: 100%;
                  background: #ffffff;
                  font-size: 20px;
                }
              }
            </style>
        </head>
        <body class="body" style="padding:0; margin:0; display:block; background:#ffffff; -webkit-text-size-adjust:none" bgcolor="#ffffff">
        <table align="center" cellpadding="0" cellspacing="0" height="100%" width="100%">
          <tbody>
            <tr>
              <td align="center" bgcolor="#ffffff" valign="top" width="100%" class="">
                <center>
                  <!-- [if gte mso 9]>
                    <v:background fill="t">
                    <v:fill type="tile" src="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x633.jpg" ></v:fill>
                    </v:background>
                  <![endif]-->
                  <table background="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x633.jpg" cellpadding="0" cellspacing="0" class="w320 grad bkg" style="margin: 0 auto;" width="600">
                    <tbody>
                      <tr>
                        <td background="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x633.jpg" bgcolor="#383061" height="633" style="height:633px; background-image:url(https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x633.jpg);background-repeat:no-repeat;background-color: #383061;" valign="top" class="">
                        <!--[if gte mso 9]>
                          <v:image xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style=" border: 0;display: inline-block; width: 600px; height: 633px;" src="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x633.jpg" ></v:image>
                          <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style=" border: 0;display: inline-block;position: absolute; width: 600px; height: 633px;">
                            <v:fill  opacity="0%" color="#383061"  ></v:fill>
                            <v:textbox inset="0,0,0,0">
                        <![endif]-->
                          <div>
                            <table cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                              <tbody>
                                <tr width="100%" height="60">
                                  <td>&nbsp;</td>
                                </tr>
                                <tr>
                                  <td width="16%"></td>
                                  <td width="67%"><br>
                                  <a href="${url}"><img alt="co/ment" height="129" src="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_logo_400x129.png" style="padding-top:50px;margin:auto;text-align:center;" width="400"></a></td>
                                  <td width="16%"></td>
                                </tr>
                                <tr>
                                  <td width="100%" colspan="3" class="headline" style="color: #ffffff; font-family: 'Alegreya Sans', sans-serif; font-size: 36px; font-weight: 700; text-align: center;">${headline}
                                  </td>
                                </tr>
                                <tr>
                                  <td width="100%" colspan="3">
                                  <center>
                                  <table cellpadding="0" cellspacing="0" style="margin: 0 auto;" width="60%">
                                    <tbody>
                                      <tr>
                                        <td style="color:#ffffff;" class="">
                                          <p style="color: white; font-size: 1.4em; line-height: 1.5em;font-weight:400; font-family: 'Alegreya Sans', sans-serif;text-align:center;">
                                            ${body}
                                          </p>
                                          <br /> &nbsp; <br />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td class="">
                                          <div style="text-align: center;">
                                            <!--[if mso]>
                                              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:76px;v-text-anchor:middle;width:300px;" arcsize="80%" stroke="f" fillcolor="#4981C2">
                                              <w:anchorlock></w:anchorlock>
                                                <center>
                                            <![endif]-->
                                            <a class="button" style="color: white; font-family: 'Alegreya Sans SC', sans-serif; letter-spacing: 2px; text-transform: lowercase; font-size: 16px; text-decoration: none; font-weight: 700; border-radius: 50px; padding: 10px 15px 12px 15px; border: 1px solid white; background: #4981C2; -webkit-text-size-adjust:none;" href="${url}">${buttonText}</a>
                                            <!--[if mso]>
                                                </center>
                                              </v:roundrect>
                                            <![endif]-->
                                          </div>
                                          <br>&nbsp;
                                        </td>
                                      </tr>
                                      <tr>
                                        <td style="text-align: center">
                                          <a class="link" style="color:#fff; text-decoration: none; border-bottom: 1px dotted #fff;" href="${baseUrl}editprofile/${recUserId}">Edit Contact Preferences</a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </center>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        </div>
                        <!--[if gte mso 9]>
                </v:textbox>
                </v:fill>
              </v:rect>
              </v:image>
              <![endif]--></td>
                  </tr>
                </tbody>
              </table>
              </center>
              </td>
            </tr>
          </tbody>
        </table>
        </body>
    </html>`
}

const pwResetTemplate = (url, recUserId) => {
  return shortEmail('co/ment Password Reset Email', url, 'Forgot your password?', 'No problem! Click below to reset it!', 'Reset Password', recUserId)
}

const validationTemplate = (url, recUserId) => {
  return shortEmail('co/ment Account Validation Email', url, 'Welcome!', 'Click below to validate your account:', 'Validate Email', recUserId)
}

// longEmail( title, url, toUser, subhead, bodyText, buttonText, recUserId )
const contactTemplate = (toUser, fromUser, fromEmail, bodyText, connectionId, boilerplate, recUserId) => {
  return longEmail(
    'co/ment Connection Request Email',
    `https://co-ment.glitch.me/connectiondetails/${connectionId}`,
    toUser,
    boilerplate || `<div style="padding: 30px 13%;">Great news! <strong>${fromUser}</strong> (<a class="link" href="mailto:${fromEmail}" style="color: #4981C2; text-decoration: none; border-bottom: 1px transparent;">${fromEmail}</a>) <br/>has responded to your ad on co/ment!</div>`,
    bodyText,
    'View Connection',
    recUserId
  )
}

module.exports = {
  pwResetTemplate,
  validationTemplate,
  contactTemplate,
  unreadsReminder,
  engagementTpl
}
