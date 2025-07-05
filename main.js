/*
  ========================================
  نظام إدارة المنتجات - Product Management System
  ملف الوظائف - JavaScript File
  ========================================
  هذا الملف يحتوي على جميع الوظائف والمنطق البرمجي للتطبيق
*/

//
// ========================================
// العناصر الأساسية - DOM Elements
// ========================================
// الحصول على جميع العناصر المطلوبة من الصفحة
//

// عناصر النموذج - Form Elements
let title = document.getElementById("title"); // حقل اسم المنتج
let price = document.getElementById("price"); // حقل السعر
let taxes = document.getElementById("taxes"); // حقل الضرائب
let ads = document.getElementById("ads"); // حقل الإعلانات
let discount = document.getElementById("discount"); // حقل الخصم
let total = document.getElementById("total"); // عرض المجموع
let count = document.getElementById("count"); // حقل الكمية
let category = document.getElementById("category"); // حقل الفئة
let submit = document.getElementById("submit"); // زر الإرسال

// متغيرات الحالة - State Variables
let mood = "create"; // حالة النموذج: إنشاء أو تحديث
let tmp; // مؤشر مؤقت لتخزين فهرس العنصر المراد تحديثه

// تهيئة عرض المجموع
total.innerHTML = "0";

//
// ========================================
// دالة حساب المجموع - Calculate Total Function
// ========================================
// تحسب المجموع النهائي للمنتج تلقائياً
//
function getTotal() {
  // التحقق من وجود قيمة في حقل السعر
  if (price.value != "" && !isNaN(parseFloat(price.value))) {
    // تحويل القيم إلى أرقام مع التعامل مع القيم الفارغة
    let priceVal = parseFloat(price.value) || 0;
    let taxesVal = parseFloat(taxes.value) || 0;
    let adsVal = parseFloat(ads.value) || 0;
    let discountVal = parseFloat(discount.value) || 0;
    
    // حساب المجموع: السعر + الضرائب + الإعلانات - الخصم
    let result = priceVal + taxesVal + adsVal - discountVal;
    
    // التأكد من أن النتيجة ليست سالبة
    if (result < 0) result = 0;
    
    // عرض النتيجة مع رقمين عشريين
    total.innerHTML = result.toFixed(2);
    
    // تغيير لون الخلفية إلى الأخضر للنجاح
    total.style.background =
      "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)";
  } else {
    // إذا لم يكن هناك سعر أو قيمة غير صحيحة، عرض صفر وخلفية حمراء
    total.innerHTML = "0";
    total.style.background =
      "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)";
  }
}

//
// ========================================
// مصفوفة البيانات - Data Array
// ========================================
// تخزين جميع المنتجات في مصفوفة
//
let datapro;

// محاولة استرجاع البيانات المحفوظة من LocalStorage
if (localStorage.product != null) {
  // تحويل النص JSON إلى مصفوفة
  datapro = JSON.parse(localStorage.product);
} else {
  // إنشاء مصفوفة فارغة إذا لم تكن هناك بيانات محفوظة
  datapro = [];
}

//
// ========================================
// معالج حدث زر الإرسال - Submit Button Event Handler
// ========================================
// يتم تنفيذها عند الضغط على زر إنشاء/تحديث المنتج
//
submit.onclick = function () {
  // إنشاء كائن المنتج الجديد مع تنظيف النصوص
  let newpro = {
    title: title.value.trim(), // اسم المنتج مع إزالة المسافات الزائدة
    price: parseFloat(price.value) || 0, // السعر - تحويل إلى رقم
    taxes: parseFloat(taxes.value) || 0, // الضرائب - تحويل إلى رقم
    ads: parseFloat(ads.value) || 0, // الإعلانات - تحويل إلى رقم
    discount: parseFloat(discount.value) || 0, // الخصم - تحويل إلى رقم
    total: total.innerHTML, // المجموع المحسوب
    category: category.value.trim(), // الفئة مع إزالة المسافات الزائدة
    count: parseInt(count.value) || 0, // الكمية - تحويل إلى رقم صحيح
  };

  // التحقق من صحة البيانات - Validation
  if (
    title.value.trim() != "" &&
    price.value != "" &&
    taxes.value != "" &&
    ads.value != "" &&
    discount.value != "" &&
    category.value.trim() != "" &&
    count.value != "" &&
    parseInt(count.value) > 0 &&
    parseInt(count.value) <= 100
  ) {
    // التحقق من حالة النموذج
    if (mood === "create") {
      // حالة الإنشاء - إضافة منتج جديد
      if (newpro.count > 1) {
        // إذا كانت الكمية أكبر من 1، أضف عدة نسخ
        for (let i = 0; i < newpro.count; i++) {
          datapro.push(newpro);
        }
      } else {
        // إضافة منتج واحد فقط
        datapro.push(newpro);
      }

      // مسح النموذج بعد الإضافة
      clearData();

      // عرض رسالة نجاح
      showSuccessMessage("تم إضافة المنتج بنجاح!");
    } else {
      // حالة التحديث - تحديث منتج موجود
      datapro[tmp] = newpro;

      // إعادة تعيين النموذج لحالة الإنشاء
      mood = "create";
      submit.innerHTML = '<i class="fas fa-plus me-2"></i>إنشاء منتج';
      count.style.display = "block";

      // عرض رسالة نجاح
      showSuccessMessage("تم تحديث المنتج بنجاح!");
    }

    // حفظ البيانات في LocalStorage
    localStorage.setItem("product", JSON.stringify(datapro));

    // تحديث عرض الجدول
    showData();
  } else {
    // التحقق من كل حقل على حدة لعرض رسالة خطأ مفصلة
    let errorMessage = "يرجى التأكد من: ";
    let errors = [];

    if (title.value.trim() == "") errors.push("اسم المنتج");
    if (price.value == "" || isNaN(parseFloat(price.value)))
      errors.push("السعر (يجب أن يكون رقماً)");
    if (taxes.value == "" || isNaN(parseFloat(taxes.value)))
      errors.push("الضرائب (يجب أن تكون رقماً)");
    if (ads.value == "" || isNaN(parseFloat(ads.value)))
      errors.push("الإعلانات (يجب أن تكون رقماً)");
    if (discount.value == "" || isNaN(parseFloat(discount.value)))
      errors.push("الخصم (يجب أن يكون رقماً)");
    if (category.value.trim() == "") errors.push("الفئة");
    if (count.value == "") {
      errors.push("الكمية");
    } else if (isNaN(parseInt(count.value))) {
      errors.push("الكمية (يجب أن تكون رقماً صحيحاً)");
    } else if (parseInt(count.value) <= 0) {
      errors.push("الكمية (يجب أن تكون أكبر من صفر)");
    } else if (parseInt(count.value) > 100) {
      errors.push("الكمية (يجب أن تكون أقل من أو تساوي 100)");
    }

    errorMessage += errors.join("، ");
    showErrorMessage(errorMessage);
  }
};

//
// ========================================
// دالة مسح النموذج - Clear Form Function
// ========================================
// تمسح جميع حقول النموذج
//
function clearData() {
  title.value = ""; // مسح اسم المنتج
  price.value = ""; // مسح السعر
  taxes.value = ""; // مسح الضرائب
  ads.value = ""; // مسح الإعلانات
  discount.value = ""; // مسح الخصم
  total.innerHTML = "0"; // إعادة تعيين المجموع
  count.value = ""; // مسح الكمية
  category.value = ""; // مسح الفئة

  // إعادة حساب المجموع لتحديث اللون
  getTotal();
}

//
// ========================================
// دالة عرض البيانات - Show Data Function
// ========================================
// تعرض جميع المنتجات في الجدول
//
function showData() {
  // إعادة حساب المجموع أولاً
  getTotal();

  // متغير لتخزين HTML الجدول
  let table = "";

  // مسح محتوى الجدول الحالي
  document.getElementById("tbody").innerHTML = table;

  // التكرار على جميع المنتجات
  for (let i = 0; i < datapro.length; i++) {
    // إنشاء صف جديد مع تأثير ظهور تدريجي
    table += `<tr class="fade-in">
            <td>${
              i + 1
            }</td>                                    <!-- رقم تسلسلي -->
            <td>${
              datapro[i].title
            }</td>                         <!-- اسم المنتج -->
            <td>${parseFloat(datapro[i].price).toFixed(2)}</td>  <!-- السعر -->
            <td>${parseFloat(datapro[i].taxes).toFixed(
              2
            )}</td>  <!-- الضرائب -->
            <td>${parseFloat(datapro[i].ads).toFixed(
              2
            )}</td>    <!-- الإعلانات -->
            <td>${parseFloat(datapro[i].discount).toFixed(2)}</td><!-- الخصم -->
            <td>${parseFloat(datapro[i].total).toFixed(
              2
            )}</td>  <!-- المجموع -->
            <td>${datapro[i].category}</td>                      <!-- الفئة -->
            <td><button onclick="updateData(${i})" class="btn btn-warning btn-sm">
                <i class="fas fa-edit me-1"></i>تعديل
            </button></td>                                        <!-- زر التعديل -->
            <td><button onclick="deleteData(${i})" class="btn btn-danger btn-sm">
                <i class="fas fa-trash-alt me-1"></i>حذف
            </button></td>                                        <!-- زر الحذف -->
             </tr>`;
  }

  // إدراج HTML الجدول في الصفحة
  document.getElementById("tbody").innerHTML = table;

  // تحديث زر حذف الكل
  let btnDelete = document.getElementById("deleteAll");
  if (datapro.length > 0) {
    // عرض زر حذف الكل مع عدد المنتجات
    btnDelete.innerHTML = `<button onclick="deleteAll()" class="btn btn-danger">
        <i class="fas fa-trash-alt me-2"></i>حذف جميع المنتجات (${datapro.length})
    </button>`;
  } else {
    // إخفاء الزر إذا لم تكن هناك منتجات
    btnDelete.innerHTML = "";
  }
}

//
// ========================================
// دالة حذف منتج واحد - Delete Single Product Function
// ========================================
// تحذف منتج محدد من المصفوفة
//
function deleteData(i) {
  // طلب تأكيد الحذف من المستخدم
  if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
    // حذف المنتج من المصفوفة
    datapro.splice(i, 1);

    // حفظ التغييرات في LocalStorage
    localStorage.product = JSON.stringify(datapro);

    // تحديث عرض الجدول
    showData();

    // عرض رسالة نجاح
    showSuccessMessage("تم حذف المنتج بنجاح!");
  }
}

//
// ========================================
// دالة حذف جميع المنتجات - Delete All Products Function
// ========================================
// تحذف جميع المنتجات من المصفوفة
//
function deleteAll() {
  // طلب تأكيد الحذف من المستخدم
  if (confirm("هل أنت متأكد من حذف جميع المنتجات؟")) {
    // مسح LocalStorage بالكامل
    localStorage.clear();

    // إفراغ المصفوفة
    datapro.splice(0);

    // تحديث عرض الجدول
    showData();

    // عرض رسالة نجاح
    showSuccessMessage("تم حذف جميع المنتجات بنجاح!");
  }
}

//
// ========================================
// دالة تحديث بيانات المنتج - Update Product Function
// ========================================
// تحمل بيانات منتج محدد في النموذج للتعديل
//
function updateData(i) {
  // تحميل بيانات المنتج في النموذج
  title.value = datapro[i].title; // اسم المنتج
  price.value = datapro[i].price; // السعر
  taxes.value = datapro[i].taxes; // الضرائب
  ads.value = datapro[i].ads; // الإعلانات
  discount.value = datapro[i].discount; // الخصم

  // إعادة حساب المجموع
  getTotal();

  // إخفاء حقل الكمية في وضع التحديث
  count.style.display = "none";

  // تحميل الفئة
  category.value = datapro[i].category;

  // تغيير نص الزر إلى "تحديث"
  submit.innerHTML = '<i class="fas fa-save me-2"></i>تحديث المنتج';

  // تغيير حالة النموذج إلى التحديث
  mood = "update";

  // حفظ فهرس العنصر المراد تحديثه
  tmp = i;

  // التمرير إلى أعلى الصفحة بسلاسة
  scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

//
// ========================================
// وظائف البحث - Search Functions
// ========================================
// للبحث في المنتجات بالاسم أو الفئة
//

// متغير لتخزين نوع البحث الحالي
let searchMood = "title";

// دالة تغيير نوع البحث
function getSearchMood(id) {
  let search = document.getElementById("search");

  if (id == "searchTitle") {
    // البحث بالاسم
    searchMood = "title";
    search.placeholder = "البحث باسم المنتج...";
  } else {
    // البحث بالفئة
    searchMood = "category";
    search.placeholder = "البحث بالفئة...";
  }

  // التركيز على حقل البحث
  search.focus();

  // مسح قيمة البحث
  search.value = "";

  // إعادة عرض جميع البيانات
  showData();
}

// دالة البحث الفوري
function searchData(value) {
  let table = "";

  if (searchMood == "title") {
    // البحث بالاسم
    for (let i = 0; i < datapro.length; i++) {
      // البحث مع تجاهل حالة الأحرف (كبيرة/صغيرة)
      if (datapro[i].title.toLowerCase().includes(value.toLowerCase())) {
        // إنشاء صف للنتيجة
        table += `<tr class="fade-in">
            <td>${i + 1}</td>
            <td>${datapro[i].title}</td>
            <td>${parseFloat(datapro[i].price).toFixed(2)}</td>
            <td>${parseFloat(datapro[i].taxes).toFixed(2)}</td>
            <td>${parseFloat(datapro[i].ads).toFixed(2)}</td>
            <td>${parseFloat(datapro[i].discount).toFixed(2)}</td>
            <td>${parseFloat(datapro[i].total).toFixed(2)}</td>
            <td>${datapro[i].category}</td>
            <td><button onclick="updateData(${i})" class="btn btn-warning btn-sm">
                <i class="fas fa-edit me-1"></i>تعديل
            </button></td>
            <td><button onclick="deleteData(${i})" class="btn btn-danger btn-sm">
                <i class="fas fa-trash-alt me-1"></i>حذف
            </button></td>  
               </tr>`;
      }
    }
  } else {
    // البحث بالفئة
    for (let i = 0; i < datapro.length; i++) {
      // البحث مع تجاهل حالة الأحرف (كبيرة/صغيرة)
      if (datapro[i].category.toLowerCase().includes(value.toLowerCase())) {
        // إنشاء صف للنتيجة
        table += `<tr class="fade-in">
                <td>${i + 1}</td>
                <td>${datapro[i].title}</td>
                <td>${parseFloat(datapro[i].price).toFixed(2)}</td>
                <td>${parseFloat(datapro[i].taxes).toFixed(2)}</td>
                <td>${parseFloat(datapro[i].ads).toFixed(2)}</td>
                <td>${parseFloat(datapro[i].discount).toFixed(2)}</td>
                <td>${parseFloat(datapro[i].total).toFixed(2)}</td>
                <td>${datapro[i].category}</td>
                <td><button onclick="updateData(${i})" class="btn btn-warning btn-sm">
                    <i class="fas fa-edit me-1"></i>تعديل
                </button></td>
                <td><button onclick="deleteData(${i})" class="btn btn-danger btn-sm">
                    <i class="fas fa-trash-alt me-1"></i>حذف
                </button></td>  
                   </tr>`;
      }
    }
  }

  // عرض نتائج البحث في الجدول
  document.getElementById("tbody").innerHTML = table;
}

//
// ========================================
// دوال الرسائل - Message Functions
// ========================================
// لعرض رسائل النجاح والخطأ للمستخدم
//

// دالة عرض رسالة نجاح
function showSuccessMessage(message) {
  // إنشاء عنصر التنبيه
  const alertDiv = document.createElement("div");
  alertDiv.className =
    "alert alert-success alert-dismissible fade show position-fixed";
  alertDiv.style.cssText =
    "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";

  // محتوى التنبيه
  alertDiv.innerHTML = `
    <i class="fas fa-check-circle me-2"></i>
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  // إضافة التنبيه للصفحة
  document.body.appendChild(alertDiv);

  // إزالة التنبيه تلقائياً بعد 3 ثوان
  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}

// دالة عرض رسالة خطأ
function showErrorMessage(message) {
  // إنشاء عنصر التنبيه
  const alertDiv = document.createElement("div");
  alertDiv.className =
    "alert alert-danger alert-dismissible fade show position-fixed";
  alertDiv.style.cssText =
    "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";

  // محتوى التنبيه
  alertDiv.innerHTML = `
    <i class="fas fa-exclamation-circle me-2"></i>
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  // إضافة التنبيه للصفحة
  document.body.appendChild(alertDiv);

  // إزالة التنبيه تلقائياً بعد 3 ثوان
  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}

//
// ========================================
// مستمعي الأحداث - Event Listeners
// ========================================
// إضافة تفاعلات إضافية لتحسين تجربة المستخدم
//

// انتظار تحميل الصفحة بالكامل
document.addEventListener("DOMContentLoaded", function () {
  // إضافة تأثير التحميل لزر الإرسال
  submit.addEventListener("click", function () {
    if (mood === "create") {
      // عرض تأثير التحميل
      this.innerHTML = '<span class="loading"></span> جاري الإضافة...';

      // إعادة النص الأصلي بعد ثانية
      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-plus me-2"></i>إنشاء منتج';
      }, 1000);
    }
  });

  // إضافة دعم مفتاح Enter للإرسال
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("keypress", function (e) {
      // إذا تم الضغط على مفتاح Enter
      if (e.key === "Enter") {
        submit.click(); // تنفيذ زر الإرسال
      }
    });
  });
});

//
// ========================================
// تهيئة التطبيق - Application Initialization
// ========================================
// عرض البيانات عند تحميل الصفحة
//
showData();
