// File upload functionality for all portals

// Student Portal Upload
function uploadStudentFiles() {
    const fileInput = document.getElementById('studentFileInput');
    const fileList = document.getElementById('studentFileList');
    
    if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please select files to upload');
        return;
    }
    
    fileList.innerHTML = '';
    
    for (let i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i];
        const fileItem = createFileItem(file);
        fileList.appendChild(fileItem);
    }
    
    setTimeout(() => {
        alert(`Successfully uploaded ${fileInput.files.length} file(s) to Student Portal!`);
        fileInput.value = '';
    }, 500);
}

// Agent Portal Upload
function uploadAgentFiles() {
    const fileInput = document.getElementById('agentFileInput');
    const fileList = document.getElementById('agentFileList');
    
    if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please select files to upload');
        return;
    }
    
    fileList.innerHTML = '';
    
    for (let i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i];
        const fileItem = createFileItem(file);
        fileList.appendChild(fileItem);
    }
    
    setTimeout(() => {
        alert(`Successfully uploaded ${fileInput.files.length} file(s) to Agent Portal!`);
        fileInput.value = '';
    }, 500);
}

// Staff Portal Upload
function uploadStaffFiles() {
    const fileInput = document.getElementById('staffFileInput');
    const fileList = document.getElementById('staffFileList');
    
    if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please select files to upload');
        return;
    }
    
    fileList.innerHTML = '';
    
    for (let i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i];
        const fileItem = createFileItem(file);
        fileList.appendChild(fileItem);
    }
    
    setTimeout(() => {
        alert(`Successfully uploaded ${fileInput.files.length} file(s) to Staff Portal!`);
        fileInput.value = '';
    }, 500);
}

// Alumni Portal Upload
function uploadAlumniFiles() {
    const fileInput = document.getElementById('alumniFileInput');
    const fileList = document.getElementById('alumniFileList');
    
    if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please select files to upload');
        return;
    }
    
    fileList.innerHTML = '';
    
    for (let i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i];
        const fileItem = createFileItem(file);
        fileList.appendChild(fileItem);
    }
    
    setTimeout(() => {
        alert(`Successfully uploaded ${fileInput.files.length} file(s) to Alumni Portal!`);
        fileInput.value = '';
    }, 500);
}

// Helper function to create file item display
function createFileItem(file) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    const fileName = document.createElement('span');
    fileName.textContent = file.name;
    
    const fileSize = document.createElement('small');
    fileSize.textContent = formatFileSize(file.size);
    fileSize.style.marginLeft = '10px';
    
    const fileInfo = document.createElement('div');
    fileInfo.appendChild(fileName);
    fileInfo.appendChild(fileSize);
    
    const uploadStatus = document.createElement('span');
    uploadStatus.className = 'status-badge status-completed';
    uploadStatus.textContent = 'Ready to Upload';
    
    fileItem.appendChild(fileInfo);
    fileItem.appendChild(uploadStatus);
    
    return fileItem;
}

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Add drag and drop functionality
document.addEventListener('DOMContentLoaded', function() {
    const uploadAreas = document.querySelectorAll('.upload-area');
    
    uploadAreas.forEach(area => {
        area.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.background = '#f0f4ff';
        });
        
        area.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.background = 'white';
        });
        
        area.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.background = 'white';
            
            const fileInput = this.querySelector('input[type="file"]');
            if (fileInput && e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                
                // Trigger file display
                const fileListId = fileInput.id.replace('Input', 'List');
                const fileList = document.getElementById(fileListId);
                
                if (fileList) {
                    fileList.innerHTML = '';
                    for (let i = 0; i < fileInput.files.length; i++) {
                        const file = fileInput.files[i];
                        const fileItem = createFileItem(file);
                        fileList.appendChild(fileItem);
                    }
                }
            }
        });
    });
    
    // Add change event listeners to file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileListId = this.id.replace('Input', 'List');
            const fileList = document.getElementById(fileListId);
            
            if (fileList) {
                fileList.innerHTML = '';
                for (let i = 0; i < this.files.length; i++) {
                    const file = this.files[i];
                    const fileItem = createFileItem(file);
                    fileList.appendChild(fileItem);
                }
            }
        });
    });
});
