interface IncommingChallange {
    username: String,
    message: String
}

interface ChallangeAnswer {
    choice: Boolean,
    activeCar: Boolean
}

interface GameReport {
    emitEvent: String,
    data: number
}