# College Timetable Management System

## Changes in this version

1. **Semesters are now first-class configuration**
   - Added a dedicated **Semesters** section under Academic Configuration.
   - Semesters belong to a department.
   - Subjects use the configured semesters.
   - Existing localStorage data is migrated automatically.

2. **Special timetable activities**
   - Added **Library, Sports, Unit Test, Seminar**, plus an optional Other activity.
   - Special activities do **not** require a subject or subject code.
   - They can occupy either **1 hour** or the **entire 2-period slot**.
   - Special activities participate in timetable conflict validation.

3. **Division removed**
   - Removed division configuration and selection from the timetable UI.
   - Removed division-based filtering, validation, rendering and PDF output.
   - Timetable scope is now **Department + Semester**.
   - Legacy saved timetable records are migrated to the new model.

4. Existing features retained:
   - Faculty/room conflict checking
   - Lab batch scheduling
   - Full-slot labs
   - Editable breaks
   - Drag-and-drop scheduling
   - LocalStorage persistence
   - PDF export
