/**
 * islamia-college-assignment-cover-generator
 * js/app.js — ফর্ম, লাইভ প্রিভিউ ও পিডিএফ/প্রিন্ট নিয়ন্ত্রণ।
 *
 * কোনো ব্যাকএন্ড নেই: শিক্ষার্থীর দেওয়া তথ্য ব্রাউজারেই থাকে, কোথাও পাঠানো হয় না।
 */
(function (root, document) {
  'use strict';

  var DATA = root.ISLAMIA_COLLEGE || {};
  var INSTITUTION = DATA.institution || {};
  var COURSES = DATA.courses || [];
  var TEACHERS = DATA.teachers || [];

  var BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  var BN_MONTHS = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  var DOTS_LONG = '………………………………';
  var DOTS_MID = '…………………';
  var DOTS_SHORT = '……………';

  var els = {};
  var natural = { width: 0, height: 0 };

  /* ---------------- সহায়ক ফাংশন ---------------- */

  /** ইংরেজি সংখ্যা → বাংলা সংখ্যা (বাংলা সংখ্যা থাকলে অক্ষুণ্ণ থাকে)। */
  function toBengaliDigits(value) {
    return String(value == null ? '' : value).replace(/[0-9]/g, function (d) {
      return BN_DIGITS[parseInt(d, 10)];
    });
  }

  function trim(value) {
    return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
  }

  /** 'YYYY-MM-DD' → '১৬ নভেম্বর, ২০২৫' */
  function bengaliDate(isoValue) {
    var raw = trim(isoValue);
    if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(raw)) return '';
    var parts = raw.split('-');
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var day = parseInt(parts[2], 10);
    if (!year || month < 1 || month > 12 || day < 1 || day > 31) return '';
    return toBengaliDigits(day) + ' ' + BN_MONTHS[month - 1] + ', ' + toBengaliDigits(year);
  }

  function addOption(select, value, label) {
    var option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  }

  function findCourseById(id) {
    for (var i = 0; i < COURSES.length; i++) {
      if (COURSES[i].id === id) return COURSES[i];
    }
    return null;
  }

  function findCourseByCode(code) {
    for (var i = 0; i < COURSES.length; i++) {
      if (COURSES[i].code === code) return COURSES[i];
    }
    return null;
  }

  function findTeacher(id) {
    for (var i = 0; i < TEACHERS.length; i++) {
      if (TEACHERS[i].id === id) return TEACHERS[i];
    }
    return null;
  }

  function setText(el, text, fallbackDots) {
    if (!el) return;
    var value = trim(text);
    el.textContent = value;
    if (!value && fallbackDots) {
      var span = document.createElement('span');
      span.className = 'placeholder';
      span.textContent = fallbackDots;
      el.appendChild(span);
    }
  }

  function setHint(el, message, isWarning) {
    if (!el) return;
    el.textContent = message;
    el.classList.toggle('is-warn', Boolean(isWarning));
  }

  /* ---------------- ড্রপডাউন পূরণ ---------------- */

  function buildSelects() {
    var i;


    if (els.courseName) {
      for (i = 0; i < COURSES.length; i++) {
        addOption(els.courseName, COURSES[i].id, COURSES[i].name);
      }
      if (COURSES.length) els.courseName.value = COURSES[0].id;
    }

    if (els.courseCode) {
      for (i = 0; i < COURSES.length; i++) {
        addOption(els.courseCode, COURSES[i].code, toBengaliDigits(COURSES[i].code));
      }
      if (COURSES.length) els.courseCode.value = COURSES[0].code;
    }

    if (els.teacher) {
      for (i = 0; i < TEACHERS.length; i++) {
        addOption(
          els.teacher,
          TEACHERS[i].id,
          TEACHERS[i].name + (TEACHERS[i].designation ? ' (' + TEACHERS[i].designation + ')' : '')
        );
      }
      if (TEACHERS.length) els.teacher.value = TEACHERS[0].id;
    }
  }

  /** নাম → কোড এবং কোড → নাম — দুই দিকের সম্পর্ক বজায় রাখে। */
  function syncFromCourseName() {
    var course = findCourseById(els.courseName.value);
    if (course && els.courseCode.value !== course.code) els.courseCode.value = course.code;
  }

  function syncFromCourseCode() {
    var course = findCourseByCode(els.courseCode.value);
    if (course && els.courseName.value !== course.id) els.courseName.value = course.id;
  }

  /* ---------------- লাইভ প্রিভিউ ---------------- */

  function render() {
    var subject = trim(els.subject.value);
    var course = findCourseById(els.courseName.value) || findCourseByCode(els.courseCode.value);
    var teacher = findTeacher(els.teacher.value);
    var studentName = trim(els.studentName.value);
    var roll = toBengaliDigits(trim(els.studentRoll.value));
    var date = bengaliDate(els.submitDate.value);

    setText(els.outCollege, INSTITUTION.name, '');
    setText(els.outLocation, INSTITUTION.location, '');
    setText(els.outDepartment, INSTITUTION.department, '');
    setText(els.outYear, INSTITUTION.year, '');
    setText(els.outSession, INSTITUTION.session, '');

    setText(els.outSubject, subject, DOTS_LONG);
    setText(els.outCourse, course ? course.name : '', DOTS_LONG);
    setText(els.outCode, course ? toBengaliDigits(course.code) : '', DOTS_SHORT);

    /* নির্দেশনায় — শিক্ষকের নাম তালিকায় যা আছে সেটিই বসে। */
    setText(els.outTeacher, teacher ? teacher.name : '', DOTS_MID);

    /* সম্পাদনায় — শিক্ষার্থীর তথ্য। */
    setText(els.outStudent, studentName, DOTS_LONG);
    setText(els.outRoll, roll, DOTS_SHORT);
    setText(els.outStudentDepartment, INSTITUTION.department, '');
    setText(els.outStudentYear, INSTITUTION.year, '');
    setText(els.outDate, date, DOTS_SHORT);

    validate({ quiet: !state.touched });
  }

  /* ---------------- যাচাই (সাধারণ নির্দেশনা) ---------------- */

  var BN_AND_BASIC = /^[\u0980-\u09FF0-9A-Za-z\s.।,\-'’"()/]+$/;
  var state = { touched: false };

  function validate(options) {
    var opts = options || {};
    var nameValue = trim(els.studentName.value);
    var rollValue = trim(els.studentRoll.value);
    var subjectValue = trim(els.subject.value);
    var problems = [];

    /* বিষয়ের নাম বাধ্যতামূলক — না লিখলে প্রিন্ট/পিডিএফ হবে না। */
    if (!subjectValue) {
      setHint(els.subjectHint, 'অনুগ্রহ করে অ্যাসাইনমেন্টের বিষয় লিখুন।', true);
      problems.push('subject');
    } else {
      setHint(els.subjectHint, 'বিষয়ের নাম লিখুন — এটি কভার পেজে বসবে।', false);
    }

    if (!nameValue) {
      setHint(els.nameHint, 'শিক্ষার্থীর পূর্ণ নাম লিখুন — এটি কভার পেজে বসবে।', !opts.quiet);
      problems.push('name');
    } else if (!BN_AND_BASIC.test(nameValue)) {
      setHint(els.nameHint, 'নামে অস্বাভাবিক চিহ্ন আছে; বাংলা অক্ষরে লিখলে সবচেয়ে ভালো দেখাবে।', true);
      problems.push('name');
    } else if (/[A-Za-z]/.test(nameValue)) {
      setHint(els.nameHint, 'ইংরেজি অক্ষরের বদলে বাংলা অক্ষরে লিখলে কভার পেজের সাথে মিলবে।', true);
    } else {
      setHint(els.nameHint, 'বাংলা অক্ষর, যুক্তাক্ষর, কার-ফলা ও বাংলা সংখ্যা — সবই ঠিকমতো দেখানো হবে।', false);
    }

    if (!rollValue) {
      setHint(els.rollHint, 'রোল নম্বর দিন — বাংলা বা ইংরেজি সংখ্যা দুটোই গ্রহণযোগ্য।', !opts.quiet);
      problems.push('roll');
    } else if (!/[0-9\u09E6-\u09EF]/.test(rollValue)) {
      setHint(els.rollHint, 'রোল নম্বরে কমপক্ষে একটি সংখ্যা থাকতে হবে।', true);
      problems.push('roll');
    } else if (/[A-Za-z\u0980-\u09FF]/.test(rollValue.replace(/[0-9\u09E6-\u09EF\s-]/g, ''))) {
      setHint(els.rollHint, 'রোল নম্বরে সাধারণত শুধু সংখ্যা ব্যবহার হয়।', true);
    } else {
      setHint(els.rollHint, 'কভার পেজে রোল নম্বর বাংলা সংখ্যায় দেখানো হবে।', false);
    }

    if (!trim(els.submitDate.value)) {
      setHint(els.dateHint, 'জমা দেওয়ার তারিখ বেছে নিন।', !opts.quiet);
      problems.push('date');
    } else if (!bengaliDate(els.submitDate.value)) {
      setHint(els.dateHint, 'তারিখটি ঠিকমতো নেই; ক্যালেন্ডার থেকে আবার বেছে নিন।', true);
      problems.push('date');
    } else {
      setHint(els.dateHint, 'কভার পেজে তারিখ বাংলা সংখ্যায় লেখা হবে।', false);
    }

    if (els.printBtn) els.printBtn.classList.toggle('is-incomplete', problems.length > 0);
    return problems;
  }

  /* ---------------- প্রিভিউ স্কেল (মোবাইলে ফিট) ---------------- */

  function measureNatural() {
    if (!els.scaler || !els.cover) return;
    var previous = els.scaler.style.transform;
    els.scaler.style.transform = 'none';
    natural.width = els.cover.offsetWidth || natural.width;
    natural.height = els.cover.offsetHeight || natural.height;
    els.scaler.style.transform = previous;
  }

  function fitPreview() {
    if (!els.scaler || !els.stage) return;
    if (!natural.width) measureNatural();
    if (!natural.width) return;

    var styles = window.getComputedStyle(els.stage);
    var padLeft = parseFloat(styles.paddingLeft) || 0;
    var padRight = parseFloat(styles.paddingRight) || 0;
    var padTop = parseFloat(styles.paddingTop) || 0;
    var padBottom = parseFloat(styles.paddingBottom) || 0;

    var available = els.stage.clientWidth - padLeft - padRight;
    var scale = Math.max(0.05, Math.min(1, available / natural.width));
    var leftover = Math.max(0, available - natural.width * scale);

    els.scaler.style.transform = 'scale(' + scale + ')';
    els.scaler.style.marginLeft = Math.round(leftover / 2) + 'px';
    els.stage.style.height = Math.ceil(natural.height * scale + padTop + padBottom) + 'px';
  }

  /* ---------------- প্রিন্ট / পিডিএফ ---------------- */

  /** ফন্ট ও লোগো প্রস্তুত হলে তবেই ছাপা হয় — বাংলা লেখা যেন কেটে না যায়। */
  function waitForAssets() {
    var fontsReady = (document.fonts && document.fonts.ready)
      ? document.fonts.ready
      : Promise.resolve();

    var timeout = new Promise(function (resolve) {
      window.setTimeout(resolve, 1200);
    });

    var images = [].slice.call(document.querySelectorAll('img'));
    var imagesReady = Promise.all(images.map(function (img) {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      if (img.decode) return img.decode().catch(function () {});
      return new Promise(function (resolve) {
        img.addEventListener('load', resolve);
        img.addEventListener('error', resolve);
      });
    }));

    return Promise.race([
      Promise.all([fontsReady, imagesReady]),
      timeout
    ]);
  }

  function suggestedTitle() {
    var course = findCourseById(els.courseName.value);
    var name = trim(els.studentName.value);
    var pieces = ['অ্যাসাইনমেন্ট'];
    if (name) pieces.push(name);
    if (course) pieces.push(toBengaliDigits(course.code));
    return pieces.join(' - ');
  }

  function openPrintDialog() {
    var originalTitle = document.title;

    waitForAssets().then(function () {
      document.title = suggestedTitle();
      window.print();
    }).catch(function () {
      window.print();
    });

    var restore = function () {
      document.title = originalTitle;
      window.removeEventListener('afterprint', restore);
    };
    window.addEventListener('afterprint', restore);
    window.setTimeout(restore, 60000);
  }

  /* ---------------- সূচনা ---------------- */

  function init() {
    var $ = function (id) { return document.getElementById(id); };

    els.form = $('assignment-form');
    els.subject = $('subject');
    els.courseName = $('course-name');
    els.courseCode = $('course-code');
    els.teacher = $('teacher');
    els.studentName = $('student-name');
    els.studentRoll = $('student-roll');
    els.submitDate = $('submit-date');

    els.subjectHint = $('subject-hint');
    els.nameHint = $('name-hint');
    els.rollHint = $('roll-hint');
    els.dateHint = $('date-hint');

    els.printBtn = $('print-btn');
    els.stage = $('preview-stage');
    els.scaler = $('preview-scaler');
    els.cover = $('cover');

    els.outCollege = $('out-college');
    els.outLocation = $('out-location');
    els.outDepartment = $('out-department');
    els.outYear = $('out-year');
    els.outSession = $('out-session');
    els.outSubject = $('out-subject');
    els.outCourse = $('out-course');
    els.outCode = $('out-code');
    els.outTeacher = $('out-teacher');
    els.outStudent = $('out-student');
    els.outRoll = $('out-roll');
    els.outStudentDepartment = $('out-student-department');
    els.outStudentYear = $('out-student-year');
    els.outDate = $('out-date');

    if (!els.form || !DATA) return;

    buildSelects();

    [els.subject, els.courseName, els.courseCode, els.teacher,
      els.studentName, els.studentRoll, els.submitDate].forEach(function (el) {
        if (!el) return;
        el.addEventListener('input', function () {
          if (el === els.courseName) syncFromCourseName();
          if (el === els.courseCode) syncFromCourseCode();
          state.touched = true;
          render();
        });
        el.addEventListener('change', function () {
          if (el === els.courseName) syncFromCourseName();
          if (el === els.courseCode) syncFromCourseCode();
          state.touched = true;
          render();
        });
      });

    els.form.addEventListener('submit', function (event) {
      event.preventDefault();
      state.touched = true;
      var problems = validate({ quiet: false });

      /* বিষয় লেখা না থাকলে প্রিন্ট ডায়ালগ খুলবে না — ঘরে ফোকাস হবে। */
      if (problems.indexOf('subject') !== -1) {
        if (els.subject) {
          if (els.subject.scrollIntoView) {
            els.subject.scrollIntoView({ block: 'center', behavior: 'smooth' });
          }
          els.subject.focus();
        }
        return;
      }

      if (problems.length && document.activeElement) document.activeElement.blur();
      openPrintDialog();
    });

    window.addEventListener('resize', fitPreview);
    window.addEventListener('orientationchange', function () {
      window.setTimeout(function () {
        measureNatural();
        fitPreview();
      }, 250);
    });

    if (window.ResizeObserver && els.stage) {
      try {
        new window.ResizeObserver(fitPreview).observe(els.stage);
      } catch (error) { /* পুরোনো ব্রাউজার — resize ইভেন্টই যথেষ্ট */ }
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        measureNatural();
        fitPreview();
      });
    }

    measureNatural();
    fitPreview();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window, document);
