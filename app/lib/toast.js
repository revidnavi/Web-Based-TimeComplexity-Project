export function showToast(message, type) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'info';
    if (type === 'success') icon = 'check_circle';
    else if (type === 'error') icon = 'cancel';
    else if (type === 'warning') icon = 'warning';

   toast.innerHTML = `
    <span class="material-icons icon-${type}">${icon}</span>
        <span class="toast-message">${message}</span>
`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 5000);
}