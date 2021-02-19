export const appendScript = (scriptToAppend) => {
    const script = document.createElement("script");
    script.src = scriptToAppend;
    script.async = true;
    console.log(script);
    document.body.appendChild(script);
}