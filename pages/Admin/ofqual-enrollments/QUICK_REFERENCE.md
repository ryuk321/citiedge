# 🚀 Ofqual Admin - Quick Reference Card

## 📍 Location
**Menu Path**: Admin Portal → Ofqual Enrollments → All Enrollments

## 🎯 Common Tasks (30 seconds or less)

### Find a Student
```
Type name/email in search bar → Instant results
```

### Check Pending Applications
```
Status dropdown → "Pending" → See all pending
```

### Update Status (Fast)
```
Find student → Click status dropdown in Actions → Select new status
```

### View Full Details
```
Click anywhere on student row → Modal opens
```

### Delete Application
```
Click trash icon → Confirm → Done
```

### Clear Filters
```
Click "Clear Filters" button → Back to all records
```

---

## 🎨 Color Legend

| Color | Status | Meaning |
|-------|--------|---------|
| 🟡 Yellow | Pending | Needs review |
| 🔵 Blue | Under Review | Being reviewed |
| 🟢 Green | Approved | Ready to enroll |
| 🟣 Purple | Enrolled | Active student |
| 🔴 Red | Rejected | Not accepted |
| ⚫ Gray | Withdrawn | Student withdrew |

---

## 🔢 Statistics Cards

| Card | Shows |
|------|-------|
| Total Enrollments (Blue) | All applications ever |
| Pending Review (Yellow) | Needs your attention |
| Approved (Green) | Ready for enrollment |
| Enrolled (Purple) | Successfully enrolled |

---

## 🔍 Filter Combinations

### "Show me all pending Level 7 applications"
- Status: Pending
- Level: Level 7
- Organisation: All

### "Find approved OTHM business courses"
- Status: Approved
- Organisation: OTHM
- Search: "business"

### "See enrolled Level 6 students"
- Status: Enrolled
- Level: Level 6

---

## ⚡ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Close Modal | `Esc` or Click outside |
| Search Box | Click in search field and type |
| Tab Through | `Tab` key between filters |

---

## 📊 Data Fields in Table

1. **Application Ref** - Unique ID (e.g., OFQ2026-0001)
2. **Student Name** - Full name
3. **Contact** - Email + phone
4. **Course** - Category name
5. **Level** - 3, 4, 5, 6, 7, or 8
6. **Organisation** - OTHM or QUALIFI
7. **Status** - Colored badge
8. **Applied Date** - Submission date
9. **Actions** - Status dropdown, view, delete

---

## 🔄 Status Workflow (Recommended)

```
pending
   ↓ (Start review)
under_review
   ↓ (Decision made)
approved
   ↓ (Student enrolled)
enrolled

Alternative:
rejected (if not accepted)
withdrawn (if student cancels)
```

---

## ⚠️ Important Notes

- **Delete is permanent** - Confirm before clicking trash icon
- **Filters are real-time** - No "Apply" button needed
- **Click row to view details** - Don't need to find "view" button
- **Status updates immediately** - No save button required
- **Search searches everything** - Name, email, and ref number

---

## 🆘 Quick Troubleshooting

### "No enrollments found"
→ Check filters, click "Clear Filters"

### Can't find specific student
→ Use search bar with email or name

### Status won't update
→ Refresh page, check internet connection

### Modal won't close
→ Click X button or press Esc

### Table looks empty
→ Clear all filters to see all records

---

## 📞 Help Resources

| Resource | Location |
|----------|----------|
| Full Documentation | `pages/Admin/ofqual-enrollments/README.md` |
| User Guide | `pages/Admin/ofqual-enrollments/INTEGRATION_GUIDE.md` |
| System Summary | `Project Instructions Readme/ADMIN_PANEL_SUMMARY.md` |

---

## ✅ Daily Workflow Suggestion

**Morning** (5 minutes):
1. Click "Pending" filter
2. Review new applications
3. Change status to "Under Review" for ones you'll process today

**Throughout Day**:
4. Open detail modal for each application
5. Review all information thoroughly
6. Update status to "Approved" or "Rejected"
7. Add notes (future feature) about decision

**End of Day**:
8. Check "Pending" count in stats card
9. Ensure no urgent applications left

---

## 🎯 Pro Tips

💡 **Use search for speed** - Faster than scrolling
💡 **Combine filters** - Be specific to narrow results
💡 **Update from table** - Quicker than opening modal
💡 **Open modal for full info** - When making important decisions
💡 **Check stats daily** - Monitor your pipeline
💡 **Clear filters often** - Don't forget to reset after specific searches

---

## 🔐 Access Requirements

- **Role**: Admin or Super Admin
- **Login**: Via admin portal
- **Permissions**: Automatic for admin users

---

**Print this card and keep at your desk for quick reference!**

---

*Version 1.0 | January 2025 | CITIEDGE Admin Portal*
