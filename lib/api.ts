// API Utility Functions
// Base API URL
const API_BASE_URL = 'https://citiedgecollege.co.uk/student_api.php';

// Generic function to fetch data from API
export async function fetchData(action: string) {
    try {
           const response = await fetch(`${API_BASE_URL}?action=${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY as string
            },
           
        });

        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Fetch error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Generic function to send data to API
export async function sendData(action: string, data: any) {
    try {
        const response = await fetch(`${API_BASE_URL}?action=${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY as string
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const result = await response.json();
        return { success: true, data: result };
        
    } catch (error) {
        console.error('Send error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Custom query function - for running custom queries through API
export async function runCustomQuery(query: string) {
    try {
        const response = await fetch(`${API_BASE_URL}?action=query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return { success: true, data: result };
    } catch (error) {
        console.error('Query error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Specific API calls for different sections
export const studentsAPI = {
    getAll: () => fetchData('getStudents'),
    getById: (id: string) => fetchData(`getStudent&id=${id}`),
    add: (student: any) => sendData('add', student),      
    update: (id: string, student: any) => sendData('updateStudent', { id, ...student }),
    delete: (id: string) => sendData('deleteStudent', { id }),
};

export const staffAPI = {
    getAll: () => fetchData('getStaff'),
    getById: (id: string) => fetchData(`getStaffMember&id=${id}`),
    create: (staff: any) => sendData('createStaff', staff),
    update: (id: string, staff: any) => sendData('updateStaff', { id, ...staff }),
    delete: (id: string) => sendData('deleteStaff', { id }),
};

export const libraryAPI = {
    getAll: () => fetchData('getLibraryItems'),
    getById: (id: string) => fetchData(`getLibraryItem&id=${id}`),
    create: (item: any) => sendData('createLibraryItem', item),
    update: (id: string, item: any) => sendData('updateLibraryItem', { id, ...item }),
    delete: (id: string) => sendData('deleteLibraryItem', { id }),
};

export const tuitionAPI = {
    getAll: () => fetchData('getTuitionRecords'),
    getById: (id: string) => fetchData(`getTuitionRecord&id=${id}`),
    create: (record: any) => sendData('createTuitionRecord', record),
    update: (id: string, record: any) => sendData('updateTuitionRecord', { id, ...record }),
    delete: (id: string) => sendData('deleteTuitionRecord', { id }),
};

export const attendanceAPI = {
    getAll: () => fetchData('getAttendance'),
    getByDate: (date: string) => fetchData(`getAttendance&date=${date}`),
    create: (record: any) => sendData('createAttendance', record),
    update: (id: string, record: any) => sendData('updateAttendance', { id, ...record }),
};

export const usersAPI = {
    getAll: () => fetchData('getUsers'),
    getById: (id: string) => fetchData(`getUser&id=${id}`),
    create: (user: any) => sendData('createUser', user),
    update: (id: string, user: any) => sendData('updateUser', { id, ...user }),
    delete: (id: string) => sendData('deleteUser', { id }),
};
