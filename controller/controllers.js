const express = require("express");
const bcrypt = require("bcrypt");
const { User, Post, Reply } = require("../model/models");

const router = express.Router();

// ============ VALIDATION HELPERS ============

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    return password && password.length >= 8;
}

// ============ AUTH MIDDLEWARE ============

function requireAuth(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: "You must be logged in to perform this action." });
    }
    next();
}

// ============ SESSION STATUS ROUTE ============

router.get("/api/auth/me", async (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ loggedIn: false });
    }
    try {
        const user = await User.findById(req.session.userId).select("-password");
        if (!user) {
            req.session.destroy();
            return res.status(401).json({ loggedIn: false });
        }
        res.json({
            loggedIn: true,
            userId: user._id,
            userName: user.name,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ USER ROUTES ============

router.post("/api/users/register", async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword)
        return res.status(400).json({ error: "All fields are required." });

    if (name.trim().length < 2)
        return res.status(400).json({ error: "Name must be at least 2 characters." });

    if (!validateEmail(email))
        return res.status(400).json({ error: "Please enter a valid email address." });

    if (!validatePassword(password))
        return res.status(400).json({ error: "Password must be at least 8 characters." });

    if (password !== confirmPassword)
        return res.status(400).json({ error: "Passwords do not match." });

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser)
            return res.status(400).json({ error: "An account with this email already exists." });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=059669&color=fff`
        });
        await newUser.save();

        req.session.userId = newUser._id;
        req.session.userName = newUser.name;

        res.status(201).json({
            message: "Registration successful.",
            userId: newUser._id,
            userName: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/api/users/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: "Email and password are required." });

    if (!validateEmail(email))
        return res.status(400).json({ error: "Please enter a valid email address." });

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user)
            return res.status(401).json({ error: "Invalid email or password." });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch)
            return res.status(401).json({ error: "Invalid email or password." });

        req.session.userId = user._id;
        req.session.userName = user.name;

        res.json({
            message: "Login successful.",
            userId: user._id,
            userName: user.name,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/api/users/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: "Could not log out." });
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out successfully." });
    });
});

router.get("/api/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ error: "User not found." });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/api/users/:id", requireAuth, async (req, res) => {
    if (String(req.session.userId) !== String(req.params.id))
        return res.status(403).json({ error: "You can only edit your own profile." });

    const { name, bio } = req.body;

    if (name && name.trim().length < 2)
        return res.status(400).json({ error: "Name must be at least 2 characters." });

    try {
        const updates = {};
        if (name) {
            updates.name = name.trim();
            updates.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=059669&color=fff`;
        }
        if (bio !== undefined) updates.bio = bio.trim();

        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
        if (!user) return res.status(404).json({ error: "User not found." });

        if (name) req.session.userName = name.trim();

        res.json({ message: "Profile updated.", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ POST ROUTES ============

router.post("/api/posts", requireAuth, async (req, res) => {
    const { establishmentName, title, content, rating } = req.body;

    if (!establishmentName || !title || !content || !rating)
        return res.status(400).json({ error: "All fields are required." });

    if (title.trim().length < 5)
        return res.status(400).json({ error: "Review title must be at least 5 characters." });

    if (content.trim().length < 10)
        return res.status(400).json({ error: "Review body must be at least 10 characters." });

    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5)
        return res.status(400).json({ error: "Rating must be between 1 and 5." });

    try {
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(404).json({ error: "User not found." });

        const newPost = new Post({
            userId: req.session.userId,
            userName: user.name,
            establishmentName: establishmentName.trim(),
            title: title.trim(),
            content: content.trim(),
            rating: ratingNum
        });
        await newPost.save();
        res.status(201).json({ message: "Review submitted successfully.", post: newPost });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/api/posts", async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/api/posts/recent", async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).limit(5);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/api/posts/user/:userId", async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/api/posts/establishment/:name", async (req, res) => {
    try {
        const { sort } = req.query;
        let sortObj = { createdAt: -1 };
        if (sort === "highest") sortObj = { rating: -1, createdAt: -1 };
        if (sort === "helpful") sortObj = { helpfulCount: -1, createdAt: -1 };
        const posts = await Post.find({ establishmentName: req.params.name }).sort(sortObj);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/api/posts/establishment/:name/count", async (req, res) => {
    try {
        const posts = await Post.find({ establishmentName: req.params.name });
        const count = posts.length;
        const totalRating = posts.reduce((sum, p) => sum + p.rating, 0);
        const avgRating = count > 0 ? (totalRating / count).toFixed(1) : 0;
        res.json({ count, avgRating });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/api/posts/:id/vote", requireAuth, async (req, res) => {
    const { voteType } = req.body;
    if (!["helpful", "unhelpful"].includes(voteType))
        return res.status(400).json({ error: "Invalid vote type." });

    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Review not found." });

        if (voteType === "helpful") post.helpfulCount += 1;
        else post.unhelpfulCount += 1;

        await post.save();
        res.json({ message: "Vote recorded.", post });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/api/posts/:id", requireAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Review not found." });
        if (String(post.userId) !== String(req.session.userId))
            return res.status(403).json({ error: "You can only delete your own reviews." });

        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: "Review deleted successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/api/posts/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Review not found." });
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ REPLY ROUTES ============

router.post("/api/posts/:id/replies", requireAuth, async (req, res) => {
    const { content } = req.body;

    if (!content || content.trim().length < 2)
        return res.status(400).json({ error: "Reply must be at least 2 characters." });

    try {
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(404).json({ error: "User not found." });

        const newReply = new Reply({
            postId: req.params.id,
            userId: req.session.userId,
            userName: user.name,
            content: content.trim()
        });
        await newReply.save();
        res.status(201).json({ message: "Reply added.", reply: newReply });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/api/posts/:id/replies", async (req, res) => {
    try {
        const replies = await Reply.find({ postId: req.params.id }).sort({ createdAt: 1 });
        res.json(replies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/api/replies/:id", requireAuth, async (req, res) => {
    try {
        const reply = await Reply.findById(req.params.id);
        if (!reply) return res.status(404).json({ error: "Reply not found." });
        if (String(reply.userId) !== String(req.session.userId))
            return res.status(403).json({ error: "You can only delete your own replies." });

        await Reply.findByIdAndDelete(req.params.id);
        res.json({ message: "Reply deleted." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ SEED ROUTE ============

router.get("/api/seed", async (req, res) => {
    try {
        let seedUser = await User.findOne({ email: "seed@campustaste.com" });
        if (!seedUser) {
            const hashedPassword = await bcrypt.hash("password123", 10);
            seedUser = new User({
                name: "CampusTaste Admin",
                email: "seed@campustaste.com",
                password: hashedPassword,
                avatar: "https://ui-avatars.com/api/?name=CampusTaste+Admin&background=059669&color=fff"
            });
            await seedUser.save();
        }

        const names = ["Miguel Jethro G. Castro", "Elijah Joseph E. Lobitaña", "Charlz Jefferson C. Gonzales"];

        const sampleReviews = [
            // Agno Food Court
            { establishmentName: "Agno Food Court", title: "The Legendary Ate Rica's Bacsilog", content: "You can't go to Agno and not get Ate Rica's Bacsilog. The cheese sauce is just as good as ever! A consistent 10/10 every time.", rating: 5, helpfulCount: 45, createdAt: new Date(Date.now() - 2 * 86400000) },
            { establishmentName: "Agno Food Court", title: "Solid Chicken from Good Munch", content: "If you're looking for a heavy meal, Good Munch is the way to go. Their chicken combos are filling and great value for the price.", rating: 4, helpfulCount: 22, createdAt: new Date(Date.now() - 4 * 86400000) },
            { establishmentName: "Agno Food Court", title: "Caffeine Fix at EZpresso", content: "If you're pulling an all-nighter, EZpresso is a lifesaver. Their iced coffee is strong and actually tastes like coffee, not just sugar.", rating: 5, helpfulCount: 15, createdAt: new Date(Date.now() - 7 * 86400000) },
            { establishmentName: "Agno Food Court", title: "Customizable Mongolian Bowl", content: "I love the Mongolian Bowl stall because I can choose exactly what goes into my meal. A bit of a wait during lunch rush but worth it.", rating: 4, helpfulCount: 12, createdAt: new Date(Date.now() - 7 * 86400000) },
            { establishmentName: "Agno Food Court", title: "Kuya Mel's is a classic", content: "Kuya Mel's has been a staple for a reason. Their rice meals are generous and perfect for students on a budget.", rating: 5, helpfulCount: 30, createdAt: new Date(Date.now() - 14 * 86400000) },
            // McDonald's
            { establishmentName: "McDonald's La Salle", title: "Best 24/7 Option Near Campus", content: "Nothing beats walking here after a late-night study session. Affordable, consistent, and always open.", rating: 4, helpfulCount: 18, createdAt: new Date(Date.now() - 1 * 86400000) },
            { establishmentName: "McDonald's La Salle", title: "Breakfast McSavers is a steal", content: "For less than 80 pesos you get a full breakfast. Perfect for early 7AM classes when you have no time to cook.", rating: 5, helpfulCount: 33, createdAt: new Date(Date.now() - 3 * 86400000) },
            { establishmentName: "McDonald's La Salle", title: "Gets crowded during lunch", content: "Food is good as always but it gets really packed between 12-1PM. Try to go before or after the rush.", rating: 3, helpfulCount: 9, createdAt: new Date(Date.now() - 5 * 86400000) },
            { establishmentName: "McDonald's La Salle", title: "McFlurry after finals", content: "Rewarded myself with a McFlurry after my last final exam. The simple joys of student life.", rating: 5, helpfulCount: 25, createdAt: new Date(Date.now() - 10 * 86400000) },
            { establishmentName: "McDonald's La Salle", title: "Reliable and consistent", content: "You know exactly what you're getting every time. That consistency is underrated when you're on a tight schedule.", rating: 4, helpfulCount: 14, createdAt: new Date(Date.now() - 12 * 86400000) },
            // The Barn by Borro
            { establishmentName: "The Barn by Borro", title: "Best Pasta Near DLSU", content: "Their creamy carbonara is genuinely one of the best I've had near campus. Worth every peso.", rating: 5, helpfulCount: 28, createdAt: new Date(Date.now() - 2 * 86400000) },
            { establishmentName: "The Barn by Borro", title: "Great for group meals", content: "Went here for a group date with blockmates after our defense. The rustic vibe is perfect for a relaxed celebration.", rating: 5, helpfulCount: 19, createdAt: new Date(Date.now() - 4 * 86400000) },
            { establishmentName: "The Barn by Borro", title: "A bit pricey but worth it", content: "Slightly more expensive than the usual Taft spots but the portions and quality more than make up for it.", rating: 4, helpfulCount: 11, createdAt: new Date(Date.now() - 6 * 86400000) },
            { establishmentName: "The Barn by Borro", title: "Rice bowls are phenomenal", content: "The sisig rice bowl is unreal. Generous serving with the perfect balance of flavors. Highly recommend.", rating: 5, helpfulCount: 35, createdAt: new Date(Date.now() - 9 * 86400000) },
            { establishmentName: "The Barn by Borro", title: "Cozy study spot too", content: "Not just good food, the atmosphere is great for studying. I spent 3 hours here once and the staff were very accommodating.", rating: 4, helpfulCount: 20, createdAt: new Date(Date.now() - 15 * 86400000) },
            // Tinuhog ni Benny
            { establishmentName: "Tinuhog ni Benny", title: "Unlimited rice is a blessing", content: "As a student who always needs more rice, this place is heaven. The liempo is charcoal-grilled and absolutely delicious.", rating: 5, helpfulCount: 40, createdAt: new Date(Date.now() - 1 * 86400000) },
            { establishmentName: "Tinuhog ni Benny", title: "Budget BBQ done right", content: "For the price, you really can't beat it. Authentic Filipino BBQ that tastes like something you'd get in your hometown.", rating: 5, helpfulCount: 27, createdAt: new Date(Date.now() - 3 * 86400000) },
            { establishmentName: "Tinuhog ni Benny", title: "Long lines but moves fast", content: "Expect a line during peak hours but it moves quickly. The food is definitely worth the brief wait.", rating: 4, helpfulCount: 16, createdAt: new Date(Date.now() - 7 * 86400000) },
            { establishmentName: "Tinuhog ni Benny", title: "Pork BBQ is the star", content: "The pork BBQ skewers are perfectly charred with a sweet-savory marinade. Order 3 at minimum, you'll thank me later.", rating: 5, helpfulCount: 32, createdAt: new Date(Date.now() - 10 * 86400000) },
            { establishmentName: "Tinuhog ni Benny", title: "Go-to for heavy lunch days", content: "On days with back-to-back classes, I always fuel up here. Rice and BBQ for under 100 pesos is hard to beat.", rating: 4, helpfulCount: 21, createdAt: new Date(Date.now() - 13 * 86400000) },
            // El Poco Cantina
            { establishmentName: "El Poco Cantina", title: "Birria Tacos are insane", content: "The birria tacos here are some of the best I've had outside of an actual Mexican restaurant. The consomé dipping broth makes it.", rating: 5, helpfulCount: 38, createdAt: new Date(Date.now() - 1 * 86400000) },
            { establishmentName: "El Poco Cantina", title: "Hidden gem on Taft", content: "Most people don't know about this place but the flavor here is incredible. Birria bowls for lunch is a power move.", rating: 5, helpfulCount: 24, createdAt: new Date(Date.now() - 4 * 86400000) },
            { establishmentName: "El Poco Cantina", title: "Portions could be bigger", content: "Tasty food but the portions are on the smaller side for the price. Still worth trying at least once.", rating: 3, helpfulCount: 8, createdAt: new Date(Date.now() - 8 * 86400000) },
            { establishmentName: "El Poco Cantina", title: "Best Mexican food near DLSU", content: "Nothing else near campus compares for Mexican food. The quesadillas are also excellent.", rating: 5, helpfulCount: 29, createdAt: new Date(Date.now() - 11 * 86400000) },
            { establishmentName: "El Poco Cantina", title: "Great spot for something different", content: "Tired of the usual Filipino food options near campus? This place is a great change of pace with big, bold flavors.", rating: 4, helpfulCount: 17, createdAt: new Date(Date.now() - 16 * 86400000) },
            // Jollibee
            { establishmentName: "Jollibee Taft", title: "Chickenjoy never misses", content: "The OG comfort food. Nothing compares to Chickenjoy when you need a quick energy boost between classes.", rating: 5, helpfulCount: 50, createdAt: new Date(Date.now() - 1 * 86400000) },
            { establishmentName: "Jollibee Taft", title: "Palabok is underrated", content: "People always get the chicken but the palabok here is seriously underrated. Try it at least once!", rating: 4, helpfulCount: 22, createdAt: new Date(Date.now() - 5 * 86400000) },
            { establishmentName: "Jollibee Taft", title: "Crowded but expected", content: "It's Jollibee. Of course it's crowded. Still fast enough to grab food between classes.", rating: 3, helpfulCount: 10, createdAt: new Date(Date.now() - 9 * 86400000) },
            { establishmentName: "Jollibee Taft", title: "Breakfast value is unbeatable", content: "Tapsilog with coffee for under 100 pesos? Nobody does breakfast value like Jollibee.", rating: 5, helpfulCount: 41, createdAt: new Date(Date.now() - 12 * 86400000) },
            { establishmentName: "Jollibee Taft", title: "A classic for a reason", content: "No matter how fancy your food taste gets, you always come back to Jollibee. A timeless Taft institution.", rating: 4, helpfulCount: 35, createdAt: new Date(Date.now() - 18 * 86400000) },
            // Mang Inasal
            { establishmentName: "Mang Inasal", title: "Unlimited rice saved my life", content: "During thesis season, Mang Inasal's unli rice kept me going. Generous, filling, and cheap.", rating: 5, helpfulCount: 44, createdAt: new Date(Date.now() - 2 * 86400000) },
            { establishmentName: "Mang Inasal", title: "Chicken Paa is the move", content: "Always order the Chicken Paa. More meat, more flavor, and it pairs perfectly with the garlic rice.", rating: 5, helpfulCount: 31, createdAt: new Date(Date.now() - 5 * 86400000) },
            { establishmentName: "Mang Inasal", title: "Good but service can be slow", content: "Food is consistently great but service can be a little slow during rush hours. Plan accordingly.", rating: 3, helpfulCount: 12, createdAt: new Date(Date.now() - 8 * 86400000) },
            { establishmentName: "Mang Inasal", title: "Best unli rice near campus", content: "If you need maximum calories for minimum budget, this is your spot. Unli rice is a student's best friend.", rating: 4, helpfulCount: 26, createdAt: new Date(Date.now() - 11 * 86400000) },
            { establishmentName: "Mang Inasal", title: "The inasal flavor is authentic", content: "The char-grilled flavor with that distinctive Mang Inasal marinade is something you can't replicate anywhere else.", rating: 5, helpfulCount: 18, createdAt: new Date(Date.now() - 14 * 86400000) },
            // Illo Japanese Restaurant
            { establishmentName: "Illo Japanese Restaurant", title: "Hidden gem in One Archers Place", content: "Didn't expect to find a Japanese restaurant this close to campus. The ramen is actually solid and portions are filling for the price.", rating: 4, helpfulCount: 12, createdAt: new Date(Date.now() - 2 * 86400000) },
            { establishmentName: "Illo Japanese Restaurant", title: "Great change of pace from usual food", content: "Tired of the usual campus food? Illo is a great alternative. Their rice bowls are tasty and reasonably priced at around ₱200-400.", rating: 4, helpfulCount: 9, createdAt: new Date(Date.now() - 5 * 86400000) },
            { establishmentName: "Illo Japanese Restaurant", title: "Service could be faster", content: "Food is good but service can be slow during lunch rush. Go during off-peak hours for a better experience.", rating: 3, helpfulCount: 7, createdAt: new Date(Date.now() - 8 * 86400000) },
            { establishmentName: "Illo Japanese Restaurant", title: "Convenient location inside campus area", content: "Being inside One Archers Place makes it super accessible. Nice cozy ambiance too, good for a quick lunch between classes.", rating: 4, helpfulCount: 11, createdAt: new Date(Date.now() - 11 * 86400000) },
            { establishmentName: "Illo Japanese Restaurant", title: "Decent Japanese food near DLSU", content: "Not the most authentic Japanese food but for the price and location you really can't complain. Worth trying at least once.", rating: 3, helpfulCount: 5, createdAt: new Date(Date.now() - 15 * 86400000) },
            // 7-Eleven
            { establishmentName: "7-Eleven Taft", title: "Lifesaver at 3AM", content: "When nothing else is open, 7-11 always comes through. Their Big Bite hotdog at midnight is peak student cuisine.", rating: 4, helpfulCount: 42, createdAt: new Date(Date.now() - 1 * 86400000) },
            { establishmentName: "7-Eleven Taft", title: "Coffee is surprisingly decent", content: "The self-serve coffee machine produces a surprisingly decent cup for the price. Great for an early class caffeine fix.", rating: 3, helpfulCount: 15, createdAt: new Date(Date.now() - 4 * 86400000) },
            { establishmentName: "7-Eleven Taft", title: "Best energy drinks selection", content: "Has the widest selection of energy drinks near campus. Essential during finals week.", rating: 4, helpfulCount: 20, createdAt: new Date(Date.now() - 7 * 86400000) },
            { establishmentName: "7-Eleven Taft", title: "Quick snacks between classes", content: "Perfect for grabbing a quick sandwich or chips between back-to-back classes. Fast, convenient, no-frills.", rating: 3, helpfulCount: 11, createdAt: new Date(Date.now() - 10 * 86400000) },
            { establishmentName: "7-Eleven Taft", title: "Always stocked", content: "Unlike some small stores that run out of stock quickly, this branch is always well-stocked. Reliable 24/7.", rating: 4, helpfulCount: 18, createdAt: new Date(Date.now() - 15 * 86400000) }
        ];

        const reviewsWithUser = sampleReviews.map((r, i) => ({
            ...r,
            userId: seedUser._id,
            userName: names[i % 3]
        }));

        const existingCount = await Post.countDocuments();
        if (existingCount === 0) {
            await Post.insertMany(reviewsWithUser);
            res.json({ message: `Seeded ${reviewsWithUser.length} reviews successfully!` });
        } else {
            res.json({ message: `Database already has ${existingCount} posts. Skipped to avoid duplicates.` });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/api/posts/all", requireAuth, async (req, res) => {
    try {
        await Post.deleteMany({});
        res.json({ message: "All posts deleted. You can now re-seed." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ DEBUG ROUTES ============

router.get("/test-db", async (req, res) => {
    try {
        const mongoose = require("mongoose");
        const collections = await mongoose.connection.db.listCollections().toArray();
        res.json({ collections });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
