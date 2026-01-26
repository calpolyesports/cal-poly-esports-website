export type WithStringId<T> = T & { _id: string };

export interface User {
	_id: string;
	username: string;
	adminFor: string[];
}

export interface Event {
	title: string;
	start: Date;
	end: Date;
	club: string;
	location?: string;
	locationLink?: string;
	description?: string;
	backgroundColor: string;
	editable: boolean;
	usesLab: boolean;
	showPublic: boolean;
}

export interface RosterGame {
	name: string;
	icon: string;
	teams: RosterTeam[];
	adminRole: string;
}

export interface RosterTeam {
	id: string;
	name: string;
	members: RosterMember[];
}

export interface RosterMember {
	id: string;
	name: string;
	username: string;
	role: string;
	picture?: string;
}

export interface Article {
	title: string;
	summary?: string;
	link: string;
	image?: string;
}

export interface Club {
	clubName: string;
	fullName: string;
	aboutText: string;
	aboutHtml: string;
	boardMembers: BoardMember[];
	urlName: string;
	color: string;
	display: boolean;
	events: ClubEvent[];
}

export interface BoardMember {
	id: string;
	name: string;
	position: string;
	profileImage?: string;
}

export interface ClubEvent {
	name: string;
	url: string;
	image: string;
}
