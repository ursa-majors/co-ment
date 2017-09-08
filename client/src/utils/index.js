import React from 'react';

const handleFirstTab = (e) => {
  if (e.keyCode === 9) {
    document.body.classList.add('user-is-tabbing');
    window.removeEventListener('keydown', handleFirstTab);
    window.addEventListener('mousedown', handleMouseDownOnce);
  }
}

const handleMouseDownOnce = () => {
  document.body.classList.remove('user-is-tabbing');
  window.removeEventListener('mousedown', handleMouseDownOnce);
  window.addEventListener('keydown', handleFirstTab);
}

window.addEventListener('keydown', handleFirstTab);

export const languages = ['Afrikaans', 'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Azerbaijani', 'Basque', 'Belarusian', 'Bengali', 'Bosnian', 'Bulgarian', 'Catalan', 'Cebuano', 'Chichewa', 'Chinese', 'Corsican', 'Croatian', 'Czech', 'Danish', 'Dutch', 'English', 'Esperanto', 'Estonian', 'Filipino', 'Finnish', 'French', 'Frisian', 'Galician', 'Georgian', 'German', 'Greek', 'Gujarati', 'Haitian Creole', 'Hausa', 'Hawaiian', 'Hebrew', 'Hindi', 'Hmong', 'Hungarian', 'Icelandic', 'Igbo', 'Indonesian', 'Irish', 'Italian', 'Japanese', 'Javanese', 'Kannada', 'Kazakh', 'Khmer', 'Korean', 'Kurdish (Kurmanji)', 'Kyrgyz', 'Lao', 'Latin', 'Latvian', 'Lithuanian', 'Luxembourgish', 'Macedonian', 'Malagasy', 'Malay', 'Malayalam', 'Maltese', 'Maori', 'Marathi', 'Mongolian', 'Myanmar (Burmese)', 'Nepali', 'Norwegian', 'Pashto', 'Persian', 'Polish', 'Portuguese', 'Punjabi', 'Romanian', 'Russian', 'Samoan', 'Scots Gaelic', 'Serbian', 'Sesotho', 'Shona', 'Sindhi', 'Sinhala', 'Slovak', 'Slovenian', 'Somali', 'Spanish', 'Sundanese', 'Swahili', 'Swedish', 'Tajik', 'Tamil', 'Telugu', 'Thai', 'Turkish', 'Ukrainian', 'Urdu', 'Uzbek', 'Vietnamese', 'Welsh', 'Xhosa', 'Yiddish', 'Yoruba', 'Zulu'];

export const skills = [".NET", "ASP", "ABAP", "Android", "AngularJS", "Angular", "Apache", "Aurelia", "Back End Development", "Bash", "Bootstrap", "es2015", "C", "C#", "C++", "Canvas", "Chai", "Clojure", "Closure", "CoffeeScript", "ColdFusion", "Cordova", "CSS", "D", "D3.js", "Dart", "Data Science", "Databases", "Delphi", "Design", "Django", "Drupal", "EJS", "Elasticsearch", "Elm", "Elixir", "Erlang", "ExpressJS", "F#", "Flask", "Fortran", "Functional Programming", "Git", "GitHub", "Go", "GraphQL", "Grommet", "Groovy", "gRPC", "Grunt", "Hadoop", "Heroku", "HTML", "InDesign", "Ionic", "iOS", "Jasmine", "Java", "JavaScript", "JavaScript closures", "Jekyll", "Jest", "jQuery", "Julia", "Keras", "Kotlin", "LAMP", "Linux", "Lisp", "Lua", "Machine Learning", "Maths", "MATLAB", "Meteor", "Mocha", "MomentJS", "MongoDB", "Mongoose", "Mustache.js", "MVC", "Node.js", "Objective-C", "OCaml", "p5.js", "Perl", "PhaserJS", "PhoneGap", "Photoshop", "Phaser", "PHP", "PostgreSQL", "PowerShell", "Promises", "Processing", "Pug", "Python", "QUnit", "R", "ReactJS", "React Native", "react-router", "Redis", "Redux", "redux-saga", "Regular Expressions", "REST", "Ruby", "Rust", "Salesforce", "SASS", "Scala", "SCSS", "SharePoint", "Sketch", "Smalltalk", "Socket.io", "Spark", "Spring", "SQL", "Surge", "SVG", "Swift", "TensorFlow", "Test Driven Development", "TypeScript", "Unity", "Vim", "VirtualBox", "Visual Basic", "Vue.js", "webpack", "WordPress", "Xamarin",];

export const timezones = [
['-12', 'Eniwetok, Kwajalein'], ['-11', 'Midway Island, Samoa'], ['-10', 'Hawaii'], ['-9', 'Alaska'], ['-8', 'Pacific Time (US & Canada)'], ['-7', 'Mountain Time (US & Canada)'], ['-6', 'Central Time (US & Canada), Mexico City'], ['-5', 'Eastern Time (US & Canada), Bogota, Lima'], ['-4.5', 'Caracas'], ['-4', 'Atlantic Time (Canada), La Paz, Santiago'], ['-3.5', 'Newfoundland'], ['-3', 'Brazil, Buenos Aires, Georgetown'], ['-2', 'Mid-Atlantic'], ['-1', 'Azores, Cape Verde Islands'], ['+0', 'Western Europe Time, London, Lisbon, Casablanca, Greenwich'], ['+1', 'Brussels, Copenhagen, Madrid, Paris'], ['+2', 'Kaliningrad, South Africa, Cairo'], ['+3', 'Baghdad, Riyadh, Moscow, St. Petersburg'], ['+3.5', 'Tehran'], ['+4', 'Abu Dhabi, Muscat, Yerevan, Baku, Tbilisi'], ['+4.5', 'Kabul'], ['+5', 'Ekaterinburg, Islamabad, Karachi, Tashkent'], ['+5.5', 'Mumbai, Kolkata, Chennai, New Delhi'], ['+5.75', 'Kathmandu'], ['+6', 'Almaty, Dhaka, Colombo'], ['+6.5', 'Yangon, Cocos Islands'], ['+7', 'Bangkok, Hanoi, Jakarta'], ['+8', 'Beijing, Perth, Singapore, Hong Kong'], ['+9', 'Tokyo, Seoul, Osaka, Sapporo, Yakutsk'], ['+9.5', 'Adelaide, Darwin'], ['+10', 'Eastern Australia, Guam, Vladivostok'], ['+11', 'Magadan, Solomon Islands, New Caledonia'], ['+12', 'Auckland, Wellington, Fiji, Kamchatka'], ];

// ////// autosuggest helper functions ///////

export const parse = (text, matches) => {
  let result = [];

  if (matches.length === 0) {
    result.push({
      text: text,       highlight: false
    });
  } else {
    if (matches[0][0] > 0) {
      result.push({
        text: text.slice(0, matches[0][0]),         highlight: false
      });
    }
  }

  matches.forEach(function(match, i) {
    const startIndex = match[0];
    const endIndex = match[1];

    result.push({
      text: text.slice(startIndex, endIndex),       highlight: true
    });

    if (i === matches.length - 1) {
      if (endIndex < text.length) {
        result.push({
          text: text.slice(endIndex, text.length),           highlight: false
        });
      }
    } else if (endIndex < matches[i + 1][0]) {
      result.push({
        text: text.slice(endIndex, matches[i + 1][0]),         highlight: false
      });
    }
  });

  return result;
};

const removeDiacritics = require('diacritic').clean;

const specialCharsRegex = /[.*+?^${}()|[\]\\]/g;

const wordCharacterRegex = /[a-z0-9_]/i;

const whitespacesRegex = /\s+/;

const escapeRegexCharacters = (str) => {
  return str.replace(specialCharsRegex, '\\$&');
}

export const match = (text, query) => {
  text = removeDiacritics(text);

  return query
    .trim()
    .split(whitespacesRegex)
    // If query is blank, we'll get empty string here, so let's filter it out.
    .filter(function(word) {
      return word.length > 0;
    })
    .reduce(function(result, word) {
      const wordLen = word.length;
      const prefix = wordCharacterRegex.test(word[0]) ? '\\b' : '';
      const regex = new RegExp(prefix + escapeRegexCharacters(word), 'i');
      const index = text.search(regex);

      if (index > -1) {
        result.push([index, index + wordLen]);

        // Replace what we just found with spaces so we don't find it again.
        text =
          text.slice(0, index) +
          (new Array(wordLen + 1)).join(' ') +
          text.slice(index + wordLen);
      }

      return result;
    }, [])
    .sort(function(match1, match2) {
      return match1[0] - match2[0];
    });
};

////// timezone hint (not implemented but maybe try this later...) /////

const tzList = timezones.map(i =>
	`(UTC ${i[0]}) ${i[1]}`,       );

const split = new Date().toString().split(' ');
const tzOffset = split[split.length - 2];
const numericOffset = tzOffset.substr(tzOffset.length - 5) / 100;
// console.log(`numericOffset: ${numericOffset}`);
const tzVal = numericOffset < 0 ? `(UTC ${numericOffset})` : `(UTC + ${numericOffset})`;
const filterList = q => tzList.filter(i => i.indexOf(q) > -1);
export const tzGuess = filterList(tzVal)[0];

////// date formatter for post cards //////

export const formatDate = (date) => {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',   ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${day} ${monthNames[monthIndex]} ${year}`;
};

////// adjust textarea size to fit content ///////
export const adjustTextArea = (target) => {
    // expand input height to fit content without scrollbar
    const el = target;
    let adjustedHeight = el.clientHeight;
    adjustedHeight = Math.max(el.scrollHeight, adjustedHeight);
    if (adjustedHeight > el.clientHeight) { el.style.height = `${adjustedHeight + 20}px`; }
  }

////// page scrolling for slide footer nav in about/tour section //////
////// source: https://codepen.io/pawelgrzybek/pen/ZeomJB

export const scrollIt = (destination, duration = 200, easing = 'linear', callback) => {

  const easings = {
    linear(t) {
      return t;
    },
    easeInQuad(t) {
      return t * t;
    },
    easeOutQuad(t) {
      return t * (2 - t);
    },
    easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic(t) {
      return t * t * t;
    },
    easeOutCubic(t) {
      return (--t) * t * t + 1;
    },
    easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
  };


  // Store initial position of a window and time
  // If performance is not available in your browser
  // It will fallback to new Date().getTime() - thanks IE < 10
  const start = window.pageYOffset;
  const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
  // const startTime = typeof(window.performance['now']) == 'function' ? performance.now() : new Date().getTime();


  // Take height of window and document to sesolve max scrollable value
  // Prevent requestAnimationFrame() from scrolling below maximum scollable value
  // Resolve destination type (node or number)
  const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
  const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
  const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
  const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

  // If requestAnimationFrame is not supported
  // Move window to destination position and trigger callback function
  if ('requestAnimationFrame' in window === false) {
    window.scroll(0, destinationOffsetToScroll);
    if (callback) {
      callback();
    }
    return;
  }

  // function resolves position of a window and moves to exact amount of pixels
  // Resolved by calculating delta and timing function choosen by user
  function scroll() {
    const now = 'now' in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, ((now - startTime) / duration));
    const timeFunction = easings[easing](time);
    window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

    // Stop requesting animation when window reached its destination
    // And run a callback function
    if (window.pageYOffset === destinationOffsetToScroll) {
      if (callback) {
        callback();
      }
      return;
    }

    // If window still needs to scroll to reach destination
    // Request another scroll invokation
    requestAnimationFrame(scroll);
  }

  // Invoke scroll and sequential requestAnimationFrame
  scroll();
}

// delay function to hide search input after user stops typing
export const delay = (function(){
  let timer = 0;
  return function(callback, ms){
  clearTimeout (timer);
  timer = setTimeout(callback, ms);
 };
})();
