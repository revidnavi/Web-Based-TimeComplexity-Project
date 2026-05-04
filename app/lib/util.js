import { API_URL } from '../conf/api.js';

export async function loginRedirect(currentPage) {
    const result = await fetch(API_URL+"/login_redirect.php", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
            currentPage
        })
    });
    const response = await result.json();
    
    if (response.redirect != null) {
        window.location.href = response.redirect;
    }
}