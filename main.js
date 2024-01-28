const SAVED_EVENT = "savedBook";
const STORAGE_KEY = "BOOK_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser tidak mendukung web storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializeData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializeData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}
//Storage End

const books = [];
const RENDER_EVENT = "renderEvent";

function addBook() {
  const titleBook = document.getElementById("inputBookTitle").value;
  const authorBook = document.getElementById("inputBookAuthor").value;
  const yearsBook = document.getElementById("inputBookYear").value;
  const isCompleted = document.getElementById("inputBookIsComplete");

  let status;
  if (isCompleted.checked) {
    status = true;
  } else {
    status = false;
  }

  books.push({
    id: +new Date(),
    title: titleBook,
    author: authorBook,
    year: Number(yearsBook),
    isCompleted: status,
  });

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
  const unCompleted = document.getElementById("incompleteBookshelfList");
  unCompleted.innerHTML = "";

  const isCompleted = document.getElementById("completeBookshelfList");
  isCompleted.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      unCompleted.append(bookElement);
    } else {
      isCompleted.append(bookElement);
    }
  }
});

function makeBook(objectBook) {
  const textTitle = document.createElement("h3");
  textTitle.classList.add("itemTitle");
  textTitle.innerText = objectBook.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = objectBook.author;

  const textYear = document.createElement("p");
  textYear.innerText = objectBook.year;

  const actionArticle = document.createElement("div");
  actionArticle.classList.add("action");

  const textArticle = document.createElement("article");
  textArticle.classList.add("book_item");
  textArticle.append(textTitle, textAuthor, textYear);
  textArticle.setAttribute("id", `book-${objectBook.id}`);

  if (objectBook.isCompleted) {
    const checkButton = document.createElement("button");
    checkButton.classList.add("green");
    checkButton.innerText = "Belum Selesai Dibaca";

    checkButton.addEventListener("click", function () {
      undoBookFromCompleted(objectBook.id);
    });

    const hapusButton = document.createElement("button");
    hapusButton.classList.add("red");
    hapusButton.innerText = "Hapus Buku";

    hapusButton.addEventListener("click", function () {
      removeBookFromCompleted(objectBook.id);
    });

    actionArticle.append(checkButton, hapusButton);
    textArticle.append(actionArticle);
  } else {
    const blmSelesaiDibaca = document.createElement("button");
    blmSelesaiDibaca.classList.add("green");
    blmSelesaiDibaca.innerHTML = "Selesai Dibaca";

    blmSelesaiDibaca.addEventListener("click", function () {
      addBookToCompleted(objectBook.id);
    });

    const hapusButton = document.createElement("button");
    hapusButton.classList.add("red");
    hapusButton.innerText = "Hapus Buku";

    hapusButton.addEventListener("click", function () {
      removeBookFromCompleted(objectBook.id);
    });

    actionArticle.append(blmSelesaiDibaca, hapusButton);
    textArticle.append(actionArticle);
  }
  return textArticle;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

document.addEventListener("DOMContentLoaded", function () {
  const saveForm = document.getElementById("inputBook");
  saveForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function searchBook() {
  const searchInput = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const moveBook = document.querySelectorAll(".itemTitle");

  for (const move of moveBook) {
    if (!move.innerText.toLowerCase().includes(searchInput)) {
      move.parentElement.style.display = "none";
    } else {
      move.parentElement.style.display = "";
    }
  }
}
