/**
 * CampusTaste Reviews - Front-End Logic
 * Group #22: Lobitaña, Castro, Gonzales
 */

// ============ SPOTS DATA ============
const SPOTS_DATA = {
    'agno-food-court': {
        name: 'Agno Food Court',
        image: 'images/agnofoodcourt.jpg',
        rating: '4.2',
        reviewCount: 156,
        desc: "The ultimate student hub for affordable meals. Home to the legendary Ate Rica's Bacsilog and diverse budget-friendly stalls.",
        address: 'Fidel Reyes St., Malate, Manila',
        hours: '7:00 AM - 7:00 PM',
        tag: 'Budget Friendly',
        locationDesc: 'Located right behind the Henry Sy Sr. Hall, access via Fidel Reyes St.'
    },
    'mcdonalds': {
        name: "McDonald's La Salle",
        image: "images/mcdonald's.jpg",
        rating: '4.0',
        reviewCount: 89,
        desc: 'A 24/7 landmark for Lasallians. Ideal for quick breakfast runs, midnight study snacks, or meeting up before class.',
        address: 'Taft Ave. cor. Estrada St., Malate, Manila',
        hours: '24 Hours',
        tag: 'Fast Food',
        locationDesc: 'Situated at the corner of Taft Ave. and Estrada St., just a short walk from the DLSU gate.'
    },
    'barn-by-borro': {
        name: 'The Barn by Borro',
        image: 'images/thebarnbyborro.jpg',
        rating: '4.7',
        reviewCount: 64,
        desc: 'Premium comfort food with a rustic vibe. Known for their hearty rice bowls, pastas, and upscale student dining experience.',
        address: '2232 Fidel Reyes St., Malate, Manila',
        hours: '10:00 AM - 9:00 PM',
        tag: 'Casual Dining',
        locationDesc: 'Along Fidel Reyes St., a short walk from the DLSU campus.'
    },
    'tinuhog-ni-benny': {
        name: 'Tinuhog ni Benny',
        image: "images/tinuhognibenny's.jpg",
        rating: '4.5',
        reviewCount: 102,
        desc: 'Affordable and authentic Filipino BBQ. A go-to spot for students craving grilled liempo and unlimited rice options.',
        address: 'Estrada St. cor. Leon Guinto St., Malate, Manila',
        hours: '10:00 AM - 8:00 PM',
        tag: 'Filipino BBQ',
        locationDesc: 'At the corner of Estrada and Leon Guinto, near the DLSU dorms area.'
    },
    'el-poco-cantina': {
        name: 'El Poco Cantina',
        image: 'images/elpococantina.jpg',
        rating: '4.6',
        reviewCount: 47,
        desc: 'Small spot, big flavor. Specializes in Birria tacos and Mexican-inspired bowls that are perfect for a heavy lunch.',
        address: '1815 Taft Ave., Malate, Manila',
        hours: '11:00 AM - 9:00 PM',
        tag: 'Mexican',
        locationDesc: 'Along Taft Ave., near the college strip area.'
    },
    'jollibee-taft': {
        name: 'Jollibee Taft',
        image: 'images/jollibee.jpg',
        rating: '4.1',
        reviewCount: 210,
        desc: "Everyone's favorite fast food chain. A Taft staple for Chickenjoy, palabok, and budget-friendly Yumburgers.",
        address: 'Taft Ave., Malate, Manila',
        hours: '6:00 AM - 12:00 AM',
        tag: 'Fast Food',
        locationDesc: 'Along Taft Ave., easily accessible from the main DLSU entrance.'
    },
    'mang-inasal': {
        name: 'Mang Inasal',
        image: 'images/manginasal.jpg',
        rating: '4.3',
        reviewCount: 133,
        desc: 'Home of unlimited rice and grilled chicken. A top choice for hungry students who need a big meal on a small budget.',
        address: 'Pedro Gil St., Malate, Manila',
        hours: '10:00 AM - 9:00 PM',
        tag: 'Filipino BBQ',
        locationDesc: 'Along Pedro Gil St., a short jeepney ride from DLSU.'
    },
    'illo-japanese': {
        name: 'Illo Japanese Restaurant',
        image: 'images/illo.jpg',
        rating: '3.5',
        reviewCount: 18,
        desc: 'A Japanese restaurant inside One Archers Place offering dine-in and takeout. Known for affordable Japanese meals ranging from ₱200–400 per person.',
        address: '2nd Floor, One Archers Place, Taft Ave., Malate, Manila',
        hours: '10:00 AM - 9:00 PM',
        tag: 'Japanese',
        locationDesc: 'Located on the 2nd floor of One Archers Place along Taft Ave., right beside the DLSU campus.'
    },
    '711-taft': {
        name: '7-Eleven Taft',
        image: 'images/711.jpg',
        rating: '3.8',
        reviewCount: 55,
        desc: 'The ultimate convenience store for quick snacks, energy drinks, and instant meals. Open 24/7 for late-night cravings.',
        address: 'Taft Ave., Malate, Manila',
        hours: '24 Hours',
        tag: 'Convenience Store',
        locationDesc: 'Right on Taft Ave., accessible at any hour for emergency snack runs.'
    }
};

// ============ FRONT-END VALIDATION HELPERS ============

/**
 * Show an inline error message below an input field.
 */
function showFieldError(inputEl, message) {
    clearFieldError(inputEl);
    inputEl.style.borderColor = '#dc2626';
    const err = document.createElement('span');
    err.className = 'field-error';
    err.style.cssText = 'color:#dc2626;font-size:0.8rem;display:block;margin-top:4px;';
    err.textContent = message;
    inputEl.parentNode.insertBefore(err, inputEl.nextSibling);
}

function clearFieldError(inputEl) {
    inputEl.style.borderColor = '';
    const existing = inputEl.parentNode.querySelector('.field-error');
    if (existing) existing.remove();
}

function clearAllErrors(formEl) {
    formEl.querySelectorAll('.field-error').forEach(e => e.remove());
    formEl.querySelectorAll('input, textarea').forEach(el => { el.style.borderColor = ''; });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate login form fields.
 * Returns true if valid, false otherwise (and shows errors).
 */
function validateLoginForm() {
    const emailEl = document.getElementById('login-email');
    const passwordEl = document.getElementById('login-password');
    const form = document.getElementById('loginForm');
    clearAllErrors(form);
    let valid = true;

    if (!emailEl.value.trim()) {
        showFieldError(emailEl, 'Email is required.');
        valid = false;
    } else if (!isValidEmail(emailEl.value.trim())) {
        showFieldError(emailEl, 'Please enter a valid email address.');
        valid = false;
    }

    if (!passwordEl.value) {
        showFieldError(passwordEl, 'Password is required.');
        valid = false;
    }

    return valid;
}

/**
 * Validate register form fields.
 * Returns true if valid, false otherwise (and shows errors).
 */
function validateRegisterForm() {
    const nameEl = document.getElementById('reg-name');
    const emailEl = document.getElementById('reg-email');
    const passwordEl = document.getElementById('reg-password');
    const confirmEl = document.getElementById('reg-confirm-password');
    const form = document.getElementById('registerForm');
    clearAllErrors(form);
    let valid = true;

    if (!nameEl.value.trim()) {
        showFieldError(nameEl, 'Full name is required.');
        valid = false;
    } else if (nameEl.value.trim().length < 2) {
        showFieldError(nameEl, 'Name must be at least 2 characters.');
        valid = false;
    }

    if (!emailEl.value.trim()) {
        showFieldError(emailEl, 'Email is required.');
        valid = false;
    } else if (!isValidEmail(emailEl.value.trim())) {
        showFieldError(emailEl, 'Please enter a valid email address.');
        valid = false;
    }

    if (!passwordEl.value) {
        showFieldError(passwordEl, 'Password is required.');
        valid = false;
    } else if (passwordEl.value.length < 8) {
        showFieldError(passwordEl, 'Password must be at least 8 characters.');
        valid = false;
    }

    if (!confirmEl.value) {
        showFieldError(confirmEl, 'Please confirm your password.');
        valid = false;
    } else if (confirmEl.value !== passwordEl.value) {
        showFieldError(confirmEl, 'Passwords do not match.');
        valid = false;
    }

    return valid;
}

/**
 * Validate review modal form.
 * Returns true if valid.
 */
function validateReviewForm() {
    const establishmentEl = document.getElementById('rev-establishment');
    const titleEl = document.getElementById('rev-title');
    const bodyEl = document.getElementById('rev-body');
    const ratingSelected = document.querySelector('input[name="star"]:checked');
    const form = document.querySelector('.review-form');
    clearAllErrors(form);
    let valid = true;

    if (!establishmentEl.value.trim()) {
        showFieldError(establishmentEl, 'Establishment is required.');
        valid = false;
    }

    if (!ratingSelected) {
        // Show error near rating section
        const ratingDiv = document.querySelector('.rating-input');
        let err = ratingDiv.nextSibling;
        const existing = ratingDiv.parentNode.querySelector('.rating-error');
        if (!existing) {
            const errEl = document.createElement('span');
            errEl.className = 'field-error rating-error';
            errEl.style.cssText = 'color:#dc2626;font-size:0.8rem;display:block;margin-top:4px;';
            errEl.textContent = 'Please select a star rating.';
            ratingDiv.insertAdjacentElement('afterend', errEl);
        }
        valid = false;
    }

    if (!titleEl.value.trim()) {
        showFieldError(titleEl, 'Review title is required.');
        valid = false;
    } else if (titleEl.value.trim().length < 5) {
        showFieldError(titleEl, 'Title must be at least 5 characters.');
        valid = false;
    }

    if (!bodyEl.value.trim()) {
        showFieldError(bodyEl, 'Review body is required.');
        valid = false;
    } else if (bodyEl.value.trim().length < 10) {
        showFieldError(bodyEl, 'Review must be at least 10 characters.');
        valid = false;
    }

    return valid;
}

// ============ SESSION / AUTH STATE ============

// Cached session user — synced from server on page load
let _currentUser = null;

/**
 * Fetch current session from server and sync localStorage + UI.
 * Returns the user object if logged in, or null.
 */
async function syncSession() {
    try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
            const data = await res.json();
            _currentUser = data;
            // Keep localStorage in sync for UI convenience
            localStorage.setItem('currentUser', JSON.stringify({
                userId: data.userId,
                userName: data.userName,
                email: data.email,
                avatar: data.avatar,
                bio: data.bio
            }));
            return data;
        } else {
            _currentUser = null;
            localStorage.removeItem('currentUser');
            return null;
        }
    } catch (err) {
        // Fallback to localStorage if network error
        const stored = localStorage.getItem('currentUser');
        _currentUser = stored ? JSON.parse(stored) : null;
        return _currentUser;
    }
}

function getCurrentUser() {
    if (_currentUser) return _currentUser;
    const stored = localStorage.getItem('currentUser');
    try {
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        return null;
    }
}

// ============ NAV UI ============

function updateAuthUI() {
    const user = getCurrentUser();
    const navProfile = document.querySelector('.nav-profile');
    const writeReviewBtn = document.getElementById('openReviewModal');

    const allNavLinks = document.querySelectorAll('.nav-links a');
    const loginLink = Array.from(allNavLinks).find(a => {
        const text = a.textContent.trim().toLowerCase();
        return text === 'login/register' || text === 'login' || text === 'register';
    });

    const logoutLink = Array.from(allNavLinks).find(a => 
        a.textContent.toLowerCase().includes('logout')
    );

    if (user) {
        if (navProfile) {
            navProfile.style.display = 'inline-flex';
            const img = navProfile.querySelector('img');
            const span = navProfile.querySelector('span');
            if (img) img.src = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName)}&background=059669&color=fff`;
            if (span) span.textContent = user.userName;
        }
        if (loginLink) loginLink.parentElement.style.display = 'none';
        if (logoutLink) {
            logoutLink.style.display = 'block';
            if (logoutLink.parentElement) logoutLink.parentElement.style.display = 'block';
        }
        if (writeReviewBtn) writeReviewBtn.style.display = 'inline-block';
    } else {
        if (navProfile) navProfile.style.display = 'none';
        if (loginLink) loginLink.parentElement.style.display = 'block';
        if (logoutLink) {
            logoutLink.style.display = 'none';
            if (logoutLink.parentElement) logoutLink.parentElement.style.display = 'none';
        }
        if (writeReviewBtn) writeReviewBtn.style.display = 'none';
    }
}

// ============ AUTH HANDLERS ============

async function handleLogin(event) {
    event.preventDefault();

    // Front-end validation first
    if (!validateLoginForm()) return;

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const loginMessage = document.getElementById('loginMessage');

    const submitBtn = event.target.querySelector('[type="submit"]');
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (response.ok) {
            _currentUser = data;
            localStorage.setItem('currentUser', JSON.stringify({
                userId: data.userId,
                userName: data.userName,
                email: data.email,
                avatar: data.avatar,
                bio: data.bio || ''
            }));
            loginMessage.innerHTML = '<div style="color:green;padding:8px;background:#f0fdf4;border-radius:6px;margin-top:10px;">Login successful! Redirecting...</div>';
            setTimeout(() => window.location.href = 'index.html', 1000);
        } else {
            loginMessage.innerHTML = `<div style="color:#dc2626;padding:8px;background:#fef2f2;border-radius:6px;margin-top:10px;">${data.error || 'Login failed. Please try again.'}</div>`;
        }
    } catch (err) {
        loginMessage.innerHTML = `<div style="color:#dc2626;padding:8px;background:#fef2f2;border-radius:6px;margin-top:10px;">Connection error. Please try again.</div>`;
    } finally {
        submitBtn.textContent = 'Login';
        submitBtn.disabled = false;
    }
}

async function handleRegister(event) {
    event.preventDefault();

    // Front-end validation first
    if (!validateRegisterForm()) return;

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const registerMessage = document.getElementById('registerMessage');

    const submitBtn = event.target.querySelector('[type="submit"]');
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, confirmPassword })
        });
        const data = await response.json();

        if (response.ok) {
            _currentUser = data;
            localStorage.setItem('currentUser', JSON.stringify({
                userId: data.userId,
                userName: data.userName,
                email: data.email,
                avatar: data.avatar,
                bio: ''
            }));
            registerMessage.innerHTML = '<div style="color:green;padding:8px;background:#f0fdf4;border-radius:6px;margin-top:10px;">Account created! Redirecting to your profile...</div>';
            setTimeout(() => window.location.href = 'profile.html', 1000);
        } else {
            registerMessage.innerHTML = `<div style="color:#dc2626;padding:8px;background:#fef2f2;border-radius:6px;margin-top:10px;">${data.error}</div>`;
        }
    } catch (err) {
        registerMessage.innerHTML = '<div style="color:#dc2626;padding:8px;background:#fef2f2;border-radius:6px;margin-top:10px;">Connection error. Please try again.</div>';
    } finally {
        submitBtn.textContent = 'Create Account';
        submitBtn.disabled = false;
    }
}

async function logout() {
    try {
        await fetch('/api/users/logout', { method: 'POST' });
    } catch (err) {
        // Proceed even if request fails
    }
    _currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ============ SPOT PAGE ============

async function loadSpotPage() {
    const params = new URLSearchParams(window.location.search);
    const spotId = params.get('id');

    if (!spotId || !SPOTS_DATA[spotId]) {
        document.getElementById('spot-name').textContent = 'Spot not found';
        document.getElementById('reviews-container').innerHTML =
            '<p style="text-align:center;color:#999;padding:40px;">This spot does not exist. <a href="establishments.html">Browse all spots</a>.</p>';
        return;
    }

    const spot = SPOTS_DATA[spotId];

    document.title = `${spot.name} - CampusTaste Reviews`;
    const pageTitleEl = document.getElementById('page-title');
    if (pageTitleEl) pageTitleEl.textContent = `${spot.name} - CampusTaste Reviews`;
    document.getElementById('breadcrumb-name').textContent = spot.name;
    document.getElementById('spot-name').textContent = spot.name;
    document.getElementById('spot-desc').textContent = spot.desc;
    document.getElementById('spot-address').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${spot.address}`;
    document.getElementById('spot-hours').innerHTML = `<i class="fas fa-clock"></i> ${spot.hours}`;
    document.getElementById('spot-tag').innerHTML = `<i class="fas fa-wallet"></i> ${spot.tag}`;
    document.getElementById('spot-location-desc').textContent = spot.locationDesc;

    const revEstablishment = document.getElementById('rev-establishment');
    if (revEstablishment) revEstablishment.value = spot.name;

    await loadSpotReviews(spot.name, 'newest');

    // Update live stats from DB
    try {
        const statsRes = await fetch(`/api/posts/establishment/${encodeURIComponent(spot.name)}/count`);
        const stats = await statsRes.json();
        const ratingEl = document.getElementById('spot-rating');
        const countEl = document.getElementById('spot-review-count');
        if (ratingEl) ratingEl.textContent = stats.avgRating > 0 ? `${stats.avgRating} ★` : `${spot.rating} ★`;
        if (countEl) countEl.textContent = `Based on ${stats.count} student review${stats.count !== 1 ? 's' : ''}`;
    } catch {
        document.getElementById('spot-rating').textContent = `${spot.rating} ★`;
        document.getElementById('spot-review-count').textContent = `Based on ${spot.reviewCount} student reviews`;
    }

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => loadSpotReviews(spot.name, sortSelect.value));
    }
}

async function loadSpotReviews(establishmentName, sort = 'newest') {
    const container = document.getElementById('reviews-container');
    if (!container) return;

    container.innerHTML = '<p style="text-align:center;color:#999;padding:30px;">Loading reviews...</p>';

    try {
        const encoded = encodeURIComponent(establishmentName);
        const response = await fetch(`/api/posts/establishment/${encoded}?sort=${sort}`);
        const posts = await response.json();

        if (!response.ok || posts.length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:40px;color:#999;">
                    <i class="fas fa-comment-slash" style="font-size:2rem;margin-bottom:12px;display:block;"></i>
                    No reviews yet for this spot. Be the first to write one!
                </div>`;
            return;
        }

        const user = getCurrentUser();

        container.innerHTML = posts.map(post => {
            const stars = '★'.repeat(post.rating) + '☆'.repeat(5 - post.rating);
            const date = new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
            const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.userName)}&background=059669&color=fff`;
            const isOwner = user && String(user.userId) === String(post.userId);

            return `
                <article class="review-card" id="review-${post._id}">
                    <div class="review-user">
                        <img src="${avatar}" alt="${post.userName}">
                        <div>
                            <span class="username">${post.userName}</span>
                            <span class="date">Posted ${date}</span>
                        </div>
                        ${isOwner ? `
                        <button class="btn-delete-review" onclick="deleteReview('${post._id}')"
                            style="margin-left:auto;background:none;border:none;color:#dc2626;cursor:pointer;font-size:0.85rem;padding:4px 8px;">
                            <i class="fas fa-trash"></i> Delete
                        </button>` : ''}
                    </div>
                    <div class="review-content">
                        <div class="star-rating">${stars}</div>
                        <h3>${post.title}</h3>
                        <p>${post.content}</p>
                    </div>
                    <div class="review-footer">
                        <button class="btn-vote" onclick="voteOnPost('${post._id}', 'helpful', this)">
                            <i class="fas fa-thumbs-up"></i> Helpful (${post.helpfulCount || 0})
                        </button>
                        <button class="btn-vote" onclick="voteOnPost('${post._id}', 'unhelpful', this)">
                            <i class="fas fa-thumbs-down"></i> Unhelpful (${post.unhelpfulCount || 0})
                        </button>
                    </div>
                </article>
            `;
        }).join('');

    } catch (err) {
        console.error('Error loading reviews:', err);
        container.innerHTML = '<p style="text-align:center;color:red;padding:30px;">Error loading reviews. Please refresh.</p>';
    }
}

async function deleteReview(postId) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
        const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
        if (response.ok) {
            const card = document.getElementById(`review-${postId}`);
            if (card) card.remove();
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to delete review.');
        }
    } catch (err) {
        alert('Error deleting review. Please try again.');
    }
}

async function voteOnPost(postId, voteType, btn) {
    if (btn.classList.contains('voted')) {
        alert('You have already voted on this review.');
        return;
    }
    try {
        const response = await fetch(`/api/posts/${postId}/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ voteType })
        });
        if (response.ok) {
            const data = await response.json();
            const count = voteType === 'helpful' ? data.post.helpfulCount : data.post.unhelpfulCount;
            const label = voteType === 'helpful' ? 'Helpful' : 'Unhelpful';
            const icon = voteType === 'helpful' ? 'fa-thumbs-up' : 'fa-thumbs-down';
            btn.innerHTML = `<i class="fas ${icon}"></i> ${label} (${count})`;
            btn.classList.add('voted');
            btn.style.color = '#059669';
            btn.style.fontWeight = 'bold';
        }
    } catch (err) {
        alert('Error recording vote.');
    }
}

// ============ RECENT REVIEWS (index.html) ============

async function loadRecentReviews() {
    const container = document.querySelector('.reviews-container');
    if (!container) return;

    container.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">Loading reviews...</p>';

    try {
        const response = await fetch('/api/posts/recent');
        const posts = await response.json();

        if (!response.ok || !Array.isArray(posts) || posts.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">No reviews yet. Be the first to write one!</p>';
            return;
        }

        container.innerHTML = posts.map(post => {
            const stars = '★'.repeat(post.rating) + '☆'.repeat(5 - post.rating);
            const date = new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.userName)}&background=059669&color=fff`;
            const spotEntry = Object.entries(SPOTS_DATA).find(([, s]) => s.name === post.establishmentName);
            const spotLink = spotEntry ? `spot.html?id=${spotEntry[0]}` : 'establishments.html';
            return `
                <article class="review-card">
                    <div class="review-user">
                        <img src="${avatar}" alt="${post.userName}">
                        <div>
                            <span class="username">${post.userName}</span>
                            <span class="date">Posted ${date} &middot; <a href="${spotLink}" style="color:#059669;">${post.establishmentName}</a></span>
                        </div>
                    </div>
                    <div class="review-content">
                        <div class="star-rating">${stars}</div>
                        <h3>${post.title}</h3>
                        <p>${post.content}</p>
                    </div>
                    <div class="review-footer">
                        <button class="btn-vote" data-id="${post._id}" data-type="helpful"><i class="fas fa-thumbs-up"></i> Helpful (${post.helpfulCount || 0})</button>
                        <button class="btn-vote" data-id="${post._id}" data-type="unhelpful"><i class="fas fa-thumbs-down"></i> Unhelpful (${post.unhelpfulCount || 0})</button>
                    </div>
                </article>
            `;
        }).join('');

        container.addEventListener('click', async (e) => {
            const btn = e.target.closest('.btn-vote[data-id]');
            if (!btn) return;
            await voteOnPost(btn.dataset.id, btn.dataset.type, btn);
        });

    } catch (err) {
        console.error('Error loading recent reviews:', err);
        container.innerHTML = '<p style="text-align:center;color:red;padding:20px;">Error loading reviews. Please refresh.</p>';
    }
}

// ============ INDEX PAGE SEARCH ============

function initIndexSearch() {
    const searchInput = document.querySelector('.search-container input');
    const searchBtn = document.querySelector('.btn-search');
    const featuredGrid = document.getElementById('featured-grid');
    const searchResultsGrid = document.getElementById('search-results-grid');
    const suggestionsBox = document.getElementById('search-suggestions');

    if (!searchInput || !featuredGrid) return;

    const allSpots = Object.entries(SPOTS_DATA);

    const showFeatured = () => {
        featuredGrid.style.display = 'grid';
        if (searchResultsGrid) searchResultsGrid.style.display = 'none';
        if (suggestionsBox) { suggestionsBox.style.display = 'none'; suggestionsBox.innerHTML = ''; }
    };

    const performSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) { showFeatured(); return; }

        const matches = allSpots.filter(([, spot]) =>
            spot.name.toLowerCase().includes(query) ||
            spot.desc.toLowerCase().includes(query) ||
            spot.tag.toLowerCase().includes(query)
        );

        featuredGrid.style.display = 'none';
        if (suggestionsBox) { suggestionsBox.style.display = 'none'; suggestionsBox.innerHTML = ''; }

        if (searchResultsGrid) {
            searchResultsGrid.style.display = 'grid';
            if (matches.length === 0) {
                searchResultsGrid.innerHTML = `
                    <div style="grid-column:1/-1;text-align:center;padding:40px;color:#999;">
                        <i class="fas fa-search" style="font-size:2rem;margin-bottom:12px;display:block;"></i>
                        No spots found for "<strong>${query}</strong>". 
                        <a href="establishments.html" style="color:#059669;">Browse all spots</a>.
                    </div>`;
                return;
            }
            searchResultsGrid.innerHTML = matches.map(([id, spot]) => `
                <article class="card">
                    <div class="card-image">
                        <img src="${spot.image}" alt="${spot.name}"
                            onerror="this.src='https://placehold.co/400x250?text=${encodeURIComponent(spot.name)}'">
                    </div>
                    <div class="card-body">
                        <div class="card-title-row">
                            <h3>${spot.name}</h3>
                            <span class="rating">${spot.rating} ★</span>
                        </div>
                        <p class="card-text">${spot.desc}</p>
                        <div class="card-meta">
                            <span><i class="fas fa-map-marker-alt"></i> ${spot.address}</span>
                        </div>
                        <a href="spot.html?id=${id}" class="btn-block">Read Reviews</a>
                    </div>
                </article>
            `).join('');
        }
    };

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) { showFeatured(); return; }

        const matches = allSpots.filter(([, spot]) =>
            spot.name.toLowerCase().includes(query) ||
            spot.tag.toLowerCase().includes(query)
        );

        if (suggestionsBox && matches.length > 0) {
            suggestionsBox.style.display = 'block';
            suggestionsBox.innerHTML = matches.slice(0, 5).map(([id, spot]) => `
                <div class="suggestion-item" onclick="window.location.href='spot.html?id=${id}'"
                    style="padding:10px 16px;cursor:pointer;display:flex;align-items:center;gap:10px;border-bottom:1px solid #f3f4f6;">
                    <i class="fas fa-utensils" style="color:#059669;font-size:0.85rem;"></i>
                    <span style="font-weight:600;flex:1;color:#1f2937;">${spot.name}</span>
                    <small style="color:#9ca3af;">${spot.tag}</small>
                </div>
            `).join('');
        } else if (suggestionsBox) {
            suggestionsBox.style.display = 'none';
        }
    });

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') performSearch();
        if (e.key === 'Escape') showFeatured();
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container') && suggestionsBox) {
            suggestionsBox.style.display = 'none';
        }
    });
}

// ============ REVIEW MODAL ============

function initReviewModal() {
    const modal = document.getElementById('reviewModal');
    const openBtn = document.getElementById('openReviewModal');
    const closeBtn = document.querySelector('.close');
    const reviewForm = document.querySelector('.review-form');

    if (!modal || !openBtn) return;

    openBtn.onclick = (e) => {
        e.preventDefault();
        const user = getCurrentUser();
        if (!user) {
            alert('Please log in first to write a review.');
            window.location.href = 'login.html';
            return;
        }
        modal.style.display = 'flex';
    };

    if (closeBtn) closeBtn.onclick = () => { modal.style.display = 'none'; };
    window.addEventListener('click', (event) => {
        if (event.target === modal) modal.style.display = 'none';
    });

    if (reviewForm) {
        reviewForm.onsubmit = async (e) => {
            e.preventDefault();

            // Front-end validation
            if (!validateReviewForm()) return;

            const user = getCurrentUser();
            if (!user) { alert('Please log in first.'); window.location.href = 'login.html'; return; }

            const establishment = document.getElementById('rev-establishment').value.trim();
            const title = document.getElementById('rev-title').value.trim();
            const body = document.getElementById('rev-body').value.trim();
            const rating = parseInt(document.querySelector('input[name="star"]:checked')?.value);

            const submitBtn = reviewForm.querySelector('.btn-submit');
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/api/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        establishmentName: establishment,
                        title,
                        content: body,
                        rating
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    modal.style.display = 'none';
                    reviewForm.reset();

                    const sortSelect = document.getElementById('sort-select');
                    if (sortSelect) await loadSpotReviews(establishment, sortSelect.value);

                    const path = window.location.pathname;
                    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
                        await loadRecentReviews();
                    }
                    alert('Review submitted successfully!');
                } else {
                    alert(`Error: ${data.error}`);
                }
            } catch (err) {
                alert('Error submitting review. Please try again.');
            } finally {
                submitBtn.textContent = 'Submit Review';
                submitBtn.disabled = false;
            }
        };
    }
}

// ============ EDIT PROFILE MODAL ============

function initEditProfile() {
    const modal = document.getElementById('editModal');
    const btn = document.getElementById('editProfileBtn');
    const closeBtn = document.querySelector('.close-modal');
    const editForm = document.querySelector('.edit-form');

    if (!modal || !btn) return;

    // Pre-fill form with current values
    btn.onclick = () => {
        const user = getCurrentUser();
        if (!user) return;
        const nameInput = editForm.querySelector('input[type="text"]');
        const bioInput = editForm.querySelector('textarea');
        if (nameInput) nameInput.value = user.userName || '';
        if (bioInput) bioInput.value = user.bio || '';
        modal.style.display = 'block';
    };

    if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
    window.addEventListener('click', (event) => {
        if (event.target === modal) modal.style.display = 'none';
    });

    if (editForm) {
        editForm.onsubmit = async (e) => {
            e.preventDefault();
            const nameInput = editForm.querySelector('input[type="text"]');
            const bioInput = editForm.querySelector('textarea');
            const newName = nameInput ? nameInput.value.trim() : '';
            const newBio = bioInput ? bioInput.value.trim() : '';

            // Front-end validation
            if (!newName) {
                showFieldError(nameInput, 'Name is required.');
                return;
            }
            if (newName.length < 2) {
                showFieldError(nameInput, 'Name must be at least 2 characters.');
                return;
            }

            const user = getCurrentUser();
            if (!user) return;

            const saveBtn = editForm.querySelector('.btn-save');
            saveBtn.textContent = 'Saving...';
            saveBtn.disabled = true;

            try {
                const response = await fetch(`/api/users/${user.userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newName, bio: newBio })
                });
                const data = await response.json();

                if (response.ok) {
                    // Update local session cache
                    const updated = {
                        ...user,
                        userName: data.user.name,
                        avatar: data.user.avatar,
                        bio: data.user.bio
                    };
                    _currentUser = updated;
                    localStorage.setItem('currentUser', JSON.stringify(updated));

                    // Update profile page UI
                    const profileName = document.querySelector('.profile-name');
                    const profileBio = document.querySelector('.profile-bio');
                    const profileAvatar = document.querySelector('.profile-avatar');
                    if (profileName) profileName.textContent = data.user.name;
                    if (profileBio) profileBio.textContent = data.user.bio;
                    if (profileAvatar) profileAvatar.src = data.user.avatar;

                    updateAuthUI();
                    modal.style.display = 'none';
                    alert('Profile updated successfully!');
                } else {
                    alert(`Error: ${data.error}`);
                }
            } catch (err) {
                alert('Error updating profile. Please try again.');
            } finally {
                saveBtn.textContent = 'Save Changes';
                saveBtn.disabled = false;
            }
        };
    }
}

// ============ VOTING (legacy for hardcoded cards) ============

function initVoting() {
    const voteButtons = document.querySelectorAll('.btn-vote:not([onclick])');
    voteButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            if (this.classList.contains('voted')) { alert('You have already voted.'); return; }
            const match = this.innerHTML.match(/\d+/);
            if (match) {
                this.innerHTML = this.innerHTML.replace(/\d+/, parseInt(match[0]) + 1);
                this.classList.add('voted');
                this.style.color = '#059669';
                this.style.fontWeight = 'bold';
            }
        });
    });
}

// ============ PROFILE PAGE ============

async function loadProfilePage() {
    const user = getCurrentUser();
    if (!user) { window.location.href = 'login.html'; return; }

    // Update sidebar
    const profileNameEl = document.querySelector('.profile-name');
    const profileHandleEl = document.querySelector('.profile-handle');
    const profileBioEl = document.querySelector('.profile-bio');
    const profileAvatarEl = document.querySelector('.profile-avatar');
    const navProfileImg = document.querySelector('.nav-profile img');

    if (profileNameEl) profileNameEl.textContent = user.userName;
    if (profileHandleEl) profileHandleEl.textContent = '@' + user.userName.replace(/\s+/g, '_').toLowerCase();
    if (profileBioEl) profileBioEl.textContent = user.bio || 'No bio yet. Edit your profile to add one!';
    const avatarSrc = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName)}&background=059669&color=fff`;
    if (profileAvatarEl) profileAvatarEl.src = avatarSrc;
    if (navProfileImg) navProfileImg.src = avatarSrc;

    await loadUserPosts();
}

// loadUserPosts is called from profile.html inline script — must be defined here
async function loadUserPosts() {
    const user = getCurrentUser();
    if (!user) return;

    const reviewsContainer = document.querySelector('.profile-content');
    if (!reviewsContainer) return;

    try {
        const response = await fetch(`/api/posts/user/${user.userId}`);
        const posts = await response.json();

        const reviewCountEl = document.getElementById('review-count');
        if (reviewCountEl) reviewCountEl.textContent = posts.length;

        const totalHelpful = posts.reduce((sum, p) => sum + (p.helpfulCount || 0), 0);
        const helpfulCountEl = document.getElementById('helpful-count');
        if (helpfulCountEl) helpfulCountEl.textContent = totalHelpful;

        reviewsContainer.innerHTML = '<div class="content-header"><h2>My Recent Reviews</h2></div>';

        if (posts.length === 0) {
            reviewsContainer.querySelector('.content-header').insertAdjacentHTML('afterend',
                '<p style="text-align:center;color:#999;padding:20px;">No reviews yet. <a href="establishments.html" style="color:#059669;">Find a spot to review!</a></p>');
            return;
        }

        posts.forEach(post => {
            const date = new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
            const spotEntry = Object.entries(SPOTS_DATA).find(([, s]) => s.name === post.establishmentName);
            const spotLink = spotEntry ? `spot.html?id=${spotEntry[0]}` : '#';

            const card = document.createElement('article');
            card.className = 'history-card';
            card.id = `profile-review-${post._id}`;
            card.innerHTML = `
                <div class="history-header">
                    <h3>${post.title}</h3>
                    <span class="history-stars">${'★'.repeat(post.rating)}${'☆'.repeat(5 - post.rating)}</span>
                </div>
                <p class="history-text">"${post.content}"</p>
                <p style="color:#666;font-size:0.9em;margin:8px 0;">
                    Establishment: <a href="${spotLink}" style="color:#059669;font-weight:600;">${post.establishmentName}</a>
                </p>
                <div class="history-footer">
                    <span>${date}</span>
                    <div class="history-actions">
                        <a href="#" class="delete-link" onclick="deleteProfileReview('${post._id}'); return false;">
                            <i class="fas fa-trash"></i> Delete
                        </a>
                    </div>
                </div>
            `;
            reviewsContainer.appendChild(card);
        });

    } catch (err) {
        console.error('Error loading user posts:', err);
        if (reviewsContainer) {
            reviewsContainer.innerHTML = '<p style="text-align:center;color:red;padding:20px;">Error loading reviews. Please refresh.</p>';
        }
    }
}

async function deleteProfileReview(postId) {
    if (!confirm('Delete this review?')) return;
    try {
        const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
        if (response.ok) {
            const card = document.getElementById(`profile-review-${postId}`);
            if (card) card.remove();
            await loadUserPosts(); // Refresh counters
        } else {
            const data = await response.json();
            alert(data.error || 'Failed to delete review.');
        }
    } catch (err) {
        alert('Error deleting review.');
    }
}

// ============ UPDATE CARD RATINGS ============

/**
 * Fetch and update the rating display for all establishment cards.
 * Called on pages that display establishment cards (index.html, establishments.html).
 */
async function updateCardRatings() {
    const ratingElements = document.querySelectorAll('.card-title-row .rating');
    
    for (const ratingEl of ratingElements) {
        // Extract establishment name from the card
        const card = ratingEl.closest('.card');
        const spotName = card.querySelector('h3').textContent.trim();
        
        try {
            const response = await fetch(`/api/posts/establishment/${encodeURIComponent(spotName)}/count`);
            if (response.ok) {
                const stats = await response.json();
                // Update with average rating if there are reviews, otherwise keep original
                if (stats.avgRating > 0) {
                    ratingEl.textContent = `${stats.avgRating} ★`;
                }
            }
        } catch (err) {
            console.error(`Error fetching rating for ${spotName}:`, err);
            // Keep original rating if API call fails
        }
    }
}

// ============ INITIALIZE ============

document.addEventListener('DOMContentLoaded', async () => {
    // Sync session with server first, then update UI
    await syncSession();
    updateAuthUI();

    initReviewModal();
    initVoting();
    initEditProfile();

    const path = window.location.pathname;

    if (path.includes('profile.html')) {
        loadProfilePage();
    }

    if (path.includes('spot.html')) {
        loadSpotPage();
    }

    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        initIndexSearch();
        loadRecentReviews();
        // Update card ratings with actual database averages
        updateCardRatings();
    }

    if (path.includes('establishments.html')) {
        // Update card ratings after browse page is rendered
        setTimeout(() => updateCardRatings(), 100);
    }
});
