const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwteftRrWcI6wWHPaEXXNM_ZKcc3cuE1GnPyWWDkXL-6xmB636mMyDlCIHcjkM7uc1jdg/exec";
let records = JSON.parse(localStorage.getItem('shree_records')) || [];

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('form-overlay');
    const openBtn = document.getElementById('open-form-btn');
    const closeBtn = document.getElementById('close-form-btn');
    const form = document.getElementById('record-form');

    // FIX: Add touchstart for mobile responsiveness
    const toggle = (e) => {
        e.preventDefault();
        overlay.classList.toggle('active');
    };

    openBtn.addEventListener('click', toggle);
    openBtn.addEventListener('touchstart', toggle);
    closeBtn.addEventListener('click', () => overlay.classList.remove('active'));

    form.onsubmit = async (e) => {
        e.preventDefault();
        document.getElementById('submit-btn').innerText = "Sending to Cloud...";
        
        const data = {
            name: document.getElementById('name').value,
            age: document.getElementById('age').value,
            grade: document.getElementById('grade').value,
            gName: document.getElementById('g-name').value,
            gPhone: document.getElementById('g-phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value
        };

        await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
        
        records.unshift(data);
        localStorage.setItem('shree_records', JSON.stringify(records));
        alert("✅ Success!");
        location.reload(); // Refresh to show new card
    };

    render();
});

function render() {
    const grid = document.getElementById('record-grid');
    document.getElementById('student-count').innerText = records.length;
    records.forEach(r => {
        const div = document.createElement('div');
        div.className = 'student-card';
        div.innerHTML = `<h3>${r.name}</h3><p>Grade: ${r.grade}</p><p>Parent: ${r.gName}</p>`;
        grid.appendChild(div);
    });
}
