const { useState, useEffect, useMemo } = React;
const STORAGE_KEY = 'college-timetable-v6';
const SESSION_KEY = 'college-timetable-session-v1';
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const BATCHES = ['A', 'B', 'C'];
const ROLES = ['Admin', 'Timetable Coordinator', 'HOD', 'Faculty'];
const DEMO_USERS = [
    { id: 'u1', username: 'admin', password: 'admin123', name: 'Aarav Admin', role: 'Admin' },
    { id: 'u2', username: 'coordinator', password: 'coord123', name: 'Riya Coordinator', role: 'Timetable Coordinator' },
    { id: 'u3', username: 'hod-cse', password: 'hod123', name: 'Dr. Mehta', role: 'HOD', departmentId: 'd1' },
    { id: 'u4', username: 'faculty-it', password: 'faculty123', name: 'Mr. Tirth Patel (TCP)', role: 'Faculty', facultyId: 'f-aad', departmentId: 'd1' }
];
const initialData = {
    collegeName: 'Sardar Patel College of Engineering and Technology',
    departments: [{ id: 'd1', name: 'Information Technology', code: 'IT', branchCode: '16' }],
    semesters: [{ id: 'sem-it-5', name: '5', departmentId: 'd1' }],
    faculty: [
        { id: 'f-wad', name: 'Ms. Vaishali Parmar (VMP)', email: '' },
        { id: 'f-aad', name: 'Mr. Tirth Patel (TCP)', email: '' },
        { id: 'f-ds', name: 'Ms. Mehjabin Saiyad (MS)', email: '' },
        { id: 'f-adbms', name: 'Ms. Toral Patel (TSP)', email: '' },
        { id: 'f-cs', name: 'Mr. Preet Patel (PP)', email: '' },
        { id: 'f-pm', name: 'Ms. Vishva U. Solanki (VUS)', email: '' }
    ],
    subjects: [
        { id: 's-WAD-th', name: 'Web Application Development', code: 'WAD', subCode: 'BE05000281', departmentId: 'd1', semester: '5', type: 'Theory' },
        { id: 's-WAD-lab', name: 'Web Application Development Lab', code: 'WAD', subCode: 'BE05000281', departmentId: 'd1', semester: '5', type: 'Lab' },
        { id: 's-AAD-th', name: 'Algorithm Analysis and Design', code: 'AAD', subCode: 'BE05016011', departmentId: 'd1', semester: '5', type: 'Theory' },
        { id: 's-AAD-lab', name: 'Algorithm Analysis and Design Lab', code: 'AAD', subCode: 'BE05016011', departmentId: 'd1', semester: '5', type: 'Lab' },
        { id: 's-DS-th', name: 'Data Science', code: 'DS', subCode: 'BE05016021', departmentId: 'd1', semester: '5', type: 'Theory' },
        { id: 's-DS-lab', name: 'Data Science Lab', code: 'DS', subCode: 'BE05016021', departmentId: 'd1', semester: '5', type: 'Lab' },
        { id: 's-ADBMS-th', name: 'Advanced Database Management System', code: 'ADBMS', subCode: 'BE05016031', departmentId: 'd1', semester: '5', type: 'Theory' },
        { id: 's-ADBMS-lab', name: 'Advanced Database Management System Lab', code: 'ADBMS', subCode: 'BE05016031', departmentId: 'd1', semester: '5', type: 'Lab' },
        { id: 's-CS-th', name: 'Cyber Security', code: 'CS', subCode: 'BE05016041', departmentId: 'd1', semester: '5', type: 'Theory' },
        { id: 's-CS-lab', name: 'Cyber Security Lab', code: 'CS', subCode: 'BE05016041', departmentId: 'd1', semester: '5', type: 'Lab' },
        { id: 's-PM-th', name: 'Project Management', code: 'PM', subCode: 'BE05000481', departmentId: 'd1', semester: '5', type: 'Theory' },
    ],
    rooms: [
        { id: 'r-233', name: '233', type: 'Classroom' },
        { id: 'r-206', name: '206', type: 'Lab' },
        { id: 'r-208', name: '208', type: 'Lab' },
        { id: 'r-226', name: '226', type: 'Lab' },
        { id: 'r-231', name: '231', type: 'Classroom' },
        { id: 'r-214', name: '214', type: 'Classroom' },
        { id: 'r-207', name: '207', type: 'Lab' },
        { id: 'r-201', name: '201', type: 'Lab' },
        { id: 'r-332', name: '332', type: 'Lab' },
        { id: 'r-143', name: '143', type: 'Classroom' },
        { id: 'r-142', name: '142', type: 'Classroom' },
        { id: 'r-325', name: '325', type: 'Lab' },
        { id: 'r-225', name: '225', type: 'Lab' }
    ],
    timeSlots: [
        { id: 't-1-1', day: 'Monday', start: '09:15', end: '10:10' },
        { id: 't-1-2', day: 'Monday', start: '10:10', end: '11:05' },
        { id: 't-1-3', day: 'Monday', start: '11:15', end: '12:10' },
        { id: 't-1-4', day: 'Monday', start: '12:10', end: '13:05' },
        { id: 't-1-5', day: 'Monday', start: '13:40', end: '14:35' },
        { id: 't-1-6', day: 'Monday', start: '14:35', end: '15:30' },
        { id: 't-2-1', day: 'Tuesday', start: '09:15', end: '10:10' },
        { id: 't-2-2', day: 'Tuesday', start: '10:10', end: '11:05' },
        { id: 't-2-3', day: 'Tuesday', start: '11:15', end: '12:10' },
        { id: 't-2-4', day: 'Tuesday', start: '12:10', end: '13:05' },
        { id: 't-2-5', day: 'Tuesday', start: '13:40', end: '14:35' },
        { id: 't-2-6', day: 'Tuesday', start: '14:35', end: '15:30' },
        { id: 't-3-1', day: 'Wednesday', start: '09:15', end: '10:10' },
        { id: 't-3-2', day: 'Wednesday', start: '10:10', end: '11:05' },
        { id: 't-3-3', day: 'Wednesday', start: '11:15', end: '12:10' },
        { id: 't-3-4', day: 'Wednesday', start: '12:10', end: '13:05' },
        { id: 't-3-5', day: 'Wednesday', start: '13:40', end: '14:35' },
        { id: 't-3-6', day: 'Wednesday', start: '14:35', end: '15:30' },
        { id: 't-4-1', day: 'Thursday', start: '09:15', end: '10:10' },
        { id: 't-4-2', day: 'Thursday', start: '10:10', end: '11:05' },
        { id: 't-4-3', day: 'Thursday', start: '11:15', end: '12:10' },
        { id: 't-4-4', day: 'Thursday', start: '12:10', end: '13:05' },
        { id: 't-4-5', day: 'Thursday', start: '13:40', end: '14:35' },
        { id: 't-4-6', day: 'Thursday', start: '14:35', end: '15:30' },
        { id: 't-5-1', day: 'Friday', start: '09:15', end: '10:10' },
        { id: 't-5-2', day: 'Friday', start: '10:10', end: '11:05' },
        { id: 't-5-3', day: 'Friday', start: '11:15', end: '12:10' },
        { id: 't-5-4', day: 'Friday', start: '12:10', end: '13:05' },
        { id: 't-5-5', day: 'Friday', start: '13:40', end: '14:35' },
        { id: 't-5-6', day: 'Friday', start: '14:35', end: '15:30' },
        { id: 't-6-1', day: 'Saturday', start: '09:15', end: '10:10' },
        { id: 't-6-2', day: 'Saturday', start: '10:10', end: '11:05' },
        { id: 't-6-3', day: 'Saturday', start: '11:15', end: '12:10' },
        { id: 't-6-4', day: 'Saturday', start: '12:10', end: '13:05' },
        { id: 't-6-5', day: 'Saturday', start: '13:40', end: '14:35' },
        { id: 't-6-6', day: 'Saturday', start: '14:35', end: '15:30' }
    ],
    breaks: [{ id: 'br-1', afterSlot: 2, start: '11:05', end: '11:15' }, { id: 'br-2', afterSlot: 4, start: '13:05', end: '13:40' }],
    timetable: [
        { id: 'e-1', subjectId: 's-WAD-lab', facultyId: 'f-wad', roomId: 'r-206', departmentId: 'd1', semester: '5', timeSlotId: 't-1-1', batch: 'A' },
        { id: 'e-2', subjectId: 's-CS-lab', facultyId: 'f-cs', roomId: 'r-208', departmentId: 'd1', semester: '5', timeSlotId: 't-1-1', batch: 'B' },
        { id: 'e-3', subjectId: 's-DS-lab', facultyId: 'f-ds', roomId: 'r-226', departmentId: 'd1', semester: '5', timeSlotId: 't-1-1', batch: 'C' },
        { id: 'e-4', subjectId: 's-AAD-th', facultyId: 'f-aad', roomId: 'r-231', departmentId: 'd1', semester: '5', timeSlotId: 't-1-3' },
        { id: 'e-5', subjectId: 's-ADBMS-th', facultyId: 'f-adbms', roomId: 'r-231', departmentId: 'd1', semester: '5', timeSlotId: 't-1-4' },
        { id: 'e-6', subjectId: 's-PM-th', facultyId: 'f-pm', roomId: 'r-231', departmentId: 'd1', semester: '5', timeSlotId: 't-1-5' },
        { id: 'e-7', subjectId: 's-CS-th', facultyId: 'f-cs', roomId: 'r-231', departmentId: 'd1', semester: '5', timeSlotId: 't-1-6' },
        { id: 'e-8', subjectId: 's-DS-th', facultyId: 'f-ds', roomId: 'r-214', departmentId: 'd1', semester: '5', timeSlotId: 't-2-1' },
        { id: 'e-9', subjectId: 's-AAD-th', facultyId: 'f-aad', roomId: 'r-214', departmentId: 'd1', semester: '5', timeSlotId: 't-2-2' },
        { id: 'e-10', subjectId: 's-AAD-lab', facultyId: 'f-aad', roomId: 'r-207', departmentId: 'd1', semester: '5', timeSlotId: 't-2-3', batch: 'A' },
        { id: 'e-11', subjectId: 's-ADBMS-lab', facultyId: 'f-adbms', roomId: 'r-201', departmentId: 'd1', semester: '5', timeSlotId: 't-2-3', batch: 'B' },
        { id: 'e-12', subjectId: 's-CS-lab', facultyId: 'f-cs', roomId: 'r-208', departmentId: 'd1', semester: '5', timeSlotId: 't-2-3', batch: 'C' },
        { id: 'e-13', subjectId: 's-CS-th', facultyId: 'f-cs', roomId: 'r-142', departmentId: 'd1', semester: '5', timeSlotId: 't-2-5' },
        { id: 'e-14', subjectId: 's-WAD-th', facultyId: 'f-wad', roomId: 'r-142', departmentId: 'd1', semester: '5', timeSlotId: 't-2-6' },
        { id: 'e-15', subjectId: 's-WAD-th', facultyId: 'f-wad', roomId: 'r-143', departmentId: 'd1', semester: '5', timeSlotId: 't-3-1' },
        { id: 'e-16', subjectId: 's-ADBMS-th', facultyId: 'f-adbms', roomId: 'r-143', departmentId: 'd1', semester: '5', timeSlotId: 't-3-2' },
        { id: 'e-17', subjectId: 's-ADBMS-lab', facultyId: 'f-adbms', roomId: 'r-201', departmentId: 'd1', semester: '5', timeSlotId: 't-3-3', batch: 'A' },
        { id: 'e-18', subjectId: 's-AAD-lab', facultyId: 'f-aad', roomId: 'r-332', departmentId: 'd1', semester: '5', timeSlotId: 't-3-3', batch: 'B' },
        { id: 'e-19', subjectId: 's-WAD-lab', facultyId: 'f-wad', roomId: 'r-206', departmentId: 'd1', semester: '5', timeSlotId: 't-3-3', batch: 'C' },
        { id: 'e-20', subjectId: 's-DS-th', facultyId: 'f-ds', roomId: 'r-143', departmentId: 'd1', semester: '5', timeSlotId: 't-3-5' },
        { id: 'e-21', subjectId: 's-PM-th', facultyId: 'f-pm', roomId: 'r-143', departmentId: 'd1', semester: '5', timeSlotId: 't-3-6' },
        { id: 'e-22', subjectId: 's-ADBMS-th', facultyId: 'f-adbms', roomId: 'r-142', departmentId: 'd1', semester: '5', timeSlotId: 't-4-1' },
        { id: 'e-23', subjectId: 's-AAD-th', facultyId: 'f-aad', roomId: 'r-142', departmentId: 'd1', semester: '5', timeSlotId: 't-4-2' },
        { id: 'e-24', subjectId: 's-CS-lab', facultyId: 'f-cs', roomId: 'r-332', departmentId: 'd1', semester: '5', timeSlotId: 't-4-3', batch: 'A' },
        { id: 'e-25', subjectId: 's-DS-lab', facultyId: 'f-ds', roomId: 'r-207', departmentId: 'd1', semester: '5', timeSlotId: 't-4-3', batch: 'B' },
        { id: 'e-26', subjectId: 's-AAD-lab', facultyId: 'f-aad', roomId: 'r-201', departmentId: 'd1', semester: '5', timeSlotId: 't-4-3', batch: 'C' },
        { id: 'e-27', subjectId: 's-DS-lab', facultyId: 'f-ds', roomId: 'r-325', departmentId: 'd1', semester: '5', timeSlotId: 't-4-5', batch: 'A' },
        { id: 'e-28', subjectId: 's-WAD-lab', facultyId: 'f-wad', roomId: 'r-225', departmentId: 'd1', semester: '5', timeSlotId: 't-4-5', batch: 'B' },
        { id: 'e-29', subjectId: 's-ADBMS-lab', facultyId: 'f-adbms', roomId: 'r-201', departmentId: 'd1', semester: '5', timeSlotId: 't-4-5', batch: 'C' },
        { id: 'e-30', subjectId: 's-CS-th', facultyId: 'f-cs', roomId: 'r-231', departmentId: 'd1', semester: '5', timeSlotId: 't-5-1' },
        { id: 'e-31', subjectId: 's-WAD-th', facultyId: 'f-wad', roomId: 'r-231', departmentId: 'd1', semester: '5', timeSlotId: 't-5-2' },
        { id: 'e-32', subjectId: 's-DS-th', facultyId: 'f-ds', roomId: 'r-231', departmentId: 'd1', semester: '5', timeSlotId: 't-5-4' },
        { id: 'e-33', subjectId: 's-AAD-th', facultyId: 'f-aad', roomId: 'r-231', departmentId: 'd1', semester: '5', timeSlotId: 't-5-5' },
        { id: 'e-34', subjectId: 's-PM-th', facultyId: 'f-pm', roomId: 'r-231', departmentId: 'd1', semester: '5', timeSlotId: 't-5-6' },
        { id: 'e-act-library', activityType: 'Library', activityName: 'Library', duration: 'period', departmentId: 'd1', semester: '5', timeSlotId: 't-5-3' },
        { id: 'e-act-unittest', activityType: 'Unit Test', activityName: 'Unit Test', duration: 'slot', departmentId: 'd1', semester: '5', timeSlotId: 't-6-1' },
        { id: 'e-act-sdp', activityType: 'Other', activityName: 'SDP', duration: 'slot', departmentId: 'd1', semester: '5', timeSlotId: 't-6-3' },
        { id: 'e-act-sports', activityType: 'Sports', activityName: 'Sports', duration: 'slot', departmentId: 'd1', semester: '5', timeSlotId: 't-6-5' }
    ]
};
// Subjects are academic subjects only. Theory/Lab is chosen on the timetable entry,
// not stored on the subject itself. Convert the demo's legacy duplicate lab records
// into one subject per code and mark the corresponding timetable entries as labs.
(function normalizeDemoSubjects() {
    const subjects = initialData.subjects || [];
    const labMap = {};
    subjects.filter(s => String(s.id).endsWith('-lab')).forEach(lab => {
        const baseId = String(lab.id).replace(/-lab$/, '-th');
        labMap[lab.id] = baseId;
    });
    initialData.timetable = (initialData.timetable || []).map(e => {
        if (labMap[e.subjectId]) return { ...e, subjectId: labMap[e.subjectId], entryType: 'lab' };
        return { ...e, entryType: e.entryType || 'lecture' };
    });
    initialData.subjects = subjects.filter(s => !String(s.id).endsWith('-lab')).map(s => {
        const { type, ...subject } = s;
        return subject;
    });
})();
function uid(prefix = 'id') { return prefix + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4); }
function isLabEntry(entry) { return String(entry?.entryType || '').trim().toLowerCase() === 'lab'; }
// ---- IT Semester 5 seed data ----
const IT5_SEED_ID = 'it5-v2';
const IT5_SUBJECTS = [
    { code: 'WAD', subCode: 'BE05000281', name: 'Web Application Development', faculty: 'Ms. Vaishali Parmar (VMP)', lab: true },
    { code: 'AAD', subCode: 'BE05016011', name: 'Algorithm Analysis and Design', faculty: 'Mr. Tirth Patel (TCP)', lab: true },
    { code: 'DS', subCode: 'BE05016021', name: 'Data Science', faculty: 'Ms. Mehjabin Saiyad (MS)', lab: true },
    { code: 'ADBMS', subCode: 'BE05016031', name: 'Advanced Database Management System', faculty: 'Ms. Toral Patel (TSP)', lab: true },
    { code: 'CS', subCode: 'BE05016041', name: 'Cyber Security', faculty: 'Mr. Preet Patel (PP)', lab: true },
    { code: 'PM', subCode: 'BE05000481', name: 'Project Management', faculty: 'Ms. Vishva U. Solanki (VUS)', lab: false }
];
const IT5_LAB_ROOMS = ['206', '208', '226', '207', '201', '332', '325', '225'];
const IT5_CLASSROOMS = ['231', '214', '143', '142'];
// [day, period number (1-6), subject, lab batch or null, room]
const IT5_ENTRIES = [
    ['Monday', 1, 'WAD', 'A', '206'], ['Monday', 1, 'CS', 'B', '208'], ['Monday', 1, 'DS', 'C', '226'],
    ['Monday', 3, 'AAD', null, '231'], ['Monday', 4, 'ADBMS', null, '231'], ['Monday', 5, 'PM', null, '231'], ['Monday', 6, 'CS', null, '231'],
    ['Tuesday', 1, 'DS', null, '214'], ['Tuesday', 2, 'AAD', null, '214'],
    ['Tuesday', 3, 'AAD', 'A', '207'], ['Tuesday', 3, 'ADBMS', 'B', '201'], ['Tuesday', 3, 'CS', 'C', '208'],
    ['Tuesday', 5, 'CS', null, '142'], ['Tuesday', 6, 'WAD', null, '142'],
    ['Wednesday', 1, 'WAD', null, '143'], ['Wednesday', 2, 'ADBMS', null, '143'],
    ['Wednesday', 3, 'ADBMS', 'A', '201'], ['Wednesday', 3, 'AAD', 'B', '332'], ['Wednesday', 3, 'WAD', 'C', '206'],
    ['Wednesday', 5, 'DS', null, '143'], ['Wednesday', 6, 'PM', null, '143'],
    ['Thursday', 1, 'ADBMS', null, '142'], ['Thursday', 2, 'AAD', null, '142'],
    ['Thursday', 3, 'CS', 'A', '332'], ['Thursday', 3, 'DS', 'B', '207'], ['Thursday', 3, 'AAD', 'C', '201'],
    ['Thursday', 5, 'DS', 'A', '325'], ['Thursday', 5, 'WAD', 'B', '225'], ['Thursday', 5, 'ADBMS', 'C', '201'],
    ['Friday', 1, 'CS', null, '231'], ['Friday', 2, 'WAD', null, '231'], ['Friday', 4, 'DS', null, '231'],
    ['Friday', 5, 'AAD', null, '231'], ['Friday', 6, 'PM', null, '231']
];
function applyIT5Seed(next) {
    if (!Array.isArray(next.seeds)) next.seeds = [];
    if (next.seeds.includes(IT5_SEED_ID)) return; // already added once: never re-add (deleted entries stay deleted)
    if (next.seeds.includes('it5-v1') && next.timetable?.some(e => e.departmentId === 'd2' && e.semester === '5')) { next.seeds.push(IT5_SEED_ID); return; }
    const dept = (next.departments || []).find(d => d.code === 'IT' || d.id === 'd2');
    if (!dept) return;
    ['faculty', 'subjects', 'rooms', 'timetable'].forEach(k => { if (!Array.isArray(next[k])) next[k] = []; });
    const isSeed = x => String(x.id).startsWith('it5-');
    ['subjects', 'rooms', 'timetable'].forEach(k => { next[k] = next[k].filter(x => !isSeed(x)); });
    const facId = code => 'it5-f-' + code;
    IT5_SUBJECTS.forEach(sub => {
        if (!next.faculty.some(f => f.id === facId(sub.code))) next.faculty.push({ id: facId(sub.code), name: sub.faculty, email: '' });
        next.subjects.push({ id: 'it5-th-' + sub.code, name: sub.name, code: sub.code, subCode: sub.subCode, departmentId: dept.id, semester: '5' });
    });
    IT5_CLASSROOMS.forEach(n => next.rooms.push({ id: 'it5-r-' + n, name: n, type: 'Classroom' }));
    IT5_LAB_ROOMS.forEach(n => next.rooms.push({ id: 'it5-r-' + n, name: n, type: 'Lab' }));
    next.seeds = next.seeds.filter(x => x !== IT5_SEED_ID);
    IT5_ENTRIES.forEach(([day, period, code, batch, room], i) => {
        const daySlots = (next.timeSlots || []).filter(t => t.day === day).sort((a, b) => a.start.localeCompare(b.start));
        const slot = daySlots[period - 1];
        if (!slot) return;
        const entry = { id: 'it5-e' + i, subjectId: 'it5-th-' + code, facultyId: facId(code), roomId: 'it5-r-' + room, departmentId: dept.id, semester: '5', timeSlotId: slot.id };
        if (batch) { entry.batch = batch; entry.entryType = 'lab'; } else entry.entryType = 'lecture';
        next.timetable.push(entry);
    });
    if (next.timetable.some(e => e.departmentId === dept.id && e.semester === '5')) next.seeds.push(IT5_SEED_ID);
}
function migrateData(data) {
    const next = clone(data || initialData);
    if (!Array.isArray(next.breaks)) {
        next.breaks = clone(initialData.breaks);
    }
    // Move saved data that still uses the old default periods to the new college timings.
    const NEW_TIMES = [['09:15', '10:10'], ['10:10', '11:05'], ['11:15', '12:10'], ['12:10', '13:05'], ['13:40', '14:35'], ['14:35', '15:30']];
    if (Array.isArray(next.timeSlots)) DAYS.forEach(day => {
        const ds = next.timeSlots.filter(t => t.day === day).sort((a, b) => a.start.localeCompare(b.start));
        if (ds.length === 4 && ds[0].start === '09:00' && ds[1].start === '10:00' && ds[2].start === '11:15' && ds[3].start === '12:15') {
            ds.forEach((t, i) => { t.start = NEW_TIMES[i][0]; t.end = NEW_TIMES[i][1]; });
            [4, 5].forEach(i => next.timeSlots.push({ id: uid('t'), day, start: NEW_TIMES[i][0], end: NEW_TIMES[i][1] }));
        }
    });
    if (Array.isArray(next.breaks)) next.breaks.forEach(b => {
        if (b.start === '11:00' && b.end === '11:15') b.start = '11:05';
        if (b.start === '13:15' && b.end === '13:30') { b.start = '13:05'; b.end = '13:40'; }
    });
    if (!Array.isArray(next.semesters)) next.semesters = clone(initialData.semesters);
    // Migrate legacy timetable records to the department + semester model.
    if (!Array.isArray(next.departments)) next.departments = clone(initialData.departments);
    if (Array.isArray(next.timetable)) {
        next.timetable = next.timetable.map(entry => {
            const copy = { ...entry };
            const subject = next.subjects?.find(s => s.id === copy.subjectId);
            if (!copy.activityType) {
                copy.departmentId = copy.departmentId || subject?.departmentId || '';
                copy.semester = copy.semester || subject?.semester || '';
            }
            delete copy['divisionId'];
            return copy;
        });
    }
    delete next['divisions'];
    next.semesters = next.semesters.filter((sem, index, arr) =>
        sem?.departmentId && sem?.name && arr.findIndex(x => x.departmentId === sem.departmentId && String(x.name) === String(sem.name)) === index
    );
    (next.departments || []).forEach(dept => {
        const values = new Set((next.subjects || []).filter(s => s.departmentId === dept.id && s.semester).map(s => String(s.semester)));
        (next.timetable || []).filter(e => e.departmentId === dept.id && e.semester).forEach(e => values.add(String(e.semester)));
        values.forEach(name => {
            if (!next.semesters.some(sem => sem.departmentId === dept.id && String(sem.name) === name))
                next.semesters.push({ id: uid('sem'), name, departmentId: dept.id });
        });
    });
    if (!next.collegeName || next.collegeName === 'Riverview College of Technology')
        next.collegeName = 'Sardar Patel College of Engineering and Technology';
    if (Array.isArray(next.faculty)) next.faculty = next.faculty.map(f => { const copy = { ...f }; delete copy.departmentId; delete copy.email; return copy; });
    // Migrate legacy subject-level Theory/Lab data to entry-level scheduling type.
    // A subject is now only a subject; the timetable entry decides lecture vs lab.
    const legacyLabIds = new Set((next.subjects || []).filter(s => String(s.type || '').toLowerCase() === 'lab').map(s => s.id));
    const subjectById = new Map((next.subjects || []).map(s => [s.id, s]));
    const baseForLegacyLab = id => String(id || '').endsWith('-lab') ? String(id).replace(/-lab$/, '-th') : id;
    next.timetable = (next.timetable || []).map(entry => {
        const wasLab = legacyLabIds.has(entry.subjectId);
        const subject = subjectById.get(entry.subjectId);
        const normalizedSubjectId = wasLab ? baseForLegacyLab(entry.subjectId) : entry.subjectId;
        return { ...entry, subjectId: normalizedSubjectId, entryType: entry.entryType || (wasLab ? 'lab' : 'lecture') };
    });
    const uniqueSubjects = new Map();
    (next.subjects || []).forEach(subject => {
        const normalizedId = baseForLegacyLab(subject.id);
        if (String(subject.type || '').toLowerCase() === 'lab') return;
        const { type, ...cleanSubject } = subject;
        cleanSubject.id = normalizedId;
        uniqueSubjects.set(normalizedId, cleanSubject);
    });
    next.subjects = Array.from(uniqueSubjects.values());
    // Labs always occupy the complete two-period slot. Normalize legacy one-hour lab entries
    // to the first period of their slot pair and remove duplicate batch records created by
    // older versions of the UI. This is deliberately data-level, not just visual.
    if (Array.isArray(next.timetable) && Array.isArray(next.timeSlots)) {
        const byIdLocal = id => next.timeSlots.find(t => t.id === id);
        const seenLabBatches = new Set();
        const normalized = [];
        next.timetable.forEach(entry => {
            const subject = next.subjects?.find(s => s.id === entry.subjectId);
            if (!isLabEntry(entry)) { normalized.push(entry); return; }
            const slot = byIdLocal(entry.timeSlotId);
            if (!slot) { normalized.push(entry); return; }
            const daySlots = next.timeSlots.filter(t => t.day === slot.day).sort((a,b) => a.start.localeCompare(b.start));
            const index = daySlots.findIndex(t => t.id === slot.id);
            const first = index >= 0 ? daySlots[Math.floor(index / 2) * 2] : slot;
            const normalizedEntry = first ? { ...entry, timeSlotId: first.id } : entry;
            const batchKey = normalizedEntry.batch ? `${normalizedEntry.departmentId}|${normalizedEntry.semester}|${first?.id || slot.id}|${normalizedEntry.batch}` : null;
            if (batchKey && seenLabBatches.has(batchKey)) return;
            if (batchKey) seenLabBatches.add(batchKey);
            normalized.push(normalizedEntry);
        });
        next.timetable = normalized;
    }
    return next;
}
function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return migrateData(raw ? JSON.parse(raw) : initialData);
    }
    catch {
        return migrateData(initialData);
    }
}
function loadSession() { try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
}
catch {
    return null;
} }
function saveSession(user) { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); }
function clearSession() { localStorage.removeItem(SESSION_KEY); }
function byId(list, id) { return list.find(x => x.id === id); }
function roleCanEdit(role) { return ['Admin', 'Timetable Coordinator', 'HOD'].includes(role); }
function fmtTime(v) { return v ? v.replace(/^0/, '') : ''; }
function clone(x) { return JSON.parse(JSON.stringify(x)); }
function App() {
    const [session, setSession] = useState(loadSession());
    const [data, setData] = useState(loadData);
    const [page, setPage] = useState('dashboard');
    const [toast, setToast] = useState(null);
    const [mobileNav, setMobileNav] = useState(false);
    const [configSection, setConfigSection] = useState('departments');
    const [modal, setModal] = useState(null);
    const [filters, setFilters] = useState({ departmentId: 'd1', semester: '3' });
    const [draggingId, setDraggingId] = useState(null);
    const [draggingMode, setDraggingMode] = useState(null); // entry | lab | batch
    const draggingRef = React.useRef({ id: null, mode: null });
    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }, [data]);
    useEffect(() => { if (!toast)
        return; const t = setTimeout(() => setToast(null), 3400); return () => clearTimeout(t); }, [toast]);
    const user = session;
    const deptForUser = user?.departmentId;
    const canEdit = user && roleCanEdit(user.role);
    const notify = (message, type = 'ok') => setToast({ message, type });
    const login = (u) => { setSession(u); saveSession(u); setPage('dashboard'); notify(`Signed in as ${u.role}.`); };
    const logout = () => { clearSession(); setSession(null); setPage('dashboard'); };
    const resetDemo = () => { if (confirm('Reset all local timetable data to the demo dataset?')) {
        setData(migrateData(clone(initialData)));
        notify('Demo data restored.');
    } };
    const updateCollection = (key, next) => setData(prev => ({ ...prev, [key]: next }));
    const permitted = (item) => {
        if (!user)
            return false;
        if (user.role === 'Admin' || user.role === 'Timetable Coordinator')
            return true;
        if (user.role === 'HOD')
            return item?.departmentId === user.departmentId;
        return false;
    };
    if (!session)
        return React.createElement(Login, { onLogin: login });
    const nav = [
        { id: 'dashboard', label: 'Dashboard', icon: '⌂' },
        { id: 'timetable', label: 'Timetable', icon: '▦' },
        ...((user.role === 'Admin' || user.role === 'Timetable Coordinator' || user.role === 'HOD') ? [{ id: 'configuration', label: 'Academic Configuration', icon: '⚙' }] : []),
    ];
    return React.createElement("div", { className: "app-shell" },
        React.createElement("aside", { className: `sidebar ${mobileNav ? 'open' : ''}` },
            React.createElement("div", { className: "brand" },
                React.createElement("div", { className: "brand-mark" }, "CT"),
                React.createElement("div", null,
                    React.createElement("strong", null, "College Timetable"),
                    React.createElement("span", null, "Academic Management"))),
            React.createElement("div", { className: "nav-label" }, "Workspace"),
            React.createElement("nav", { className: "nav" }, nav.map(n => React.createElement("button", { key: n.id, className: page === n.id ? 'active' : '', onClick: () => { setPage(n.id); setMobileNav(false); } },
                React.createElement("span", null, n.icon),
                n.label))),
            React.createElement("div", { className: "sidebar-footer" },
                React.createElement("div", { className: "user-mini" },
                    React.createElement("div", { className: "avatar" }, initials(user.name)),
                    React.createElement("div", null,
                        React.createElement("strong", null, user.name),
                        React.createElement("span", null,
                            user.role,
                            user.departmentId ? ` · ${byId(data.departments, user.departmentId)?.code || ''}` : ''))))),
        React.createElement("main", { className: "main" },
            React.createElement("header", { className: "topbar" },
                React.createElement("div", null,
                    React.createElement("button", { className: "btn small mobile-only", onClick: () => setMobileNav(v => !v), style: { marginRight: 8 } }, "\u2630"),
                    React.createElement("span", { style: { fontWeight: 700, fontSize: 12 } }, data.collegeName),
                    React.createElement("p", null, "Client-side timetable workspace")),
                React.createElement("div", { className: "actions" },
                    React.createElement("button", { className: "btn small", onClick: resetDemo }, "Reset demo data"),
                    React.createElement("button", { className: "btn small", onClick: logout }, "Sign out"))),
            React.createElement("div", { className: "content" },
                page === 'dashboard' && React.createElement(Dashboard, { data: data, user: user, onGo: setPage }),
                page === 'timetable' && React.createElement(TimetablePage, { data: data, setData: setData, user: user, filters: filters, setFilters: setFilters, canEdit: canEdit, notify: notify, modal: modal, setModal: setModal, draggingId: draggingId, setDraggingId: setDraggingId, draggingMode: draggingMode, setDraggingMode: setDraggingMode, draggingRef: draggingRef }),
                page === 'configuration' && (user.role === 'Admin' || user.role === 'Timetable Coordinator' || user.role === 'HOD') && React.createElement(Configuration, { data: data, user: user, section: configSection, setSection: setConfigSection, updateCollection: updateCollection, notify: notify }))),
        toast && React.createElement("div", { className: "toast-wrap" },
            React.createElement("div", { className: `toast ${toast.type === 'error' ? 'error' : ''}` }, toast.message)));
}
function initials(name = 'User') { return name.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase(); }
function Login({ onLogin }) {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState('');
    const submit = e => { e.preventDefault(); const u = DEMO_USERS.find(x => x.username === username && x.password === password); if (!u)
        return setError('Invalid demo username or password.'); setError(''); onLogin(u); };
    return React.createElement("div", { className: "login-page" },
        React.createElement("div", { className: "login-card" },
            React.createElement("section", { className: "login-hero" },
                React.createElement("div", { className: "brand" },
                    React.createElement("div", { className: "brand-mark" }, "CT"),
                    React.createElement("div", null,
                        React.createElement("strong", null, "College Timetable"),
                        React.createElement("span", null, "Academic Management System"))),
                React.createElement("h1", null, "Build a timetable without building an ERP."),
                React.createElement("p", null, "Manage academic configuration, schedule classes, prevent clashes, move entries, and export the timetable. Everything stays in the browser using LocalStorage."),
                React.createElement("div", { className: "login-features" },
                    React.createElement("div", { className: "login-feature" }, "\u2713 Role-based access for four academic roles"),
                    React.createElement("div", { className: "login-feature" }, "\u2713 Real-time faculty, room and lab-batch conflict checks"),
                    React.createElement("div", { className: "login-feature" }, "\u2713 Drag-and-drop weekly scheduling"),
                    React.createElement("div", { className: "login-feature" }, "\u2713 Client-side PDF export"))),
            React.createElement("section", { className: "login-form" },
                React.createElement("h2", null, "Sign in"),
                React.createElement("p", null, "Use one of the demo accounts below."),
                React.createElement("form", { onSubmit: submit },
                    React.createElement("div", { className: "field" },
                        React.createElement("label", null, "Username"),
                        React.createElement("input", { value: username, onChange: e => setUsername(e.target.value), autoComplete: "username" })),
                    React.createElement("div", { className: "field", style: { marginTop: 13 } },
                        React.createElement("label", null, "Password"),
                        React.createElement("input", { type: "password", value: password, onChange: e => setPassword(e.target.value), autoComplete: "current-password" })),
                    error && React.createElement("div", { className: "error-list", style: { marginTop: 13 } }, error),
                    React.createElement("button", { className: "btn primary", style: { width: '100%', marginTop: 16 } }, "Sign in")),
                React.createElement("div", { className: "demo-users" },
                    React.createElement("h4", null, "Demo credentials"),
                    DEMO_USERS.map(u => React.createElement("div", { className: "demo-user", key: u.id },
                        React.createElement("span", null, u.role),
                        React.createElement("code", null,
                            u.username,
                            " / ",
                            u.password)))))));
}
function Dashboard({ data, user, onGo }) {
    return React.createElement(React.Fragment, null,
        React.createElement("div", { className: "page-head" },
            React.createElement("div", null,
                React.createElement("h2", null, "Dashboard"),
                React.createElement("p", null, "A focused overview of the timetable workspace.")),
            React.createElement("button", { className: "btn primary", onClick: () => onGo('timetable') }, "Open timetable")),
        React.createElement("div", { className: "stats dashboard-stats" },
            React.createElement("div", { className: "card stat" },
                React.createElement("div", { className: "stat-label" }, "Departments"),
                React.createElement("div", { className: "stat-value" }, data.departments.length),
                React.createElement("div", { className: "stat-note" }, "Academic units configured")),
            React.createElement("div", { className: "card stat" },
                React.createElement("div", { className: "stat-label" }, "Faculty"),
                React.createElement("div", { className: "stat-value" }, data.faculty.length),
                React.createElement("div", { className: "stat-note" }, "Available for assignments")),
            React.createElement("div", { className: "card stat" },
                React.createElement("div", { className: "stat-label" }, "Rooms"),
                React.createElement("div", { className: "stat-value" }, data.rooms.length),
                React.createElement("div", { className: "stat-note" }, "Classrooms + labs"))));
}
function entryAcademicInfo(e, data) {
    if (e?.activityType) return { departmentId: e.departmentId || '', semester: String(e.semester || '') };
    const s = byId(data.subjects, e?.subjectId);
    return { departmentId: e?.departmentId || s?.departmentId || '', semester: String(e?.semester || s?.semester || '') };
}
function isSpecialEntry(e) { return !!e?.activityType; }
function specialLabel(e) { return e?.activityName || e?.activityType || 'Activity'; }
function DashboardEntry({ e, data }) {
    const s = byId(data.subjects, e.subjectId), info = entryAcademicInfo(e, data), t = byId(data.timeSlots, e.timeSlotId), r = byId(data.rooms, e.roomId);
    const title = isSpecialEntry(e) ? specialLabel(e) : `${s?.code || ''} · ${s?.name || ''}`;
    const type = isSpecialEntry(e) ? e.activityType : (isLabEntry(e) ? 'Lab' : 'Theory');
    return React.createElement("div", { className: "quick-item" },
        React.createElement("div", null,
            React.createElement("strong", null, title),
            React.createElement("span", null, t?.day, " · ", t?.start, "-", t?.end, " · Sem ", info.semester, r?.name ? ` · ${r.name}` : '', e.batch ? ` · Batch ${e.batch}` : '')),
        React.createElement("span", { className: `tag ${isSpecialEntry(e) ? 'special' : (isLabEntry(e) ? 'lab' : 'theory')}` }, type));
}
function TimetablePage({ data, setData, user, filters, setFilters, canEdit, notify, modal, setModal, draggingId, setDraggingId, draggingMode, setDraggingMode, draggingRef }) {
    const facultyOwn = user.role === 'Faculty' ? data.faculty.find(f => f.id === user.facultyId) : null;
    const effectiveFilters = filters;
    const beginDrag = (id, mode, ev) => { draggingRef.current = { id, mode }; if (ev?.dataTransfer) { ev.dataTransfer.effectAllowed = 'move'; ev.dataTransfer.setData('text/plain', id); } setDraggingId(id); setDraggingMode(mode); };
    const endDrag = () => { draggingRef.current = { id: null, mode: null }; setDraggingId(null); setDraggingMode(null); };
    const semesters = (data.semesters || []).filter(s => s.departmentId === effectiveFilters.departmentId);
    const semesterNames = [...new Set(semesters.map(s => String(s.name)))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    const visibleEntries = data.timetable.filter(e => {
        if (user.role === 'Faculty') return e.facultyId === user.facultyId;
        const info = entryAcademicInfo(e, data);
        return info.departmentId === effectiveFilters.departmentId && String(info.semester) === String(effectiveFilters.semester);
    });
    const days = DAYS.filter(day => data.timeSlots.some(t => t.day === day));
    const groupsByDay = Object.fromEntries(days.map(day => [day, buildSlotGroups(data.timeSlots.filter(t => t.day === day))]));
    const groups = days.length ? groupsByDay[days[0]] || [] : [];

    useEffect(() => {
        if (user.role === 'Faculty') return;
        const names = [...new Set((data.semesters || []).filter(s => s.departmentId === filters.departmentId).map(s => String(s.name)))];
        if (!names.includes(String(filters.semester)))
            setFilters(f => ({ ...f, semester: names[0] || '' }));
    }, [data.semesters, filters.departmentId, user.role]);

    const groupForSlot = slotId => {
        for (const day of days) {
            const found = groupsByDay[day].find(g => g.slots.some(s => s.id === slotId));
            if (found) return found;
        }
        return null;
    };
    const entryAt = timeId => visibleEntries.find(e => e.timeSlotId === timeId && e.duration !== 'slot');
    const entriesInGroup = (day, group) => {
        const groupStart = group.slots[0]?.start, groupEnd = group.slots[group.slots.length - 1]?.end;
        return visibleEntries.filter(e => {
            const slot = byId(data.timeSlots, e.timeSlotId);
            if (!slot || slot.day !== day) return false;
            if (group.slots.some(x => x.id === slot.id)) return true;
            const w = entryWindow(e, data);
            return w && w.day === day && timeRangesOverlap({ start: groupStart, end: groupEnd }, w);
        });
    };
    const swapBatchEntries = (sourceId, targetId) => {
        if (!canEdit || !sourceId || !targetId || sourceId === targetId) return;
        const source = data.timetable.find(e => e.id === sourceId);
        const target = data.timetable.find(e => e.id === targetId);
        if (!source || !target || !isLabEntry(source) || !isLabEntry(target)) return;
        const next = clone(data);
        const updated = next.timetable.map(e => {
            if (e.id === source.id) return { ...e, timeSlotId: target.timeSlotId };
            if (e.id === target.id) return { ...e, timeSlotId: source.timeSlotId };
            return e;
        });
        const candidateData = { ...next, timetable: updated };
        for (const id of [source.id, target.id]) {
            const candidate = updated.find(e => e.id === id);
            const errors = validateEntry(candidate, candidateData, id);
            if (errors.length) {
                endDrag();
                return notify(`Cannot swap batches: ${errors[0]}`, 'error');
            }
        }
        endDrag();
        setData(candidateData);
        notify(`Batch ${source.batch || ''} and Batch ${target.batch || ''} swapped.`);
    };

    const drop = (timeSlotId, event) => {
        if (event?.stopPropagation) event.stopPropagation();
        const active = draggingRef.current;
        const sourceId = active.id || draggingId;
        const sourceMode = active.mode || draggingMode;
        if (!canEdit || !sourceId) return;
        if (sourceMode === 'batch') return;
        const entry = data.timetable.find(e => e.id === sourceId);
        if (!entry) return;

        const sourceGroup = groupForSlot(entry.timeSlotId);
        const targetGroup = groupForSlot(timeSlotId);
        const sourceIsFull = isLabEntry(entry) || entry.duration === 'slot';
        const sourceStart = sourceIsFull ? (sourceGroup?.slots[0]?.id || entry.timeSlotId) : entry.timeSlotId;
        const targetStart = sourceIsFull ? (targetGroup?.slots[0]?.id || timeSlotId) : timeSlotId;

        if (sourceStart === targetStart) {
            endDrag();
            return;
        }

        // Find what is actually occupying the destination. A one-hour entry may
        // only swap with another one-hour entry. A full-slot lab/activity may only
        // swap with another full-slot entry. This prevents a 1-hour card from
        // accidentally moving an entire 2-hour block (or vice versa).
        const targetSlot = byId(data.timeSlots, timeSlotId);
        const targetGroupStart = targetGroup?.slots[0]?.id || timeSlotId;
        const targetGroupEntries = targetGroup && targetSlot
            ? data.timetable.filter(e => {
                const w = entryWindow(e, data);
                if (!w || w.day !== targetSlot.day) return false;
                const eg = groupForSlot(e.timeSlotId);
                return eg && eg.slots[0]?.id === targetGroupStart;
            })
            : [];
        const targetFullEntries = targetGroupEntries.filter(e => isLabEntry(e) || e.duration === 'slot');
        const targetOneHourEntries = targetSlot
            ? data.timetable.filter(e => e.timeSlotId === timeSlotId && !isLabEntry(e) && e.duration !== 'slot')
            : [];

        // A full-slot entry occupies the whole two-period group.
        // A one-hour entry occupies exactly the clicked period.
        const targetIsFull = targetFullEntries.length > 0;
        const targetOccupants = sourceIsFull ? targetFullEntries : targetOneHourEntries;

        // Do not allow cross-size swaps. It would leave the timetable with
        // overlapping/partially displaced entries.
        const hasOtherKind = sourceIsFull
            ? targetOneHourEntries.length > 0 && targetFullEntries.length === 0
            : targetFullEntries.length > 0;
        if (hasOtherKind) {
            endDrag();
            return notify(
                sourceIsFull
                    ? 'A full-slot entry can only be swapped with another full-slot entry.'
                    : 'A 1-hour entry can only be swapped with another 1-hour entry.',
                'error'
            );
        }

        // A drop onto an occupied compatible entry swaps the positions.
        if (targetOccupants.length) {
            const targetBlockIds = targetOccupants.map(e => e.id);
            const sourceBlockIds = sourceIsFull
                ? data.timetable.filter(e => {
                    const w = entryWindow(e, data);
                    const src = entryWindow(entry, data);
                    return w && src && w.day === src.day && w.start === src.start && w.end === src.end &&
                        (isLabEntry(e) || e.duration === 'slot');
                }).map(e => e.id)
                : [entry.id];

            const sourceDestination = sourceIsFull ? targetGroupStart : timeSlotId;
            const targetDestination = sourceIsFull ? sourceStart : entry.timeSlotId;
            const involvedIds = [...new Set([...sourceBlockIds, ...targetBlockIds])];
            const working = clone(data);

            const updated = working.timetable.map(e => {
                if (sourceBlockIds.includes(e.id)) return { ...e, timeSlotId: sourceDestination };
                if (targetBlockIds.includes(e.id)) return { ...e, timeSlotId: targetDestination };
                return e;
            });

            const candidateData = { ...working, timetable: updated };
            const movedCandidates = updated.filter(e => involvedIds.includes(e.id));
            for (const candidate of movedCandidates) {
                const errors = validateEntry(candidate, candidateData, candidate.id);
                if (errors.length) {
                    endDrag();
                    return notify(`Cannot swap: ${errors[0]}`, 'error');
                }
            }

            endDrag();
            setData(candidateData);
            notify('Timetable entries swapped.');
            return;
        }

        // Empty destination: preserve normal move behavior. Full-slot entries
        // always start at the first period of their destination group.
        const target = sourceIsFull ? targetGroupStart : timeSlotId;
        const errors = validateEntry({ ...entry, timeSlotId: target }, data, entry.id);
        endDrag();
        if (errors.length) return notify(errors[0], 'error');
        const next = clone(data);
        next.timetable = next.timetable.map(e => e.id === entry.id ? { ...e, timeSlotId: target } : e);
        setData(next);
        notify('Timetable entry moved.');
    };
    const openAdd = timeSlotId => {
        if (canEdit) setModal({
            type: 'entry',
            entry: null,
            timeSlotId,
            defaultDepartmentId: effectiveFilters.departmentId,
            defaultSemester: effectiveFilters.semester
        });
    };
    const openEdit = entry => {
        if (!canEdit) return;
        if (isSpecialEntry(entry)) return setModal({ type: 'entry', entry });
        const subject = byId(data.subjects, entry.subjectId);
        if (!isLabEntry(entry)) return setModal({ type: 'entry', entry });
        const group = groupForSlot(entry.timeSlotId);
        const info = entryAcademicInfo(entry, data);
        const groupSlotIds = new Set((group?.slots || []).map(x => x.id));
        const labEntries = data.timetable.filter(e => {
            const other = entryAcademicInfo(e, data);
            return other.departmentId === info.departmentId && String(other.semester) === String(info.semester) &&
                groupSlotIds.has(e.timeSlotId) && isLabEntry(e);
        });
        setModal({ type: 'lab', entries: labEntries, timeSlotId: group?.slots?.[0]?.id || entry.timeSlotId,
            defaultDepartmentId: info.departmentId, defaultSemester: info.semester });
    };
    const openBreakEdit = afterSlot => { if (canEdit) setModal({ type: 'break', afterSlot }); };
    const exportPdf = () => generatePDF(data, user, effectiveFilters, visibleEntries);

    const renderEntry = e => React.createElement(TimetableEntry, {
        e, data, user, canEdit, compact: true,
        onEdit: () => openEdit(e),
        onDragStart: ev => beginDrag(e.id, 'entry', ev),
        onDragEnd: endDrag
    });
    const renderLecturePeriod = slot => {
        const e = entryAt(slot.id);
        return React.createElement("div", {
            key: slot.id,
            className: `lecture-period ${draggingId ? 'drop-target' : ''}`,
            onDoubleClick: () => openAdd(slot.id),
            onDragOver: ev => { if (!canEdit) return; ev.preventDefault(); ev.currentTarget.classList.add('drop-target'); },
            onDragLeave: ev => ev.currentTarget.classList.remove('drop-target'),
            onDrop: ev => { ev.preventDefault(); ev.stopPropagation(); ev.currentTarget.classList.remove('drop-target'); drop(slot.id, ev); }
        },
            React.createElement("span", { className: "period-time" }, `${fmtTime(slot.start)}–${fmtTime(slot.end)}`),
            e ? renderEntry(e) : React.createElement("span", { className: "empty-period" }, "+ Add entry")
        );
    };
    const renderGroupCell = (day, group, groupIndex) => {
        const dayGroup = groupsByDay[day]?.[groupIndex] || group;
        const groupEntries = entriesInGroup(day, dayGroup);
        const fullSpecial = groupEntries.filter(e => isSpecialEntry(e) && e.duration === 'slot');
        const labs = groupEntries.filter(e => isLabEntry(e));
        return React.createElement("td", { key: day, className: `group-cell ${draggingId ? 'drop-target' : ''}`,
            onDragOver: ev => { if (!canEdit) return; ev.preventDefault(); ev.currentTarget.classList.add('drop-target'); },
            onDragLeave: ev => ev.currentTarget.classList.remove('drop-target'),
            onDrop: ev => { ev.preventDefault(); ev.stopPropagation(); ev.currentTarget.classList.remove('drop-target'); drop(dayGroup.slots[0]?.id, ev); } },
            fullSpecial.length
                ? React.createElement(SpecialSlotCard, { entry: fullSpecial[0], data, canEdit, onEdit: openEdit,
                    onDragStart: ev => beginDrag(fullSpecial[0].id, 'entry', ev), onDragEnd: endDrag })
                : labs.length
                    ? React.createElement(LabSlotCard, { labs, group: dayGroup, data, canEdit, onEdit: openEdit,
                        onDragLabStart: (e, ev) => beginDrag(e.id, 'lab', ev),
                        onDragBatchStart: (e, ev) => beginDrag(e.id, 'batch', ev),
                        onDragEnd: endDrag,
                        onDropBatch: (targetId, ev) => { ev.preventDefault(); ev.stopPropagation(); const sourceId = draggingRef.current.id || draggingId; swapBatchEntries(sourceId, targetId); } })
                    : React.createElement("div", { className: "lecture-pair" }, dayGroup.slots.map(renderLecturePeriod))
        );
    };
    const scheduleRows = groups.flatMap((group, groupIndex) => {
        const breakInfo = data.breaks?.find(b => b.afterSlot === (groupIndex + 1) * 2);
        const breakContent = React.createElement("div", { className: "break-label" },
            React.createElement("span", null, "☕"),
            React.createElement("strong", null, "BREAK"),
            React.createElement("small", null, breakInfo ? `${fmtTime(breakInfo.start)}–${fmtTime(breakInfo.end)}` : "Set break time"),
            canEdit && React.createElement("button", { className: "break-edit-btn", onClick: () => openBreakEdit((groupIndex + 1) * 2) }, "Edit break"));
        return [
            React.createElement("tr", { key: `slot-${group.key}`, className: "slot-group-row" },
                React.createElement("td", null,
                    React.createElement("div", { className: "slot-group-label" },
                        React.createElement("strong", null, `Slot ${groupIndex + 1}`),
                        React.createElement("span", null, `${fmtTime(group.slots[0]?.start)} – ${fmtTime(group.slots[group.slots.length - 1]?.end)}`))),
                days.map(day => renderGroupCell(day, group, groupIndex))),
            React.createElement("tr", { key: `break-${group.key}`, className: "break-row" },
                React.createElement("td", { colSpan: days.length + 1 }, breakContent))
        ];
    });
    return React.createElement(React.Fragment, null,
        React.createElement("div", { className: "page-head" },
            React.createElement("div", null,
                React.createElement("h2", null, user.role === 'Faculty' ? 'My Timetable' : 'Weekly Timetable'),
                React.createElement("p", null, user.role === 'Faculty'
                    ? `${facultyOwn?.name || 'Faculty'} · view-only`
                    : 'Each slot contains two lecture periods or one full lab/activity.')),
            React.createElement("div", { className: "actions" },
                React.createElement("button", { className: "btn", onClick: exportPdf }, "Download PDF"))),
        user.role === 'Faculty' && React.createElement("div", { className: "notice info" }, "Faculty mode is view-only. Editing, deletion and drag-and-drop are disabled."),
        React.createElement("div", { className: "card filters" },
            React.createElement("div", { className: "field compact" },
                React.createElement("label", null, "Department"),
                React.createElement("select", {
                    disabled: user.role === 'Faculty',
                    value: effectiveFilters.departmentId,
                    onChange: e => {
                        const nextDept = e.target.value;
                        const nextSem = [...new Set((data.semesters || []).filter(x => x.departmentId === nextDept).map(x => String(x.name)))]
                            .sort((a,b) => a.localeCompare(b, undefined, {numeric:true}))[0] || '';
                        setFilters(f => ({ ...f, departmentId: nextDept, semester: nextSem }));
                    }
                }, data.departments.map(d => React.createElement("option", { key: d.id, value: d.id }, d.code)))),
            React.createElement("div", { className: "field compact" },
                React.createElement("label", null, "Semester"),
                React.createElement("select", {
                    disabled: user.role === 'Faculty',
                    value: effectiveFilters.semester,
                    onChange: e => setFilters(f => ({ ...f, semester: e.target.value }))
                }, semesterNames.map(name => React.createElement("option", { key: name, value: name }, `Sem ${name}`)))),
            React.createElement("div", { style: { marginLeft: 'auto', alignSelf: 'center' } },
                React.createElement("span", { className: "tag" }, visibleEntries.length, " entries"))),
        React.createElement("div", { className: "card timetable-card" },
            React.createElement("div", { className: "timetable-toolbar" },
                React.createElement("div", { className: "timetable-title" },
                    React.createElement("div", { className: "timetable-title-icon" }, "▦"),
                    React.createElement("div", null,
                        React.createElement("strong", null, "Weekly Schedule"),
                        React.createElement("span", null, user.role === 'Faculty' ? 'All assigned classes' : `Semester ${effectiveFilters.semester || ''}`))),
                React.createElement("div", { className: "timetable-legend" },
                    React.createElement("span", { className: "legend-item" }, React.createElement("i", { className: "legend-dot theory-dot" }), "Theory"),
                    React.createElement("span", { className: "legend-item" }, React.createElement("i", { className: "legend-dot lab-dot" }), "Lab"),
                    React.createElement("span", { className: "legend-item" }, React.createElement("i", { className: "legend-break" }), "Break"))),
            React.createElement("div", { className: "timetable-scroll" },
                React.createElement("table", { className: "timetable grouped-timetable" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Slot"),
                            days.map(d => React.createElement("th", { key: d }, React.createElement("span", { className: "day-head" }, d))))),
                    React.createElement("tbody", null, scheduleRows)))),
        modal?.type === 'entry' && React.createElement(EntryModal, {
            data, user, modal, onClose: () => setModal(null), notify,
            onSave: (patch, editingId) => saveEntry(patch, editingId, data, setData, notify, setModal),
            onSaveLab: (meta, rows, existingIds) => saveLabEntries(meta, rows, existingIds, data, setData, notify, setModal),
            onDelete: id => deleteEntry(id, data, setData, notify, setModal)
        }),
        modal?.type === 'lab' && React.createElement(LabModal, {
            data, user, modal, onClose: () => setModal(null), notify,
            onSave: (meta, rows, existingIds) => saveLabEntries(meta, rows, existingIds, data, setData, notify, setModal),
            onDelete: ids => deleteLabEntries(ids, data, setData, notify, setModal)
        }),
        modal?.type === 'break' && React.createElement(BreakModal, {
            data, afterSlot: modal.afterSlot, onClose: () => setModal(null),
            onSave: value => saveBreak(value, modal.afterSlot, data, setData, notify, setModal)
        })
    );
}
function buildSlotGroups(slots) {
    const sorted = [...slots].sort((a, b) => a.start.localeCompare(b.start));
    const groups = [];
    for (let i = 0; i < sorted.length; i += 2) {
        const pair = sorted.slice(i, i + 2);
        if (pair.length) groups.push({ key: pair.map(s => s.id).join('-'), slots: pair });
    }
    return groups;
}
function LabSlotCard({ labs, group, data, canEdit, onEdit, onDragLabStart, onDragBatchStart, onDragEnd, onDropBatch }) {
    const uniqueLabs = Array.from(new Map(labs.map((e, i) => [e.batch || `row-${i}`, e])).values());
    const first = uniqueLabs[0];
    const subject = byId(data.subjects, first?.subjectId);
    const info = entryAcademicInfo(first, data);
    const slotStart = group.slots[0]?.start;
    const slotEnd = group.slots[group.slots.length - 1]?.end || group.slots[0]?.end;
    return React.createElement("div", {
        className: "lab-slot-card",
        title: canEdit ? 'This lab occupies the complete 2-hour slot. Drag a batch to move it or double-click to edit.' : 'Full-slot lab'
    },
        React.createElement("div", { className: "lab-slot-time" }, `${fmtTime(slotStart)}–${fmtTime(slotEnd)}`),
        React.createElement("div", { className: "lab-slot-header", draggable: canEdit, onDragStart: canEdit ? ev => onDragLabStart(first, ev) : undefined, onDragEnd: canEdit ? onDragEnd : undefined, title: canEdit ? "Drag header to swap entire lab" : undefined },
            React.createElement("div", { className: "lab-slot-title" },
                React.createElement("strong", null, `${subject?.code || ''} · ${subject?.name || 'Lab'}`),
                React.createElement("span", null, `Semester ${info.semester || ''} · Full 2-hour slot`)
            ),
            React.createElement("span", { className: "lab-slot-badge" }, "LAB")
        ),
        React.createElement("div", { className: "lab-batches" }, uniqueLabs.map((e, index) => {
            const f = byId(data.faculty, e.facultyId);
            const r = byId(data.rooms, e.roomId);
            return React.createElement("div", {
                key: e.id,
                className: "lab-batch-row",
                draggable: canEdit,
                onDragStart: canEdit ? ev => onDragBatchStart(e, ev) : undefined,
                onDragEnd: canEdit ? onDragEnd : undefined,
                onDragOver: canEdit ? ev => { ev.preventDefault(); ev.stopPropagation(); } : undefined,
                onDrop: canEdit ? ev => { ev.preventDefault(); ev.stopPropagation(); onDropBatch(e.id, ev); } : undefined,
                onDoubleClick: canEdit ? () => onEdit(e) : undefined
            },
                React.createElement("span", { className: "lab-batch-name" }, e.batch ? `Batch ${e.batch}` : `Lab ${index + 1}`),
                React.createElement("span", null, `${byId(data.departments, info.departmentId)?.code || 'Department'} · Sem ${info.semester || ''}`),
                React.createElement("span", null, r?.name || 'Lab room'),
                canEdit && React.createElement("button", { className: "icon-btn lab-edit-btn", onClick: ev => { ev.stopPropagation(); onEdit(e); } }, "✎")
            );
        }))
    );
}
function SpecialSlotCard({ entry, data, canEdit, onEdit, onDragStart, onDragEnd }) {
    const dept = byId(data.departments, entry.departmentId);
    return React.createElement("div", {
        className: "special-slot-card",
        draggable: canEdit,
        onDragStart: canEdit ? onDragStart : undefined,
        onDragEnd: canEdit ? onDragEnd : undefined,
        onDoubleClick: canEdit ? () => onEdit(entry) : undefined
    },
        React.createElement("div", { className: "special-slot-title" }, specialLabel(entry)),
        canEdit && React.createElement("button", { className: "icon-btn special-edit-btn", onClick: ev => { ev.stopPropagation(); onEdit(entry); } }, "✎")
    );
}
function TimetableEntry({ e, data, user, canEdit, onEdit, onDragStart, onDragEnd, compact = false }) {
    const s = byId(data.subjects, e.subjectId), f = byId(data.faculty, e.facultyId), r = byId(data.rooms, e.roomId);
    if (isSpecialEntry(e)) {
        return React.createElement("div", {
            className: `entry special-entry ${compact ? 'entry-compact' : ''}`,
            draggable: canEdit,
            onDragStart: canEdit ? onDragStart : undefined,
            onDragEnd: canEdit ? onDragEnd : undefined,
            onDoubleClick: canEdit ? onEdit : undefined,
            title: canEdit ? 'Drag to move or double-click to edit' : 'View-only'
        },
            React.createElement("div", { className: "entry-title" }, specialLabel(e)),
            canEdit && React.createElement("div", { className: "entry-actions" },
                React.createElement("button", { className: "icon-btn", onClick: ev => { ev.stopPropagation(); onEdit(); } }, "✎")));
    }
    const v = entryAcademicInfo(e, data);
    return React.createElement("div", {
        className: `entry ${compact ? 'entry-compact' : ''} ${isLabEntry(e) ? 'lab-entry' : 'theory-entry'}`,
        draggable: canEdit,
        onDragStart: canEdit ? onDragStart : undefined,
        onDragEnd: canEdit ? onDragEnd : undefined,
        onDoubleClick: canEdit ? onEdit : undefined,
        title: canEdit ? 'Drag to move or double-click to edit' : 'View-only'
    },
        React.createElement("div", { className: "entry-title" }, s?.code, " · ", s?.name),
        React.createElement("div", { className: "entry-sub" },
            byId(data.departments, v.departmentId)?.code || 'Department', " · ", `Sem ${v.semester}`),
        React.createElement("div", { className: "entry-meta" },
            user.role === 'Faculty'
                ? React.createElement(React.Fragment, null,
                    r?.name && React.createElement("span", null, r.name),
                    e.batch && React.createElement("span", null, "Batch ", e.batch))
                : React.createElement(React.Fragment, null,
                    React.createElement("span", null, `Sem ${v.semester}`),
                    React.createElement("span", null, r?.name),
                    e.batch && React.createElement("span", null, "Batch ", e.batch))),
        canEdit && React.createElement("div", { className: "entry-actions" },
            React.createElement("button", { className: "icon-btn", onClick: ev => { ev.stopPropagation(); onEdit(); } }, "✎")));
}
function EntryModal({ data, user, modal, onClose, notify, onSave, onSaveLab, onDelete }) {
    const editing = modal.entry;
    const existing = editing || {};
    const existingSubject = byId(data.subjects, existing.subjectId);
    const [mode, setMode] = useState(isSpecialEntry(existing) ? 'activity' : isLabEntry(existing) ? 'lab' : 'lecture');
    const [form, setForm] = useState({
        subjectId: existing.subjectId || '',
        facultyId: existing.facultyId || '',
        roomId: existing.roomId || '',
        departmentId: existing.departmentId || existingSubject?.departmentId || modal.defaultDepartmentId || 'd1',
        semester: String(existing.semester || existingSubject?.semester || modal.defaultSemester || ''),
        timeSlotId: existing.timeSlotId || modal.timeSlotId || '',
        activityType: existing.activityType || 'Library',
        activityName: existing.activityName || '',
        duration: existing.duration || 'period'
    });
    const [labRows, setLabRows] = useState(BATCHES.map(batch => ({ batch, subjectId: '', facultyId: '', roomId: '' })));
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const updateLabRow = (batch, key, value) => setLabRows(rows => rows.map(r => r.batch === batch ? { ...r, [key]: value } : r));
    const semesters = (data.semesters || []).filter(x => x.departmentId === form.departmentId);
    const subjects = data.subjects.filter(s => s.departmentId === form.departmentId && String(s.semester) === String(form.semester));
    const theorySubjects = subjects;
    const labSubjects = subjects;
    const faculty = data.faculty;
    const rooms = data.rooms.filter(r => r.type === (mode === 'lab' ? 'Lab' : 'Classroom'));
    const slots = data.timeSlots.filter(t => t.day);
    const labSlots = slots.filter(t => {
        const daySlots = slots.filter(x => x.day === t.day).sort((a,b) => a.start.localeCompare(b.start));
        const i = daySlots.findIndex(x => x.id === t.id);
        return i >= 0 && i % 2 === 0 && !!daySlots[i + 1];
    });
    const selectableSlots = mode === 'lab' || (mode === 'activity' && form.duration === 'slot') ? labSlots : slots;
    const switchMode = nextMode => {
        setMode(nextMode);
        if (nextMode === 'lab') {
            set('subjectId', ''); set('facultyId', ''); set('roomId', '');
            const currentDaySlots = slots.filter(x => x.day === byId(data.timeSlots, form.timeSlotId)?.day);
            const currentGroup = buildSlotGroups(currentDaySlots).find(g => g.slots.some(x => x.id === form.timeSlotId));
            set('timeSlotId', currentGroup?.slots?.[0]?.id || labSlots[0]?.id || form.timeSlotId);
        } else if (nextMode === 'activity') {
            set('subjectId', ''); set('facultyId', ''); set('roomId', '');
        } else {
            setLabRows(BATCHES.map(batch => ({ batch, subjectId: '', facultyId: '', roomId: '' })));
        }
    };
    useEffect(() => {
        if (editing && isLabEntry(existing)) {
            const info = entryAcademicInfo(existing, data);
            setLabRows(BATCHES.map(batch => {
                const row = data.timetable.find(e => e.id === editing.id && e.batch === batch) ||
                    data.timetable.find(e => e.batch === batch && e.timeSlotId === existing.timeSlotId &&
                        entryAcademicInfo(e, data).departmentId === info.departmentId &&
                        String(entryAcademicInfo(e, data).semester) === String(info.semester));
                return { batch, subjectId: row?.subjectId || '', facultyId: row?.facultyId || '', roomId: row?.roomId || '' };
            }));
        }
    }, [editing?.id]);
    const save = () => {
        if (mode === 'lab') {
            if (!form.departmentId || !form.semester || !form.timeSlotId) return notify('Department, semester and full lab slot are required.', 'error');
            if (labRows.some(r => !r.subjectId || !r.facultyId || !r.roomId)) return notify('Select subject, professor and lab room for all three batches.', 'error');
            const existingIds = editing ? data.timetable.filter(e => isLabEntry(e) &&
                e.timeSlotId === existing.timeSlotId &&
                entryAcademicInfo(e, data).departmentId === form.departmentId &&
                String(entryAcademicInfo(e, data).semester) === String(form.semester)).map(e => e.id) : [];
            return onSaveLab({ departmentId: form.departmentId, semester: form.semester, timeSlotId: form.timeSlotId }, labRows, existingIds);
        }
        if (mode === 'activity') {
            const name = form.activityType === 'Other' ? form.activityName.trim() : form.activityType;
            if (!name) return notify('Enter the activity name.', 'error');
            if (!form.departmentId || !form.semester || !form.timeSlotId) return notify('Department, semester and time slot are required.', 'error');
            return onSave({ activityType: form.activityType, activityName: name, duration: form.duration,
                departmentId: form.departmentId, semester: form.semester, timeSlotId: form.timeSlotId }, editing?.id);
        }
        const required = [['subjectId', 'Subject'], ['facultyId', 'Faculty'], ['roomId', 'Room'], ['departmentId', 'Department'], ['semester', 'Semester'], ['timeSlotId', 'Time slot']];
        const missing = required.filter(([k]) => !form[k]).map(([, n]) => n);
        if (missing.length) return notify(`Required: ${missing.join(', ')}.`, 'error');
        onSave({ subjectId: form.subjectId, facultyId: form.facultyId, roomId: form.roomId,
            departmentId: form.departmentId, semester: form.semester, timeSlotId: form.timeSlotId, entryType: 'lecture' }, editing?.id);
    };
    const head = React.createElement("div", { className: "modal-head" },
        React.createElement("div", null,
            React.createElement("h3", null, editing ? 'Edit timetable entry' : 'Add timetable entry'),
            React.createElement("p", null, 'Schedule a lecture, full lab, or a non-subject activity.')),
        React.createElement("button", { className: "icon-btn", onClick: onClose }, "×"));
    const children = [];
    children.push(React.createElement("div", { key: "type", className: "field full" },
        React.createElement("label", null, "Schedule type"),
        React.createElement("select", { value: mode, onChange: e => switchMode(e.target.value), disabled: !!editing },
            React.createElement("option", { value: "lecture" }, "Theory / Lecture · 1 hour"),
            React.createElement("option", { value: "lab" }, "Lab · full 2-hour slot"),
            React.createElement("option", { value: "activity" }, "Library / Sports / Unit Test / Seminar"))));
    // Department, semester, and time slot come from the current timetable context.
    // They remain in form state for validation/saving, but are not shown here.
    // The user already selected the semester timetable and clicked the exact slot.
    if (mode === 'activity') {
        children.push(React.createElement("div", { key: "activity", className: "field" },
            React.createElement("label", null, "Activity"),
            React.createElement("select", { value: form.activityType, onChange: e => set('activityType', e.target.value) },
                ['Library', 'Sports', 'Unit Test', 'Seminar', 'Other'].map(x => React.createElement("option", { key: x, value: x }, x)))));
        children.push(React.createElement("div", { key: "duration", className: "field" },
            React.createElement("label", null, "Duration"),
            React.createElement("select", { value: form.duration, onChange: e => {
                const duration = e.target.value;
                const current = byId(data.timeSlots, form.timeSlotId);
                const group = current ? groupForLocalSlot(data.timeSlots, current.id) : null;
                setForm(f => ({ ...f, duration, timeSlotId: duration === 'slot' ? (group?.slots?.[0]?.id || f.timeSlotId) : f.timeSlotId }));
            } },
                React.createElement("option", { value: "period" }, "1 hour"),
                React.createElement("option", { value: "slot" }, "Entire slot · 2 periods"))));
        if (form.activityType === 'Other') children.push(React.createElement("div", { key: "activityName", className: "field full" },
            React.createElement("label", null, "Activity name"),
            React.createElement("input", { value: form.activityName, onChange: e => set('activityName', e.target.value), placeholder: "e.g. Cultural Activity" })));
    } else if (mode === 'lecture') {
        children.push(React.createElement("div", { key: "subject", className: "field" },
            React.createElement("label", null, "Subject"),
            React.createElement("select", { value: form.subjectId, onChange: e => { set('subjectId', e.target.value); set('roomId', ''); } },
                React.createElement("option", { value: "" }, "Select subject"), theorySubjects.map(x => React.createElement("option", { key: x.id, value: x.id }, `${x.code} · ${x.name}`)))));
        children.push(React.createElement("div", { key: "faculty", className: "field" },
            React.createElement("label", null, "Faculty"),
            React.createElement("select", { value: form.facultyId, onChange: e => set('facultyId', e.target.value) },
                React.createElement("option", { value: "" }, "Select faculty"), faculty.map(f => React.createElement("option", { key: f.id, value: f.id }, f.name)))));
        children.push(React.createElement("div", { key: "room", className: "field" },
            React.createElement("label", null, "Room"),
            React.createElement("select", { value: form.roomId, onChange: e => set('roomId', e.target.value) },
                React.createElement("option", { value: "" }, "Select classroom"), rooms.map(r => React.createElement("option", { key: r.id, value: r.id }, r.name)))));
    } else {
        children.push(React.createElement("div", { key: "labbox", className: "lab-config-box full" },
            React.createElement("div", { className: "lab-config-head" },
                React.createElement("strong", null, "Configure 3 lab batches"),
                React.createElement("span", null, "Each batch gets its own subject, professor and lab room.")),
            labRows.map(row => React.createElement("div", { key: row.batch, className: "lab-config-row" },
                React.createElement("div", { className: "batch-pill" }, `Batch ${row.batch}`),
                React.createElement("select", { value: row.subjectId, onChange: e => updateLabRow(row.batch, 'subjectId', e.target.value) },
                    React.createElement("option", { value: "" }, "Select lab subject"), labSubjects.map(x => React.createElement("option", { key: x.id, value: x.id }, `${x.code} · ${x.name}`))),
                React.createElement("select", { value: row.facultyId, onChange: e => updateLabRow(row.batch, 'facultyId', e.target.value) },
                    React.createElement("option", { value: "" }, "Select professor"), faculty.map(f => React.createElement("option", { key: f.id, value: f.id }, f.name))),
                React.createElement("select", { value: row.roomId, onChange: e => updateLabRow(row.batch, 'roomId', e.target.value) },
                    React.createElement("option", { value: "" }, "Select lab room"), rooms.map(r => React.createElement("option", { key: r.id, value: r.id }, r.name)))))));
    }
    return React.createElement("div", { className: "modal-backdrop", onMouseDown: e => { if (e.target === e.currentTarget) onClose(); } },
        React.createElement("div", { className: `modal ${mode === 'lab' ? 'lab-modal' : ''}` },
            head,
            React.createElement("div", { className: "modal-body" }, React.createElement("div", { className: "form-grid" }, children)),
            React.createElement("div", { className: "modal-foot" },
                React.createElement("div", null, editing && React.createElement("button", { className: "btn danger", onClick: () => onDelete(editing.id) }, "Delete")),
                React.createElement("div", { className: "actions" },
                    React.createElement("button", { className: "btn", onClick: onClose }, "Cancel"),
                    React.createElement("button", { className: "btn primary", onClick: save }, mode === 'lab' ? 'Save lab slot' : (editing ? 'Save changes' : 'Add entry'))))));
}
function groupForLocalSlot(timeSlots, slotId) {
    const slot = byId(timeSlots, slotId);
    if (!slot) return null;
    return buildSlotGroups(timeSlots.filter(x => x.day === slot.day)).find(g => g.slots.some(x => x.id === slotId)) || null;
}
function LabModal({ data, user, modal, onClose, notify, onSave, onDelete }) {
    const entries = modal.entries || [];
    const first = entries[0] || {};
    const info = entryAcademicInfo(first, data);
    const [form, setForm] = useState({
        departmentId: info.departmentId || modal.defaultDepartmentId || '',
        semester: String(info.semester || modal.defaultSemester || ''),
        timeSlotId: modal.timeSlotId || first.timeSlotId || ''
    });
    const [rows, setRows] = useState(BATCHES.map(batch => {
        const e = entries.find(x => x.batch === batch);
        return { batch, subjectId: e?.subjectId || '', facultyId: e?.facultyId || '', roomId: e?.roomId || '' };
    }));
    const updateRow = (batch, key, value) => setRows(rs => rs.map(r => r.batch === batch ? { ...r, [key]: value } : r));
    const subjects = data.subjects.filter(s => s.departmentId === form.departmentId && String(s.semester) === String(form.semester));
    const rooms = data.rooms.filter(r => r.type === 'Lab');
    const slots = data.timeSlots.filter(t => t.day);
    const labSlots = slots.filter(t => {
        const daySlots = slots.filter(x => x.day === t.day).sort((a,b) => a.start.localeCompare(b.start));
        const i = daySlots.findIndex(x => x.id === t.id);
        return i >= 0 && i % 2 === 0 && !!daySlots[i + 1];
    });
    const save = () => {
        if (!form.departmentId || !form.semester || !form.timeSlotId) return notify('Department, semester and full lab slot are required.', 'error');
        if (rows.some(r => !r.subjectId || !r.facultyId || !r.roomId)) return notify('Select subject, professor and lab room for all three batches.', 'error');
        onSave({ departmentId: form.departmentId, semester: form.semester, timeSlotId: form.timeSlotId }, rows, entries.map(e => e.id));
    };
    return React.createElement("div", { className: "modal-backdrop", onMouseDown: e => { if (e.target === e.currentTarget) onClose(); } },
        React.createElement("div", { className: "modal lab-modal" },
            React.createElement("div", { className: "modal-head" },
                React.createElement("div", null, React.createElement("h3", null, entries.length ? 'Edit full lab slot' : 'Add full lab slot'),
                    React.createElement("p", null, 'One lab slot = two consecutive periods. Configure all three batches here.')),
                React.createElement("button", { className: "icon-btn", onClick: onClose }, "×")),
            React.createElement("div", { className: "modal-body" },
                React.createElement("div", { className: "form-grid" },
                    React.createElement("div", { className: "field" }, React.createElement("label", null, "Department"),
                        React.createElement("select", { value: form.departmentId, onChange: e => setForm(f => ({ ...f, departmentId: e.target.value, semester: String((data.semesters || []).find(x => x.departmentId === e.target.value)?.name || '') })) },
                            data.departments.map(d => React.createElement("option", { key: d.id, value: d.id }, d.code)))),
                    React.createElement("div", { className: "field" }, React.createElement("label", null, "Semester"),
                        React.createElement("select", { value: form.semester, onChange: e => setForm(f => ({ ...f, semester: e.target.value })) },
                            (data.semesters || []).filter(x => x.departmentId === form.departmentId).map(x => React.createElement("option", { key: x.id, value: String(x.name) }, `Sem ${x.name}`)))),
                    React.createElement("div", { className: "field full" }, React.createElement("label", null, "Full lab slot"),
                        React.createElement("select", { value: form.timeSlotId, onChange: e => setForm(f => ({ ...f, timeSlotId: e.target.value })) },
                            React.createElement("option", { value: "" }, "Select slot"),
                            labSlots.map(t => {
                                const group = groupForLocalSlot(slots, t.id);
                                return React.createElement("option", { key: t.id, value: t.id }, `${t.day} · ${fmtTime(group?.slots[0]?.start || t.start)}–${fmtTime(group?.slots[group?.slots.length - 1]?.end || t.end)}`);
                            }))))),
                React.createElement("div", { className: "lab-batch-editor" }, rows.map(row => React.createElement("div", { key: row.batch, className: "lab-config-row editor-row" },
                    React.createElement("div", { className: "batch-pill" }, `Batch ${row.batch}`),
                    React.createElement("select", { value: row.subjectId, onChange: e => updateRow(row.batch, 'subjectId', e.target.value) },
                        React.createElement("option", { value: "" }, "Select lab subject"), subjects.map(x => React.createElement("option", { key: x.id, value: x.id }, `${x.code} · ${x.name}`))),
                    React.createElement("select", { value: row.facultyId, onChange: e => updateRow(row.batch, 'facultyId', e.target.value) },
                        React.createElement("option", { value: "" }, "Select professor"), data.faculty.map(f => React.createElement("option", { key: f.id, value: f.id }, f.name))),
                    React.createElement("select", { value: row.roomId, onChange: e => updateRow(row.batch, 'roomId', e.target.value) },
                        React.createElement("option", { value: "" }, "Select lab"), data.rooms.filter(r => r.type === 'Lab').map(r => React.createElement("option", { key: r.id, value: r.id }, r.name))))),
                React.createElement("div", { className: "notice info" }, "All three batches use the same 2-hour time window.")),
            React.createElement("div", { className: "modal-foot" },
                React.createElement("div", null, entries.length && React.createElement("button", { className: "btn danger", onClick: () => onDelete(entries.map(e => e.id)) }, "Delete lab slot")),
                React.createElement("div", { className: "actions" },
                    React.createElement("button", { className: "btn", onClick: onClose }, "Cancel"),
                    React.createElement("button", { className: "btn primary", onClick: save }, "Save lab slot")))));
}
function BreakModal({ data, afterSlot, onClose, onSave }) {
    const existing = data.breaks?.find(b => b.afterSlot === afterSlot) || { start: '', end: '' };
    const [start, setStart] = useState(existing.start);
    const [end, setEnd] = useState(existing.end);
    const save = () => { if (!start || !end || start >= end) return; onSave({ start, end }); };
    return React.createElement("div", { className: "modal-backdrop", onMouseDown: e => { if (e.target === e.currentTarget) onClose(); } }, React.createElement("div", { className: "modal" },
        React.createElement("div", { className: "modal-head" }, React.createElement("div", null, React.createElement("h3", null, `Edit Break ${afterSlot}`), React.createElement("p", null, `Break after Slot ${afterSlot}`)), React.createElement("button", { className: "icon-btn", onClick: onClose }, "×")),
        React.createElement("div", { className: "modal-body" }, React.createElement("div", { className: "form-grid" }, React.createElement("div", { className: "field" }, React.createElement("label", null, "Start time"), React.createElement("input", { type: "time", value: start, onChange: e => setStart(e.target.value) })), React.createElement("div", { className: "field" }, React.createElement("label", null, "End time"), React.createElement("input", { type: "time", value: end, onChange: e => setEnd(e.target.value) }))), React.createElement("div", { className: "notice info" }, "This changes the displayed break time. Keep it between the surrounding timetable slots.")),
        React.createElement("div", { className: "modal-foot" }, React.createElement("div"), React.createElement("div", { className: "actions" }, React.createElement("button", { className: "btn", onClick: onClose }, "Cancel"), React.createElement("button", { className: "btn primary", onClick: save }, "Save break")))));
}

function timeRangesOverlap(a, b) {
    return a && b && a.day === b.day && a.start < b.end && b.start < a.end;
}
function entryWindow(entry, data) {
    const slot = byId(data.timeSlots, entry.timeSlotId);
    if (!slot) return null;
    if (isLabEntry(entry) || entry.duration === 'slot') {
        const group = groupForLocalSlot(data.timeSlots, slot.id);
        return { day: slot.day, start: group?.slots[0]?.start || slot.start, end: group?.slots[group.slots.length - 1]?.end || slot.end };
    }
    return slot;
}
function validateEntry(candidate, data, ignoreId = null) {
    const errors = [];
    const special = isSpecialEntry(candidate);
    const subject = special ? null : byId(data.subjects, candidate.subjectId);
    const faculty = special ? null : byId(data.faculty, candidate.facultyId);
    const room = special ? null : byId(data.rooms, candidate.roomId);
    const info = entryAcademicInfo(candidate, data);
    const slot = byId(data.timeSlots, candidate.timeSlotId);
    if (!info.departmentId || !info.semester || !slot) return ['Department, semester and time slot are required.'];
    if (!special && (!subject || !faculty || !room)) return ['Complete all subject, faculty and room fields before saving.'];
    if (special && candidate.activityType === 'Other' && !candidate.activityName) return ['Activity name is required.'];
    const candidateWindow = entryWindow(candidate, data);
    const conflicts = data.timetable
        .filter(e => e.id !== ignoreId)
        .map(e => ({ entry: e, window: entryWindow(e, data), info: entryAcademicInfo(e, data), subject: byId(data.subjects, e.subjectId) }))
        .filter(x => x.window && timeRangesOverlap(candidateWindow, x.window));
    if (conflicts.some(x => x.entry.facultyId && faculty && x.entry.facultyId === candidate.facultyId))
        errors.push(`Faculty conflict: ${faculty.name} is already assigned during this time.`);
    if (conflicts.some(x => x.entry.roomId && room && x.entry.roomId === candidate.roomId))
        errors.push(`Room conflict: ${room.name} is already occupied during this time.`);
    const sameAcademic = x => x.info.departmentId === info.departmentId && String(x.info.semester) === String(info.semester);
    if (special) {
        if (conflicts.some(sameAcademic)) errors.push(`The semester already has an entry during this time.`);
        return errors;
    }
    if (isLabEntry(candidate)) {
        if (room.type !== 'Lab') errors.push('Lab entry must use a Lab room.');
        if (!BATCHES.includes(candidate.batch)) errors.push('Lab batch must be A, B or C.');
        if (conflicts.some(x => sameAcademic(x) && x.entry.batch === candidate.batch)) errors.push(`Lab batch conflict: Batch ${candidate.batch} already has a class during this time.`);
        if (conflicts.some(x => sameAcademic(x) && !isLabEntry(x.entry) && !isSpecialEntry(x.entry)))
            errors.push(`Semester conflict: a theory class is already scheduled during this time.`);
        if (conflicts.some(x => sameAcademic(x) && isSpecialEntry(x.entry)))
            errors.push(`Semester conflict: a special activity is already scheduled during this time.`);
    } else {
        if (room.type !== 'Classroom') errors.push('Lecture entry must use a Classroom.');
        if (conflicts.some(x => sameAcademic(x) && !isLabEntry(x.entry)))
            errors.push(`Semester conflict: another lecture or activity is already scheduled during this time.`);
        if (conflicts.some(x => sameAcademic(x) && isLabEntry(x.entry)))
            errors.push(`Semester conflict: a lab is already scheduled during this time.`);
    }
    return errors;
}
function saveEntry(patch, editingId, data, setData, notify, setModal) {
    const subject = byId(data.subjects, patch.subjectId);
    let normalizedPatch = { ...patch };
    if (isLabEntry(patch) || patch.duration === 'slot') {
        const slot = byId(data.timeSlots, patch.timeSlotId);
        const group = slot ? groupForLocalSlot(data.timeSlots, slot.id) : null;
        if (group?.slots?.[0]) normalizedPatch.timeSlotId = group.slots[0].id;
    }
    const candidate = { ...normalizedPatch, id: editingId || uid('e') };
    const errors = validateEntry(candidate, data, editingId);
    if (errors.length) return notify(errors[0], 'error');
    const next = clone(data);
    next.timetable = editingId ? next.timetable.map(e => e.id === editingId ? candidate : e) : [...next.timetable, candidate];
    setData(next);
    notify(editingId ? 'Timetable entry updated.' : 'Timetable entry added.');
    setModal(null);
}
function saveLabEntries(meta, rows, existingIds, data, setData, notify, setModal) {
    const slot = byId(data.timeSlots, meta.timeSlotId);
    const group = slot ? groupForLocalSlot(data.timeSlots, slot.id) : null;
    if (!group || group.slots.length < 2) return notify('A lab must occupy a complete two-period slot.', 'error');
    const first = group.slots[0];
    const normalizedRows = rows.map((r, i) => ({ ...r, id: existingIds[i] || uid('e'), departmentId: meta.departmentId, semester: meta.semester, timeSlotId: first.id }));
    const existingOther = data.timetable.filter(e => !existingIds.includes(e.id));
    let working = { ...clone(data), timetable: existingOther };
    for (const row of normalizedRows) {
        const candidate = { id: row.id, subjectId: row.subjectId, facultyId: row.facultyId, roomId: row.roomId,
            departmentId: row.departmentId, semester: row.semester, timeSlotId: row.timeSlotId, batch: row.batch, entryType: 'lab' };
        const errors = validateEntry(candidate, working, null);
        if (errors.length) return notify(`Batch ${row.batch}: ${errors[0]}`, 'error');
        working.timetable.push(candidate);
    }
    working.timetable = working.timetable.filter(e => !existingIds.includes(e.id) || normalizedRows.some(r => r.id === e.id));
    setData(working);
    notify(existingIds.length ? 'Full lab slot updated.' : 'Full lab slot added.');
    setModal(null);
}
function saveBreak(value, afterSlot, data, setData, notify, setModal) {
    if (!value.start || !value.end || value.start >= value.end) return notify('Break end time must be after the start time.', 'error');
    const next = clone(data);
    const item = next.breaks?.find(b => b.afterSlot === afterSlot);
    if (item) { item.start = value.start; item.end = value.end; }
    else { if (!Array.isArray(next.breaks)) next.breaks = []; next.breaks.push({ id: uid('b'), afterSlot, start: value.start, end: value.end, label: `Break ${afterSlot}` }); }
    setData(next); notify(`Break ${afterSlot} time updated.`); setModal(null);
}
function deleteLabEntries(ids, data, setData, notify, setModal) {
    if (!confirm('Delete all three batches from this lab slot?')) return;
    const next = clone(data);
    next.timetable = next.timetable.filter(e => !ids.includes(e.id));
    setData(next); notify('Full lab slot deleted.'); setModal(null);
}
function deleteEntry(id, data, setData, notify, setModal) {
    if (!confirm('Delete this timetable entry?')) return;
    const next = clone(data);
    next.timetable = next.timetable.filter(e => e.id !== id);
    setData(next); notify('Timetable entry deleted.'); setModal(null);
}
function Configuration({ data, user, section, setSection, updateCollection, notify }) {
    const sections = [['departments', 'Departments'], ['semesters', 'Semesters'], ['faculty', 'Faculty'], ['subjects', 'Subjects'], ['rooms', 'Rooms'], ['timeSlots', 'Time Slots']];
    const editable = section === 'departments'
        ? { title: 'Departments', fields: [['name', 'Department name'], ['code', 'Department code']] }
        : section === 'semesters'
            ? { title: 'Semesters', fields: [['name', 'Semester'], ['departmentId', 'Department']] }
            : section === 'faculty'
                ? { title: 'Faculty', fields: [['name', 'Faculty name']] }
                : section === 'subjects'
                    ? { title: 'Subjects', fields: [['name', 'Subject name'], ['code', 'Subject code'], ['departmentId', 'Department'], ['semester', 'Semester']] }
                    : section === 'rooms'
                        ? { title: 'Rooms', fields: [['name', 'Room name / number'], ['type', 'Type']] }
                        : { title: 'Time Slots', fields: [['day', 'Working day'], ['start', 'Start time'], ['end', 'End time']] };
    return React.createElement(React.Fragment, null,
        React.createElement("div", { className: "page-head" },
            React.createElement("div", null,
                React.createElement("h2", null, "Academic Configuration"),
                React.createElement("p", null, "Only data needed to create and validate timetables lives here."))),
        React.createElement("div", { className: "card filters" }, sections.map(([id, label]) => React.createElement("button", { key: id, className: `btn ${section === id ? 'primary' : ''}`, onClick: () => setSection(id) }, label))),
        React.createElement(ConfigTable, { data: data, user: user, section: section, config: editable, updateCollection: updateCollection, notify: notify }));
}
function TimeSlotsConfig({ data, updateCollection, notify }) {
    const items = data.timeSlots || [];
    const [edit, setEdit] = useState(null);

    const slotsForDay = day => items
        .filter(x => x.day === day)
        .sort((a, b) => a.start.localeCompare(b.start));

    const openAdd = day => setEdit({ id: uid('ts'), day, start: '', end: '' });
    const openEdit = item => setEdit(clone(item));

    const save = item => {
        if (!item.day || !item.start || !item.end)
            return notify('Day, start and end time are required.', 'error');
        if (item.start >= item.end)
            return notify('End time must be after the start time.', 'error');
        if (items.some(x => x.id !== item.id && x.day === item.day && x.start === item.start && x.end === item.end))
            return notify('A time slot with the same day and time already exists.', 'error');

        const exists = items.some(x => x.id === item.id);
        updateCollection('timeSlots', exists ? items.map(x => x.id === item.id ? item : x) : [...items, item]);
        setEdit(null);
        notify(exists ? 'Time slot updated.' : 'Time slot added.');
    };

    const remove = id => {
        if (data.timetable.some(e => e.timeSlotId === id))
            return notify('Cannot delete this time slot because a timetable entry still uses it.', 'error');
        if (!confirm('Delete this time slot?')) return;
        updateCollection('timeSlots', items.filter(x => x.id !== id));
        notify('Time slot deleted.');
    };

    const dayCards = DAYS.map(day => {
        const daySlots = slotsForDay(day);
        const slotItems = daySlots.length
            ? daySlots.map(slot => React.createElement('div', { className: 'time-slot-item', key: slot.id },
                React.createElement('span', { className: 'time-slot-time' }, `${slot.start}–${slot.end}`),
                React.createElement('div', { className: 'actions' },
                    React.createElement('button', { className: 'btn small', onClick: () => openEdit(slot) }, 'Edit'),
                    React.createElement('button', { className: 'btn small danger', onClick: () => remove(slot.id) }, 'Delete')
                )
            ))
            : React.createElement('div', { className: 'time-slot-empty' }, 'No slots added yet. Click + Add slot.');

        return React.createElement('section', { className: 'time-slot-day', key: day },
            React.createElement('div', { className: 'time-slot-day-head' },
                React.createElement('div', null,
                    React.createElement('h3', null, day),
                    React.createElement('span', null, `${daySlots.length} ${daySlots.length === 1 ? 'slot' : 'slots'}`)
                ),
                React.createElement('button', { className: 'btn small primary', onClick: () => openAdd(day) }, '+ Add slot')
            ),
            React.createElement('div', { className: 'time-slot-list' }, slotItems)
        );
    });

    const editor = edit ? React.createElement('div', { className: 'modal-body time-slot-modal', style: { paddingTop: 16 } },
        React.createElement('div', { className: 'time-slot-modal-head' },
            React.createElement('div', null,
                React.createElement('h3', null, items.some(x => x.id === edit.id) ? 'Edit time slot' : 'Add time slot'),
                React.createElement('p', null, 'Set the period for this day.')
            )
        ),
        React.createElement('div', { className: 'form-grid' },
            React.createElement('div', { className: 'field' },
                React.createElement('label', null, 'Day'),
                React.createElement('select', { value: edit.day, onChange: e => setEdit(v => ({ ...v, day: e.target.value })) },
                    DAYS.map(d => React.createElement('option', { key: d, value: d }, d))
                )
            ),
            React.createElement('div', { className: 'field' },
                React.createElement('label', null, 'Start time'),
                React.createElement('input', { type: 'time', value: edit.start, onChange: e => setEdit(v => ({ ...v, start: e.target.value })) })
            ),
            React.createElement('div', { className: 'field' },
                React.createElement('label', null, 'End time'),
                React.createElement('input', { type: 'time', value: edit.end, onChange: e => setEdit(v => ({ ...v, end: e.target.value })) })
            )
        ),
        React.createElement('div', { className: 'actions', style: { justifyContent: 'flex-end', marginTop: 16 } },
            React.createElement('button', { className: 'btn', onClick: () => setEdit(null) }, 'Cancel'),
            React.createElement('button', { className: 'btn primary', onClick: () => save(edit) }, 'Save slot')
        )
    ) : null;

    return React.createElement(React.Fragment, null,
        React.createElement('div', { className: 'page-head' },
            React.createElement('div', null,
                React.createElement('h2', null, 'Time Slots'),
                React.createElement('p', null, 'Choose a day and add the periods used by your college timetable.')
            )
        ),
        editor,
        React.createElement('div', { className: 'time-slot-days' }, dayCards)
    );
}
function ConfigTable({ data, user, section, config, updateCollection, notify }) {
    if (section === 'timeSlots') return React.createElement(TimeSlotsConfig, { data, updateCollection, notify });
    const items = data[section];
    const [edit, setEdit] = useState(null);
    const blank = () => { const x = { id: uid(section.slice(0, 2)) }; config.fields.forEach(([k]) => x[k] = k === 'type' ? (section === 'subjects' ? 'Theory' : section === 'rooms' ? 'Classroom' : '') : k === 'day' ? 'Monday' : ''); return x; };
    const save = (item) => {
        if (!item.name && section !== 'timeSlots')
            return notify('Name is required.', 'error');
        if (section === 'departments' && (!item.code))
            return notify('Department code is required.', 'error');
        if (section === 'semesters' && (!item.name || !item.departmentId))
            return notify('Semester and department are required.', 'error');
        if (section === 'semesters' && items.some(x => x.id !== item.id && x.departmentId === item.departmentId && String(x.name) === String(item.name)))
            return notify('That semester already exists for this department.', 'error');
        if (section === 'subjects' && (!item.code || !item.departmentId || !item.semester))
            return notify('Subject code, department and semester are required.', 'error');
        if (section === 'rooms' && !item.type)
            return notify('Room type is required.', 'error');
        if (section === 'timeSlots' && (!item.day || !item.start || !item.end))
            return notify('Day, start and end time are required.', 'error');
        if (section === 'timeSlots' && item.start >= item.end)
            return notify('End time must be after start time.', 'error');
        if (section === 'timeSlots' && items.some(x =>
            x.id !== item.id &&
            x.day === item.day &&
            x.start === item.start &&
            x.end === item.end
        ))
            return notify('A time slot with the same day and time already exists.', 'error');
        // A new form item already has an id, so checking edit?.id incorrectly
        // treated every new record as an edit. Determine whether this exact id
        // already exists in the collection instead.
        const isExisting = items.some(x => x.id === item.id);
        const next = isExisting
            ? items.map(x => x.id === item.id ? item : x)
            : [...items, item];
        updateCollection(section, next);
        setEdit(null);
        notify(isExisting ? 'Configuration updated.' : 'Configuration added.');
    };
    const remove = (id) => {
        const referenced = section === 'faculty'
            ? data.timetable.some(e => e.facultyId === id)
            : section === 'subjects'
                ? data.timetable.some(e => e.subjectId === id)
                : section === 'semesters'
                    ? data.subjects.some(s => s.departmentId === byId(data.semesters, id)?.departmentId && String(s.semester) === String(byId(data.semesters, id)?.name))
                    : section === 'rooms'
                        ? data.timetable.some(e => e.roomId === id)
                        : section === 'timeSlots'
                            ? data.timetable.some(e => e.timeSlotId === id)
                            : false;
        if (referenced)
            return notify('Cannot delete this item because timetable or academic data still references it.', 'error');
        if (section === 'departments') {
            const used = data.subjects.some(s => s.departmentId === id) || (data.semesters || []).some(v => v.departmentId === id) ||
                data.timetable.some(e => entryAcademicInfo(e, data).departmentId === id);
            if (used) return notify('Cannot delete a department that is still used by semesters, subjects or timetable entries.', 'error');
        }
        if (!confirm('Delete this configuration item?')) return;
        updateCollection(section, items.filter(x => x.id !== id));
        notify('Configuration item deleted.');
    };
    const value = (item, k) => k === 'departmentId' ? byId(data.departments, item[k])?.code || '' : k === 'type' ? item[k] : k === 'semester' ? `Sem ${item[k]}` : k === 'day' ? `${item.day} · ${item.start}–${item.end}` : item[k];
    const displayFields = config.fields.map(([k, l]) => k);
    return React.createElement("div", { className: "card" },
        React.createElement("div", { className: "section-head", style: { padding: '16px 16px 0' } },
            React.createElement("div", null,
                React.createElement("h3", null, config.title),
                React.createElement("p", { style: { margin: '4px 0 0', fontSize: 10, color: 'var(--muted)' } },
                    items.length,
                    " records")),
            React.createElement("button", { className: "btn primary", onClick: () => setEdit(blank()) }, "+ Add")),
        edit && React.createElement("div", { className: "modal-body", style: { paddingTop: 16 } },
            React.createElement("div", { className: "form-grid" }, config.fields.map(([k, label]) => React.createElement(ConfigField, { key: k, k: k, label: label, value: edit[k], item: edit, onChange: v => setEdit(e => {
                if (k === 'departmentId' && section === 'subjects') {
                    const firstSem = (data.semesters || []).find(x => x.departmentId === v)?.name || '';
                    return { ...e, departmentId: v, semester: String(firstSem) };
                }
                return { ...e, [k]: v };
            }), data: data, section: section }))),
            React.createElement("div", { className: "actions", style: { justifyContent: 'flex-end', marginTop: 16 } },
                React.createElement("button", { className: "btn", onClick: () => setEdit(null) }, "Cancel"),
                React.createElement("button", { className: "btn primary", onClick: () => save(edit) }, "Save"))),
        React.createElement("div", { className: "table-wrap" },
            React.createElement("table", { className: "data-table" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        config.fields.map(([k, l]) => React.createElement("th", { key: k }, l)),
                        React.createElement("th", null, "Actions"))),
                React.createElement("tbody", null, items.length ? items.map(item => React.createElement("tr", { key: item.id },
                    displayFields.map(k => React.createElement("td", { key: k }, k === 'type' ? React.createElement("span", { className: `tag ${String(item[k]).toLowerCase()}` }, item[k]) : value(item, k))),
                    React.createElement("td", null,
                        React.createElement("div", { className: "actions" },
                            React.createElement("button", { className: "btn small", onClick: () => setEdit(clone(item)) }, "Edit"),
                            React.createElement("button", { className: "btn small danger", onClick: () => remove(item.id) }, "Delete"))))) : React.createElement("tr", null,
                    React.createElement("td", { colSpan: displayFields.length + 1 },
                        React.createElement("div", { className: "empty" },
                            React.createElement("strong", null, "No records"),
                            "Add the first ",
                            config.title.toLowerCase().slice(0, -1),
                            ".")))))));
}
function ConfigField({ k, label, value, item, onChange, data, section }) {
    if (k === 'departmentId')
        return React.createElement("div", { className: "field" },
            React.createElement("label", null, label),
            React.createElement("select", { value: value, onChange: e => onChange(e.target.value) },
                React.createElement("option", { value: "" }, "Select department"),
                data.departments.map(d => React.createElement("option", { key: d.id, value: d.id }, d.code, " · ", d.name))));
    if (k === 'semester')
        return React.createElement("div", { className: "field" },
            React.createElement("label", null, label),
            React.createElement("select", { value: value, onChange: e => onChange(e.target.value) },
                React.createElement("option", { value: "" }, "Select semester"),
                (data.semesters || []).filter(x => !item?.departmentId || x.departmentId === item.departmentId)
                    .map(x => React.createElement("option", { key: x.id, value: String(x.name) }, `Sem ${x.name}`))));
    if (k === 'type')
        return React.createElement("div", { className: "field" },
            React.createElement("label", null, label),
            React.createElement("select", { value: value, onChange: e => onChange(e.target.value) },
                section === 'rooms'
                    ? React.createElement(React.Fragment, null,
                        React.createElement("option", { value: "Classroom" }, "Classroom"),
                        React.createElement("option", { value: "Lab" }, "Lab"))
                    : React.createElement(React.Fragment, null,
                        React.createElement("option", { value: "Theory" }, "Theory"),
                        React.createElement("option", { value: "Lab" }, "Lab"))));
    if (k === 'day')
        return React.createElement("div", { className: "field" },
            React.createElement("label", null, label),
            React.createElement("select", { value: value, onChange: e => onChange(e.target.value) },
                DAYS.map(d => React.createElement("option", { key: d }, d))));
    return React.createElement("div", { className: "field" },
        React.createElement("label", null, label),
        React.createElement("input", { type: k === 'email' ? 'email' : 'text', value: value, onChange: e => onChange(e.target.value) }));
}
function UsersPage() { return React.createElement(React.Fragment, null,
    React.createElement("div", { className: "page-head" },
        React.createElement("div", null,
            React.createElement("h2", null, "Demo Users"),
            React.createElement("p", null, "Simple client-side authentication for academic demonstration. Passwords are intentionally visible because this is not a security system."))),
    React.createElement("div", { className: "card table-wrap" },
        React.createElement("table", { className: "data-table" },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "Role"),
                    React.createElement("th", null, "Name"),
                    React.createElement("th", null, "Username"),
                    React.createElement("th", null, "Password"),
                    React.createElement("th", null, "Scope"))),
            React.createElement("tbody", null, DEMO_USERS.map(u => React.createElement("tr", { key: u.id },
                React.createElement("td", null,
                    React.createElement("span", { className: "tag" }, u.role)),
                React.createElement("td", null, u.name),
                React.createElement("td", null,
                    React.createElement("code", null, u.username)),
                React.createElement("td", null,
                    React.createElement("code", null, u.password)),
                React.createElement("td", null, u.departmentId ? 'Department-scoped' : 'Full access'))))))); }
function generatePDF(data, user, filters, entries) {
    if (!window.jspdf?.jsPDF)
        return alert('PDF library did not load. Check your internet connection and reload the page.');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const isFaculty = user.role === 'Faculty';
    const dept = byId(data.departments, filters.departmentId);
    const semester = filters.semester;
    const facultyOwn = isFaculty ? byId(data.faculty, user.facultyId) : null;
    const NAVY = [30, 58, 95], STRIP = [238, 242, 247], LINE = [207, 216, 227], REC = [229, 233, 239], INK = [31, 41, 55];
    const TINTS = [[219, 234, 254], [252, 231, 243], [220, 252, 231], [254, 243, 199], [237, 233, 254], [204, 251, 241], [254, 226, 226], [224, 242, 254]];
    const tintOf = s => TINTS[Math.max(0, data.subjects.findIndex(x => x.id === s?.id)) % TINTS.length];
    const M = 10, W = 277;
    const fit = (text, w) => {
        let t = String(text || '');
        if (doc.getTextWidth(t) <= w) return t;
        while (t.length > 1 && doc.getTextWidth(t + '…') > w) t = t.slice(0, -1);
        return t + '…';
    };
    doc.setFillColor(...NAVY); doc.rect(M, M, W, 14, 'F');
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
    doc.text(data.collegeName, M + W / 2, M + 6, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    doc.text(isFaculty ? 'Faculty Time Table' : 'Time Table', M + W / 2, M + 11.5, { align: 'center' });
    doc.setFillColor(...STRIP); doc.setDrawColor(...LINE); doc.rect(M, M + 14, W, 8, 'FD');
    doc.setTextColor(...INK); doc.setFontSize(9);
    const info = isFaculty
        ? [`Faculty: ${facultyOwn?.name || '-'}`]
        : [`Branch: ${dept?.name || '-'}`, `Semester: ${semester || '-'}`];
    info.forEach((t, i) => doc.text(t, M + W * (i + 0.5) / info.length, M + 19.2, { align: 'center' }));

    const days = DAYS.filter(d => data.timeSlots.some(t => t.day === d));
    if (!days.length) { doc.save('timetable.pdf'); return; }
    const groupsByDay = Object.fromEntries(days.map(d => [d, buildSlotGroups(data.timeSlots.filter(t => t.day === d))]));
    const groups = groupsByDay[days[0]] || [];
    const timeW = 26, dayW = (W - timeW) / days.length, top = M + 26, headH = 8;
    const breakH = 6, nBreaks = Math.max(0, groups.length - 1);
    const avail = 210 - M - 8 - top - headH - nBreaks * breakH;
    const ph = Math.max(10, Math.min(20, avail / Math.max(1, groups.length * 2)));
    const fs = ph >= 15 ? 8 : 7;
    doc.setFillColor(...NAVY); doc.setDrawColor(...LINE); doc.rect(M, top, timeW, headH, 'FD');
    days.forEach((d, i) => {
        const x = M + timeW + i * dayW;
        doc.setFillColor(...NAVY); doc.setTextColor(255, 255, 255); doc.rect(x, top, dayW, headH, 'FD');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text(d, x + dayW / 2, top + 5.3, { align: 'center' });
    });
    const box = (x, y, w, h, tint) => { if (tint) { doc.setFillColor(...tint); doc.rect(x, y, w, h, 'FD'); } else doc.rect(x, y, w, h, 'S'); };
    const lines = (x, y, w, h, arr) => {
        doc.setTextColor(...INK);
        const lh = fs * 0.42 + 0.6, n = arr.length, startY = y + (h - n * lh) / 2 + lh * 0.78;
        arr.forEach((l, i) => { doc.setFont('helvetica', i === 0 ? 'bold' : 'normal'); doc.setFontSize(i === 0 ? fs + 0.5 : fs - 0.5); doc.text(fit(l, w - 2), x + w / 2, startY + i * lh, { align: 'center' }); });
    };
    const lectureCell = (x, y, w, h, list) => {
        if (!list.length) return box(x, y, w, h);
        const hh = h / list.length;
        list.forEach((e, i) => {
            if (isSpecialEntry(e)) {
                box(x, y + i * hh, w, hh, [245, 243, 255]);
                lines(x, y + i * hh, w, hh, [specialLabel(e)]);
                return;
            }
            const subj = byId(data.subjects, e.subjectId);
            const r = byId(data.rooms, e.roomId);
            box(x, y + i * hh, w, hh, tintOf(subj));
            if (isFaculty) {
                const info = entryAcademicInfo(e, data);
                const deptCode = byId(data.departments, info.departmentId)?.code || 'Department';
                lines(x, y + i * hh, w, hh, [
                    `${subj?.code || subj?.name || ''}`,
                    `${deptCode} · Sem ${info.semester || ''}`,
                    `${r?.name || ''}`
                ]);
            } else {
                lines(x, y + i * hh, w, hh, [
                    `${subj?.code || subj?.name || ''}`,
                    byId(data.faculty, e.facultyId)?.name || '',
                    r?.name || ''
                ]);
            }
        });
    };
    const labCell = (x, y, w, h, labs) => {
        box(x, y, w, h);
        const rh = (h - 2) / labs.length;
        labs.forEach((e, i) => {
            const subj = byId(data.subjects, e.subjectId), f = byId(data.faculty, e.facultyId), r = byId(data.rooms, e.roomId);
            const by = y + 1 + i * rh;
            doc.setFillColor(...tintOf(subj)); doc.roundedRect(x + 1, by + 0.3, w - 2, rh - 0.6, 0.8, 0.8, 'F');
            const info = entryAcademicInfo(e, data);
            const deptCode = byId(data.departments, info.departmentId)?.code || 'Department';
            const head = `${e.batch ? e.batch + ' – ' : ''}${subj?.code || subj?.name || ''}`;
            const tail = isFaculty ? `${deptCode} · Sem ${info.semester || ''} · ${r?.name || ''}` : `${f?.name || ''} · ${r?.name || ''}`;
            doc.setTextColor(...INK); doc.setFont('helvetica', 'bold'); doc.setFontSize(fs - 0.5);
            if (rh >= 9) {
                doc.text(fit(head, w - 3), x + w / 2, by + rh / 2 - 0.4, { align: 'center' });
                doc.setFont('helvetica', 'normal'); doc.text(fit(tail, w - 3), x + w / 2, by + rh / 2 + 2.6, { align: 'center' });
            } else doc.text(fit(`${head} ${tail}`, w - 3), x + w / 2, by + rh / 2 + 1, { align: 'center' });
        });
    };
    const specialCell = (x, y, w, h, e) => {
        box(x, y, w, h, [245, 243, 255]);
        lines(x, y, w, h, [specialLabel(e)]);
    };
    let y = top + headH;
    groups.forEach((g0, gi) => {
        const p0 = g0.slots[0], p1 = g0.slots[1];
        [p0, p1].forEach((p, pi) => {
            if (!p) return;
            doc.setDrawColor(...LINE); doc.setFillColor(...STRIP); doc.rect(M, y + pi * ph, timeW, ph, 'FD');
            doc.setTextColor(...INK); doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5);
            doc.text(`${fmtTime(p.start)}–${fmtTime(p.end)}`, M + timeW / 2, y + pi * ph + ph / 2 + 1, { align: 'center' });
        });
        days.forEach((d, di) => {
            const dg = groupsByDay[d]?.[gi] || g0, x = M + timeW + di * dayW;
            const inGroup = entries.filter(e => {
                const slot = byId(data.timeSlots, e.timeSlotId);
                if (!slot || slot.day !== d) return false;
                if (dg.slots.some(z => z.id === slot.id)) return true;
                const w = entryWindow(e, data);
                const gs = dg.slots[0]?.start, ge = dg.slots[dg.slots.length - 1]?.end;
                return w && gs && ge && timeRangesOverlap({ start: gs, end: ge }, w);
            });
            const fullSpecial = inGroup.find(e => isSpecialEntry(e) && e.duration === 'slot');
            const labs = inGroup.filter(e => isLabEntry(e));
            if (fullSpecial) specialCell(x, y, dayW, ph * 2, fullSpecial);
            else if (labs.length) labCell(x, y, dayW, ph * 2, labs);
            else dg.slots.forEach((slot, si) => lectureCell(x, y + si * ph, dayW, ph, inGroup.filter(e => e.timeSlotId === slot.id)));
        });
        y += ph * 2;
        if (gi < groups.length - 1) {
            const b = data.breaks?.find(b => b.afterSlot === (gi + 1) * 2);
            doc.setFillColor(...REC); doc.setDrawColor(...LINE); doc.rect(M, y, W, breakH, 'FD');
            doc.setTextColor(85, 85, 85); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
            doc.text(b ? `Break ${fmtTime(b.start)}–${fmtTime(b.end)}` : 'Break', M + W / 2, y + 4.1, { align: 'center' });
            y += breakH;
        }
    });
    doc.setFontSize(7); doc.setTextColor(120); doc.text(`Generated locally · ${new Date().toLocaleString()}`, M, 205);
    const fname = isFaculty ? (facultyOwn?.name || 'faculty').replace(/[^a-z0-9]+/gi, '-') : `${dept?.code || 'college'}-semester-${semester}`;
    doc.save(`${fname}-timetable.pdf`);
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App, null));
