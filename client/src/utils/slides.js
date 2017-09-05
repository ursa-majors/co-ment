const slides = [
  {
    title: 'Introduction',
    image: '',
    imageAlt: '',
    __html: `<div>
    <p>Welcome to Co/Ment - a community to connect Mentors and Mentees to accelerate their code journey</p>
    <p>The site features the tools to help you find a coding partner tailored to your needs - from matching your technical background, to your spoken language...even your timezone.</p>
    <p>No matter where you stand on the coding path, there are others both ahead of you and behind.  There's no requirement to becoming a mentor - just a willingness to share your knowledge.</p>
    </div>`,
    slideId: 1,
  },
  {
    title: 'Step 1: Profile',
    image: './src/img/profile.png',
    imageAlt: 'Profile',
    __html: `<div>
    <p>Begin by filling out your profile</p>
    <p>Add skills, languages, timezone and links to your social profiles</p>
    <p>This information will help you find the perfect contact</p>
    </div>`,
    slideId: 2,
  },
  {
    title: 'Step 2: Posts',
    image: './src/img/post.png',
    imageAlt: 'Posts',
    __html: `<div>
    <p>Next, create a post advertising your desired match.</p>
    <p>Other users can connect to you through your post.</p>
    <p>You will be notified by an email when a user wants to connect.</p>
    </div>`,
    slideId: 3,
  },
  {
    title: 'Step 3: Connections',
    image: './src/img/connection.gif',
    imageAlt: 'Connections',
    __html: `<div>
    <p>You can request a connection when you a find a post that matches your needs.</p>
    <p>The user will receive an email with your request</p>
    <p>Once you are connected, the mentorship can proceed through eMail, Slack or even in-person meetings.</p>
    </div>`,
    slideId: 4,
  },
];

const faq = [
  { question: 'What is required to be a mentor?',
    answer: 'Anyone can be a mentor! The only major requirement is a willingness to share what you\'ve learned.  ',
    id: 'q1',
  },
  { question: 'How does the mentor/mentee relationship work?',
    answer: 'Once the connection request has been accepted, you will be notified via email.  At that point, the Mentor and Mentee will agree on the best way to continue the relationship.  Communication will take place outside the Co/Ment platform, but can use any format that works for both parties - phone, email, Slack, hangouts, in-person - the possibilities are endless',
    id: 'q2',
  },
  { question: 'How long does a mentorship last?',
    answer: 'There is no set time for a Mentorship.  Depending on your goals, you may have a single meeting or meet for an entire year.  Keep it up as long as your connection is productive for you.',
    id: 'q3',
  },
  { question: 'I can\'t find a mentor for skill XYZ. What do I do?',
    answer: 'Send us an email at guidingstar@gmail.com and we\'ll do our best to find you a mentor.',
    id: 'q4',
  },
];

export {
  slides,
  faq,
};
