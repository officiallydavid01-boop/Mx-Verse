
import {
  Home,
  Compass,
  Users,
  MessageCircle,
  Bell,
  CalendarDays,
  UserRound,
  Settings,
  PlusCircle,
  Sparkles,
  Construction,
} from 'lucide-react';

function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-page-header">
      <span className="mx-page-eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

function ComingSoon({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <section className="mx-coming-soon">
      <div className="mx-coming-icon">
        <Icon size={27} />
      </div>
      <span className="mx-coming-label">
        <Construction size={13} /> UNDER DEVELOPMENT
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="mx-coming-decoration">
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}

export function HomeFeedPage() {
  return (
    <div className="mx-page">
      <PageHeader
        eyebrow="YOUR CAMPUS, YOUR UNIVERSE"
        title="Your home feed."
        description="See what's happening around your campus and connect with your people."
      />

      <div className="mx-feed-welcome">
        <div className="mx-feed-welcome-content">
          <div className="mx-feed-sparkle">
            <Sparkles size={19} />
          </div>
          <div>
            <span className="mx-feed-label">WELCOME TO MXVERSE</span>
            <h2>Your campus story starts here.</h2>
            <p>
              This is your space for campus conversations, student
              experiences, updates and discoveries.
            </p>
          </div>
        </div>
        <div className="mx-feed-orbit">MX</div>
      </div>

      <div className="mx-feed-section-heading">
        <div>
          <h2>Campus conversations</h2>
          <p>Your community's activity will appear here.</p>
        </div>
        <span className="mx-live-indicator">
          <span /> FEED COMING SOON
        </span>
      </div>

      <ComingSoon
        icon={MessageCircle}
        title="The conversation starts soon."
        description="Your home feed is being prepared. Soon you'll be able to share posts, photos, thoughts and campus updates with other FUTMINNA students."
      />
    </div>
  );
}

export function ExplorePage() {
  return (
    <div className="mx-page">
      <PageHeader
        eyebrow="DISCOVER SOMETHING NEW"
        title="Explore."
        description="Find interesting people, conversations and communities across FUTMINNA."
      />
      <ComingSoon
        icon={Compass}
        title="Discover your universe."
        description="Student discovery, trending conversations and campus interests will live here."
      />
    </div>
  );
}

export function CommunitiesPage() {
  return (
    <div className="mx-page">
      <PageHeader
        eyebrow="FIND YOUR PEOPLE"
        title="Communities."
        description="Connect with students who share your interests, courses and passions."
      />
      <ComingSoon
        icon={Users}
        title="Your communities are coming."
        description="Discover and join student communities, academic circles and interest groups."
      />
    </div>
  );
}

export function MessagesPage() {
  return (
    <div className="mx-page">
      <PageHeader
        eyebrow="STAY CONNECTED"
        title="Messages."
        description="Your private conversations and group chats will live here."
      />
      <ComingSoon
        icon={MessageCircle}
        title="Your conversations await."
        description="Private messaging and group conversations are planned for a future build."
      />
    </div>
  );
}

export function NotificationsPage() {
  return (
    <div className="mx-page">
      <PageHeader
        eyebrow="STAY IN THE LOOP"
        title="Notifications."
        description="Keep up with activity and updates that matter to you."
      />
      <ComingSoon
        icon={Bell}
        title="Nothing to notify you about yet."
        description="Follows, replies, reactions, mentions and other notifications will appear here."
      />
    </div>
  );
}

export function EventsPage() {
  return (
    <div className="mx-page">
      <PageHeader
        eyebrow="WHAT'S HAPPENING"
        title="Campus events."
        description="Discover events, opportunities and activities around campus."
      />
      <ComingSoon
        icon={CalendarDays}
        title="Something is coming."
        description="Campus events, student activities and opportunities will be available here."
      />
    </div>
  );
}

export function ProfilePage() {
  return (
    <div className="mx-page">
      <PageHeader
        eyebrow="YOUR IDENTITY"
        title="My profile."
        description="Your MXVERSE identity and campus presence."
      />
      <ComingSoon
        icon={UserRound}
        title="Your profile space."
        description="Your profile details, posts, followers and following will be displayed here."
      />
    </div>
  );
}

export function SettingsPage() {
  return (
    <div className="mx-page">
      <PageHeader
        eyebrow="MAKE IT YOURS"
        title="Settings."
        description="Manage your account, preferences and privacy."
      />
      <ComingSoon
        icon={Settings}
        title="Your preferences."
        description="Account settings, privacy controls, notification preferences and security options will live here."
      />
    </div>
  );
}

export function CreatePostPage() {
  return (
    <div className="mx-page">
      <PageHeader
        eyebrow="SHARE YOUR MOMENT"
        title="Create a post."
        description="Share something with your campus community."
      />
      <ComingSoon
        icon={PlusCircle}
        title="Your voice belongs here."
        description="The post composer with photo uploads and audience controls is coming in the next feature build."
      />
    </div>
  );
}
