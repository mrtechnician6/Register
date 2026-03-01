<script>
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwteftRrWcI6wWHPaEXXNM_ZKcc3cuE1GnPyWWDkXL-6xmB636mMyDlCIHcjkM7uc1jdg/exec";
    // Using v3 storage to ensure we have clean data
    let records = JSON.parse(localStorage.getItem('shree_v3_clean')) || [];

    // --- 1. CORE INITIALIZATION ---
    document.addEventListener('DOMContentLoaded', () => {
        const overlay = document.getElementById('overlay');
        const openBtn = document.getElementById('open-btn');
        const form = document.getElementById('reg-form');
        const searchInput = document.getElementById('search-input');

        // Toggle Form Logic
        const toggle = (e) => { if(e) e.preventDefault(); overlay.classList.toggle('active'); };
        if(openBtn) {
            openBtn.addEventListener('click', toggle);
            openBtn.addEventListener('touchstart', toggle);
        }

        // --- 2. SEARCH FEATURE LOGIC ---
        if(searchInput) {
            searchInput.addEventListener('input', () => {
                const term = searchInput.value.toLowerCase().trim();
                const filtered = records.filter(r => 
                    r.name.toLowerCase().includes(term) || 
                    r.grade.toLowerCase().includes(term)
                );
                render(filtered, term); // Pass the term to check if we are searching
            });
        }

        // --- 3. SUBMISSION LOGIC ---
        if(form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                const btn = document.getElementById('submit-btn');
                btn.innerText = "Saving...";
                btn.disabled = true;

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
                    records.unshift(data);
                    localStorage.setItem('shree_v3_clean', JSON.stringify(records));
                    alert("✅ Registration Successful!");
                    form.reset();
                    overlay.classList.remove('active');
                    render();
                } catch (err) { alert("Error connecting to cloud."); }
                finally { btn.innerText = "Complete Registration"; btn.disabled = false; }
            };
        }

        render(); // Initial draw
    });

    // --- 4. RENDER FUNCTION (The "Tap to Show" & "Search Error" logic) ---
    function render(dataToDisplay = records, searchTerm = "") {
        const grid = document.getElementById('record-grid');
        document.getElementById('student-count').innerText = dataToDisplay.length;
        grid.innerHTML = '';
        
        // Scenario 1: No matches found during search
        if (dataToDisplay.length === 0 && searchTerm !== "") {
            grid.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #64748b;">
                    <i class="fa-solid fa-user-slash" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                    <h3 style="color: #0f172a;">Student not found</h3>
                    <p>This student is not registered in our academy yet.</p>
                </div>`;
            return;
        }

        // Scenario 2: No records in system at all
        if (records.length === 0) {
            grid.innerHTML = '<p style="text-align:center; color:#94a3b8; margin-top:30px;">Ready for first registration!</p>';
            return;
        }

        // Draw Cards
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
                    <div class="detail-item"><i class="fa-solid fa-envelope"></i> <strong>Email:</strong> ${r.email}</div>
                    <div class="detail-item"><i class="fa-solid fa-map-location-dot"></i> <strong>Address:</strong> ${r.address}</div>
                </div>`;
            grid.appendChild(card);
        });
    }
</script>
