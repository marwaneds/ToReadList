document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('book-form');
    const bookList = document.getElementById('book-list');
    let editMode = false;
    let editElement = null;

    bookForm.addEventListener('submit', addBook);
    bookList.addEventListener('click', handleBookActions);
    bookList.addEventListener('dragstart', handleDragStart);
    bookList.addEventListener('dragover', handleDragOver);
    bookList.addEventListener('drop', handleDrop);
    bookList.addEventListener('dragend', handleDragEnd);

    function addBook(e) {
        e.preventDefault();

        const bookTitle = document.getElementById('book-title').value;

        if (bookTitle.trim() !== '') {
            if (editMode) {
                editElement.querySelector('span').textContent = bookTitle;
                editMode = false;
                editElement = null;
                bookForm.querySelector('button').textContent = 'Ajouter';
            } else {
                const li = createBookElement(bookTitle);
                bookList.insertBefore(li, bookList.firstChild);
            }

            document.getElementById('book-title').value = '';
        }
    }

    function createBookElement(title) {
        const li = document.createElement('li');
        li.setAttribute('draggable', 'true');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'read-checkbox';

        const span = document.createElement('span');
        span.textContent = title;

        li.appendChild(checkbox);
        li.appendChild(span);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';

        const editBtn = document.createElement('button');
        editBtn.appendChild(document.createTextNode('Modifier'));
        editBtn.className = 'edit-btn';
        actionsDiv.appendChild(editBtn);

        const removeBtn = document.createElement('button');
        removeBtn.appendChild(document.createTextNode('Supprimer'));
        removeBtn.className = 'remove-btn';
        actionsDiv.appendChild(removeBtn);

        li.appendChild(actionsDiv);
        return li;
    }

    function handleBookActions(e) {
        if (e.target.classList.contains('remove-btn')) {
            if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
                const li = e.target.parentElement.parentElement;
                bookList.removeChild(li);
            }
        } else if (e.target.classList.contains('edit-btn')) {
            const li = e.target.parentElement.parentElement;
            const title = li.querySelector('span').textContent;
            document.getElementById('book-title').value = title;
            editMode = true;
            editElement = li;
            bookForm.querySelector('button').textContent = 'Mettre à jour';
        } else if (e.target.classList.contains('read-checkbox')) {
            const li = e.target.parentElement;
            li.classList.toggle('read');
            if (li.classList.contains('read')) {
                bookList.appendChild(li);
            } else {
                bookList.insertBefore(li, bookList.firstChild);
            }
        }
    }

    function handleDragStart(e) {
        if (e.target.tagName === 'LI') {
            e.target.classList.add('dragging');
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
        const draggingElement = document.querySelector('.dragging');
        const elements = [...bookList.querySelectorAll('li:not(.dragging)')];
        const nextElement = elements.find(element => {
            return e.clientY <= element.getBoundingClientRect().top + element.getBoundingClientRect().height / 2;
        });

        if (nextElement) {
            bookList.insertBefore(draggingElement, nextElement);
        } else {
            bookList.appendChild(draggingElement);
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        e.target.classList.remove('dragging');
    }

    function handleDragEnd(e) {
        if (e.target.tagName === 'LI') {
            e.target.classList.remove('dragging');
        }
    }
});
