import { Document } from 'mongoose';

declare global {
    interface IBasicUser {
        email: String,
        username: String,
        password: String,
        lastLogin: Date, // Date of last successful login
        profile: IUserProfile,
    }

    interface IUserWithHistories extends IBasicUser {
        loginHistory: Date[],
        raceHistory: IRaceHistory[]
    }

    interface IExtendedUser extends IUserWithHistories {
        wins: Number,
        losses: Number
    }
    
    interface IUserDocumentModel extends IExtendedUser, Document {
        fullName(): String,
        isValidPassword(string): Promise<boolean>
    }

    interface IUserProfile {
        /* Personal data of the player */
        firstName?: String,
        lastName?: String,
        birthDate?: Date,
        visible?: Boolean // false by default
    }

    interface IRaceHistory {
        oponent: String,
        date: Date
        status: Boolean, // Wheather the battle is a win or loss
        type: String // Type of race - attack, defence, bot attack
    }
}