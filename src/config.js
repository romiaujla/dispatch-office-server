module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 8000,
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dunder-mifflin@localhost/dispatch-office',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://dunder-mifflin@localhost/dispatch-office-test',
    JWT_SECRET: process.env.JWT_SECRET || '6ba5fa8e-f7fa-11e9-8f0b-362b9e155667',
}