/* utils/mailtemplates.js

  Just a place to stash email markup

*/

const pwResetTemplate = (url) => {
    return `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns:v="urn:schemas-microsoft-com:vml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>co/ment Password Reset Email</title>
          <style type="text/css">
          @import url(http://fonts.googleapis.com/css?family=Alegreya+Sans:300,700|Alegreya+Sans+SC:300,700);
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
            font-weight: 300;
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
            background: $4981C2;
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
                    font-weight: 300;
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
              <center><!-- [if gte mso 9]>
                    <v:background fill="t">
                    <v:fill type="tile" src="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x633.jpg" ></v:fill>
                    </v:background>
                    <![endif]-->
              <table background="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x633.jpg" cellpadding="0" cellspacing="0" class="w320 grad bkg" style="margin: 0 auto;" width="600">
                <tbody>
                  <tr>
                    <td background="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x633.jpg" bgcolor="#383061" height="633" style="height:633px; background-image:url(https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x633.jpg);background-repeat:no-repeat;background-color: #383061;" valign="top" class=""><!--[if gte mso 9]>
          <v:image xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style=" border: 0;display: inline-block; width: 600px; height: 633px;" src="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x633.jpg" ></v:image>
          <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style=" border: 0;display: inline-block;position: absolute; width: 600px; height: 633px;">
            <v:fill  opacity="0%" color="#383061"  ></v:fill>
            <v:textbox inset="0,0,0,0">
              <![endif]-->
                    <div>
                    <table cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                      <tbody>
                        <tr width="100%" height="60"><td>&nbsp;</td></tr>
                        <tr>
                          <td width="16%"></td>
                          <td width="67%"><br>
                          <a href="${url}"><img alt="co/ment" height="129" src="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_logo_400x129.png" style="padding-top:50px;margin:auto;text-align:center;" width="400"></a></td>
                          <td width="16%"></td>
                        </tr>
                  <tr>
                    <td width="100%" colspan="3" class="headline" style="color: #ffffff; font-family: 'Alegreya Sans', sans-serif; font-size: 36px; font-weight: 700; text-align: center;">Forgot your password?</td>
                  </tr>
                  <tr>
                    <td width="100%" colspan="3">
                    <center>
                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto;" width="60%">
                      <tbody>
                        <tr>
                          <td style="color:#ffffff;" class="">
                            <p style="color: white; font-size: 1.4em; line-height: 1.5em;font-weight:300; font-family: 'Alegreya Sans', sans-serif;text-align:center;">
                              No problem! Click below to reset it!
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
                              <a class="button" style="color: white; font-family: 'Alegreya Sans SC', sans-serif; letter-spacing: 2px; text-transform: lowercase; font-size: 16px; text-decoration: none; font-weight: 700; border-radius: 50px; padding: 10px 15px 12px 15px; border: 1px solid white; background: #4981C2; -webkit-text-size-adjust:none;" href="${url}">Reset Password</a>
                              <!--[if mso]>
                                  </center>
                                </v:roundrect>
                              <![endif]-->
                            </div>
                            <br>&nbsp;
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
        </html>`;
};

const validationTemplate = (url) => {
  return `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns:v="urn:schemas-microsoft-com:vml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>co/ment Account Validation Email</title>
          <style type="text/css">
          @import url(http://fonts.googleapis.com/css?family=Alegreya+Sans:300,700|Alegreya+Sans+SC:300,700);
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
            font-weight: 300;
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
            background: $4981C2;
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
                    font-weight: 300;
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
              <center><!-- [if gte mso 9]>
                    <v:background fill="t">
                    <v:fill type="tile" src="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x633.jpg" ></v:fill>
                    </v:background>
                    <![endif]-->
              <table background="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x633.jpg" cellpadding="0" cellspacing="0" class="w320 grad bkg" style="margin: 0 auto;" width="600">
                <tbody>
                  <tr>
                    <td background="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x633.jpg" bgcolor="#383061" height="633" style="height:633px; background-image:url(https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x633.jpg);background-repeat:no-repeat;background-color: #383061;" valign="top" class=""><!--[if gte mso 9]>
          <v:image xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style=" border: 0;display: inline-block; width: 600px; height: 633px;" src="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x633.jpg" ></v:image>
          <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style=" border: 0;display: inline-block;position: absolute; width: 600px; height: 633px;">
            <v:fill  opacity="0%" color="#383061"  ></v:fill>
            <v:textbox inset="0,0,0,0">
              <![endif]-->
                    <div>
                    <table cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                      <tbody>
                        <tr width="100%" height="60"><td>&nbsp;</td></tr>
                        <tr>
                          <td width="16%"></td>
                          <td width="67%"><br>
                          <a href="${url}"><img alt="co/ment" height="129" src="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_logo_400x129.png" style="padding-top:50px;margin:auto;text-align:center;" width="400"></a></td>
                          <td width="16%"></td>
                        </tr>
                  <tr>
                    <td width="100%" colspan="3" class="headline" style="color: #ffffff; font-family: 'Alegreya Sans', sans-serif; font-size: 36px; font-weight: 700; text-align: center;">Welcome!</td>
                  </tr>
                  <tr>
                    <td width="100%" colspan="3">
                    <center>
                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto;" width="60%">
                      <tbody>
                        <tr>
                          <td style="color:#ffffff;" class="">
                            <p style="color: white; font-size: 1.4em; line-height: 1.5em;font-weight:300; font-family: 'Alegreya Sans', sans-serif;text-align:center;">
                              Click below to validate your account:
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
                              <a class="button" style="color: white; font-family: 'Alegreya Sans SC', sans-serif; letter-spacing: 2px; text-transform: lowercase; font-size: 16px; text-decoration: none; font-weight: 700; border-radius: 50px; padding: 10px 15px 12px 15px; border: 1px solid white; background: #4981C2; -webkit-text-size-adjust:none;" href="${url}">Validate Email</a>
                              <!--[if mso]>
                                  </center>
                                </v:roundrect>
                              <![endif]-->
                            </div>
                            <br>&nbsp;
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
        </html>`;
};


const contactTemplate = (toUser, fromUser, fromEmail, bodyText, connectionId) => {
        return `
          <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns:v="urn:schemas-microsoft-com:vml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>co/ment Connection Request Email</title>
          <style type="text/css">
          @import url(http://fonts.googleapis.com/css?family=Alegreya+Sans:300,700|Alegreya+Sans+SC:300,700);
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
            font-weight: 300;
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
            background: url(https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x1502.jpg) no-repeat top center;
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
            background: $4981C2;
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
                    font-weight: 300;
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
              <center><!-- [if gte mso 9]>
                    <v:background fill="t">
                    <v:fill type="tile" src="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x1502.jpg" ></v:fill>
                    </v:background>
                    <![endif]-->
              <table background="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x1502.jpg" cellpadding="0" cellspacing="0" class="w320 grad bkg" style="margin: 0 auto;" width="600">
                <tbody>
                  <tr>
                    <td background="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x1502.jpg" bgcolor="#383061" height="633" style="height:1502px; background-image:url(https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x1502.jpg);background-repeat:no-repeat;background-color: #383061;" valign="top" class=""><!--[if gte mso 9]>
          <v:image xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style=" border: 0;display: inline-block; width: 600px; height: 1502px;" src="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600x1502.jpg" ></v:image>
          <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style=" border: 0;display: inline-block;position: absolute; width: 600px; height: 1502px;">
            <v:fill  opacity="0%" color="#383061"  ></v:fill>
            <v:textbox inset="0,0,0,0">
              <![endif]-->
                    <div>
                    <table cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                      <tbody>
                        <tr width="100%" height="60"><td>&nbsp;</td></tr>
                        <tr>
                          <td width="16%"></td>
                          <td width="67%"><br>
                        <a href="https://co-ment.glitch.me/connectiondetails/${connectionId}"><img alt="co/ment" height="129" src="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_logo_400x129.png?raw=true" style="padding-top:50px;" width="400"></a></td>
                          <td width="16%"></td>
                        </tr>
                        <tr>
                          <td width="100%" colspan="3" class="headline" style="color: #ffffff; font-family: 'Alegreya Sans', sans-serif; font-size: 36px; font-weight: 700; text-align: center;">Hello ${toUser}!</td>
                        </tr>
                      <tr>
                        <td width="100%" colspan="3">
                    <center>
                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto;" width="60%">
                      <tbody>
                        <tr>
                          <td style="color:#ffffff;" class="">
                            <p style="color: white; font-size: 1.4em; line-height: 1.5em;font-weight:300; font-family: 'Alegreya Sans', sans-serif;text-align:center;">Great news! <strong>${fromUser}</strong> (<a class="link" style="color: #ffffff; text-decoration: none; border-bottom: 1px transparent;" href="mailto:${fromEmail}">${fromEmail}</a>) has responded to your ad on co/ment!</p>

                              <p style="color: white; font-size: 1.2em; line-height: 1.4em;font-weight:300; text-align: left; padding: 0 20px;">${bodyText}</p>
                              <br>
                              &nbsp;</td>
                            </tr>
                            <tr>
                              <td class="">
                              <div style="text-align: center;"><!--[if mso]>
                              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://co-ment.glitch.me/connectiondetails/${connectionId}" style="height:76px;v-text-anchor:middle;width:300px;" arcsize="80%" stroke="f" fillcolor="#4981C2">
                                <w:anchorlock></w:anchorlock>
                                <center>
                              <![endif]--><a class="button" style="color: white; font-family: 'Alegreya Sans SC', sans-serif; letter-spacing: 2px; text-transform: lowercase; font-size: 16px; text-decoration: none; font-weight: 700; border-radius: 50px; padding: 10px 15px 12px 15px; border: 1px solid white; background: #4981C2; -webkit-text-size-adjust:none;" href="https://co-ment.glitch.me/connectiondetails/${connectionId}">View Connection</a> <!--[if mso]>
                                </center>
                              </v:roundrect>
                            <![endif]--></div>
                              <br>
                              &nbsp;</td>
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
      </html>
        `;
      };


module.exports = {
    pwResetTemplate    : pwResetTemplate,
    validationTemplate : validationTemplate,
    contactTemplate    : contactTemplate
};
