import mongoose, { Schema, Model } from 'mongoose'
import * as bcrypt from 'bcrypt';

const profile = {
    firstName: String,
    lastName: String,
    birthDate: Date,
    visible: { type: Boolean, default: false }
}

const raceHistory = [{
    oponent: null,
    date: { type: Date, default: new Date() },
    status: Boolean, // Wheather the battle is a win or loss
    type: String // Type of race - attack, defence, bot attack
}]

const userSchema: Schema<IUserDocumentModel> = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastLogin: Date, // Date of last successful login
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    loginHistory: [Date],
    profile: profile,
    raceHistory: raceHistory,
    coins: { type: Number, default: 0 }
}, {
    // strict: false // if you don't see a field saved in the DB check this option
});

userSchema.pre<IUserDocumentModel>('save', async function (next): Promise<void> {
    if (!this.isModified('password')) {
        return next();
    }

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

// const processFindQuery = (users) => {
//     if (users) {
//         if (!Array.isArray(users)) {
//             users = [ users ];
//         }

//         users.forEach((user) => {
//             user.password = null;
//         });
//     }
// }

// userSchema.post<IUserDocumentModel>('find', processFindQuery);
// userSchema.post<IUserDocumentModel>('findOne', processFindQuery);

userSchema.methods.isValidPassword = async function (password: string): Promise<boolean> {
    const compare = await bcrypt.compare(password, this.password);
    return compare;
}

userSchema.methods.fullName = function (): string {
    return (this.firstName.trim() + " " + this.lastName.trim());
};

const UserModel: Model<IUserDocumentModel> = mongoose.model<IUserDocumentModel>('User', userSchema);

export default UserModel;