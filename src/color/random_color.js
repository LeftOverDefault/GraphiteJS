randomColor = function() {
    return (new Color()).fromHex('#' + Math.floor(Math.random() * 16777215).toString(16));
}
