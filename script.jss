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

