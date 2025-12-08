// File upload functionality for all portals

// Generic upload function
function uploadFiles(portalType, portalName) {
    const fileInput = document.getElementById(portalType + 'FileInput');
    const fileList = document.getElementById(portalType + 'FileList');
    
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
        alert(`Successfully uploaded ${fileInput.files.length} file(s) to ${portalName}!`);
        fileInput.value = '';
    }, 500);
}

// Portal-specific upload functions
function uploadStudentFiles() {
    uploadFiles('student', 'Student Portal');
}

function uploadAgentFiles() {
    uploadFiles('agent', 'Agent Portal');
}

function uploadStaffFiles() {
    uploadFiles('staff', 'Staff Portal');
}

function uploadAlumniFiles() {
    uploadFiles('alumni', 'Alumni Portal');
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
                // Create a new DataTransfer object and add files
                const dataTransfer = new DataTransfer();
                for (let i = 0; i < e.dataTransfer.files.length; i++) {
                    dataTransfer.items.add(e.dataTransfer.files[i]);
                }
                fileInput.files = dataTransfer.files;
                
                // Trigger change event
                const event = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(event);
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
