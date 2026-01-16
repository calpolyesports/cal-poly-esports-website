// Server-side events do not have backgroundColor or editable properties
export interface Event {
	title: string;
	start: Date;
	end: Date;
	club: string;
	location?: string;
	locationLink?: string;
	description?: string;
	usesLab: boolean;
	showPublic: boolean;
}

// Don't want to expose password_hash on the client
export interface User {
	_id: string;
	username: string;
	passwordHash: string;
	adminFor: string[];
}

// Session as stored in the database
export interface Session {
	_id: string;
	userId: string;
	expiresAt: Date;
	fresh: boolean;
}
