import { Document } from 'mongoose';

declare global {
    interface IBasicUser {
        username: String,
        email: String,
        password: String,
        lastLogin: Date, // Date of last successful login
        profile: IUserProfile,
        firstName: String,
        lastName: String
    }

    interface IUserWithHistories extends IBasicUser {
        passwordHistory: IPasswordHistory[],
        loginHistory: ILoginHistory[],
        raceHistory: IRaceHistory[]
    }

    interface IExtendedUser extends IUserWithHistories {
        fullName(): string,
        isValidPassword(string): Promise<boolean>
    }

    interface IUserDocumentModel extends IExtendedUser, Document { }

    interface IUserProfile {
        /* Personal data of the player */
        email: String,
        firstName?: String,
        lastName?: String,
        birthDate?: Date,
        visible?: Boolean // false by default
    }

    interface IPasswordHistory {
        password: String,
        changeDate: Date
    }

    interface ILoginHistory {
        date: Date,
        invalidLogins: Number // Used to block login attempts if needed
    }

    interface IOponent {
        userId: String,
        username: String
    }

    interface IRaceHistory {
        oponent: IOponent,
        date: Date
        status: Boolean, // Wheather the battle is a win or loss
        type: String // Type of race - attack, defence, bot attack
    }
}