/**
 * islamia-college-assignment-cover-generator
 * js/courses.js — কলেজের স্থায়ী ব্র্যান্ডিং তথ্য।
 *
 * বিভাগ, বর্ষ, শিক্ষাবর্ষ, কোর্স, শিক্ষক — সবই ব্যবহারকারীর ইনপুট থেকে আসে;
 * এখানে কোনো বিভাগ-নির্দিষ্ট ডিফল্ট হার্ডকোড করা নেই।
 */
(function (root) {
  'use strict';

  /** কলেজের স্থায়ী ব্র্যান্ডিং (কভার পেজের শীর্ষে লোগোর নিচে বসে)। */
  var INSTITUTION = {
    name: 'ইসলামিয়া সরকারি কলেজ',
    location: 'সিরাজগঞ্জ'
  };

  root.ISLAMIA_COLLEGE = {
    institution: INSTITUTION
  };
})(typeof window !== 'undefined' ? window : this);
