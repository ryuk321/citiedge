/**
 * Reusable UI Components
 * Component-based architecture for building consistent UIs
 */

const Components = {
    /**
     * Create a card component
     */
    card: (config) => {
        const { title, icon, content, footer, className = '' } = config;
        
        return `
            <div class="component-card ${className}">
                ${icon ? `<div class="card-icon">${icon}</div>` : ''}
                ${title ? `<h3 class="card-title">${title}</h3>` : ''}
                <div class="card-content">
                    ${content}
                </div>
                ${footer ? `<div class="card-footer">${footer}</div>` : ''}
            </div>
        `;
    },
    
    /**
     * Create a data table component
     */
    table: (config) => {
        const { headers, rows, className = '', actions = [] } = config;
        
        let tableHTML = `<table class="component-table ${className}">`;
        
        // Headers
        tableHTML += '<thead><tr>';
        headers.forEach(header => {
            tableHTML += `<th>${header}</th>`;
        });
        if (actions.length > 0) {
            tableHTML += '<th>Actions</th>';
        }
        tableHTML += '</tr></thead>';
        
        // Rows
        tableHTML += '<tbody>';
        rows.forEach((row, index) => {
            tableHTML += '<tr>';
            row.forEach(cell => {
                tableHTML += `<td>${cell}</td>`;
            });
            
            // Actions column
            if (actions.length > 0) {
                tableHTML += '<td class="actions-cell">';
                actions.forEach(action => {
                    tableHTML += `<button class="btn btn-sm btn-${action.type}" 
                                    onclick="${action.onClick}(${index})"
                                    title="${action.label}">
                                    ${action.icon || action.label}
                                  </button>`;
                });
                tableHTML += '</td>';
            }
            
            tableHTML += '</tr>';
        });
        tableHTML += '</tbody>';
        
        tableHTML += '</table>';
        return tableHTML;
    },
    
    /**
     * Create a stat card component
     */
    statCard: (config) => {
        const { label, value, icon, trend, className = '' } = config;
        
        return `
            <div class="stat-card ${className}">
                <div class="stat-icon">${icon}</div>
                <div class="stat-info">
                    <div class="stat-label">${label}</div>
                    <div class="stat-value">${value}</div>
                    ${trend ? `<div class="stat-trend ${trend.type}">${trend.text}</div>` : ''}
                </div>
            </div>
        `;
    },
    
    /**
     * Create a timetable component
     */
    timetable: (data) => {
        let html = '<div class="timetable-grid">';
        
        // Header row with days
        html += '<div class="timetable-header"><div class="time-label">Time</div>';
        data.forEach(day => {
            html += `<div class="day-header">${day.day}</div>`;
        });
        html += '</div>';
        
        // Get all unique time slots
        const timeSlots = [...new Set(data.flatMap(day => day.slots.map(slot => slot.time)))];
        
        // Create rows for each time slot
        timeSlots.forEach(time => {
            html += `<div class="timetable-row">`;
            html += `<div class="time-label">${time}</div>`;
            
            data.forEach(day => {
                const slot = day.slots.find(s => s.time === time);
                if (slot && slot.course) {
                    html += `
                        <div class="timetable-cell filled">
                            <div class="course-code">${slot.course}</div>
                            <div class="course-type">${slot.type}</div>
                            <div class="course-location">${slot.location}</div>
                        </div>
                    `;
                } else {
                    html += `<div class="timetable-cell empty">Free</div>`;
                }
            });
            
            html += '</div>';
        });
        
        html += '</div>';
        return html;
    },
    
    /**
     * Create a modal component
     */
    modal: (config) => {
        const { id, title, content, footer, size = 'medium' } = config;
        
        return `
            <div id="${id}" class="modal" style="display: none;">
                <div class="modal-overlay" onclick="Components.closeModal('${id}')"></div>
                <div class="modal-content modal-${size}">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close" onclick="Components.closeModal('${id}')">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
                </div>
            </div>
        `;
    },
    
    /**
     * Open modal
     */
    openModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    },
    
    /**
     * Close modal
     */
    closeModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    },
    
    /**
     * Create a form field
     */
    formField: (config) => {
        const { type, name, label, value = '', required = false, options = [] } = config;
        
        let fieldHTML = `<div class="form-field">`;
        fieldHTML += `<label for="${name}">${label}${required ? ' <span class="required">*</span>' : ''}</label>`;
        
        if (type === 'select') {
            fieldHTML += `<select id="${name}" name="${name}" ${required ? 'required' : ''}>`;
            fieldHTML += '<option value="">Select...</option>';
            options.forEach(opt => {
                fieldHTML += `<option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>${opt.label}</option>`;
            });
            fieldHTML += '</select>';
        } else if (type === 'textarea') {
            fieldHTML += `<textarea id="${name}" name="${name}" ${required ? 'required' : ''}>${value}</textarea>`;
        } else {
            fieldHTML += `<input type="${type}" id="${name}" name="${name}" value="${value}" ${required ? 'required' : ''}>`;
        }
        
        fieldHTML += '</div>';
        return fieldHTML;
    },
    
    /**
     * Create a badge/status indicator
     */
    badge: (config) => {
        const { text, type = 'default' } = config;
        return `<span class="badge badge-${type}">${text}</span>`;
    },
    
    /**
     * Create a loading spinner
     */
    loader: (text = 'Loading...') => {
        return `
            <div class="loader-container">
                <div class="loader"></div>
                <p>${text}</p>
            </div>
        `;
    },
    
    /**
     * Create an alert/notification
     */
    alert: (config) => {
        const { type = 'info', message, dismissible = true } = config;
        
        return `
            <div class="alert alert-${type}">
                <span>${message}</span>
                ${dismissible ? '<button class="alert-close" onclick="this.parentElement.remove()">&times;</button>' : ''}
            </div>
        `;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Components;
}
