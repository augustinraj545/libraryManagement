export const shortify = (text = 'No Description', maxLength = 300) => {
    if (text?.length <= maxLength) {
        return text;
    }

    return text.substring(0, maxLength) + " ...";
}