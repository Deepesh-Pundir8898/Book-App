const allCategories = document.querySelector("#all-categories");
const booksContainer = document.querySelector(".books-container");
const darkmode = document.querySelector(".dark-mode");
const loginForm = document.querySelector("#login-form");
const signUpForm = document.querySelector("#signup-form");
const modal = document.querySelector("#modal");
const modalContent = document.querySelector("#modal-content");


// Dark mode toggle
darkmode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode-active');
});

// API URLs
const categoriesUrl = "https://books-backend.p.goit.global/books/category-list";
const booksUrl = "https://books-backend.p.goit.global/books/top-books";

// Fetch and display categories
async function fetchCategories() {
    try {
        const response = await fetch(categoriesUrl);
        const data = await response.json();
        displayCategories(data);
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

function displayCategories(categories) {
    const categoryList = document.createElement("ul");
    categoryList.classList.add("category");

    categories.forEach(element => {
        const categoryItem = document.createElement("li");
        categoryItem.innerText = element.list_name;
        categoryItem.addEventListener('click', () => filterBooksByCategory(element.list_name));
        categoryList.appendChild(categoryItem);
    });

    allCategories.appendChild(categoryList);
}

document.querySelector("#all-category").addEventListener('click', ()=>{
    fetchBooks();
})

// Fetch and display books
async function fetchBooks() {
    try {
        const response = await fetch(booksUrl);
        const data = await response.json();
        displayBooks(data);
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}

function displayBooks(categories) {
    booksContainer.innerHTML = ''; // Clear existing content

    categories.forEach(category => {
        const booksContainerCategoryWise = document.createElement('div');
        booksContainerCategoryWise.classList.add('books-container-category-wise');

        const bookCategory = document.createElement('h3');
        bookCategory.innerText = category.list_name;

        const seeMore = document.createElement('div');
        seeMore.classList.add('see-more');
        const seeMoreBtn = document.createElement('button');
        seeMoreBtn.classList.add('seeMore-btn');
        seeMoreBtn.textContent = 'SEE MORE';
        seeMore.appendChild(seeMoreBtn);

        const booksConatiner = document.createElement('div');
        booksConatiner.classList.add('category-books-container');

        category.books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');
            bookItem.innerHTML = `
                <div class="book-card">
                    <img src="${book.book_image}" alt="${book.title}">
                    <div class="book-overlay"><p>Quick Response</p></div>
                </div>
                <div class="book-title">${book.title}</div>
                <div class="book-author-name">${book.publisher}</div>
            `;

            // Add click event to show book details
            bookItem.addEventListener('click', () => showBookDetails(book));

            booksConatiner.appendChild(bookItem);
        });

        seeMoreBtn.addEventListener("click",()=>{
            filterBooksByCategory(category.list_name);
        })

        booksContainerCategoryWise.appendChild(bookCategory);
        booksContainerCategoryWise.appendChild(booksConatiner);
        booksContainerCategoryWise.appendChild(seeMore);
        booksContainer.appendChild(booksContainerCategoryWise);
    });
}

// Filter books by category
async function filterBooksByCategory(categoryName) {
    try {
        const response = await fetch(booksUrl);
        const data = await response.json();
        const filteredData = data.filter(category => category.list_name === categoryName);
        displayBooks(filteredData);
    } catch (error) {
        console.error("Error filtering books by category:", error);
    }
}

// Show book details in a modal
function showBookDetails(book) {
    modal.style.display = "flex";
    modalContent.innerHTML = `
        <h2>${book.title}</h2>
        <img src="${book.book_image}" alt="${book.title}">
        <p>Author: ${book.author}</p>
        <p>Publisher: ${book.publisher}</p>
        <p>Description: ${book.description}</p>
        <button id="close-modal">Close</button>
    `;

    const closeModalBtn = document.querySelector("#close-modal");
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = "none";
    });
}

//  ukraine support down arrow button

document.querySelector('.down-button').addEventListener('click', () => {
    const wrapper = document.querySelector('.wrapper');
    
    wrapper.scrollBy({
        top: 100,
        behavior: 'smooth'
    });
});

// Handle login and signup (basic functionality)

const signupBtn = document.querySelector("#signup-btn");
signupBtn.addEventListener('click',()=>{
    if(localStorage.getItem('user')==null){
        document.querySelector(".main-container").style.display="none";
        document.querySelector("#login-form").style.display="none";
        document.querySelector("#signup-form").style.display="block";
    } else {
        document.querySelector(".main-container").style.display="none";
        document.querySelector("#signup-form").style.display="none";
        document.querySelector("#login-form").style.display="block";
    }
})

signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    
    localStorage.setItem('user', JSON.stringify({ username, password }));
    alert('User registered successfully!');
    document.querySelector("#signup-form").style.display="none";
    document.querySelector(".main-container").style.display="flex";
    const storedUser = JSON.parse(localStorage.getItem('user'));
    signupBtn.innerHTML = `${storedUser.username}<span><i class="fa-solid fa-arrow-right"></i></span>`;
    
    // Change button text to logout
    signupBtn.textContent = `Logout (${storedUser.username})`;
    signupBtn.removeEventListener('click', showSignUpForm);
    signupBtn.addEventListener('click', logout);
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.username === username && storedUser.password === password) {
        alert('Login successful!');
        signupBtn.innerHTML = `${storedUser.username}<span><i class="fa-solid fa-arrow-right"></i></span>`;
        
        document.querySelector("#signup-form").style.display="none";
        document.querySelector(".main-container").style.display="flex";

        // Change button text to logout
        signupBtn.textContent = `Logout (${storedUser.username})`;
        signupBtn.removeEventListener('click', showSignUpForm);
        signupBtn.addEventListener('click', logout);
    } else {
        alert('Invalid credentials');
    }
});

// Logout function
function logout() {
    // localStorage.removeItem('user');
    alert('You have been logged out.');
    signupBtn.innerHTML = `Sign Up <span><i class="fa-solid fa-arrow-right"></i></span>`;
    signupBtn.removeEventListener('click', logout);
    signupBtn.addEventListener('click', showSignUpForm);
}

// Function to show signup form
function showSignUpForm() {
    document.querySelector(".main-container").style.display="none";
    document.querySelector("#signup-form").style.display="block";
    document.querySelector("#login-form").style.display="none";

}

// Initialize the application
async function init() {
    await fetchCategories();
    await fetchBooks();
    
    // Check if user is already logged in
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
        signupBtn.innerHTML = `${storedUser.username}<span><i class="fa-solid fa-arrow-right"></i></span>`;
        signupBtn.textContent = `Logout (${storedUser.username})`;
        signupBtn.removeEventListener('click', showSignUpForm);
        signupBtn.addEventListener('click', logout);
    } else {
        signupBtn.addEventListener('click', showSignUpForm);
    }
}

init();
