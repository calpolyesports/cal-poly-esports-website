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
    username: string;
    role: string;

    constructor(username: string, role: string) {
        this.username = username;
        this.role = role;
    }
}
