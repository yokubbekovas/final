const addBox = document.querySelector(".add-box");
const popUpBox = document.querySelector(".popup-box");
const closeIcon = document.querySelector("header i");
const titleTag = document.querySelector("input");
const descTag = document.querySelector("textarea");
const addBtn = popUpBox.querySelector("button");
const popupTitle = document.querySelector("header p");

let isUpdate = false; // Initialize variables
let UpdateId = null;
let notes = JSON.parse(localStorage.getItem("notes") || "[]");

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Show popup
addBox.addEventListener("click", function () {
  titleTag.focus();
  popUpBox.classList.add("show");
  addBtn.innerText = "Add Note";
  popupTitle.innerText = "Add a New Note";
});

// Hide popup
closeIcon.addEventListener("click", () => {
  popUpBox.classList.remove("show");
  titleTag.value = "";
  descTag.value = "";
  isUpdate = false; // Reset update mode
});

// Add or update a note
addBtn.addEventListener("click", (e) => {
  e.preventDefault();

  let noteTitle = titleTag.value.trim();
  let noteDesc = descTag.value.trim();

  if (noteTitle || noteDesc) {
    let dateObj = new Date(),
      month = months[dateObj.getMonth()],
      day = dateObj.getDate(),
      year = dateObj.getFullYear();

    let noteInfo = {
      title: noteTitle,
      description: noteDesc,
      date: `${month} ${day}, ${year}`,
    };

    if (!isUpdate) {
      notes.push(noteInfo); // Add new note
    } else {
      notes[UpdateId] = noteInfo; // Update existing note
      isUpdate = false; // Reset update mode
    }

    localStorage.setItem("notes", JSON.stringify(notes));
    closeIcon.click();
    showNotes();
  }
});

// Display notes
function showNotes() {
  document.querySelectorAll(".note").forEach((note) => note.remove());
  notes.forEach((note, index) => {
    let liTag = `
      <li class="note">
        <div class="details">
          <p>${note.title}</p>
          <span>${note.description}</span>
        </div>
        <div class="bottom-content">
          <span>${note.date}</span>
          <div class="settings">
            <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
            <ul class="menu">
              <li onclick="updateNote(${index}, '${note.title}', '${note.description}')"><i class="uil uil-pen"></i>Edit</li>
              <li onclick="deleteNote(${index})"><i class="uil uil-trash"></i>Delete</li>
            </ul>
          </div>
        </div>
      </li>
    `;
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}

// Delete a note
function deleteNote(noteId) {
  let confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  showNotes();
}

// Edit a note
function updateNote(noteId, title, desc) {
  isUpdate = true;
  UpdateId = noteId;
  addBox.click();
  titleTag.value = title;
  descTag.value = desc;
  addBtn.innerText = "Update Note";
  popupTitle.innerText = "Update a Note";
}

// Show or hide menu
function showMenu(elem) {
  elem.parentElement.classList.toggle("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

// Initial render
showNotes();
