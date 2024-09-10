import { Lucia, TimeSpan } from 'lucia';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';
import mongoose from 'mongoose';
import { dev } from "$app/environment";

const adapter = new MongodbAdapter(
    mongoose.connection.collection('sessions'),
    mongoose.connection.collection('users'),
);

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
            admin_for: attributes.admin_for,
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
    admin_for: string[];
}
