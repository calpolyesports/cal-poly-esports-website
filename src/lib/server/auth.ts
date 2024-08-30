import { Lucia, TimeSpan } from 'lucia';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';
import { dev } from "$app/environment";
import { Session, User } from './database';

const adapter = new MongodbAdapter(Session, User);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: !dev,
        }
    },
    sessionExpiresIn: new TimeSpan(2, 'w'),
    getUserAttributes: (attributes) => {
        return {
            username: attributes.username,
            adminFor: attributes.adminFor,
        };
    }
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    username: string;
    password_hash: string;
    adminFor: string[];
}
