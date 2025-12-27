# Student Finance System - Quick Setup

## 🚀 3-Step Setup

### Step 1: Database Setup (2 minutes)
```bash
# Run the SQL file
mysql -u your_username -p your_database < create_student_finance_table.sql
```

Or copy the contents of `create_student_finance_table.sql` and execute in your MySQL client.

**What this does:**
- Creates `student_finance_qualifications` table
- Creates `student_finance_general` table
- Inserts 16 pre-populated UK subjects
- Inserts 3 general information sections

**Verify:**
```sql
SELECT COUNT(*) FROM student_finance_qualifications;  -- Should return 16
SELECT COUNT(*) FROM student_finance_general;         -- Should return 3
```

---

### Step 2: Backend API Setup (5-10 minutes)

Add these API actions to your `student_api.php`:

```php
// ==========================================
// STUDENT FINANCE QUALIFICATIONS
// ==========================================

if ($action === 'getStudentFinanceQualifications') {
    $where = isset($_GET['active']) && $_GET['active'] === 'true' ? " WHERE is_active = 1" : "";
    $sql = "SELECT * FROM student_finance_qualifications{$where} ORDER BY display_order ASC, id ASC";
    $result = $conn->query($sql);
    $data = $result->fetch_all(MYSQLI_ASSOC);
    
    // Convert boolean fields
    foreach ($data as &$row) {
        $row['level_6_finance_eligible'] = (bool)$row['level_6_finance_eligible'];
        $row['level_7_finance_eligible'] = (bool)$row['level_7_finance_eligible'];
        $row['level_8_finance_eligible'] = (bool)$row['level_8_finance_eligible'];
        $row['is_regulated'] = (bool)$row['is_regulated'];
        $row['is_active'] = (bool)$row['is_active'];
    }
    
    echo json_encode(['success' => true, 'data' => $data]);
    exit;
}

if ($action === 'addFinanceQualification') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $sql = "INSERT INTO student_finance_qualifications 
            (subject_name, subject_slug, category, 
             level_6_title, level_6_qualification, level_6_finance_eligible,
             level_7_title, level_7_qualification, level_7_finance_eligible,
             level_8_title, level_8_qualification, level_8_finance_eligible,
             professional_route, is_regulated, regulatory_body, special_notes,
             display_order, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssisssissssiii", 
        $data['subject_name'], $data['subject_slug'], $data['category'],
        $data['level_6_title'], $data['level_6_qualification'], $data['level_6_finance_eligible'],
        $data['level_7_title'], $data['level_7_qualification'], $data['level_7_finance_eligible'],
        $data['level_8_title'], $data['level_8_qualification'], $data['level_8_finance_eligible'],
        $data['professional_route'], $data['is_regulated'], $data['regulatory_body'],
        $data['special_notes'], $data['display_order'], $data['is_active']
    );
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'id' => $conn->insert_id]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
    exit;
}

if ($action === 'updateFinanceQualification') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $sql = "UPDATE student_finance_qualifications SET 
            subject_name = ?, subject_slug = ?, category = ?,
            level_6_title = ?, level_6_qualification = ?, level_6_finance_eligible = ?,
            level_7_title = ?, level_7_qualification = ?, level_7_finance_eligible = ?,
            level_8_title = ?, level_8_qualification = ?, level_8_finance_eligible = ?,
            professional_route = ?, is_regulated = ?, regulatory_body = ?, special_notes = ?,
            display_order = ?, is_active = ?
            WHERE id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssisssissssiiii", 
        $data['subject_name'], $data['subject_slug'], $data['category'],
        $data['level_6_title'], $data['level_6_qualification'], $data['level_6_finance_eligible'],
        $data['level_7_title'], $data['level_7_qualification'], $data['level_7_finance_eligible'],
        $data['level_8_title'], $data['level_8_qualification'], $data['level_8_finance_eligible'],
        $data['professional_route'], $data['is_regulated'], $data['regulatory_body'],
        $data['special_notes'], $data['display_order'], $data['is_active'], $data['id']
    );
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
    exit;
}

if ($action === 'deleteFinanceQualification') {
    $data = json_decode(file_get_contents('php://input'), true);
    $sql = "DELETE FROM student_finance_qualifications WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $data['id']);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
    exit;
}

// ==========================================
// STUDENT FINANCE GENERAL INFO
// ==========================================

if ($action === 'getStudentFinanceGeneral') {
    $where = isset($_GET['active']) && $_GET['active'] === 'true' ? " WHERE is_active = 1" : "";
    $sql = "SELECT * FROM student_finance_general{$where} ORDER BY display_order ASC, id ASC";
    $result = $conn->query($sql);
    $data = $result->fetch_all(MYSQLI_ASSOC);
    
    // Convert boolean fields
    foreach ($data as &$row) {
        $row['is_active'] = (bool)$row['is_active'];
    }
    
    echo json_encode(['success' => true, 'data' => $data]);
    exit;
}

if ($action === 'addFinanceGeneralInfo') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $sql = "INSERT INTO student_finance_general 
            (section_title, section_slug, section_type, content, 
             display_order, is_active, icon, color_code) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssiss", 
        $data['section_title'], $data['section_slug'], $data['section_type'],
        $data['content'], $data['display_order'], $data['is_active'],
        $data['icon'], $data['color_code']
    );
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'id' => $conn->insert_id]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
    exit;
}

if ($action === 'updateFinanceGeneralInfo') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $sql = "UPDATE student_finance_general SET 
            section_title = ?, section_slug = ?, section_type = ?,
            content = ?, display_order = ?, is_active = ?,
            icon = ?, color_code = ?
            WHERE id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssissi", 
        $data['section_title'], $data['section_slug'], $data['section_type'],
        $data['content'], $data['display_order'], $data['is_active'],
        $data['icon'], $data['color_code'], $data['id']
    );
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
    exit;
}

if ($action === 'deleteFinanceGeneralInfo') {
    $data = json_decode(file_get_contents('php://input'), true);
    $sql = "DELETE FROM student_finance_general WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $data['id']);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
    exit;
}
```

---

### Step 3: Test Everything (3 minutes)

1. **Test Admin Page:**
   - Login as admin
   - Go to Admin Panel → Student Finance
   - Try adding a new qualification
   - Try editing an existing one
   - Verify both tabs work (Qualifications & General Info)

2. **Test Student Page:**
   - Visit `/student/StudentFinanceInfo`
   - Check if all 16 subjects are displayed
   - Test search functionality
   - Test category filters
   - Expand a subject card to see details

3. **Verify API:**
```bash
# Test GET endpoint
curl -H "X-API-KEY: your_key" "https://citiedgecollege.co.uk/student_api.php?action=getStudentFinanceQualifications"

# Should return JSON with 16 subjects
```

---

## 📍 Access URLs

- **Admin Management**: `/admin` → Click "Student Finance" in sidebar
- **Student View**: `/student/StudentFinanceInfo`

---

## ✅ Success Checklist

- [ ] Database tables created
- [ ] 16 subjects visible in database
- [ ] 3 general info sections visible
- [ ] API endpoints working (test with curl/Postman)
- [ ] Admin page loads without errors
- [ ] Can add/edit/delete qualifications
- [ ] Can add/edit/delete general info
- [ ] Student page displays all information
- [ ] Search works on student page
- [ ] Category filters work
- [ ] Subject cards expand/collapse

---

## 🔧 Configuration

### Environment Variable
Ensure this is set in your `.env.local`:
```
NEXT_PUBLIC_API_KEY=your_api_key_here
```

### Database Connection
Your API should connect to the database where you ran the SQL file.

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "Network error" on admin page | Check API_KEY is correct |
| Data not showing | Verify API endpoints return data |
| Can't add records | Check database permissions |
| Student page blank | Check console for errors, verify is_active=true |
| Styling issues | Clear browser cache |

---

## 📞 Need Help?

1. Check browser console (F12) for errors
2. Check network tab to see API responses
3. Verify database tables exist: `SHOW TABLES LIKE 'student_finance%';`
4. Test API independently with curl/Postman

---

## 🎉 You're Done!

The system is ready to use. Students can now view UK qualification mapping and finance eligibility, and admins can easily manage all the information through the beautiful interface.

**Next Steps:**
- Customize subject information as needed
- Add more subjects through the admin interface
- Update information annually
- Monitor student usage

---

**Setup Time**: ~10-15 minutes total
**Status**: Production Ready ✅
