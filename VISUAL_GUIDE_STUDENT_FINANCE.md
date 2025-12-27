# Student Finance System - Visual Guide & Screenshots

## 📸 Page Layout Overview

This document describes the visual appearance and layout of the Student Finance system pages.

---

## 🎨 Admin Management Page

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Student Finance Management                                 │
│  Manage UK qualification mapping and student finance...     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Subject Qualifications]  [General Information]  ← Tabs   │
│                                                             │
│  [+ Add Qualification] ← Action Button                     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Law                    [Legal Studies] [⚠️ Regulated] │  │
│  │  Regulatory Body: Solicitors Regulation Authority     │  │
│  │                                         [Edit][Delete] │  │
│  │  ┌──────────────┬──────────────┬──────────────┐      │  │
│  │  │ Level 6      │ Level 7      │ Level 8      │      │  │
│  │  │ ✅ Funded    │ ✅ Funded    │ ✅ Funded    │      │  │
│  │  │ LLB          │ LLM          │ PhD in Law   │      │  │
│  │  └──────────────┴──────────────┴──────────────┘      │  │
│  │  Professional Route: LLB → SQE → Solicitor           │  │
│  │  Important Notes: All levels eligible for SFE         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Accounting & Financial Auditing Management           │  │
│  │  [Business & Finance]                 [Edit][Delete]  │  │
│  │  ... (similar layout)                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Color Scheme

**Qualification Cards:**
- Border: Gray (#E5E7EB)
- Background: White
- Hover: Shadow effect

**Level Indicators:**
- Level 6: Green border-left (#10B981)
- Level 7: Blue border-left (#3B82F6)
- Level 8: Purple border-left (#8B5CF6)

**Badges:**
- Category: Blue background (#DBEAFE), Blue text (#1E40AF)
- Regulated: Red background (#FEE2E2), Red text (#991B1B)
- Inactive: Gray background (#F3F4F6), Gray text (#374151)

**Buttons:**
- Edit: Blue background (#EFF6FF), Blue text (#2563EB)
- Delete: Red background (#FEE2E2), Red text (#DC2626)
- Add: Blue gradient (#2563EB to #4F46E5), White text

---

## 📱 Add/Edit Modal

### Modal Layout

```
┌───────────────────────────────────────────────────────────┐
│  Add Qualification                               [X]      │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  Subject Name *          Subject Slug *                   │
│  [_______________]       [_______________]                │
│                                                           │
│  Category                Display Order                    │
│  [_______________]       [_______________]                │
│                                                           │
│  ═══════════════════════════════════════════════════      │
│  Level 6 (Bachelor's)                                     │
│  Level 6 Title                                            │
│  [_________________________________]                      │
│  Level 6 Qualification Details                            │
│  [_________________________________]                      │
│  [_________________________________]                      │
│  ☑ Student Finance Eligible                              │
│                                                           │
│  ═══════════════════════════════════════════════════      │
│  Level 7 (Master's)                                       │
│  ... (similar to Level 6)                                 │
│                                                           │
│  ═══════════════════════════════════════════════════      │
│  Level 8 (Doctorate)                                      │
│  ... (similar to Level 6)                                 │
│                                                           │
│  Professional Route                                        │
│  [_________________________________]                      │
│                                                           │
│  ☑ Is Regulated Field                                    │
│  Regulatory Body                                          │
│  [_________________________________]                      │
│                                                           │
│  Special Notes                                            │
│  [_________________________________]                      │
│  [_________________________________]                      │
│                                                           │
│  ☑ Active (Display on student page)                      │
│                                                           │
│                    [Cancel] [Add Qualification]           │
└───────────────────────────────────────────────────────────┘
```

---

## 🎓 Student Information Page

### Header Section

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  UK Student Finance & Qualification Guide                  │
│  Comprehensive guide to UK qualification levels and         │
│  Student Finance England eligibility                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### General Information Cards

```
┌─────────────────────────────────────────────────────────────┐
│  ℹ️  Student Finance England - Quick Rule                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Level 1-3:  ❌ Not funded by SFE                          │
│  Level 4-6:  ✅ Undergraduate Loan                         │
│  Level 7:    ✅ Postgraduate Master's Loan                 │
│  Level 8:    ✅ Doctoral Loan (exceptions apply)           │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  📊  Standard Progression Chart (Level 1 → PhD)             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Level 1–2  →  Level 3 (Access to HE)                      │
│                   ↓                                          │
│  Level 4 (CertHE / HNC)                                     │
│                   ↓                                          │
│  Level 5 (DipHE / HND / Foundation Degree)                 │
│                   ↓                                          │
│  Level 6 (Bachelor's Degree – BA / BSc / LLB)              │
│                   ↓                                          │
│  Level 7 (Master's Degree – MA / MSc / MBA / LLM)          │
│                   ↓                                          │
│  Level 8 (PhD / Professional Doctorate)                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Subject Qualifications Section

```
┌─────────────────────────────────────────────────────────────┐
│  Subject-by-Subject Qualification Mapping                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔍 [Search subjects...              ]                     │
│                                                             │
│  [All] [Legal Studies] [Business & Finance] [Healthcare]   │
│  [Technology] [Humanities] [Arts & Media] [Education]       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Law  [Legal Studies] [⚠️ Regulated]            [▼]   │  │
│  │  Regulated by: Solicitors Regulation Authority       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Accounting & Financial Auditing Management           │  │
│  │  [Business & Finance]                           [▼]   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Expanded Subject Card

```
┌─────────────────────────────────────────────────────────────┐
│  Law  [Legal Studies] [⚠️ Regulated]                  [▲]   │
│  Regulated by: Solicitors Regulation Authority (SRA)       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┬─────────────────┬──────────────────┐ │
│  │ Level 6          │ Level 7         │ Level 8          │ │
│  │ ✅ Funded        │ ✅ Funded       │ ✅ Funded        │ │
│  │                  │                 │                  │ │
│  │ LLB (Bachelor    │ LLM (Master of  │ PhD in Law       │ │
│  │ of Laws)         │ Laws)           │                  │ │
│  │                  │                 │                  │ │
│  │ Level 6: LLB     │ Level 7: LLM    │ Level 8: PhD     │ │
│  │ (Bachelor of     │ (Master of      │ in Law           │ │
│  │ Laws)            │ Laws)           │                  │ │
│  └──────────────────┴─────────────────┴──────────────────┘ │
│                                                             │
│  🎓 Professional Route                                      │
│  LLB → SQE → Solicitor / Barrister                         │
│                                                             │
│  ⚠️  Important Information                                  │
│  All levels eligible for Student Finance England           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Footer Section

```
┌─────────────────────────────────────────────────────────────┐
│  Need More Information?                                     │
│                                                             │
│  For the most up-to-date information on Student Finance    │
│  eligibility and application procedures, please visit the   │
│  official Student Finance England website or contact...    │
│                                                             │
│  [Visit Student Finance England]  [Visit UCAS]             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Color Palette

### Primary Colors
```
Blue:    #3B82F6  ██████  Primary actions, Level 7
Indigo:  #4F46E5  ██████  Gradients, accents
Green:   #10B981  ██████  Success, Level 6, funded
Purple:  #8B5CF6  ██████  Level 8
Yellow:  #F59E0B  ██████  Warnings, important notes
Red:     #EF4444  ██████  Danger, delete, not funded
```

### Neutral Colors
```
Gray-50:  #F9FAFB  ██████  Light backgrounds
Gray-100: #F3F4F6  ██████  Hover states
Gray-200: #E5E7EB  ██████  Borders
Gray-500: #6B7280  ██████  Secondary text
Gray-700: #374151  ██████  Body text
Gray-800: #1F2937  ██████  Headings
Gray-900: #111827  ██████  Primary text
```

### Gradient Backgrounds
```
Blue Gradient:   from-blue-50 via-white to-indigo-50
Header Gradient: from-blue-600 to-indigo-600
Button Gradient: from-blue-600 to-indigo-600
```

---

## 📐 Spacing & Typography

### Typography Scale
```
Heading 1:  text-4xl (36px)  font-bold
Heading 2:  text-3xl (30px)  font-bold
Heading 3:  text-2xl (24px)  font-bold
Heading 4:  text-xl  (20px)  font-bold
Heading 5:  text-lg  (18px)  font-semibold
Body:       text-base (16px) font-normal
Small:      text-sm   (14px) font-normal
Tiny:       text-xs   (12px) font-normal
```

### Spacing
```
Section padding:    p-6 (24px) or p-8 (32px)
Card padding:       p-4 (16px) or p-6 (24px)
Gap between items:  gap-4 (16px) or gap-6 (24px)
Margin bottom:      mb-4 (16px) or mb-6 (24px)
```

### Border Radius
```
Small:  rounded-lg  (8px)   - Cards, buttons
Medium: rounded-xl  (12px)  - Major sections
Large:  rounded-2xl (16px)  - Modals
Full:   rounded-full        - Badges, pills
```

---

## 🖱️ Interactive States

### Buttons
```
Default:  bg-blue-600 text-white
Hover:    bg-blue-700 shadow-lg
Active:   bg-blue-800
Disabled: bg-gray-300 cursor-not-allowed
```

### Cards
```
Default:  border-gray-200
Hover:    shadow-lg transform
Active:   shadow-xl
```

### Input Fields
```
Default:  border-gray-300
Focus:    ring-2 ring-blue-500 border-transparent
Error:    border-red-500 ring-2 ring-red-200
```

---

## 📱 Responsive Design

### Breakpoints
```
Mobile:   < 640px   - Single column, stacked layout
Tablet:   640-1024  - 2 columns where appropriate
Desktop:  > 1024px  - 3 columns, full features
```

### Mobile Optimizations
- Collapsible sidebar in admin
- Stacked form fields
- Full-width cards
- Touch-friendly buttons (min 44px height)
- Simplified navigation

---

## ✨ Animation & Effects

### Transitions
```
Duration: transition-all duration-300
Hover:    hover:shadow-lg transition-shadow
Focus:    focus:ring-2 focus:ring-blue-500
Loading:  animate-spin (loading spinner)
Expand:   transform rotate-180 (chevrons)
```

### Shadows
```
Small:  shadow-sm   - Subtle depth
Medium: shadow-md   - Card elevation
Large:  shadow-lg   - Hover states
XLarge: shadow-xl   - Modals, popups
```

---

## 🎯 Icons

### Icon System
Using Heroicons (outline style) throughout:

```
Info:        ℹ️  (circle with i)
Warning:     ⚠️  (triangle with !)
Success:     ✅  (checkmark in circle)
Error:       ❌  (X in circle)
Search:      🔍  (magnifying glass)
Chart:       📊  (bar chart)
Calendar:    📅  (calendar)
Money:       💰  (money bag / currency)
Education:   🎓  (graduation cap)
Document:    📄  (document icon)
```

---

## 🎬 User Flows

### Admin: Adding a Qualification
```
1. Login → Admin Panel
2. Click "Student Finance" in sidebar
3. Click "Add Qualification" button
4. Fill in form fields
5. Click "Add Qualification"
6. See success message
7. New qualification appears in list
```

### Student: Finding Information
```
1. Navigate to /student/StudentFinanceInfo
2. See general information cards at top
3. Scroll to Subject Qualifications
4. Use search or category filters
5. Click on subject card to expand
6. View Level 6, 7, 8 details
7. Check funding eligibility
8. Review professional routes
9. Click external links if needed
```

---

## 📊 Data Display Conventions

### Boolean Values
```
True:  ✅ Green checkmark
False: ❌ Red X
```

### Finance Eligibility
```
Funded:     ✅ Funded (green)
Not Funded: ❌ Not Funded (red)
```

### Status Indicators
```
Active:    Blue/Green badge
Inactive:  Gray badge
Regulated: Red badge with ⚠️
```

### Levels
```
Level 6: Green accent
Level 7: Blue accent
Level 8: Purple accent
```

---

## 🎨 Design Philosophy

### Principles
1. **Clarity First**: Information is easy to find and understand
2. **Visual Hierarchy**: Important info stands out
3. **Consistency**: Same patterns throughout
4. **Responsiveness**: Works on all devices
5. **Accessibility**: High contrast, readable fonts
6. **Modern**: Clean, professional appearance
7. **Interactive**: Smooth transitions and feedback

### Best Practices Applied
- ✅ Clear visual grouping
- ✅ Consistent spacing
- ✅ Readable typography
- ✅ Meaningful colors
- ✅ Obvious interactive elements
- ✅ Loading states
- ✅ Error handling
- ✅ Mobile-first approach

---

**Version**: 1.0
**Last Updated**: December 27, 2025
**Status**: Complete visual specification ✅
