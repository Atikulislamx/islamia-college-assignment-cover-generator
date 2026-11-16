/**
 * islamia-college-assignment-cover-generator
 * js/teachers.js — "নির্দেশনায়" অংশের শিক্ষক তালিকা।
 *
 * শিক্ষকের নাম কভার পেজে হুবহু বসে; `designation` শুধু ড্রপডাউনে পরিচিতির জন্য দেখানো হয়।
 */
(function (root) {
  'use strict';

  var TEACHERS = [
    { id: 't1', name: 'তানজুম আরা ম্যাডাম', designation: 'বিভাগীয় প্রধান' },
    { id: 't2', name: 'এমডি আমিনুল ইসলাম', designation: 'প্রভাষক' },
    { id: 't3', name: 'কাবির হোসেন', designation: 'প্রভাষক' },
    { id: 't4', name: 'এমডি জুলফিকার আসাদুল্লাহ', designation: 'প্রভাষক' }
  ];

  root.ISLAMIA_COLLEGE = root.ISLAMIA_COLLEGE || {};
  root.ISLAMIA_COLLEGE.teachers = TEACHERS;
})(typeof window !== 'undefined' ? window : this);
