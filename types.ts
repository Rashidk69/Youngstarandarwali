export interface Player {
  id: string;
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicketkeeper';
  image: string;
  stats: {
    matches: number;
    runs?: number;
    wickets?: number;
    sixes?: number;
    average?: number;
    strikeRate?: number;
  };
}

export interface Match {
  id: string;
  opponent: string;
  opponentLogo: string;
  date: string;
  time: string;
  venue: string;
  status: 'Upcoming' | 'Live' | 'Completed';
  result?: string;
  score?: string;
}

export interface Highlight {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  date: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  image: string;
  date: string;
}

export interface Story {
  id: string;
  userImage: string;
  userName: string;
  storyImage: string;
}
