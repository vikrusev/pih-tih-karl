interface BasicUserModel {
    email: String,
    password: String,
    lastLogin: Date, // Date of last successful login
    profile: UserProfile
}

interface UserWithHistories extends BasicUserModel {
    passwordHistory: PasswordHistory[],
    loginHistory: LoginHistory[],
    raceHistory: RaceHistory[]
}

interface UserProfile {
    /* Visible username of the player */
    username: String,
    firstName?: String,
    lastName?: String,
    birthDate?: Date
}

interface PasswordHistory {
    password: String,
    changeDate: Date
}

interface LoginHistory {
    date: Date,
    invalidLogins: Number // Used to block login attempts if needed
}

interface Oponent {
    userId: String,
    username: String
}

interface RaceHistory {
    oponent: Oponent,
    date: Date
    status: Boolean, // Wheather the battle is a win or loss
    type: String // Type of race - attack, defence, bot attack
}
