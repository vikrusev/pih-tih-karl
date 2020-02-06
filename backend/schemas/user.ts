import mongoose, { Schema, Model } from 'mongoose'

const userSchema: Schema<IUserDocumentModel> = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastLogin: Date, // Date of last successful login
    profile: String,
    firstName: String,
    lastName: String
}, {
    // strict: false // if you don't see a field saved in the DB check this option
});

userSchema.pre<IUserDocumentModel>('save', function (next): void {
    if (!this.username) {
        this.username = 'vikrusev';
    }

    next();
});

userSchema.methods.fullName = function (): string {
    return (this.firstName.trim() + " " + this.lastName.trim());
};

const UserModel: Model<IUserDocumentModel> = mongoose.model<IUserDocumentModel>('User', userSchema);

export default UserModel;