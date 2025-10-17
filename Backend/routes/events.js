const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');

// Create event
router.post('/', auth, async (req, res) => {
    const { title, description, date, location } = req.body;
    try {
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            creator: req.user,
        });
        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().populate('creator', 'username');
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get event by ID
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('creator', 'username');
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update event
router.put('/:id', auth, async (req, res) => {
    const { title, description, date, location } = req.body;
    try {
        let event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.creator.toString() !== req.user) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        event = await Event.findByIdAndUpdate(req.params.id, { title, description, date, location }, { new: true });
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.creator.toString() !== req.user) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
