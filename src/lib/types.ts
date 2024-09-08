export class Event {
    id: string;
    title: string;
    start: Date;
    end: Date;
    club: string;
    backgroundColor: string;
    editable: boolean = false;

    constructor(id: string, title: string, start: Date, end: Date, club: string, backgroundColor: string, editable: boolean) {
        this.id = id;
        this.title = title;
        this.start = start;
        this.end = end;
        this.club = club;
        this.backgroundColor = backgroundColor;
        this.editable = editable;
    }

    static fromMongo(doc: any): Event {
        const backgroundColor = '#154734';
        return new Event(doc._id.toString(), doc.title, doc.start, doc.end, doc.club, backgroundColor, false);
    }

    toMongo() {
        return {
            title: this.title,
            start: this.start,
            end: this.end,
            club: this.club
        };
    }

    toJSON() {
        return {...this};
    }
}

export class RosterGame {
    id: string;
    name: string;
    icon: string;
    teams: RosterTeam[];

    constructor(id: string, name: string, icon: string, teams: RosterTeam[]) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.teams = teams;
    }

    static fromMongo(
        doc: any,
        teams: any[],
        members: { [teamId: string]: any[] }
    ): RosterGame {
        return new RosterGame(
            doc._id.toString(),
            doc.name,
            doc.icon,
            teams.map((team) => RosterTeam.fromMongo(team, members[team._id.toString()] ?? [])),
        );
    }

    toJSON() {
        return {
            ...this,
            teams: this.teams.map((team) => team.toJSON()),
        };
    }
}

export class RosterTeam {
    id: string;
    name: string;
    members: RosterMember[];

    constructor(id: string, name: string, members: RosterMember[]) {
        this.id = id;
        this.name = name;
        this.members = members;
    }

    static fromMongo(doc: any, members: any[]): RosterTeam {
        return new RosterTeam(doc._id.toString(), doc.name, members.map((member) => RosterMember.fromMongo(member)));
    }

    toJSON() {
        return {
            ...this,
            members: this.members.map((member) => member.toJSON()),
        };
    }
}

export class RosterMember {
    id: string;
    name: string;
    username: string;
    role: string;
    picture?: string;

    constructor(id: string, name: string, username: string, role: string, picture?: string) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.role = role;
        this.picture = picture;
    }

    static fromMongo(doc: any): RosterMember {
        return new RosterMember(doc._id.toString(), doc.name, doc.username, doc.role, doc.picture);
    }

    toJSON() {
        return {...this};
    }
}

export class Article {
    id: string;
    title: string;
    summary: string;
    link: string;
    image: string;

    constructor(id: string, title: string, summary: string, link: string, image: string) {
        this.id = id;
        this.title = title;
        this.summary = summary;
        this.link = link;
        this.image = image;
    }

    static fromMongo(doc: any): Article {
        return new Article(doc._id.toString(), doc.title, doc.summary, doc.link, doc.image);
    }

    toJSON() {
        return {...this};
    }
}

export class Club {
    id: string;
    clubName: string;
    aboutText: string;
    boardMembers: { name: string; position: string; profileImage: string }[];
    urlName: string;
    color: string;

    constructor(id: string, clubName: string, urlName: string, aboutText: string, boardMembers: { name: string; position: string; profileImage: string }[], color: string) {
        this.id = id;
        this.clubName = clubName;
        this.aboutText = aboutText;
        this.boardMembers = boardMembers;
        this.urlName = urlName;
        this.color = color;
    }

    static fromMongo(doc: any) {
        return new Club(doc._id.toString(), doc.clubName, doc.urlName, doc.aboutText, doc.boardMembers, doc.color);
    }

    toJSON() {
        return {...this};
    }
}
