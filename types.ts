interface Group {
  id: string;
  approved: boolean;
  description: string;
  image: string;
  title: string;
}

interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  roles: string[];
  moderating: string[];
  profileImage: string;
  bio: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  username: string;
  postCreatedAt: [number, number, number];
  group: string;
}

interface Message {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  isSent: boolean;
  dateTime: [number, number, number];
}

interface Comment {
  id: string;
  text: string;
  createdAt: [number, number, number];
  username: string;
  postId: string;
}
