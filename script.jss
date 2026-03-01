        <script>
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwteftRrWcI6wWHPaEXXNM_ZKcc3cuE1GnPyWWDkXL-6xmB636mMyDlCIHcjkM7uc1jdg/exec";
    
    // We use a global variable so the search function can always see the data
    window.allRecords = JSON.parse(localStorage.getItem('shree_v3_clean')) || [];

    // --- 1. THE SEARCH ENGINE ---
    function runSearch() {
        const input = document.getElementById('search-input');
        const grid = document.getElementById('record-grid');
        
        if (!input || !grid) return; // Safety check

        const term = input.value.toLowerCase().trim();
        
        // Filter: If user searches 'R', it finds 'Ram'
        const filtered = window.allRecords.filter(r => 
            r.name.toLowerCase().includes(term) || 
            r.grade.toLowerCase().includes(term)
        );

        // Update count
        document.getElementById('student-count').innerText = filtered.length;

        // Display results
        if (filtered.length > 0) {
            renderList(filtered);
        } else {
            // THE "NO STUDENT FOUND" FEATURE
            grid.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #64748b;">
                    <i class="fa-solid fa-magnifying-glass-chart" style="font-size: 3.5rem; margin-bottom: 20px; opacity: 0.3;"></i>
                    <h3 style="color: #0f172a; margin-bottom: 8px;">No Students Found</h3>
                    <p>There is no student registered starting with "${input.value}"</p>
                </div>`;
        }
    }

    // --- 2. THE DISPLAY ENGINE ---
    function renderList(dataToDisplay) {
        const grid = document.getElementById('record-grid');
        grid.innerHTML = '';

        dataToDisplay.forEach(r => {
            const card = document.createElement('div');
            card.className = 'student-card';
            card.onclick = () => card.classList.toggle('expanded');
            
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h3 style="color:#0f172a;">${r.name}</h3>
                        <p style="font-size:0.8rem; color:#64748b;">Grade: ${r.grade} • Tap to view</p>
                    </div>
                    <i class="fa-solid fa-chevron-down" style="color:#cbd5e1;"></i>
                </div>
                <div class="student-details">
                    <div class="detail-item"><i class="fa-solid fa-calendar"></i> <strong>Age:</strong> ${r.age}</div>
                    <div class="detail-item"><i class="fa-solid fa-user-shield"></i> <strong>Parent:</strong> ${r.gName}</div>
                    <div class="detail-item"><i class="fa-solid fa-phone"></i> <strong>Contact:</strong> ${r.gPhone}</div>
                    <div class="detail-item"><i class="fa-solid fa-map-location-dot"></i> <strong>Address:</strong> ${r.address}</div>
                </div>`;
            grid.appendChild(card);
        });
    }

    // --- 3. INITIALIZATION ---
    document.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.getElementById('search-input');
        const form = document.getElementById('reg-form');

        // Attach the search trigger
        if (searchInput) {
            searchInput.addEventListener('input', runSearch);
        }

        // Form Submission
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                const btn = document.getElementById('submit-btn');
                btn.innerText = "Registering...";
                
                const data = {
                    name: document.getElementById('name').value,
                    age: document.getElementById('age').value,
                    grade: document.getElementById('grade').value,
                    gName: document.getElementById('gname').value,
                    gPhone: document.getElementById('gphone').value,
                    email: document.getElementById('email').value,
                    address: document.getElementById('addr').value
                };

                try {
                    await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
                    window.allRecords.unshift(data);
                    localStorage.setItem('shree_v3_clean', JSON.stringify(window.allRecords));
                    alert("✅ Registration Success!");
                    location.reload(); // Refresh ensures everything stays in sync
                } catch (err) { alert("Error!"); }
            };
        }

        renderList(window.allRecords);
    });
</script>
