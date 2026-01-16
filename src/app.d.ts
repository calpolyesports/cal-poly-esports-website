// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: { _id: string; username: string; adminFor: string[] } | null;
			session: { _id: string; userId: string; expiresAt: Date; fresh: boolean } | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
