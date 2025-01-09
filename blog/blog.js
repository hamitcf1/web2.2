// DOM Elements
const blogPosts = document.querySelector('.blog-posts');
const postFormModal = document.getElementById('post-form-modal');
const postForm = document.getElementById('blog-post-form');
const searchInput = document.getElementById('blog-search');
const newPostBtn = document.getElementById('new-post-btn');
const modalCloseButtons = document.querySelectorAll('.modal-close');

// Blog posts array (simulating a database)
let posts = [
    {
        id: 1,
        title: 'Welcome to My Blog',
        author: 'HamitCF',
        role: 'Junior Software Developer',
        date: new Date('2024-01-01'),
        content: 'Welcome to my technical blog where I share my journey in software development and quality assurance...',
        fullContent: 'Welcome to my technical blog where I share my journey in software development and quality assurance. Here, I\'ll be documenting my experiences, learnings, and insights as I navigate through various projects and challenges in the tech industry.'
    }
];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderPosts(posts);
    setupEventListeners();
});

function setupEventListeners() {
    // New Post Button
    newPostBtn.addEventListener('click', () => {
        postFormModal.classList.add('active');
    });

    // Modal Close Buttons
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').classList.remove('active');
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });

    // Post Form Submission
    postForm.addEventListener('submit', handlePostSubmission);

    // Search Input
    searchInput.addEventListener('input', handleSearch);

    // Read More Buttons
    blogPosts.addEventListener('click', (e) => {
        if (e.target.classList.contains('read-more')) {
            const postElement = e.target.closest('.blog-post');
            const postId = parseInt(postElement.dataset.postId);
            const post = posts.find(p => p.id === postId);
            
            if (post) {
                const preview = postElement.querySelector('.post-preview');
                const button = postElement.querySelector('.read-more');
                
                if (button.textContent === 'Read More') {
                    preview.textContent = post.fullContent;
                    button.textContent = 'Show Less';
                } else {
                    preview.textContent = post.content;
                    button.textContent = 'Read More';
                }
            }
        }
    });
}

function handlePostSubmission(e) {
    e.preventDefault();

    const newPost = {
        id: posts.length + 1,
        title: document.getElementById('post-title').value,
        author: 'HamitCF', // Hardcoded for demo
        role: document.getElementById('post-role').value,
        date: new Date(),
        content: document.getElementById('post-content').value.substring(0, 150) + '...',
        fullContent: document.getElementById('post-content').value
    };

    posts.unshift(newPost);
    renderPosts(posts);
    postForm.reset();
    postFormModal.classList.remove('active');
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.author.toLowerCase().includes(searchTerm) ||
        post.role.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm)
    );
    renderPosts(filteredPosts);
}

function renderPosts(postsToRender) {
    blogPosts.innerHTML = postsToRender.map(post => `
        <article class="blog-post" data-post-id="${post.id}">
            <h2 class="post-title">${post.title}</h2>
            <div class="post-meta">
                <span class="post-date">${formatDate(post.date)}</span>
                <span class="post-author">${post.author}</span>
                <span class="post-role">${post.role}</span>
            </div>
            <div class="post-content">
                <p class="post-preview">${post.content}</p>
                <button class="read-more">Read More</button>
            </div>
        </article>
    `).join('');
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Sidebar Toggle Functionality
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const sidebarOverlay = document.querySelector('.sidebar-overlay');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    sidebarOverlay.classList.toggle('active');
});

sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('collapsed');
    sidebarOverlay.classList.remove('active');
}); 