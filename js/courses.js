/**
 * islamia-college-assignment-cover-generator
 * js/courses.js — স্থায়ী কলেজ তথ্য, কোর্সের নাম ও কোর্স কোডের তালিকা।
 *
 * নতুন কোর্স বা কোড যোগ করতে হলে শুধু এই ফাইলের তালিকা সম্পাদনা করুন —
 * ড্রপডাউন, প্রিভিউ ও প্রিন্ট স্বয়ংক্রিয়ভাবে হালনাগাদ হবে।
 */
(function (root) {
  'use strict';

  /** কলেজের স্থায়ী তথ্য (ইনপুট ফর্মে দেখানো হয় না, কভার পেজে বসে)। */
  var INSTITUTION = {
    name: 'ইসলামিয়া সরকারি কলেজ',
    location: 'সিরাজগঞ্জ',
    department: 'বাংলা বিভাগ',
    year: 'প্রথম বর্ষ',
    session: '২০২৫–২৬'
  };

  /**
   * কোর্সের নাম ও কোর্স কোড — একটির সঙ্গে অন্যটির সম্পর্ক এখানেই সংজ্ঞায়িত।
   * `code` = কোর্স কোড (ইংরেজি অঙ্কে সংরক্ষিত; কভার পেজে বাংলা অঙ্কে দেখানো হয়),
   * `name` = শিক্ষার্থীর ইন্টারফেস ও কভার পেজে দেখানো বাংলা নাম,
   * `en`   = রেকর্ডের জন্য ইংরেজি নাম (ইন্টারফেসে দেখানো হয় না)।
   */
  var COURSES = [
    {
      id: 'c1',
      code: '211001',
      name: 'বাংলাদেশ এবং বাঙালির ইতিহাস ও সংস্কৃতি',
      en: 'History and Culture of Bangladesh and Bengalees'
    },
    {
      id: 'c2',
      code: '211003',
      name: 'বাংলা ভাষার ইতিহাস ও ব্যবহারিক বাংলা',
      en: 'History of Bangla Language and Functional Bangla'
    },
    {
      id: 'c3',
      code: '211005',
      name: 'বাংলা কবিতা ১',
      en: 'Bangla Poetry - 1'
    },
    {
      id: 'c4',
      code: '211007',
      name: 'বাংলা উপন্যাস ১',
      en: 'Bangla Novel - 1'
    },
    {
      id: 'c5',
      code: '212109',
      name: 'সমাজকর্ম পরিচিতি',
      en: 'Introduction to Social Work'
    },
    {
      id: 'c6',
      code: '219901',
      name: 'বাংলাদেশের ইতিহাস: ভাষা, সংস্কৃতি ও পরিচয়',
      en: "History of Bangladesh: Language, Culture and Identity"
    },
    {
      id: 'c7',
      code: '219903',
      name: 'তথ্য ও যোগাযোগ প্রযুক্তি (তত্ত্বীয়)',
      en: 'Information and Communication Technology (Theory)'
    },
    {
      id: 'c8',
      code: '216601',
      name: 'তথ্য ও যোগাযোগ প্রযুক্তি',
      en: 'Information and Communication Technology'
    }
  ];

  root.ISLAMIA_COLLEGE = {
    institution: INSTITUTION,
    courses: COURSES
  };
})(typeof window !== 'undefined' ? window : this);
