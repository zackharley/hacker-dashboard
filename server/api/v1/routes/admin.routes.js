const Router = require('express').Router;

const ADMIN = 'admin';
const APPLICATIONS = 'applications';
const EMAIL = 'email';
const EMAILS = 'emails';
const REVIEW = 'review';
const SETTINGS = 'settings';

module.exports = (ctr) => {
    const adminAPI = Router();

    const { admin, user } = ctr;

    adminAPI.get(`/admins`, async (req, res) => {
        try {
            const admins = await admin.getAdmins();
            return res.status(200).json({ admins });
        } catch (err) {
            return res.status(err.code).json(err);
        }
    });

    // TODO: Update application routes to take an eventId
    adminAPI.get(`/${ADMIN}/${APPLICATIONS}/${REVIEW}`, async (req, res) => {
        const { userId } = req.user;
        try {
            const { reviewGroup } = await user.getUser(userId);
            const applicationToReview = await admin.getApplicationToReview(reviewGroup);
            return res.status(200).json(applicationToReview);
        } catch (err) {
            return res.status(err.code).json(err);
        }
    });

    // TODO: Should this be a PUT?
    adminAPI.post(`/${ADMIN}/${APPLICATIONS}/${REVIEW}/:userId`, async (req, res) => {
        const { userId } = req.params;
        const { review } = req.body;
        try {
            const updatedUser = await admin.submitApplicationReview(userId, review);
            return res.status(201).json({ user: updatedUser });
        } catch (err) {
            return res.status(err.code).json(err);
        }
    });

    adminAPI.put(`/${ADMIN}/${APPLICATIONS}/:eventId/:userId`, async (req, res) => {
        const { eventId, userId } = req.params;
        const { status } = req.body;
        try {
            const updatedUser = await admin.updateApplicationStatus(userId, eventId, status);
            return res.status(200).json({ user: updatedUser });
        } catch (e) {
            return res.status(e.code).json(e);
        }
    });

    adminAPI.get(`/${ADMIN}/${APPLICATIONS}/reviewed`, async (req, res) => {
        try {
            const applicationsWithReviews = await admin.getApplicationsWithReviews();
            return res.status(200).json({ applicationsWithReviews });
        } catch (err) {
            return res.status(err.code).json(err);
        }
    });

    adminAPI.get(`/${ADMIN}/${APPLICATIONS}/reviewers`, async (req, res) => {
        try {
            const reviewers = await admin.getReviewers();
            res.status(200).json({ reviewers });
        } catch (err) {
            return res.status(err.code).json(err);
        }
    });

    adminAPI.put(`/${ADMIN}/${APPLICATIONS}/reviewers`, async (req, res) => {
        try {
            const reviewers = await admin.reassignReviewers();
            res.status(200).json({ reviewers });
        } catch (err) {
            return res.status(err.code).json(err);
        }
    });

    adminAPI.get(`/${ADMIN}/${SETTINGS}`, async (req, res) => {
        try {
            const settings = await admin.getSettings();
            return res.status(200).json({ settings });
        } catch (err) {
            return res.status(err.code).json(err);
        }
    });

    adminAPI.post(`/${ADMIN}/${EMAIL}`, async (req, res) => {
        const { templateName, recipients} = req.body;
        try {
            await admin.sendEmail(templateName, recipients);
            return res.status(201).send('Success!');
        } catch (err) {
            return res.status(err.code).json(err);
        }
    });

    adminAPI.get(`/${ADMIN}/${EMAILS}`, (req, res) => {
        return res.status(200).json({ emails: admin.getEmails() });
    });

    return adminAPI;
};
