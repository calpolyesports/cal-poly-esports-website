export class Game {
    id: number;
    name: string;
    icon: string;
    teams: Team[];

    constructor(id: number, name: string, icon: string, teams: Team[]) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.teams = teams;
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
