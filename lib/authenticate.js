export async function checklogin(auth_link) {
    const result = await fetch(auth_link);
    const data = await result.json();
    if (data.redirect) {
        window.location.href = data.redirect;
    }
}