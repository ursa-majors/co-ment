const slides = [
  {
    title: 'Introduction',
    image: '',
    imageAlt: '',
    __html: `<div>
    <p>Welcome to <strong>co/ment</strong> &mdash; a community to connect mentors and mentees to accelerate your coding journey</p>
    <p><strong>co/ment</strong> offers tools to help you find a coding partner tailored to your needs: search for a specific technical background, skill set, spoken language, or time zone.</p>
    <p>No matter where you stand on the coding path, there are others both ahead of you and behind. There are no requirements to become a mentor except a willingness to share your knowledge.</p>
    </div>`,
    slideId: 1,
  },
  {
    title: 'Step 1: Profile',
    image: 'https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/profile.png',
    imageAlt: 'Profile',
    __html: `<div>
    <p>Begin by filling out your profile</p>
    <p>Add skills, languages, time zone, and links to your social profiles</p>
    <p>This information will help you find the perfect coding partner.</p>
    </div>`,
    slideId: 2,
  },
  {
    title: 'Step 2: Posts',
    image: 'https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/post.png',
    imageAlt: 'Posts',
    __html: `<div>
    <p>Next, create a post that describes the match you're seeking.</p>
    <p>Other users can connect with you through your post.</p>
    <p>You'll get an email from <strong>co/ment</strong> when a user wants to connect.</p>
    </div>`,
    slideId: 3,
  },
  {
    title: 'Step 3: Connections',
    image: 'https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/connection.gif',
    imageAlt: 'Connections',
    __html: `<div>
    <p>When you a find match, request a connection!</p>
    <p>The user will receive an email with your request</p>
    <p>Once you are connected, you decide how to move forward. Set up a video chat, a pair-programming session, or share your skills via email or Slack.</p>
    </div>`,
    slideId: 4,
  },
];

const faq = [
  { question: 'Who can be a mentor?',
    __html: `<div>Anyone! The only requirement is a willingness to share your skills.`,
    id: 'q1',
  },
  { question: 'How does the mentor/mentee relationship work?',
    __html: `<div>Once a user accepts your connection request, you will be notified by email. At that point, the mentor and mentee will agree on the best way to continue the relationship. Communication will take place outside the <strong>co/ment</strong> platform, and can use any format that works for you&mdash;phone, email, Slack, hangouts, in-person&mdash;the possibilities are endless.</div>`,
    id: 'q2',
  },
  { question: 'How long does a mentorship last?',
    __html: `<div>It's up to  you! Depending on your goals, you may have a single meeting or work together for an entire year. Keep it up as long as the connection is productive for you.</div>`,
    id: 'q3',
  },
  { question: 'I can\'t find a mentor for skill XYZ. What do I do?',
    __html: `<div><a href="mailto:findyourguidingstar@gmail.com">Contact us</a> and we'll do our best to find you a mentor.</div>`,
    id: 'q4',
  },
];

export {
  slides,
  faq,
};
