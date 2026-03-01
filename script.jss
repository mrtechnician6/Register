// 1. Link the search input to the code
const searchInput = document.getElementById('search-input');

// 2. Create the Search Function
function handleSearch() {
    const term = searchInput.value.toLowerCase().trim();
    const grid = document.getElementById('record-grid');
    
    // Filter from your main 'records' list
    const filtered = records.filter(r => 
        r.name.toLowerCase().includes(term) || 
        r.grade.toLowerCase().includes(term)
    );

    // Update the count display
    document.getElementById('student-count').innerText = filtered.length;

    // Clear grid for results
    grid.innerHTML = '';

    if (filtered.length > 0) {
        // Show found students using your existing render logic
        render(filtered); 
    } else {
        // THE "NOT REGISTERED" FEATURE
        grid.innerHTML = `
            <div style="text-align: center; padding: 50px 20px; color: #64748b;">
                <i class="fa-solid fa-user-xmark" style="font-size: 3.5rem; margin-bottom: 15px; color: #cbd5e1;"></i>
                <h3 style="color: #0f172a; margin-bottom: 10px;">Student Not Found</h3>
                <p>This student is not registered in <b>Shree Kinder Garden Academy</b>.</p>
                <p style="font-size: 0.8rem; margin-top: 10px;">Try checking the spelling or register them using the + button.</p>
            </div>
        `;
    }
}

// 3. The "Event Listener" - This makes it run!
searchInput.addEventListener('input', handleSearch);

// 4. Update your Render function to accept the filtered list
function render(dataToDisplay = records) {
    const grid = document.getElementById('record-grid');
    grid.innerHTML = ''; 
    
    if (records.length === 0) {
        grid.innerHTML = '<p style="text-align:center; color:#94a3b8; margin-top:30px;">Ready for first registration!</p>';
        return;
    }

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
            </div>
        `;
        grid.appendChild(card);
    });
}
