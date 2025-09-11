export class Utility {
    private static enToBnMap : Record<string, string> = {
        '0': '০','1': '১','2': '২','3': '৩','4': '৪',
        '5': '৫','6': '৬','7': '৭','8': '৮','9': '৯'
    };

    static translateNumber(number: string) {
        return number.replace(/[0-9]/g, (match) => this.enToBnMap[match]);
    }
}
