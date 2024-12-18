const Router = require('express').Router;
const authMiddleware = require('../middlewares/auth-middleware');
const userController = require('../controllers/user-controller');
const { body, validationResult } = require('express-validator');
const userService = require('../service/user-service'); // Якщо файл знаходиться в папці services



const router = new Router();

// Registration Route
router.post('/registration',
    body('email').isEmail().withMessage('Email має бути дійсним'),
    body('password').isLength({ min: 3, max: 32 }).withMessage('Пароль має бути від 3 до 32 символів'),
    body('phone').isMobilePhone().withMessage('Телефон має бути дійсним'),
    body('fullName').notEmpty().withMessage('Поле fullName є обов’язковим'),
    body('role').isIn(['trainer', 'student']).withMessage('Роль має бути або "trainer", або "student"'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    userController.registration
);
// router.get('/students', authMiddleware, roleMiddleware('trainer'), userController.getStudents);
// router.get('/trainers', authMiddleware, roleMiddleware('student'), userController.getTrainers);
router.post('/forgot-password', async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await userService.forgotPassword(email);
        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
});
router.get('/users',  async (req, res) => {
    try {
        const users = await userService.getAllUsers(); // This function should fetch users from the database
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});
router.post('/reset-password', async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        const result = await userService.resetPassword(token, newPassword);
        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
});


// Login Route
router.post('/login',
    body('email').isEmail().withMessage('Email має бути дійсним'),
    body('password').isLength({ min: 3 }).withMessage('Пароль має бути не менше 3 символів'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    userController.login
);

// Activation Route
router.get('/activate/:link', userController.activate);
router.put('/update-profile/:userId', 
    authMiddleware, userController.updateProfile
);



module.exports = router;
