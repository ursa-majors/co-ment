export const languages = ['Afrikaans', 'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Azerbaijani', 'Basque', 'Belarusian', 'Bengali', 'Bosnian', 'Bulgarian', 'Catalan', 'Cebuano', 'Chichewa', 'Chinese', 'Corsican', 'Croatian', 'Czech', 'Danish', 'Dutch', 'English', 'Esperanto', 'Estonian', 'Filipino', 'Finnish', 'French', 'Frisian', 'Galician', 'Georgian', 'German', 'Greek', 'Gujarati', 'Haitian Creole', 'Hausa', 'Hawaiian', 'Hebrew', 'Hindi', 'Hmong', 'Hungarian', 'Icelandic', 'Igbo', 'Indonesian', 'Irish', 'Italian', 'Japanese', 'Javanese', 'Kannada', 'Kazakh', 'Khmer', 'Korean', 'Kurdish (Kurmanji)', 'Kyrgyz', 'Lao', 'Latin', 'Latvian', 'Lithuanian', 'Luxembourgish', 'Macedonian', 'Malagasy', 'Malay', 'Malayalam', 'Maltese', 'Maori', 'Marathi', 'Mongolian', 'Myanmar (Burmese)', 'Nepali', 'Norwegian', 'Pashto', 'Persian', 'Polish', 'Portuguese', 'Punjabi', 'Romanian', 'Russian', 'Samoan', 'Scots Gaelic', 'Serbian', 'Sesotho', 'Shona', 'Sindhi', 'Sinhala', 'Slovak', 'Slovenian', 'Somali', 'Spanish', 'Sundanese', 'Swahili', 'Swedish', 'Tajik', 'Tamil', 'Telugu', 'Thai', 'Turkish', 'Ukrainian', 'Urdu', 'Uzbek', 'Vietnamese', 'Welsh', 'Xhosa', 'Yiddish', 'Yoruba', 'Zulu'];

export const skills = ['.htaccess', '.net', 'ajax', 'algorithm', 'android', 'angular', 'angularjs', 'apache', 'api', 'arrays', 'asp.net', 'asp.net-mvc', 'bash', 'c', 'c#', 'c++', 'class', 'codeigniter', 'cordova', 'css', 'css3', 'database', 'django', 'eclipse', 'entity-framework', 'excel', 'excel-vba', 'facebook', 'file', 'forms', 'function', 'git', 'google-chrome', 'google-maps', 'hibernate', 'html', 'html5', 'image', 'ios', 'iphone', 'java', 'javascript', 'jquery', 'json', 'laravel', 'linq', 'linux', 'list', 'loops', 'matlab', 'maven', 'mongodb', 'multithreading', 'mysql', 'node.js', 'objective-c', 'oracle', 'osx', 'performance', 'perl', 'php', 'postgresql', 'powershell', 'python', 'python-2.7', 'python-3.x', 'qt', 'r', 'reactjs', 'regex', 'rest', 'ruby', 'ruby-on-rails', 'ruby-on-rails-3', 'scala', 'shell', 'sockets', 'spring', 'sql', 'sql-server', 'sql-server-2008', 'sqlite', 'string', 'swift', 'swing', 'symfony', 'twitter-bootstrap', 'uitableview', 'unit-testing', 'validation', 'vb.net', 'vba', 'visual-studio', 'web-services', 'windows', 'winforms', 'wordpress', 'wpf', 'xcode', 'xml'];

export const timezones = [
['-12', 'Eniwetok, Kwajalein'],
['-11', 'Midway Island, Samoa'],
['-10', 'Hawaii'],
['-9', 'Alaska'],
['-8', 'Pacific Time (US & Canada)'],
['-7', 'Mountain Time (US & Canada)'],
['-6', 'Central Time (US & Canada), Mexico City'],
['-5', 'Eastern Time (US & Canada), Bogota, Lima'],
['-4.5', 'Caracas'],
['-4', 'Atlantic Time (Canada), La Paz, Santiago'],
['-3.5', 'Newfoundland'],
['-3', 'Brazil, Buenos Aires, Georgetown'],
['-2', 'Mid-Atlantic'],
['-1', 'Azores, Cape Verde Islands'],
['+0', 'Western Europe Time, London, Lisbon, Casablanca, Greenwich'],
['+1', 'Brussels, Copenhagen, Madrid, Paris'],
['+2', 'Kaliningrad, South Africa, Cairo'],
['+3', 'Baghdad, Riyadh, Moscow, St. Petersburg'],
['+3.5', 'Tehran'],
['+4', 'Abu Dhabi, Muscat, Yerevan, Baku, Tbilisi'],
['+4.5', 'Kabul'],
['+5', 'Ekaterinburg, Islamabad, Karachi, Tashkent'],
['+5.5', 'Mumbai, Kolkata, Chennai, New Delhi'],
['+5.75', 'Kathmandu'],
['+6', 'Almaty, Dhaka, Colombo'],
['+6.5', 'Yangon, Cocos Islands'],
['+7', 'Bangkok, Hanoi, Jakarta'],
['+8', 'Beijing, Perth, Singapore, Hong Kong'],
['+9', 'Tokyo, Seoul, Osaka, Sapporo, Yakutsk'],
['+9.5', 'Adelaide, Darwin'],
['+10', 'Eastern Australia, Guam, Vladivostok'],
['+11', 'Magadan, Solomon Islands, New Caledonia'],
['+12', 'Auckland, Wellington, Fiji, Kamchatka'],
];

export const formatDate = (date) => {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${day} ${monthNames[monthIndex]} ${year}`;
};