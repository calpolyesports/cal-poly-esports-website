import mongoose, { Schema, model } from 'mongoose';


if (mongoose.models.User) {
    mongoose.deleteModel('User');
    mongoose.deleteModel('Session');
    mongoose.deleteModel('Event');
    mongoose.deleteModel('RosterGame');
    mongoose.deleteModel('RosterTeam');
    mongoose.deleteModel('RosterMember');
    mongoose.deleteModel('Article');
    mongoose.deleteModel('Club');
}


// Authentication document with mandatory _id field
const userSchema = new Schema({
    _id: { type: String, required: true },
    username: { type: String, required: true },
    password_hash: { type: String, required: true },
    admin_for: [String],
});
export const UserModel = model('User', userSchema);

// Authentication document with mandatory _id field
const sessionSchema = new Schema({
    _id: { type: String, required: true },
    expires_at: { type: Date, required: true },
    user_id: { type: String, required: true },
});
export const SessionModel = model('Session', sessionSchema);


const eventSchema = new Schema({
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    club: { type: String, required: true },
});
export const EventModel = model('Event', eventSchema);


const rosterGameSchema = new Schema({
    name: { type: String, required: true },
    icon: { type: String, required: true },
    teams: [{ type: Schema.Types.ObjectId, ref: 'RosterTeam' }],
});
export const RosterGameModel = model('RosterGame', rosterGameSchema);

const rosterTeamSchema = new Schema({
    name: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'RosterMember' }],
});
export const RosterTeamModel = model('RosterTeam', rosterTeamSchema);

const rosterMemberSchema = new Schema({
    team: { type: Schema.Types.ObjectId, ref: 'RosterTeam' },
    name: { type: String, required: true },
    username: { type: String, required: true },
    role: { type: String, required: true },
    picture: String,
});
export const RosterMemberModel = model('RosterMember', rosterMemberSchema);

const articleSchema = new Schema({
    title: { type: String, required: true },
    summary: String,
    link: { type: String, required: true },
    image: String,
});
export const ArticleModel = model('Article', articleSchema);


const clubSchema = new Schema({
    clubName: { type: String, required: true },
    aboutText: { type: String, required: true },
    boardMembers: [
        { name: String, position: String, profileImage: String }
    ],
    urlName: { type: String, required: true },
    color: { type: String, required: true },
});
export const ClubModel = model('Club', clubSchema);
