export type WithStringId<T> = T & { _id: string };

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
    title: string;
    start: Date;
    end: Date;
    club: string;
    backgroundColor: string;
    editable: boolean;
}

export interface RosterGame {
    name: string;
    icon: string;
    teams: WithStringId<RosterTeam>[];
    adminRole: string;
}

export interface RosterTeam {
    name: string;
    members: WithStringId<RosterMember>[];
}

export interface RosterMember {
    name: string;
    username: string;
    role: string;
    picture: string;
}

export interface Article {
    title: string;
    summary?: string;
    link: string;
    image?: string;
}

export interface Club {
    clubName: string;
    aboutText: string;
    aboutHtml: string;
    boardMembers: BoardMember[];
    urlName: string;
    color: string;
}

export interface BoardMember {
    name: string;
    position: string;
    profileImage: string;
}
