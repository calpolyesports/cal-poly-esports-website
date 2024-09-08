import { ObjectId } from "mongodb";

// WILL RAISE ERROR IF IMPORTED FROM CLIENT
// should only be used server-side (in database.ts)
// if you need to use a model in a client-side file, you should create a new file in src/types

// Authentication document with mandatory _id field
export interface UserDoc {
    _id: string;
    username: string;
    password_hash: string;
    admin_for: string[];
}

// Authentication document with mandatory _id field
export interface SessionDoc {
    _id: string;
	expires_at: Date;
	user_id: string;
}

export interface EventDoc {
    title: string;
    start: Date;
    end: Date;
    club: string;
}

export interface RosterGameDoc {
    name: string;
    icon: string;
}

export interface RosterTeamDoc {
    game: ObjectId;
    name: string;
}

export interface RosterMemberDoc {
    team: ObjectId;
    name: string;
    username: string;
    role: string;
    picture?: string;
}

export interface ArticleDoc {
    title: string;
    summary: string;
    link: string;
    image: string;
}

export interface ClubDoc {
    clubName: string;
    aboutText: string;
    boardMembers: { name: string; position: string; profileImage: string }[];
    urlName: string;
    color: string;
}
