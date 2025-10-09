export function isEmail(email: string) {
    const emailRegularExpression = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim
    return emailRegularExpression.test(email)
}
