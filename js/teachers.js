/**
 * islamia-college-assignment-cover-generator
 * js/teachers.js — "নির্দেশনায়" অংশের শিক্ষক তালিকা।
 *
 * শিক্ষকের নাম কভার পেজে হুবহু বসে।
 */
(function (root) {
  'use strict';

  var TEACHERS = [
    { id: 't1', name: 'তানজুম আরা (বিভাগীয় প্রধান)' },
    { id: 't2', name: 'এমডি আমিনুল ইসলাম (প্রভাষক)' },
    { id: 't3', name: 'কাবির হোসেন (প্রভাষক)' },
    { id: 't4', name: 'প্রফেসর মোঃ শহিদুল ইসলাম (আহবায়ক, আইসিটি বিভাগ)' },
    { id: 't5', name: 'এমডি জুলফিকার আসাদুল্লাহ (প্রভাষক)' }
  ];

  root.ISLAMIA_COLLEGE = root.ISLAMIA_COLLEGE || {};
  root.ISLAMIA_COLLEGE.teachers = TEACHERS;
})(typeof window !== 'undefined' ? window : this);
