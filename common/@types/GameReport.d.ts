interface GameReportSmall {
    type: String,
    value: any
}

interface GameReport {
    emitEvent: String,
    data: GameReportSmall
}

interface EndReport {
    message: String,
    subMessage: String
}