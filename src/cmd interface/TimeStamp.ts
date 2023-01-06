export function timeStamp() {
    let dateTime = new Date();
    let timeNow: string = dateTime.toString()
    timeNow = timeNow.slice(0, 21)
    return timeNow
}
