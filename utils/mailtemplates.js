/* utils/mailtemplates.js

  Just a place to stash email markup

*/

const contactTemplate = (to_user, from_user, from_email, bodyText, connectionId) => {
  console.log('mailtemplatesjs', connectionId);
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
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

  .gradient {
    background: #22c1c3;
    background: -webkit-linear-gradient(to top, #22c1c3, #4981C2);
    background: linear-gradient(to top, #22c1c3, #4981C2);
  }

  .headline {
    color: #ffffff;
    font-size: 36px;
  }

 .force-full-width {
  width: 100% !important;
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


    }
  </style>
</head>
<body class="body" style="padding:0; margin:0; display:block; background:#ffffff; -webkit-text-size-adjust:none" bgcolor="#ffffff">
<table align="center" cellpadding="0" cellspacing="0" height="100%" width="100%">
  <tbody>
    <tr>
      <td align="center" bgcolor="#ffffff" valign="top" width="100%" class="">
      <center>
      <table cellpadding="0" cellspacing="0" class="w320" style="margin: 0 auto;" width="600">
        <tbody>
          <tr>
            <td align="center" valign="top">
            <table cellpadding="0" cellspacing="0" style="margin: 0 auto;" width="100%">
              <tbody>
              </tbody>
            </table>

            <table cellpadding="0" cellspacing="0" class="gradient" style="margin: 0 auto;" width="100%">
              <tbody>
                <tr>
                  <td class=""><br>
                  <img alt="co/ment" height="129" src="https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/co-ment_logo_400x129.png?raw=true" width="400"></td>
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
                        <p style="color: white; font-size: 1.4em; line-height: 1.5em;font-weight:100;">Great news! <strong>${from_user}</strong> (<a href="mailto:${from_email}" style="color: #ffffff; border-bottom: 1px dotted #fff;">${from_email}</a>) has responded to your ad on co/ment!</p>

                        <p style="color: white; font-size: 1.2em; line-height: 1.4em;font-weight:100;">${bodyText}</p>
                        <br>
                        &nbsp;</td>
                      </tr>
                      <tr>
                        <td class="">
                        <div><!--[if mso]>
                        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://co-ment.glitch.me/connections" style="height:50px;v-text-anchor:middle;width:200px;" arcsize="80%" stroke="f" fillcolor="#178f8f">
                          <w:anchorlock></w:anchorlock>
                          <center>
                        <![endif]--><a href="http://co-ment.glitch.me/connectiondetails/${connectionId}" style="background-color:transparent;border-radius:40px;color:#ffffff;border: 1px solid #ffffff; display:inline-block;font-family:'Alegreya Sans SC', 'Helvetica Neue', 'Arial', 'sans-serif' !important;font-size:16px;font-weight:100;line-height:50px;text-align:center;text-transform:lowercase;letter-spacing:2px;text-decoration:none;width:200px;-webkit-text-size-adjust:none;">View Connection</a> <!--[if mso]>
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
            </td>
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
