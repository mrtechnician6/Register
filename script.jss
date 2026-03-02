            </script>
// This tells the browser: "The moment someone types in the search box, run the search"
document.getElementById('search-input').addEventListener('input', function() {
    const term = this.value.toLowerCase().trim();
    const grid = document.getElementById('record-grid');
    
    // Filter the records based on Name or Grade
    const filtered = window.allRecords.filter(r => 
        r.name.toLowerCase().includes(term) || 
        r.grade.toLowerCase().includes(term)
    );

    // Update the number count
    document.getElementById('student-count').innerText = filtered.length;

    if (filtered.length > 0) {
        renderList(filtered); // Show the matching students
    } else {
        // Show "No Students Found" if searching for something like 'Z'
        grid.innerHTML = `
            <div style="text-align: center; padding: 50px; color: #64748b;">
                <i class="fa-solid fa-user-slash" style="font-size: 3rem; margin-bottom: 10px; opacity: 0.3;"></i>
                <h3 style="color: #0f172a;">No Students Found</h3>
                <p>"${this.value}" is not registered yet.</p>
            </div>`;
    }
});

    <script>
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwteftRrWcI6wWHPaEXXNM_ZKcc3cuE1GnPyWWDkXL-6xmB636mMyDlCIHcjkM7uc1jdg/exec";
        
        // Start with empty records to avoid showing "old" data from other platforms
        let records = JSON.parse(localStorage.getItem('shree_v3_clean')) || [];

        const searchInput = document.getElementById('search-input');
        const overlay = document.getElementById('overlay');
        const openBtn = document.getElementById('open-btn');
        const form = document.getElementById('reg-form');
        const countDisplay = document.getElementById('student-count');

        // --- 1. UNIVERSAL CLOUD SYNC ---
        // This ensures that whether you open in Messenger, Instagram, or Chrome, 
        // it always fetches the latest data from your Google Sheet.
        async function syncWithCloud() {
            countDisplay.innerText = "Loading..."; // Visual cue that it's fetching data
            try {
                const response = await fetch(SCRIPT_URL);
                const cloudData = await response.json();
                
                if (cloudData && Array.isArray(cloudData)) {
                    // Filter out any empty rows from the sheet
                    records = cloudData.filter(r => r.name).reverse(); 
                    localStorage.setItem('shree_v3_clean', JSON.stringify(records));
                    render();
                }
            } catch (err) {
                console.warn("Cloud Sync Failed. Showing local backup.");
                render(); // Fallback to local if offline
            }
        }

        // --- 2. SEARCH ENGINE (Starts With) ---
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            const filtered = records.filter(r => 
                r.name.toLowerCase().startsWith(term) || 
                r.grade.toString().toLowerCase().startsWith(term)
            );
            render(filtered, term);
        });

        // --- 3. UI LOGIC ---
        const toggle = (e) => { if(e) e.preventDefault(); overlay.classList.toggle('active'); };
        openBtn.addEventListener('click', toggle);
        overlay.onclick = (e) => { if(e.target === overlay) toggle(); };

        // --- 4. THE RENDER ENGINE ---
        function render(dataToDisplay = records, searchTerm = "") {
            const grid = document.getElementById('record-grid');
            countDisplay.innerText = dataToDisplay.length;
            grid.innerHTML = '';
            
            if (dataToDisplay.length === 0 && searchTerm !== "") {
                grid.innerHTML = `<div style="text-align:center;padding:50px;"><i class="fa-solid fa-user-xmark" style="font-size:3rem;color:#cbd5e1;"></i><h3>No Matches</h3></div>`;
                return;
            }

            if (dataToDisplay.length === 0 && !searchTerm) {
                grid.innerHTML = '<p style="text-align:center;color:#94a3b8;margin-top:50px;">Fetching records from cloud...</p>';
                return;
            }

            dataToDisplay.forEach(r => {
                const card = document.createElement('div');
                card.className = 'student-card';
                card.onclick = () => card.classList.toggle('expanded');
                card.innerHTML = `
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div>
                            <h3 style="color:#0f172a;">${r.name}</h3>
                            <p style="font-size:0.8rem;color:#64748b;">Grade: ${r.grade} • <span style="color:var(--brand)">Details</span></p>
                        </div>
                        <i class="fa-solid fa-chevron-down" style="color:#cbd5e1;"></i>
                    </div>
                    <div class="student-details">
                        <div class="detail-item"><i class="fa-solid fa-user-shield"></i> <strong>Guardian:</strong> ${r.gName || r.gname}</div>
                        <div class="detail-item"><i class="fa-solid fa-phone"></i> <strong>Contact:</strong> ${r.gPhone || r.gphone}</div>
                        <div class="detail-item"><i class="fa-solid fa-map-location-dot"></i> <strong>Address:</strong> ${r.address || r.addr}</div>
                    </div>`;
                grid.appendChild(card);
            });
        }

        // --- 5. REGISTRATION LOGIC ---
        form.onsubmit = async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const originalText = btn.innerText;
            btn.innerText = "Syncing...";
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
                // Optimistically update UI
                records.unshift(data);
                localStorage.setItem('shree_v3_clean', JSON.stringify(records));
                form.reset();
                toggle();
                render();
                alert("✅ Registered in Cloud!");
            } catch (err) { alert("Network Error. Please try again."); }
            finally { btn.innerText = originalText; btn.disabled = false; }
        };

        // RUN ON STARTUP
        render(); // Show local data first
        syncWithCloud(); // Immediately fetch fresh data from the Sheet
    </script>
