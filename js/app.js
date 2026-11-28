/**
 * islamia-college-assignment-cover-generator
 * js/app.js — ফর্ম, লাইভ প্রিভিউ ও পিডিএফ/প্রিন্ট নিয়ন্ত্রণ।
 *
 * কোনো ব্যাকএন্ড নেই: শিক্ষার্থীর দেওয়া তথ্য ব্রাউজারেই থাকে, কোথাও পাঠানো হয় না।
 * সকল বিভাগের জন্য উন্মুক্ত — কোনো বিভাগ/বর্ষ/শিক্ষক/কোর্স হার্ডকোড করা নেই।
 */
(function (root, document) {
  'use strict';

  var DATA = root.ISLAMIA_COLLEGE || {};
  var INSTITUTION = DATA.institution || {};

  var BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  var BN_MONTHS = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  var DOTS_LONG = '………………………………';
  var DOTS_MID = '…………………………';
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

  /**
   * একটি আউটপুট এলিমেন্টে টেক্সট বসায়।
   * - value থাকলে সরাসরি বসায়।
   * - value না থাকলে fallbackDots দিয়ে প্লেসহোল্ডার দেখায়।
   * - fallbackDots না দিলে (empty string '') এলিমেন্টটি ফাঁকা রাখা হয় (লাইন দেখা যাবে না)।
   */
  function setText(el, text, fallbackDots) {
    if (!el) return;
    var value = trim(text);
    el.textContent = '';
    el.classList.remove('is-empty');
    if (value) {
      el.appendChild(document.createTextNode(value));
    } else if (fallbackDots) {
      var span = document.createElement('span');
      span.className = 'placeholder';
      span.textContent = fallbackDots;
      el.appendChild(span);
    } else {
      el.classList.add('is-empty');
    }
  }

  function setHint(el, message, isWarning) {
    if (!el) return;
    el.textContent = message;
    el.classList.toggle('is-warn', Boolean(isWarning));
  }

  /** বর্ষ ও শিক্ষাবর্ষ একসাথে যুক্ত করে একটি লাইন তৈরি করে। */
  function formatYearSession(year, session) {
    var y = trim(year);
    var s = toBengaliDigits(trim(session));
    if (y && s) return y + ', শিক্ষাবর্ষ: ' + s;
    if (y) return y;
    if (s) return 'শিক্ষাবর্ষ: ' + s;
    return '';
  }

  /** কলেজের পূর্ণ নাম (ব্র্যান্ডিং) — নাম ও লোকেশন একসাথে। */
  function institutionFullName() {
    var name = trim(INSTITUTION.name);
    var loc = trim(INSTITUTION.location);
    if (name && loc) return name + ', ' + loc;
    return name || loc;
  }

  /* ---------------- লাইভ প্রিভিউ ---------------- */

  function render() {
    var department = trim(els.department.value);
    var year = trim(els.year.value);
    var session = toBengaliDigits(trim(els.session.value));
    var subject = trim(els.subject.value);
    var courseName = trim(els.courseName.value);
    var courseCode = toBengaliDigits(trim(els.courseCode.value));
    var teacherName = trim(els.teacherName.value);
    var teacherDesignation = trim(els.teacherDesignation.value);
    var teacherDepartment = trim(els.teacherDepartment.value);
    var studentName = trim(els.studentName.value);
    var roll = toBengaliDigits(trim(els.studentRoll.value));
    var reg = toBengaliDigits(trim(els.studentReg.value));
    var date = bengaliDate(els.submitDate.value);

    var collegeLine = institutionFullName();
    var yearSession = formatYearSession(year, session);

    /* কলেজ ব্র্যান্ডিং (স্থির) */
    setText(els.outCollege, INSTITUTION.name, '');
    setText(els.outLocation, INSTITUTION.location, '');

    /* হেডার মেটা — বিভাগ, বর্ষ, শিক্ষাবর্ষ */
    setText(els.outDepartment, department, '……………………');
    setText(els.outYear, year, '………………');
    setText(els.outSession, session, '……………');

    /* কোর্স ও বিষয় */
    setText(els.outSubject, subject, DOTS_LONG);
    setText(els.outCourse, courseName, '…………………………………………');
    setText(els.outCode, courseCode, DOTS_SHORT);

    /* নির্দেশনায় — শিক্ষকের তথ্য */
    setText(els.outTeacher, teacherName, DOTS_LONG);
    setText(els.outTeacherDesignation, teacherDesignation, DOTS_MID);
    setText(els.outTeacherDepartment, teacherDepartment, DOTS_MID);
    setText(els.outGuideCollege, collegeLine, '');

    /* প্রস্তুতকারী — শিক্ষার্থীর তথ্য */
    setText(els.outStudent, studentName, DOTS_LONG);
    setText(els.outStudentYearSession, yearSession, DOTS_MID);
    setText(els.outStudentDepartment, department, '……………………');
    setText(els.outRoll, roll, DOTS_SHORT);
    setText(els.outReg, reg, DOTS_SHORT);
    setText(els.outStudentCollege, collegeLine, '');
    setText(els.outDate, date, DOTS_SHORT);

    validate({ quiet: !state.touched });
  }

  /* ---------------- যাচাই ---------------- */

  var BN_AND_BASIC = /^[\u0980-\u09FF0-9A-Za-z\s.।,\-'’"()/]+$/;
  var state = { touched: false };

  function validate(options) {
    var opts = options || {};
    var problems = [];

    /* বিষয়ের নাম বাধ্যতামূলক */
    if (!trim(els.subject.value)) {
      setHint(els.subjectHint, 'অনুগ্রহ করে অ্যাসাইনমেন্টের বিষয় লিখুন।', true);
      problems.push('subject');
    } else {
      setHint(els.subjectHint, 'অ্যাসাইনমেন্টের বিষয়বস্তুর শিরোনাম লিখুন।', false);
    }

    /* শিক্ষার্থীর নাম বাধ্যতামূলক */
    var nameValue = trim(els.studentName.value);
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

    /* রোল নম্বর বাধ্যতামূলক */
    var rollValue = trim(els.studentRoll.value);
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

    /* জমা দেওয়ার তারিখ বাধ্যতামূলক */
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
    var name = trim(els.studentName.value);
    var pieces = ['অ্যাসাইনমেন্ট'];
    if (name) pieces.push(name);
    var code = trim(els.courseCode.value);
    if (code) pieces.push(toBengaliDigits(code));
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

    /* বিভাগ/বর্ষ/শিক্ষাবর্ষ */
    els.department = $('department');
    els.year = $('year');
    els.session = $('session');

    /* কোর্স ও বিষয় */
    els.subject = $('subject');
    els.courseName = $('course-name');
    els.courseCode = $('course-code');

    /* শিক্ষক */
    els.teacherName = $('teacher-name');
    els.teacherDesignation = $('teacher-designation');
    els.teacherDepartment = $('teacher-department');

    /* শিক্ষার্থী */
    els.studentName = $('student-name');
    els.studentRoll = $('student-roll');
    els.studentReg = $('student-reg');
    els.submitDate = $('submit-date');

    /* হিন্ট এলিমেন্ট */
    els.departmentHint = $('department-hint');
    els.yearHint = $('year-hint');
    els.sessionHint = $('session-hint');
    els.subjectHint = $('subject-hint');
    els.courseNameHint = $('course-name-hint');
    els.courseCodeHint = $('course-code-hint');
    els.teacherNameHint = $('teacher-name-hint');
    els.teacherDesignationHint = $('teacher-designation-hint');
    els.teacherDepartmentHint = $('teacher-department-hint');
    els.nameHint = $('name-hint');
    els.rollHint = $('roll-hint');
    els.regHint = $('reg-hint');
    els.dateHint = $('date-hint');

    /* বাটন ও প্রিভিউ */
    els.printBtn = $('print-btn');
    els.stage = $('preview-stage');
    els.scaler = $('preview-scaler');
    els.cover = $('cover');

    /* আউটপুট এলিমেন্ট */
    els.outCollege = $('out-college');
    els.outLocation = $('out-location');
    els.outDepartment = $('out-department');
    els.outYear = $('out-year');
    els.outSession = $('out-session');
    els.outSubject = $('out-subject');
    els.outCourse = $('out-course');
    els.outCode = $('out-code');
    els.outTeacher = $('out-teacher');
    els.outTeacherDesignation = $('out-teacher-designation');
    els.outTeacherDepartment = $('out-teacher-department');
    els.outGuideCollege = $('out-guide-college');
    els.outStudent = $('out-student');
    els.outStudentYearSession = $('out-student-year-session');
    els.outRoll = $('out-roll');
    els.outReg = $('out-reg');
    els.outStudentDepartment = $('out-student-department');
    els.outStudentCollege = $('out-student-college');
    els.outDate = $('out-date');

    if (!els.form) return;

    /* সকল ইনপুটে ইভেন্ট লিসেনার — লাইভ প্রিভিউ আপডেট */
    var inputs = [
      els.department, els.year, els.session,
      els.subject, els.courseName, els.courseCode,
      els.teacherName, els.teacherDesignation, els.teacherDepartment,
      els.studentName, els.studentRoll, els.studentReg, els.submitDate
    ];

    inputs.forEach(function (el) {
      if (!el) return;
      el.addEventListener('input', function () {
        state.touched = true;
        render();
      });
      el.addEventListener('change', function () {
        state.touched = true;
        render();
      });
    });

    els.form.addEventListener('submit', function (event) {
      event.preventDefault();
      state.touched = true;
      var problems = validate({ quiet: false });

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
      } catch (error) { /* পুরোনো ব্রাউজার */ }
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
