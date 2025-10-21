import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface BlogPost {
  id: number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  content: string; 
}

export interface Event {
  id: number;
  title: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  category: string;
  description: string;
  registrationLink?: string;
}

export interface GalleryImage {
  id: number | string;
  alt: string;
  imageUrl: string;
}

export interface EventFrame {
  id: number | string;
  name: string;
  imageUrl: string;
}

export interface RoverMate {
  id: number;
  imageUrl: string;
  name: string;
  title: string;
  idNumber: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  relation: string; // e.g., 'Parent', 'Rover Scout'
}

export interface RNMSGBook {
  id: number;
  title: string;
  fileUrl: string; // Can be a URL to a PDF or an image
  coverUrl?: string;
}

export interface RecruitmentSection {
  id: number;
  title: string;
  age: string;
  description: string;
  imageUrl: string;
  colorClass: string;
  applyLink: string;
}

export interface Awardee {
  id: string;
  name: string;
  year: number;
  imageUrl?: string;
}

export type AwardCategory = 'Cub Scout' | 'Scout' | 'Rover Scout' | 'Adult Leader' | 'Special';

export interface Award {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  categories: AwardCategory[];
  awardees?: Awardee[];
}

export interface Moderator {
  id: number;
  fullName: string;
  username: string;
  password_val: string;
  pin: string;
  imageUrl?: string;
}

export interface NavLink {
  id: number;
  title: string;
  path: string;
  order: number;
  parentId: number | null;
}

export interface CommitteeMember {
  id: number;
  imageUrl: string;
  name: string;
  designation: string;
  session: string;
}

export interface Founder {
  id: number;
  imageUrl: string;
  name: string;
  designation: string;
  session: string;
}

export interface PatrolMember {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
}

export interface Patrol {
  id: string;
  name: string;
  members: PatrolMember[];
}

export interface PatrolSection {
  id: string;
  name: string;
  color: string;
  isVisible: boolean;
  patrols: Patrol[];
}


interface DataContextType {
    blogPosts: BlogPost[];
    events: Event[];
    galleryImages: GalleryImage[];
    eventFrames: EventFrame[];
    roverMates: RoverMate[];
    testimonials: Testimonial[];
    rnmsgBooks: RNMSGBook[];
    recruitmentSections: RecruitmentSection[];
    awards: Award[];
    moderators: Moderator[];
    navLinks: NavLink[];
    committeeMembers: CommitteeMember[];
    founders: Founder[];
    patrolSections: PatrolSection[];
    setNavLinks: (links: NavLink[]) => void;
    addBlogPost: (post: Omit<BlogPost, 'id'>) => void;
    updateBlogPost: (post: BlogPost) => void;
    deleteBlogPost: (id: number) => void;
    addEvent: (event: Omit<Event, 'id'>) => void;
    updateEvent: (event: Event) => void;
    deleteEvent: (id: number) => void;
    addGalleryImage: (image: Omit<GalleryImage, 'id' | 'imageUrl'> & {imageUrl: string}) => void;
    updateGalleryImage: (image: GalleryImage) => void;
    deleteGalleryImage: (id: number | string) => void;
    addEventFrame: (frame: Omit<EventFrame, 'id'>) => void;
    updateEventFrame: (frame: EventFrame) => void;
    deleteEventFrame: (id: number | string) => void;
    updateRoverMate: (roverMate: RoverMate) => void;
    addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void;
    updateTestimonial: (testimonial: Testimonial) => void;
    deleteTestimonial: (id: number) => void;
    addRnmsgBook: (book: Omit<RNMSGBook, 'id'>) => void;
    updateRnmsgBook: (book: RNMSGBook) => void;
    deleteRnmsgBook: (id: number) => void;
    updateRecruitmentSection: (section: RecruitmentSection) => void;
    addAward: (award: Omit<Award, 'id'>) => void;
    updateAward: (award: Award) => void;
    deleteAward: (id: number) => void;
    addAwardeeToAward: (awardId: number, awardee: Omit<Awardee, 'id'>) => void;
    updateAwardeeInAward: (awardId: number, updatedAwardee: Awardee) => void;
    deleteAwardeeFromAward: (awardId: number, awardeeId: string) => void;
    addModerator: (moderator: Omit<Moderator, 'id'>) => void;
    deleteModerator: (id: number) => void;
    addCommitteeMember: (member: Omit<CommitteeMember, 'id'>) => void;
    updateCommitteeMember: (member: CommitteeMember) => void;
    deleteCommitteeMember: (id: number) => void;
    updateAllCommitteeSessions: (session: string) => void;
    addFounder: (founder: Omit<Founder, 'id'>) => void;
    updateFounder: (founder: Founder) => void;
    deleteFounder: (id: number) => void;
    updateAllFounderSessions: (session: string) => void;
    addPatrolSection: (sectionData: { name: string; color: string }) => void;
    updatePatrolSection: (sectionId: string, sectionData: { name: string; color: string }) => void;
    deletePatrolSection: (sectionId: string) => void;
    togglePatrolSectionVisibility: (sectionId: string) => void;
    addPatrol: (sectionId: string, patrolData: Omit<Patrol, 'id' | 'members'>) => void;
    updatePatrol: (sectionId: string, updatedPatrol: Omit<Patrol, 'members'>) => void;
    deletePatrol: (sectionId: string, patrolId: string) => void;
    addPatrolMember: (sectionId: string, patrolId: string, memberData: Omit<PatrolMember, 'id'>) => void;
    updatePatrolMember: (sectionId: string, patrolId: string, updatedMember: PatrolMember) => void;
    deletePatrolMember: (sectionId: string, patrolId: string, memberId: string) => void;
}

// Initial Data
const initialBlogPosts: BlogPost[] = [
  { id: 1, title: "Annual Summer Camp Highlights", category: "Camping", date: "2024-08-15", excerpt: "Our scouts had an unforgettable week of adventure, learning new skills, and making lifelong friends at our annual summer camp.", imageUrl: "https://picsum.photos/id/1060/600/400", content: "Our scouts had an unforgettable week of adventure, learning new skills, and making lifelong friends at our annual summer camp. The week was packed with activities from dawn till dusk, including hiking, orienteering, campfire cooking, and knot-tying workshops. A highlight for many was the night-time stargazing session where we identified constellations. It was a transformative experience for everyone involved." },
  { id: 2, title: "Community Clean-Up Drive Success", category: "Community Service", date: "2024-07-22", excerpt: "RNMSG scouts took to the streets of Natore for our bi-annual clean-up drive, making a significant impact on our local environment.", imageUrl: "https://picsum.photos/id/835/600/400", content: "RNMSG scouts took to the streets of Natore for our bi-annual clean-up drive, making a significant impact on our local environment. Armed with gloves and bags, our scouts collected litter, sorted recyclables, and helped beautify public parks. The event was a powerful lesson in civic responsibility and the importance of caring for our shared spaces. We received wonderful feedback from the local community." },
  { id: 3, title: "Welcoming New Cub Scouts", category: "Recruitment", date: "2024-07-05", excerpt: "We were thrilled to welcome a new batch of enthusiastic Cub Scouts. The investiture ceremony was a proud moment for all.", imageUrl: "https://picsum.photos/id/1018/600/400", content: "We were thrilled to welcome a new batch of enthusiastic Cub Scouts to the RNMSG family. The investiture ceremony was a proud and solemn moment for the new members and their parents. The cubs made their Scout Promise for the first time, officially beginning their journey in scouting. We look forward to seeing them grow and learn with us." },
  { id: 4, title: "Leadership Workshop for Rovers", category: "Training", date: "2024-06-18", excerpt: "Our Rover Scouts participated in an intensive leadership workshop, honing their skills to become the leaders of tomorrow.", imageUrl: "https://picsum.photos/id/839/600/400", content: "Our Rover Scouts participated in an intensive leadership workshop designed to hone their skills in communication, project management, and team motivation. The sessions were interactive and included practical challenges that pushed them to think strategically. This training is a cornerstone of the Rover program, preparing them for leadership roles both within scouting and in their future careers." },
  { id: 5, title: "Mastering Knots and Lashings", category: "Skills", date: "2024-05-30", excerpt: "This month's skill session focused on essential pioneering skills. Our scouts are now pros at various knots and lashings!", imageUrl: "https://picsum.photos/id/476/600/400", content: "This month's skill session was dedicated to the art of pioneering. Scouts from all sections learned and practiced a variety of essential knots and lashings. From the simple reef knot to complex structures built with square lashings, our members proved their dexterity and teamwork. These skills are not only practical for camping but also build problem-solving abilities." },
  { id: 6, title: "Exploring the Great Outdoors", category: "Adventure", date: "2024-04-25", excerpt: "The Scout Section embarked on a challenging hiking expedition, putting their navigation and teamwork skills to the test.", imageUrl: "https://picsum.photos/id/21/600/400", content: "The Scout Section embarked on a challenging but rewarding hiking expedition through the nearby hills. The trek tested their navigation skills using a map and compass, as well as their endurance and teamwork. Along the way, they learned about local flora and fauna, practiced leaving no trace, and created lasting memories of their adventure in the great outdoors." }
];

const initialEvents: Event[] = [
  { id: 1, title: "Annual Tree Plantation Drive", date: "05/09/2024", time: "9:00 AM - 1:00 PM", location: "Natore Town Park", category: "Community Service", description: "Join us in making our community greener. We'll be planting over 100 saplings. Gloves and tools will be provided. This is a great opportunity to contribute to environmental conservation and learn about local tree species. All are welcome to participate.", registrationLink: "https://forms.gle/example" },
  { id: 2, title: "Weekend Camping Trip", date: "20/09/2024", endDate: "22/09/2024", time: "Starts 4:00 PM on Friday", location: "Lalpur Forest Reserve", category: "Camping", description: "A weekend of camping, hiking, and learning survival skills. Open to all Scout and Rover sections. Don't forget your sleeping bag! We will cover fire safety, shelter building, and basic wilderness first aid. Meals will be cooked over the campfire.", registrationLink: "https://forms.gle/example" },
  { id: 3, title: "First Aid & Emergency Response Workshop", date: "12/10/2024", time: "10:00 AM - 4:00 PM", location: "RNMSG Scout Hall", category: "Training", description: "A certified instructor will teach essential first aid techniques, including CPR and wound care. This is a crucial skill for every scout and a valuable certification to have. Lunch will be provided." },
  { id: 4, title: "Scout's Own & Campfire", date: "26/10/2024", time: "6:00 PM - 9:00 PM", location: "RNMSG Group Grounds", category: "Gathering", description: "An evening of reflection, songs, and skits around the campfire. A great opportunity for all sections to bond and share their scouting experiences. Parents and friends are invited to join us for this special gathering." },
  { id: 5, title: "Annual Scout Sports Day", date: "10/11/2024", time: "10:00 AM - 3:00 PM", location: "Natore Stadium", category: "Sports", description: "A day of friendly competition and sportsmanship. Events include track and field, tug-of-war, and various team games. Come cheer for your fellow scouts!", registrationLink: "https://forms.gle/example" },
];

const initialGalleryImages: GalleryImage[] = [
    { id: 21, alt: "A scout group hiking on a trail", imageUrl: "https://picsum.photos/id/21/500/500" }, { id: 433, alt: "Scouts setting up a tent in a forest", imageUrl: "https://picsum.photos/id/433/500/500" }, { id: 450, alt: "A campfire with scouts gathered around", imageUrl: "https://picsum.photos/id/450/500/500" }, { id: 476, alt: "Close-up of a scout tying a knot", imageUrl: "https://picsum.photos/id/476/500/500" }, { id: 577, alt: "A team of scouts navigating with a map", imageUrl: "https://picsum.photos/id/577/500/500" }, { id: 659, alt: "View from a mountain peak during a scout camp", imageUrl: "https://picsum.photos/id/659/500/500" }, { id: 835, alt: "Scouts participating in a community service project", imageUrl: "https://picsum.photos/id/835/500/500" }, { id: 985, alt: "A scout leader teaching a skill to younger members", imageUrl: "https://picsum.photos/id/985/500/500" }, { id: 1041, alt: "Scouts canoeing on a calm lake", imageUrl: "https://picsum.photos/id/1041/500/500" }, { id: 1056, alt: "An award ceremony for scouts", imageUrl: "https://picsum.photos/id/1056/500/500" }, { id: 1060, alt: "A group photo of the entire scout troop", imageUrl: "https://picsum.photos/id/1060/500/500" }, { id: 1074, alt: "Scouts learning first-aid techniques", imageUrl: "https://picsum.photos/id/1074/500/500" }
];

const initialEventFrames: EventFrame[] = [
    { id: 1, name: 'Scout Jamboree 2024', imageUrl: 'https://res.cloudinary.com/dtqnpnzxj/image/upload/v1717830831/1_n8t9tq.png' },
    { id: 2, name: 'Clean-Up Drive Frame', imageUrl: 'https://res.cloudinary.com/dtqnpnzxj/image/upload/v1717830831/2_kfrwdt.png' },
    { id: 3, name: 'RNMSG Anniversary', imageUrl: 'https://res.cloudinary.com/dtqnpnzxj/image/upload/v1717830831/3_wgwx8i.png' },
];

const initialRoverMates: RoverMate[] = [
  { id: 1, imageUrl: "https://res.cloudinary.com/dtqnpnzxj/image/upload/v1760974988/1759646827984_el6jbe.jpg", name: "Mehedi Hasan Maruf", title: "Rover Mate Leader", idNumber: "BSID: BS0001" },
  { id: 2, imageUrl: "https://picsum.photos/seed/rakib/200/200", name: "Rakibul Islam", title: "Senior Rover Mate", idNumber: "BSID: BS0002" },
  { id: 3, imageUrl: "https://picsum.photos/seed/shahriar/200/200", name: "S.M. Shahriar", title: "Rover Mate", idNumber: "BSID: BS0003" }
];

const initialTestimonials: Testimonial[] = [
  { id: 1, quote: "Joining RNMSG was the best decision for my son. He has become more confident, responsible, and has made so many great friends. The leaders are fantastic!", author: "Afsana Begum", relation: "Parent of a Cub Scout" },
  { id: 2, quote: "Scouting has taught me practical skills I never would have learned otherwise. From camping in the wild to leading a community project, every experience has been a valuable lesson.", author: "Raiyan Ahmed", relation: "Rover Scout" },
  { id: 3, quote: "The sense of community and brotherhood in this group is incredible. We support each other, challenge ourselves, and work together to make a positive impact. Proud to be a scout.", author: "Kabir Hossain", relation: "Scout Section Leader" },
  { id: 4, quote: "I was very shy before I joined scouting. Going on camps and working with my patrol helped me come out of my shell. I love the campfire songs and all the friends I've made!", author: "Nadia Sultana", relation: "Scout" }
];

const initialBooks: RNMSGBook[] = [
    { id: 1, title: "Essential Characteristics of Scouting", fileUrl: "https://scout.org/sites/default/files/library_files/WOSM-Essential-Characteristics-of-Scouting-EN.pdf" }
];

const initialRecruitmentSections: RecruitmentSection[] = [
  { 
    id: 1, 
    title: "Cub Scout Section", 
    age: "Ages 6 to 10+", 
    description: "Cubs learn about the world, teamwork, and basic scouting skills through fun games, stories, and activities. It's the perfect start to a lifelong adventure.", 
    imageUrl: "https://res.cloudinary.com/dtqnpnzxj/image/upload/v1756405022/1_ozjbwd.jpg", 
    colorClass: "text-scout-yellow",
    applyLink: "#/join" 
  },
  { 
    id: 2, 
    title: "Scout Section", 
    age: "Ages 11 to 16+", 
    description: "Scouts take on more challenges, develop leadership skills, and explore the outdoors. They work in patrols to plan adventures and serve their community.", 
    imageUrl: "https://res.cloudinary.com/dtqnpnzxj/image/upload/v1756405022/2_nm95qx.jpg", 
    colorClass: "text-scout-green",
    applyLink: "#/join"
  },
  { 
    id: 3, 
    title: "Rover Scout Section", 
    age: "Ages 17 to 25", 
    description: "Rovers focus on service, high adventure, and personal development. They manage their own programs and contribute to scouting at all levels.", 
    imageUrl: "https://res.cloudinary.com/dtqnpnzxj/image/upload/v1756405022/3_sf2jdx.jpg", 
    colorClass: "text-scout-red",
    applyLink: "#/join"
  },
];

const initialAwards: Award[] = [
    { 
        id: 1, 
        name: "Shapla Cub Award", 
        description: "The highest award for a Cub Scout in Bangladesh, recognizing proficiency in various skills and a commitment to the Cub Scout promise and law.", 
        imageUrl: "https://res.cloudinary.com/dtqnpnzxj/image/upload/v1720875932/rnmsg/awards/shapla.png", 
        categories: ["Cub Scout"],
        awardees: [
            { id: 'sca-2023-1', name: 'Karim Rahman', year: 2023, imageUrl: 'https://picsum.photos/seed/karim/150' },
            { id: 'sca-2023-2', name: 'Jamila Khatun', year: 2023, imageUrl: 'https://picsum.photos/seed/jamila/150' },
            { id: 'sca-2022-1', name: 'Fahim Ahmed', year: 2022, imageUrl: 'https://picsum.photos/seed/fahim/150' },
            { id: 'sca-2022-2', name: 'Sadia Islam', year: 2022, imageUrl: 'https://picsum.photos/seed/sadia/150' },
            { id: 'sca-2021-1', name: 'Rohan Ali', year: 2021, imageUrl: 'https://picsum.photos/seed/rohan/150' },
        ]
    },
    { 
        id: 2, 
        name: "President's Scout Award", 
        description: "The highest rank for a Scout, awarded for exceptional character, leadership, and service. It represents a significant commitment to the Scouting ideals.", 
        imageUrl: "https://res.cloudinary.com/dtqnpnzxj/image/upload/v1720875932/rnmsg/awards/ps.png", 
        categories: ["Scout"],
        awardees: [
            { id: 'psa-2022-1', name: 'Salma Akter', year: 2022, imageUrl: 'https://picsum.photos/seed/salma/150' },
            { id: 'psa-2021-1', name: 'Mehedi Hasan', year: 2021, imageUrl: 'https://picsum.photos/seed/mehedi/150' },
            { id: 'psa-2021-2', name: 'Anika Chowdhury', year: 2021, imageUrl: 'https://picsum.photos/seed/anika/150' },
            { id: 'psa-2020-1', name: 'Jahid Khan', year: 2020, imageUrl: 'https://picsum.photos/seed/jahid/150' },
        ]
    },
    { 
        id: 3, 
        name: "President's Rover Scout Award", 
        description: "The highest honor for a Rover Scout, acknowledging outstanding leadership in service projects, personal development, and a deep understanding of scouting principles.", 
        imageUrl: "https://res.cloudinary.com/dtqnpnzxj/image/upload/v1720875932/rnmsg/awards/prs.png", 
        categories: ["Rover Scout"],
        awardees: [
             { id: 'prsa-2024-1', name: 'Rakibul Islam', year: 2024, imageUrl: 'https://picsum.photos/seed/rakibul/150' },
             { id: 'prsa-2023-1', name: 'S.M. Shahriar', year: 2023, imageUrl: 'https://picsum.photos/seed/shahriar/150' },
        ]
    },
    { id: 4, name: "Community Service Badge", description: "Awarded to scouts who have dedicated significant hours to community service projects, demonstrating their commitment to helping others.", imageUrl: "https://picsum.photos/seed/community/400/400", categories: ["Special"] },
    { id: 5, name: "Camping Proficiency Badge", description: "Recognizes a scout's expertise in camping skills, including shelter building, fire safety, and outdoor cooking.", imageUrl: "https://picsum.photos/seed/camping/400/400", categories: ["Scout"] },
    { id: 6, name: "First Aid Proficiency Badge", description: "Awarded for demonstrating knowledge and practical skill in first aid, including CPR and emergency response.", imageUrl: "https://picsum.photos/seed/firstaid/400/400", categories: ["Scout"] },
    { id: 7, name: "Leadership Stripe", description: "Given to a Rover Scout who has successfully planned and led a major group activity or service project.", imageUrl: "https://picsum.photos/seed/leadership/400/400", categories: ["Rover Scout"] },
    { id: 8, name: "Nature Explorer Badge", description: "For Cub Scouts who show a keen interest in nature, can identify local plants and animals, and understand the importance of conservation.", imageUrl: "https://picsum.photos/seed/nature/400/400", categories: ["Cub Scout"] },
];

const initialModerators: Moderator[] = [];

const initialNavLinks: NavLink[] = [
  { id: 1, title: 'Home', path: '/', order: 1, parentId: null },
  { id: 11, title: 'About Us', path: '#', order: 2, parentId: null },
  { id: 12, title: 'Our History', path: '/history', order: 1, parentId: 11 },
  { id: 9, title: 'RNMSG Committee', path: '/committee', order: 2, parentId: 11 },
  { id: 10, title: 'RNMSG Founders', path: '/founders', order: 3, parentId: 11 },
  { id: 2, title: 'Gallery', path: '/gallery', order: 3, parentId: null },
  { id: 3, title: 'Achievements', path: '/Achievements', order: 4, parentId: null },
  { id: 13, title: 'Our Patrols', path: '/patrols', order: 5, parentId: null },
  { id: 4, title: 'Blog', path: '/blog', order: 6, parentId: null },
  { id: 5, title: 'Upcoming Events', path: '/events', order: 7, parentId: null },
  { id: 6, title: 'Join Us', path: '/join', order: 8, parentId: null },
  { id: 7, title: 'RNMSG Library', path: '/books', order: 9, parentId: null },
  { id: 8, title: 'Event Frames', path: '/frames', order: 10, parentId: null },
];

const initialCommitteeMembers: CommitteeMember[] = [
  { id: 1, imageUrl: 'https://picsum.photos/seed/president/200', name: 'Md. President', designation: 'President', session: '2023-2024' },
  { id: 2, imageUrl: 'https://picsum.photos/seed/vp/200', name: 'Md. Vice President', designation: 'Vice President', session: '2023-2024' },
  { id: 3, imageUrl: 'https://picsum.photos/seed/secretary/200', name: 'Md. Secretary', designation: 'Secretary', session: '2023-2024' },
  { id: 4, imageUrl: 'https://picsum.photos/seed/treasurer/200', name: 'Md. Treasurer', designation: 'Treasurer', session: '2023-2024' },
];

const initialFounders: Founder[] = [
    { id: 1, imageUrl: 'https://picsum.photos/seed/founder1/200', name: 'Mr. Visionary Founder', designation: 'Chief Founder', session: 'Founding Member' },
    { id: 2, imageUrl: 'https://picsum.photos/seed/founder2/200', name: 'Ms. Pioneer Founder', designation: 'Co-Founder', session: 'Founding Member' },
    { id: 3, imageUrl: 'https://picsum.photos/seed/founder3/200', name: 'Mr. Cornerstone', designation: 'Founding Secretary', session: 'Founding Member' },
];

const initialPatrolSections: PatrolSection[] = [
  {
    id: 'cub',
    name: 'Cub Scout',
    color: '#FFD700',
    isVisible: true,
    patrols: [
      {
        id: 'cub-p1', name: 'Yellow Tigers',
        members: [
          { id: 'cm1', name: 'Ali Hasan', role: 'Sixer', imageUrl: 'https://picsum.photos/seed/ali/100' },
          { id: 'cm2', name: 'Fatima Begum', role: 'Second', imageUrl: 'https://picsum.photos/seed/fatima/100' },
          { id: 'cm3', name: 'Rahim Sheikh', role: 'Member', imageUrl: 'https://picsum.photos/seed/rahim/100' },
        ]
      },
      {
        id: 'cub-p2', name: 'Orange Lions',
        members: [
          { id: 'cm4', name: 'Samira Khan', role: 'Sixer', imageUrl: 'https://picsum.photos/seed/samira/100' },
        ]
      }
    ]
  },
  {
    id: 'scout',
    name: 'Scout',
    color: '#006A4E',
    isVisible: true,
    patrols: [
       {
        id: 'scout-p1', name: 'Green Eagles',
        members: [
          { id: 'sm1', name: 'Imran Chowdhury', role: 'Patrol Leader', imageUrl: 'https://picsum.photos/seed/imran/100' },
          { id: 'sm2', name: 'Nusrat Jahan', role: 'Asst. Patrol Leader', imageUrl: 'https://picsum.photos/seed/nusrat/100' },
          { id: 'sm3', name: 'Tariq Ahmed', role: 'Member', imageUrl: 'https://picsum.photos/seed/tariq/100' },
        ]
      }
    ]
  },
  {
    id: 'rover',
    name: 'Rover Scout',
    color: '#E4002B',
    isVisible: true,
    patrols: [
      {
        id: 'rover-p1', name: 'Red Rovers',
        members: [
          { id: 'rm1', name: 'Mehedi Hasan Maruf', role: 'Crew Leader', imageUrl: 'https://res.cloudinary.com/dtqnpnzxj/image/upload/v1760974988/1759646827984_el6jbe.jpg' },
          { id: 'rm2', name: 'Rakibul Islam', role: 'Asst. Crew Leader', imageUrl: 'https://picsum.photos/seed/rakib/100' },
        ]
      }
    ]
  }
];


const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(initialGalleryImages);
  const [eventFrames, setEventFrames] = useState<EventFrame[]>(initialEventFrames);
  const [roverMates, setRoverMates] = useState<RoverMate[]>(initialRoverMates);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [rnmsgBooks, setRnmsgBooks] = useState<RNMSGBook[]>(initialBooks);
  const [recruitmentSections, setRecruitmentSections] = useState<RecruitmentSection[]>(initialRecruitmentSections);
  const [awards, setAwards] = useState<Award[]>(initialAwards);
  const [moderators, setModerators] = useState<Moderator[]>(initialModerators);
  const [navLinks, setNavLinks] = useState<NavLink[]>(initialNavLinks);
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>(initialCommitteeMembers);
  const [founders, setFounders] = useState<Founder[]>(initialFounders);
  const [patrolSections, setPatrolSections] = useState<PatrolSection[]>(initialPatrolSections);


  const addBlogPost = (post: Omit<BlogPost, 'id'>) => {
    setBlogPosts(prev => [{...post, id: Date.now()}, ...prev]);
  };

  const updateBlogPost = (updatedPost: BlogPost) => {
    setBlogPosts(prev => prev.map(post => post.id === updatedPost.id ? updatedPost : post));
  };

  const deleteBlogPost = (id: number) => {
    setBlogPosts(prev => prev.filter(post => post.id !== id));
  };
  
  const addEvent = (event: Omit<Event, 'id'>) => {
    setEvents(prev => [{...event, id: Date.now()}, ...prev]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(prev => prev.map(event => event.id === updatedEvent.id ? updatedEvent : event));
  };

  const deleteEvent = (id: number) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const addGalleryImage = (image: Omit<GalleryImage, 'id' | 'imageUrl'> & {imageUrl: string}) => {
    setGalleryImages(prev => [{...image, id: Date.now().toString()}, ...prev]);
  };

  const updateGalleryImage = (updatedImage: GalleryImage) => {
    setGalleryImages(prev => prev.map(image => image.id === updatedImage.id ? updatedImage : image));
  };

  const deleteGalleryImage = (id: number | string) => {
    setGalleryImages(prev => prev.filter(image => image.id !== id));
  };
  
  const addEventFrame = (frame: Omit<EventFrame, 'id'>) => {
    setEventFrames(prev => [{ ...frame, id: Date.now().toString() }, ...prev]);
  };

  const updateEventFrame = (updatedFrame: EventFrame) => {
    setEventFrames(prev => prev.map(frame => frame.id === updatedFrame.id ? updatedFrame : frame));
  };

  const deleteEventFrame = (id: number | string) => {
    setEventFrames(prev => prev.filter(frame => frame.id !== id));
  };
  
  const updateRoverMate = (updatedRoverMate: RoverMate) => {
    setRoverMates(prev => prev.map(mate => mate.id === updatedRoverMate.id ? updatedRoverMate : mate));
  };

  const addTestimonial = (testimonial: Omit<Testimonial, 'id'>) => {
    setTestimonials(prev => [{...testimonial, id: Date.now()}, ...prev]);
  };

  const updateTestimonial = (updatedTestimonial: Testimonial) => {
    setTestimonials(prev => prev.map(t => t.id === updatedTestimonial.id ? updatedTestimonial : t));
  };

  const deleteTestimonial = (id: number) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };
  
  const addRnmsgBook = (book: Omit<RNMSGBook, 'id'>) => {
      setRnmsgBooks(prev => [{ ...book, id: Date.now() }, ...prev]);
  };

  const updateRnmsgBook = (updatedBook: RNMSGBook) => {
      setRnmsgBooks(prev => prev.map(book => book.id === updatedBook.id ? updatedBook : book));
  };

  const deleteRnmsgBook = (id: number) => {
      setRnmsgBooks(prev => prev.filter(book => book.id !== id));
  };
  
  const updateRecruitmentSection = (updatedSection: RecruitmentSection) => {
    setRecruitmentSections(prev => prev.map(section => section.id === updatedSection.id ? updatedSection : section));
  };

  const addAward = (award: Omit<Award, 'id'>) => {
    setAwards(prev => [{ ...award, id: Date.now() }, ...prev]);
  };

  const updateAward = (updatedAward: Award) => {
    setAwards(prev => prev.map(award => award.id === updatedAward.id ? updatedAward : award));
  };

  const deleteAward = (id: number) => {
    setAwards(prev => prev.filter(award => award.id !== id));
  };

  const addAwardeeToAward = (awardId: number, awardee: Omit<Awardee, 'id'>) => {
    const newAwardee: Awardee = { ...awardee, id: `awardee-${Date.now()}` };
    setAwards(prev => prev.map(award => {
        if (award.id === awardId) {
            return {
                ...award,
                awardees: [...(award.awardees || []), newAwardee]
            };
        }
        return award;
    }));
  };

  const updateAwardeeInAward = (awardId: number, updatedAwardee: Awardee) => {
      setAwards(prev => prev.map(award => {
          if (award.id === awardId) {
              return {
                  ...award,
                  awardees: award.awardees?.map(a => a.id === updatedAwardee.id ? updatedAwardee : a) || []
              };
          }
          return award;
      }));
  };

  const deleteAwardeeFromAward = (awardId: number, awardeeId: string) => {
      setAwards(prev => prev.map(award => {
          if (award.id === awardId) {
              return {
                  ...award,
                  awardees: award.awardees?.filter(a => a.id !== awardeeId) || []
              };
          }
          return award;
      }));
  };
  
  const addModerator = (moderator: Omit<Moderator, 'id'>) => {
    setModerators(prev => [{...moderator, id: Date.now()}, ...prev]);
  };

  const deleteModerator = (id: number) => {
    setModerators(prev => prev.filter(mod => mod.id !== id));
  };

  const addCommitteeMember = (member: Omit<CommitteeMember, 'id'>) => {
    setCommitteeMembers(prev => [{ ...member, id: Date.now() }, ...prev]);
  };

  const updateCommitteeMember = (updatedMember: CommitteeMember) => {
      setCommitteeMembers(prev => prev.map(member => member.id === updatedMember.id ? updatedMember : member));
  };

  const deleteCommitteeMember = (id: number) => {
      setCommitteeMembers(prev => prev.filter(member => member.id !== id));
  };

  const updateAllCommitteeSessions = (session: string) => {
    setCommitteeMembers(prev => prev.map(member => ({ ...member, session })));
  };

  const addFounder = (member: Omit<Founder, 'id'>) => {
    setFounders(prev => [{ ...member, id: Date.now() }, ...prev]);
  };

  const updateFounder = (updatedMember: Founder) => {
      setFounders(prev => prev.map(member => member.id === updatedMember.id ? updatedMember : member));
  };

  const deleteFounder = (id: number) => {
      setFounders(prev => prev.filter(member => member.id !== id));
  };

  const updateAllFounderSessions = (session: string) => {
    setFounders(prev => prev.map(member => ({ ...member, session })));
  };
  
    const addPatrolSection = (sectionData: { name: string; color: string }) => {
        const newSection: PatrolSection = {
            ...sectionData,
            id: `section-${Date.now()}`,
            isVisible: true,
            patrols: [],
        };
        setPatrolSections(prev => [...prev, newSection]);
    };

    const updatePatrolSection = (sectionId: string, sectionData: { name: string; color: string }) => {
        setPatrolSections(prev => prev.map(section =>
            section.id === sectionId ? { ...section, ...sectionData } : section
        ));
    };
    
    const deletePatrolSection = (sectionId: string) => {
        setPatrolSections(prev => prev.filter(section => section.id !== sectionId));
    };

    const togglePatrolSectionVisibility = (sectionId: string) => {
        setPatrolSections(prev => prev.map(section =>
            section.id === sectionId ? { ...section, isVisible: !section.isVisible } : section
        ));
    };

  const addPatrol = (sectionId: string, patrolData: Omit<Patrol, 'id' | 'members'>) => {
      setPatrolSections(prev => prev.map(section => {
          if (section.id === sectionId) {
              const newPatrol: Patrol = { ...patrolData, id: `patrol-${Date.now()}`, members: [] };
              return { ...section, patrols: [...section.patrols, newPatrol] };
          }
          return section;
      }));
  };

  const updatePatrol = (sectionId: string, updatedPatrol: Omit<Patrol, 'members'>) => {
      setPatrolSections(prev => prev.map(section => {
          if (section.id === sectionId) {
              return {
                  ...section,
                  patrols: section.patrols.map(p => p.id === updatedPatrol.id ? { ...p, name: updatedPatrol.name } : p)
              };
          }
          return section;
      }));
  };

  const deletePatrol = (sectionId: string, patrolId: string) => {
      setPatrolSections(prev => prev.map(section => {
          if (section.id === sectionId) {
              return { ...section, patrols: section.patrols.filter(p => p.id !== patrolId) };
          }
          return section;
      }));
  };

  const addPatrolMember = (sectionId: string, patrolId: string, memberData: Omit<PatrolMember, 'id'>) => {
      setPatrolSections(prev => prev.map(section => {
          if (section.id === sectionId) {
              return {
                  ...section,
                  patrols: section.patrols.map(p => {
                      if (p.id === patrolId) {
                          const newMember: PatrolMember = { ...memberData, id: `member-${Date.now()}` };
                          return { ...p, members: [...p.members, newMember] };
                      }
                      return p;
                  })
              };
          }
          return section;
      }));
  };

  const updatePatrolMember = (sectionId: string, patrolId: string, updatedMember: PatrolMember) => {
      setPatrolSections(prev => prev.map(section => {
          if (section.id === sectionId) {
              return {
                  ...section,
                  patrols: section.patrols.map(p => {
                      if (p.id === patrolId) {
                          return { ...p, members: p.members.map(m => m.id === updatedMember.id ? updatedMember : m) };
                      }
                      return p;
                  })
              };
          }
          return section;
      }));
  };

  const deletePatrolMember = (sectionId: string, patrolId: string, memberId: string) => {
      setPatrolSections(prev => prev.map(section => {
          if (section.id === sectionId) {
              return {
                  ...section,
                  patrols: section.patrols.map(p => {
                      if (p.id === patrolId) {
                          return { ...p, members: p.members.filter(m => m.id !== memberId) };
                      }
                      return p;
                  })
              };
          }
          return section;
      }));
  };


  return (
    <DataContext.Provider value={{ 
        blogPosts, events, galleryImages, eventFrames, roverMates, testimonials, rnmsgBooks, recruitmentSections, awards, moderators, navLinks, committeeMembers, founders, patrolSections,
        setNavLinks,
        addBlogPost, updateBlogPost, deleteBlogPost, 
        addEvent, updateEvent, deleteEvent,
        addGalleryImage, updateGalleryImage, deleteGalleryImage,
        addEventFrame, updateEventFrame, deleteEventFrame,
        updateRoverMate,
        addTestimonial, updateTestimonial, deleteTestimonial,
        addRnmsgBook, updateRnmsgBook, deleteRnmsgBook,
        updateRecruitmentSection,
        addAward, updateAward, deleteAward,
        addAwardeeToAward, updateAwardeeInAward, deleteAwardeeFromAward,
        addModerator, deleteModerator,
        addCommitteeMember, updateCommitteeMember, deleteCommitteeMember,
        updateAllCommitteeSessions,
        addFounder, updateFounder, deleteFounder, updateAllFounderSessions,
        addPatrolSection, updatePatrolSection, deletePatrolSection, togglePatrolSectionVisibility,
        addPatrol, updatePatrol, deletePatrol,
        addPatrolMember, updatePatrolMember, deletePatrolMember
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};