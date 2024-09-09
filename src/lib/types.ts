export interface User {
    _id: string;
    username: string;
    password_hash: string;
    admin_for: string[];
}

export interface Session {
    _id: string;
    expires_at: Date;
    user_id: string;
}

export interface Event {
    _id: string;
    title: string;
    start: Date;
    end: Date;
    club: string;
    backgroundColor: string;
    editable: boolean;
}

export interface RosterGame {
    _id: string;
    name: string;
    icon: string;
    teams: RosterTeam[];
}

export interface RosterTeam {
    _id: string;
    name: string;
    members: RosterMember[];
}

export interface RosterMember {
    _id: string;
    name: string;
    username: string;
    role: string;
    picture: string;
}

export interface Article {
    _id: string;
    title: string;
    summary?: string;
    link: string;
    image?: string;
}

export interface Club {
    _id: string;
    clubName: string;
    aboutText: string;
    boardMembers: BoardMember[];
    urlName: string;
    color: string;
}

export interface BoardMember {
    _id: string;
    name: string;
    position: string;
    profileImage: string;
}
