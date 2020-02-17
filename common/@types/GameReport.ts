interface GameReportSmall {
    type: String,
    value: Number | Boolean
}

interface GameReport {
    emitEvent: String,
    data: GameReportSmall
}