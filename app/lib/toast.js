export function showToast(header, message, type) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'info';
    if (type === 'success') icon = 'check_circle';
    else if (type === 'error') icon = 'cancel';
    else if (type === 'warning') icon = 'warning';

   toast.innerHTML = `

    <span class="material-icons icon-${type}">${icon}</span>
    <div class="toast-content">
    <span class="toast-header">${header}</span>
        <span class="toast-message">${message}</span>
    </div>
`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 5000);
}