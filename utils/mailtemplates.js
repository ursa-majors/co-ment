/* utils/mailtemplates.js

  Just a place to stash email markup

*/

const contactTemplate = (to_user, from_user, from_email, bodyText, connectionId) => {
  console.log('mailtemplatesjs', connectionId);
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>co/ment Contact Request Email</title>

  <style type="text/css">
  @import url(http://fonts.googleapis.com/css?family=Alegreya+Sans:100|Alegreya+Sans+SC:100);

  /* Take care of image borders and formatting */

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
    color: #bbbbbb;
  }

  a img {
    border: none;
  }

  /* General styling */

  td, h1, h2, h3  {
    font-family: 'Alegreya Sans', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
    font-weight: 100;
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
    background: #4981C2;
    background: -webkit-linear-gradient(to top, #22c1c3, #4981C2);
    background: linear-gradient(to top, #22c1c3, #4981C2);
  }

  .bkg {
    background: #4981C2;
    background: -webkit-linear-gradient(to top, #22c1c3, #4981C2);
    background: linear-gradient(to top, #22c1c3, #4981C2);
    background: url(https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600.png) no-repeat top center;
      -webkit-background-size: cover;
      -moz-background-size: cover;
      -o-background-size: cover;
      background-size: cover;
  }

  .headline {
    color: #ffffff;
    font-size: 36px;
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
    font-weight: 100;
    border-radius: 50px;
    padding: 10px;
    border: 1px solid white;
    background: transparent;
    -webkit-text-size-adjust:none;
  }

.button:hover, .button::active, .button::focus {
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
      background: rgba(255, 255, 255, 0.2);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
      transition: all 300ms ease-in-out;
    }


  </style>

  <style type="text/css" media="screen">
      @media screen {
         /*Thanks Outlook 2013! http://goo.gl/XLxpyl*/
        td, h1, h2, h3 {
          font-family: 'Alegreya Sans', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
          font-weight: 100;
        }
      }
  </style>

  <style type="text/css" media="only screen and (max-width: 480px)">
    /* Mobile styles */
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
            <v:fill type="tile" src="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600.png" ></v:fill>
            </v:background>
            <![endif]-->
      <table background="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600.png" cellpadding="0" cellspacing="0" class="w320 grad bkg" style="margin: 0 auto;" width="600">
        <tbody>
          <tr>
            <td background="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600.png" bgcolor="#4981C2" height="548" style="height:548px; background-image:url(https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600.png);background-repeat:no-repeat;background-color: #4981C2;" valign="top" class=""><!--[if gte mso 9]>
  <v:image xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style=" border: 0;display: inline-block; width: 600px; height: 548px;" src="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_email-bkg_600.png" ></v:image>
  <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style=" border: 0;display: inline-block;position: absolute; width: 600px; height: 548px;">
    <v:fill  opacity="0%" color="#4981C2"  ></v:fill>
    <v:textbox inset="0,0,0,0">
      <![endif]-->
            <div>
            <table cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
              <tbody>
                <tr>
                  <td class=""><br>
                  <a href="https://co-ment.glitch.me/connectiondetails/${connectionId}"><img alt="co/ment" height="129" src="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_logo_400x129.png?raw=true" style="padding-top:50px;" width="400"></a></td>
                </tr>
                <tr>
                  <td class="headline">Hello ${to_user}!</td>
                </tr>
                <tr>
                  <td class="">
                  <center>
                  <table cellpadding="0" cellspacing="0" style="margin: 0 auto;" width="60%">
                    <tbody>
                      <tr>
                        <td style="color:#ffffff;" class="">&nbsp;
                        <p style="color: white; font-size: 1.4em; line-height: 1.5em;font-weight:100;">Great news! <strong>${from_user}</strong> (<a class="link" href="mailto:${from_email}">${from_email}</a>) has responded to your ad on co/ment!</p>

                        <p style="color: white; font-size: 1.2em; line-height: 1.4em;font-weight:100; text-align: left; padding: 0 20px;">${bodyText}</p>
                        <br>
                        &nbsp;</td>
                      </tr>
                      <tr>
                        <td class="">
                        <div><!--[if mso]>
                        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://co-ment.glitch.me/connectiondetails/${connectionId}" style="height:50px;v-text-anchor:middle;width:200px;" arcsize="80%" stroke="f" fillcolor="#178f8f">
                          <w:anchorlock></w:anchorlock>
                          <center>
                        <![endif]--><a class="button" href="https://co-ment.glitch.me/connectiondetails/${connectionId}">View Connection</a> <!--[if mso]>
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
  contactTemplate : contactTemplate
};
