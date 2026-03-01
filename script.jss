function searchRecords() {
    const term = document.getElementById('search-input').value.toLowerCase().trim();
    const grid = document.getElementById('record-grid');
    
    // Filter the records based on Name or Grade
    const filtered = records.filter(r => 
        r.name.toLowerCase().includes(term) || 
        r.grade.toLowerCase().includes(term)
    );

    // Update the student count display for the search results
    document.getElementById('student-count').innerText = filtered.length;

    // Clear the grid to show results
    grid.innerHTML = '';

    if (filtered.length > 0) {
        // Show the found students
        render(filtered); 
    } else {
        // THE NEW FEATURE: "Student not registered" message
        grid.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #64748b;">
                <i class="fa-solid fa-user-slash" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <h3 style="color: #0f172a;">Student not found</h3>
                <p>This student is not registered in our academy yet.</p>
            </div>
        `;
    }
}

// UPDATE: Modify your existing render function slightly to accept a list
function render(dataToDisplay = records) {
    const grid = document.getElementById('record-grid');
    grid.innerHTML = ''; // Clear current view
    
    // If no data exists at all in the system
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
