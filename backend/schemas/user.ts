import mongoose, { Schema, Model } from 'mongoose'
import * as bcrypt from 'bcrypt';

const userSchema: Schema<IUserDocumentModel> = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    lastLogin: Date, // Date of last successful login
    profile: String,
    firstName: String,
    lastName: String
}, {
    // strict: false // if you don't see a field saved in the DB check this option
});

userSchema.pre<IUserDocumentModel>('save', async function (next): Promise<void> {
    if (!this.username) {
        this.username = 'vikrusev';
    }

    if (this.password) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
    } else {
        throw Error('WTF No Password?!');
    }

    next();
});

userSchema.methods.isValidPassword = async function (password: string): Promise<boolean> {
    const compare = await bcrypt.compare(password, this.password);
    return compare;
}

userSchema.methods.fullName = function (): string {
    return (this.firstName.trim() + " " + this.lastName.trim());
};

const UserModel: Model<IUserDocumentModel> = mongoose.model<IUserDocumentModel>('User', userSchema);

export default UserModel;