document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    const suggestionsContainer = document.getElementById('searchSuggestions');

    // Popular food items for suggestions (replace with your actual data)
    const popularItems = [
        { id: 1, name: 'Hamburger Bò', category: 'Burger', price: 59000, image: '/images/foods/hamburger.jpg' },
        { id: 2, name: 'Pizza Hải Sản', category: 'Pizza', price: 89000, image: '/images/foods/pizza.jpg' },
        { id: 3, name: 'Gà Rán', category: 'Gà', price: 69000, image: '/images/foods/fried-chicken.jpg' },
        { id: 4, name: 'Mì Ý Sốt Bò Bằm', category: 'Mì Ý', price: 65000, image: '/images/foods/spaghetti.jpg' },
        { id: 5, name: 'Salad Cá Hồi', category: 'Salad', price: 75000, image: '/images/foods/salad.jpg' }
    ];

    // Recent searches (stored in localStorage)
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

    // Setup event listeners
    setupEventListeners();

    function setupEventListeners() {
        // Show clear button when input has text
        searchInput.addEventListener('input', function () {
            clearButton.style.display = this.value ? 'flex' : 'none';
            showSuggestions();
        });

        // Clear search input
        clearButton.addEventListener('click', function () {
            searchInput.value = '';
            clearButton.style.display = 'none';
            hideSuggestions();
            searchInput.focus();
        });

        // Handle form submission
        searchForm.addEventListener('submit', function (e) {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                // Add to recent searches
                addToRecentSearches(searchTerm);
            }
        });

        // Show suggestions on focus
        searchInput.addEventListener('focus', function () {
            if (this.value.trim() || recentSearches.length > 0) {
                showSuggestions();
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', function (e) {
            if (!searchForm.contains(e.target)) {
                hideSuggestions();
            }
        });

        // Keyboard navigation for suggestions
        searchInput.addEventListener('keydown', function (e) {
            if (!suggestionsContainer.classList.contains('active')) return;

            const items = suggestionsContainer.querySelectorAll('.suggestion-item');
            const selectedItem = suggestionsContainer.querySelector('.suggestion-item.selected');
            let selectedIndex = -1;

            if (selectedItem) {
                selectedIndex = Array.from(items).indexOf(selectedItem);
            }

            // Down arrow
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % items.length;
                selectSuggestionItem(items, selectedIndex);
            }

            // Up arrow
            else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                selectSuggestionItem(items, selectedIndex);
            }

            // Enter key
            else if (e.key === 'Enter' && selectedItem) {
                e.preventDefault();
                selectedItem.click();
            }

            // Escape key
            else if (e.key === 'Escape') {
                hideSuggestions();
            }
        });
    }

    // Show search suggestions
    function showSuggestions() {
        const searchTerm = searchInput.value.trim().toLowerCase();

        // Clear previous suggestions
        suggestionsContainer.innerHTML = '';

        // Filter items based on search term
        let filteredItems = [];

        if (searchTerm) {
            filteredItems = popularItems.filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm)
            );
        } else if (recentSearches.length > 0) {
            // Show recent searches if no search term
            renderRecentSearches();
            suggestionsContainer.classList.add('active');
            return;
        }

        // Render filtered items
        if (filteredItems.length > 0) {
            filteredItems.forEach(item => {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'suggestion-item';
                suggestionItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="suggestion-image">
                    <div class="suggestion-content">
                        <div class="suggestion-title">${highlightMatch(item.name, searchTerm)}</div>
                        <div class="suggestion-category">${item.category}</div>
                    </div>
                    <div class="suggestion-price">${formatPrice(item.price)}</div>
                `;

                suggestionItem.addEventListener('click', function () {
                    searchInput.value = item.name;
                    clearButton.style.display = 'flex';
                    hideSuggestions();
                    searchForm.submit();
                });

                suggestionsContainer.appendChild(suggestionItem);
            });
        } else if (searchTerm) {
            // No results found
            suggestionsContainer.innerHTML = `
                <div class="no-suggestions">
                    <p>Không tìm thấy kết quả cho "${searchTerm}"</p>
                </div>
            `;
        } else {
            // No search term and no recent searches
            suggestionsContainer.classList.remove('active');
            return;
        }

        suggestionsContainer.classList.add('active');
    }

    // Render recent searches
    function renderRecentSearches() {
        if (recentSearches.length === 0) return;

        const recentHeader = document.createElement('div');
        recentHeader.className = 'suggestion-header';
        recentHeader.innerHTML = `
            <div class="d-flex justify-content-between align-items-center p-3">
                <span class="fw-bold">Tìm kiếm gần đây</span>
                <button type="button" class="btn btn-sm text-danger" id="clearHistory">Xóa</button>
            </div>
        `;
        suggestionsContainer.appendChild(recentHeader);

        // Add event listener to clear history button
        recentHeader.querySelector('#clearHistory').addEventListener('click', function (e) {
            e.stopPropagation();
            localStorage.removeItem('recentSearches');
            recentSearches = [];
            hideSuggestions();
        });

        // Add recent searches
        recentSearches.slice(0, 5).forEach(term => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.innerHTML = `
                <ion-icon name="time-outline" style="font-size: 20px; color: #6c757d;"></ion-icon>
                <div class="suggestion-content">
                    <div class="suggestion-title">${term}</div>
                </div>
            `;

            suggestionItem.addEventListener('click', function () {
                searchInput.value = term;
                clearButton.style.display = 'flex';
                hideSuggestions();
                searchForm.submit();
            });

            suggestionsContainer.appendChild(suggestionItem);
        });
    }

    // Hide suggestions
    function hideSuggestions() {
        suggestionsContainer.classList.remove('active');
    }

    // Add to recent searches
    function addToRecentSearches(term) {
        // Remove if already exists
        recentSearches = recentSearches.filter(item => item !== term);

        // Add to beginning of array
        recentSearches.unshift(term);

        // Keep only the last 10 searches
        recentSearches = recentSearches.slice(0, 10);

        // Save to localStorage
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }

    // Highlight matching text
    function highlightMatch(text, searchTerm) {
        if (!searchTerm) return text;

        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    // Format price
    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(price);
    }

    // Select suggestion item
    function selectSuggestionItem(items, index) {
        // Remove selected class from all items
        items.forEach(item => item.classList.remove('selected'));

        // Add selected class to current item
        items[index].classList.add('selected');

        // Scroll into view if needed
        items[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Add this to your CSS
    const style = document.createElement('style');
    style.textContent = `
        .highlight {
            background-color: rgba(25, 135, 84, 0.2);
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
});
document.addEventListener('DOMContentLoaded', function () {
    // Initialize Bootstrap dropdowns
    var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
        return new bootstrap.Dropdown(dropdownToggleEl);
    });

    // Add hover effect for desktop
    const accountDropdown = document.querySelector('.account-dropdown');
    const dropdownToggle = accountDropdown.querySelector('.dropdown-toggle');
    const dropdownMenu = accountDropdown.querySelector('.dropdown-menu');
    let dropdownInstance = bootstrap.Dropdown.getInstance(dropdownToggle);

    // Only apply hover behavior on desktop
    if (window.innerWidth >= 992) {
        let timeout;

        accountDropdown.addEventListener('mouseenter', function () {
            clearTimeout(timeout);
            dropdownInstance.show();
        });

        accountDropdown.addEventListener('mouseleave', function () {
            timeout = setTimeout(() => {
                dropdownInstance.hide();
            }, 200);
        });
    }

    // Cart badge animation on changes
    function animateCartBadge() {
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            cartBadge.classList.add('badge-animation');
            setTimeout(() => {
                cartBadge.classList.remove('badge-animation');
            }, 1000);
        }
    }

    // Add this to your CSS
    const style = document.createElement('style');
    style.textContent = `
        .badge-animation {
            animation: badgePop 0.5s ease;
        }
        
        @keyframes badgePop {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // Call this function when cart is updated
    // For example, you can call it after adding an item to cart via AJAX
    // animateCartBadge();
});
document.addEventListener('DOMContentLoaded', function () {
    // Initialize Bootstrap dropdowns
    var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
        return new bootstrap.Dropdown(dropdownToggleEl);
    });

    // Add hover effect for desktop
    const accountDropdown = document.querySelector('.account-dropdown');
    const dropdownToggle = accountDropdown.querySelector('.dropdown-toggle');
    const dropdownMenu = accountDropdown.querySelector('.dropdown-menu');
    let dropdownInstance = bootstrap.Dropdown.getInstance(dropdownToggle);

    // Only apply hover behavior on desktop
    if (window.innerWidth >= 992) {
        let timeout;

        accountDropdown.addEventListener('mouseenter', function () {
            clearTimeout(timeout);
            dropdownInstance.show();
        });

        accountDropdown.addEventListener('mouseleave', function () {
            timeout = setTimeout(() => {
                dropdownInstance.hide();
            }, 200);
        });
    }
});
document.getElementById('current-year').textContent = new Date().getFullYear();

// Newsletter form submission
document.getElementById('newsletter-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;

    // Here you would typically send the email to your server
    console.log('Subscribed email:', email);

    // Show success message
    document.getElementById('success-message').style.display = 'block';

    // Clear the form
    this.reset();

    // Hide success message after 3 seconds
    setTimeout(function () {
        document.getElementById('success-message').style.display = 'none';
    }, 3000);
});

// Check if current page is login page and hide specific paragraph
document.addEventListener('DOMContentLoaded', function () {
    // Method 1: Check if URL contains "login" (adjust based on your URL structure)
    const isLoginPage = window.location.href.toLowerCase().includes('login');

    // Method 2: Alternative - check for a specific element that only exists on the login page
    // const loginForm = document.getElementById('login-form');
    // const isLoginPage = loginForm !== null;

    if (isLoginPage) {
        // Replace 'about-paragraph' with the ID of the paragraph you want to hide
        const paragraphToHide = document.getElementById('about-paragraph');
        if (paragraphToHide) {
            paragraphToHide.style.display = 'none';
        }

        // You can hide multiple elements if needed
        // const newsletterParagraph = document.getElementById('newsletter-paragraph');
        // if (newsletterParagraph) {
        //     newsletterParagraph.style.display = 'none';
        // }
    }
});