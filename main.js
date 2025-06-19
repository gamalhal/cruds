let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");
let mood = "create";
let tmp;
console.log(title, price, taxes, ads, discount, total, count, category, submit);

function getTotal() {
  if (price.value != "") {
    let result = +price.value + +ads.value + +taxes.value - +discount.value;

    total.innerHTML = result;
    total.style.background = "green";
  } else {
    total.innerHTML = "";
    total.style.background = "red";
  }
}

//creaat product
let datapro;
if (localStorage.product != null) {
  datapro = JSON.parse(localStorage.product);
} else {
  datapro = [];
}
submit.onclick = function () {
  let newpro = {
    title: title.value,

    //.lowercase()
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    category: category.value,
    //.lowercase()
    count: count.value,
  };
   if(title.value != '' && price.value != '' && taxes.value != '' && ads.value != '' && discount.value != ''&&
    newpro.count <= 100 ){
  if (mood === "create") {
    if (newpro.count > 1) {
      for (let i = 0; i < newpro.count; i++) {
        datapro.push(newpro);
      }
    } else {
      datapro.push(newpro);
    }
    clearData();
  }
  } 
  
  
  else {
    datapro[tmp] = newpro;
    mood = "create";
    submit.innerHTML = "create";
    count.style.display = "block";
    
  } 

  localStorage.setItem("product", JSON.stringify(datapro));
  console.log(datapro);
  
  showData();
  
};

//clear inputs
function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
}

//read data
function showData() {
  getTotal();
  let table = "";
  document.getElementById("tbody").innerHTML = table;
  for (let i = 0; i < datapro.length; i++) {
    table += `<tr>
            <td>${i+1}</td>
            <td>${datapro[i].title}</td>
            <td>${datapro[i].price}</td>
            <td>${datapro[i].taxes}</td>
            <td>${datapro[i].ads}</td>
            <td>${datapro[i].discount}</td>
            <td>${datapro[i].total}</td>
            <td>${datapro[i].category}</td>
            <td><button onclick="updateData(${i})" id="update">update</button></td>
            <td><button  onclick="deleteData(${i})" id="delete">delete</button></td>  
             </tr>`;
    document.getElementById("tbody").innerHTML = table;
    let btnDelete = document.getElementById("deleteAll");
    if (datapro.length > 0) {
      btnDelete.innerHTML = `<button onclick="deleteAll()">deleteAll(${datapro.length})</button>`;
    } else {
      btnDelete.innerHTML = "";
    }
  }
}

showData();

//delete data
function deleteData(i) {
  datapro.splice(i, 1);
  localStorage.product = JSON.stringify(datapro);
  showData();
}

//deleteAll
function deleteAll() {
  localStorage.clear();
  datapro.splice(0);
  showData();
}

//update data
function updateData(i) {
  title.value = datapro[i].title;
  price.value = datapro[i].price;
  taxes.value = datapro[i].taxes;
  ads.value = datapro[i].ads;
  discount.value = datapro[i].discount;
  getTotal();
  count.style.display = "none";
  category.value = datapro[i].category;
  submit.innerHTML = "update";
  mood = "update";
  tmp = i;
  scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

//search
let searchMood = "title";
function getSearchMood(id) {
  let search = document.getElementById("search");
  if (id == "searchTitle") {
    searchMood = "title";
  } else {
    searchMood = "category";
  }
  search.placeholder = "search by " + searchMood;
  //this a problem here that it do not work focus in inputs search
  search.focus();
  search.value = "";
  showData();
}

function searchData(value) {
  console.log(value);
  let table = "";
  if (searchMood == "title") {
    for (let i = 0; i < datapro.length; i++) {
      if (datapro[i].title.includes(value)) {
        //.lowercase()
        table += `<tr>
            <td>${i}</td>
            <td>${datapro[i].title}</td>
            <td>${datapro[i].price}</td>
            <td>${datapro[i].taxes}</td>
            <td>${datapro[i].ads}</td>
            <td>${datapro[i].discount}</td>
            <td>${datapro[i].total}</td>
            <td>${datapro[i].category}</td>
            <td><button onclick="updateData(${i})" id="update">update</button></td>
            <td><button  onclick="deleteData(${i})" id="delete">delete</button></td>  
               </tr>`;
      }
    }
  } else {
    if (datapro[i].category.includes(value)) {
      table += `<tr>
                <td>${i}</td>
                <td>${datapro[i].title}</td>
                <td>${datapro[i].price}</td>
                <td>${datapro[i].taxes}</td>
                <td>${datapro[i].ads}</td>
                <td>${datapro[i].discount}</td>
                <td>${datapro[i].total}</td>
                <td>${datapro[i].category}</td>
                <td><button onclick="updateData(${i})" id="update">update</button></td>
                <td><button  onclick="deleteData(${i})" id="delete">delete</button></td>  
                   </tr>`;
    }
  }

  document.getElementById("tbody").innerHTML = table;
}

// in there a prb;em in search rewatch a cod

// clean data
