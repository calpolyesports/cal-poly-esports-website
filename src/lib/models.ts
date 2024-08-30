export interface UserDoc {
    _id: string;
    username: string;
    password_hash: string;
    adminFor: string[];
}

export interface SessionDoc {
    _id: string;
	expires_at: Date;
	user_id: string;
}

export class Game {
    id: string;
    name: string;
    icon: string;
    teams: Team[];

    constructor(id: string, name: string, icon: string, teams: Team[]) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.teams = teams;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromMongo(obj: any): Game {
        return new Game(obj._id.toString(), obj.name, obj.icon, obj.teams);
    }

    toJSON() {
        return {...this};
    }
}

export class Team {
    name: string;
    members: Member[];

    constructor(name: string, members: Member[]) {
        this.name = name;
        this.members = members;
    }
}

export class Member {
    name: string;
    username: string;
    role: string;
    picture?: string;

    constructor(name: string, username: string, role: string, picture?: string) {
        this.name = name;
        this.username = username;
        this.role = role;
        this.picture = picture;
    }
}

export class Article {
    title: string;
    summary: string;
    link: string;
    image: string;

    constructor(title: string, summary: string, link: string, image: string) {
        this.title = title;
        this.summary = summary;
        this.link = link;
        this.image = image;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromMongo(obj: any): Article {
        return new Article(obj.title, obj.summary, obj.link, obj.image);
    }

    toJSON() {
        return {...this};
    }
}

export class Club {
    clubName: string;
    aboutText: string;
    boardMembers: { name: string; position: string; profileImage: string }[];
    urlName: string;

    constructor(clubName: string, urlName: string, aboutText: string, boardMembers: { name: string; position: string; profileImage: string }[]) {
        this.clubName = clubName;
        this.aboutText = aboutText;
        this.boardMembers = boardMembers;
        this.urlName = urlName;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromMongo(doc: any) {
        return new Club(doc.clubName, doc.urlName, doc.aboutText, doc.boardMembers);
    }

    toJSON() {
        return {...this};
    }
}
